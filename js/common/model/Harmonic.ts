// Copyright 2020-2023, University of Colorado Boulder

/**
 * Harmonic is the model of a harmonic in a Fourier series, used in the 'Discrete' and 'Wave Game' screens.
 * For the 'Wave Packet' screen, a simpler model is used, due to the number of Fourier components required -
 * see FourierComponent..
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { TColor } from '../../../../scenery/js/imports.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import AxisDescription from './AxisDescription.js';
import Domain from './Domain.js';
import getAmplitudeFunction from './getAmplitudeFunction.js';
import SeriesType from './SeriesType.js';

type SelfOptions = {

  // required
  order: number; // the order of the harmonic, numbered from 1
  frequency: number; // frequency, in Hz
  wavelength: number; // wavelength, in meters
  amplitudeRange: Range; // range of amplitude, no units
  colorProperty: TReadOnlyProperty<TColor>; // the color used to visualize the harmonic

  // optional
  amplitude?: number; // initial amplitude of the harmonic, no units
};

type HarmonicOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class Harmonic extends PhetioObject {

  // See SelfOptions
  public readonly order: number;
  public readonly frequency: number;
  public readonly wavelength: number;
  public readonly amplitudeRange: Range;
  public readonly colorProperty: TReadOnlyProperty<TColor>;

  // period of the harmonic, in milliseconds
  public readonly period: number;

  // amplitude of the harmonic, no units
  public readonly amplitudeProperty: NumberProperty;

  public constructor( providedOptions: HarmonicOptions ) {

    const options = optionize<HarmonicOptions, SelfOptions, PhetioObjectOptions>()( {

      // HarmonicOptions
      amplitude: 0,

      // PhetioObjectOptions
      phetioState: false
    }, providedOptions );

    assert && assert( Number.isInteger( options.order ) && options.order > 0 );
    assert && assert( options.frequency > 0 );
    assert && assert( options.wavelength > 0 );

    super( options );

    this.order = options.order;
    this.frequency = options.frequency;
    this.wavelength = options.wavelength;
    this.amplitudeRange = options.amplitudeRange;
    this.colorProperty = options.colorProperty;
    this.period = 1000 / this.frequency;

    this.amplitudeProperty = new NumberProperty( options.amplitude, {
      range: this.amplitudeRange,
      phetioDocumentation: 'the amplitude of this harmonic',
      tandem: options.tandem.createTandem( 'amplitudeProperty' )
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public reset(): void {
    this.amplitudeProperty.reset();
  }

  /**
   * Create a data set to approximate this harmonic.
   */
  public createDataSet( numberOfPoints: number, L: number, T: number, xAxisDescription: AxisDescription,
                        domain: Domain, seriesType: SeriesType, t: number ): Vector2[] {
    const order = this.order;
    const amplitude = this.amplitudeProperty.value;
    const xRange = xAxisDescription.createRangeForDomain( domain, L, T );
    return Harmonic.createDataSetStatic( order, amplitude, numberOfPoints, L, T, xRange, domain, seriesType, t );
  }

  /**
   * Creates a data set for any harmonic. This is used in the Wave Packet screen, which does not create Harmonic
   * instances due to the large number of Fourier components involved.
   */
  public static createDataSetStatic( order: number, amplitude: number, numberOfPoints: number, L: number, T: number,
                                     xRange: Range, domain: Domain, seriesType: SeriesType, t: number ): Vector2[] {

    assert && assert( Number.isInteger( order ) && order > 0 );
    assert && assert( Number.isInteger( numberOfPoints ) && numberOfPoints > 0 );
    assert && assert( L > 0 );
    assert && assert( T > 0 );
    assert && assert( t >= 0 );

    const dataSet = [];
    const amplitudeFunction = getAmplitudeFunction( domain, seriesType );

    // Make dx a bit larger than necessary, so that we cover the entire xRange by slightly exceeding xRange.max.
    const dx = xRange.getLength() / ( numberOfPoints - 1 );

    let x = xRange.min;
    let y;
    for ( let i = 0; i < numberOfPoints; i++ ) {
      y = amplitudeFunction( amplitude, order, x, t, L, T );
      dataSet.push( new Vector2( x, y ) );
      x += dx;
    }
    assert && assert( dataSet.length === numberOfPoints, 'incorrect number of points in dataSet' );

    return dataSet;
  }
}

fourierMakingWaves.register( 'Harmonic', Harmonic );