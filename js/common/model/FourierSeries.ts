// Copyright 2020-2023, University of Colorado Boulder

/**
 * FourierSeries is the model of a Fourier series, used in the 'Discrete' and 'Wave Game' screens.
 * For the 'Wave Packet' screen, a simpler model is used, due to the number of Fourier components
 * required - see FourierComponent.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty, { UnknownDerivedProperty } from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWColors from '../FMWColors.js';
import FMWConstants from '../FMWConstants.js';
import AxisDescription from './AxisDescription.js';
import Domain from './Domain.js';
import getAmplitudeFunction from './getAmplitudeFunction.js';
import Harmonic from './Harmonic.js';
import SeriesType from './SeriesType.js';

// constants
const DEFAULT_AMPLITUDES = Array( FMWConstants.MAX_HARMONICS ).fill( 0 );
const DEFAULT_AMPLITUDE_RANGE = new Range( -FMWConstants.MAX_AMPLITUDE, FMWConstants.MAX_AMPLITUDE );

type SelfOptions = {
  numberOfHarmonics?: number;
  amplitudeRange?: Range; // the range of all harmonic amplitudes
  amplitudes?: number[]; // initial amplitudes for the harmonics
};

export type FourierSeriesOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class FourierSeries extends PhetioObject {

  // properties of the fundamental (first, n=1) harmonic
  public readonly fundamentalFrequency: number; // frequency, in Hz
  public readonly fundamentalPeriod: number; // period, in milliseconds
  public readonly fundamentalWavelength: number; // wavelength, in meters

  // aliases that correspond to symbols used in equations
  public readonly T: number; // period
  public readonly L: number; // wavelength

  // the range of all harmonic amplitudes
  public readonly amplitudeRange: Range;

  public readonly harmonics: Harmonic[];

  // Amplitudes for all harmonics. This was requested for PhET-iO, but has proven to be generally useful.
  // It needs to be of type UnknownDerivedProperty because we're using setDeferred to optimize listener notifications.
  public readonly amplitudesProperty: UnknownDerivedProperty<number[]>;

  // whether sound is enabled for this Fourier series
  public readonly soundEnabledProperty: Property<boolean>;

  // volume of the sound for this Fourier series
  public readonly soundOutputLevelProperty: NumberProperty;

  public constructor( providedOptions: FourierSeriesOptions ) {

    const options = optionize<FourierSeriesOptions, SelfOptions, PhetioObjectOptions>()( {

      // FourierSeriesOptions
      numberOfHarmonics: FMWConstants.MAX_HARMONICS,
      amplitudeRange: DEFAULT_AMPLITUDE_RANGE, // {Range} the range of all harmonic amplitudes
      amplitudes: DEFAULT_AMPLITUDES, // {number[]} initial amplitudes for the harmonics

      // PhetioObjectOptions
      phetioState: false
    }, providedOptions );

    assert && assert( Number.isInteger( options.numberOfHarmonics ) && options.numberOfHarmonics > 0 );
    assert && assert( options.numberOfHarmonics <= FMWColors.HARMONIC_COLOR_PROPERTIES.length );
    assert && assert( _.every( options.amplitudes, amplitude => options.amplitudeRange.contains( amplitude ) ),
      'one or more amplitudes are out of range' );

    super( options );

    this.fundamentalFrequency = 440;
    this.fundamentalPeriod = 1000 / this.fundamentalFrequency;
    this.fundamentalWavelength = 1;

    this.T = this.fundamentalPeriod;
    this.L = this.fundamentalWavelength;

    this.amplitudeRange = options.amplitudeRange;

    // Parent tandem for harmonics
    const harmonicsTandem = options.tandem.createTandem( 'harmonics' );

    this.harmonics = [];
    for ( let order = 1; order <= options.numberOfHarmonics; order++ ) {
      this.harmonics.push( new Harmonic( {
        order: order,
        frequency: this.fundamentalFrequency * order,
        wavelength: this.L / order,
        colorProperty: FMWColors.HARMONIC_COLOR_PROPERTIES[ order - 1 ],
        amplitude: options.amplitudes[ order - 1 ],
        amplitudeRange: this.amplitudeRange,
        tandem: harmonicsTandem.createTandem( `harmonic${order}` )
      } ) );
    }
    assert && assert( this.harmonics.length === options.numberOfHarmonics, 'unexpected number of harmonics' );

    this.amplitudesProperty = DerivedProperty.deriveAny(
      this.harmonics.map( harmonic => harmonic.amplitudeProperty ),
      () => this.harmonics.map( harmonic => harmonic.amplitudeProperty.value ), {
        phetioDocumentation: 'the amplitudes of all harmonics',
        phetioValueType: ArrayIO( NumberIO ),
        tandem: options.tandem.createTandem( 'amplitudesProperty' )
      } );

    this.soundEnabledProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'soundEnabledProperty' )
    } );

    this.soundOutputLevelProperty = new NumberProperty( 0.5, {
      range: new Range( 0.05, 1 ),
      tandem: options.tandem.createTandem( 'soundOutputLevelProperty' )
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Resets the Fourier series.
   */
  public reset(): void {
    this.resetHarmonics();
    this.soundEnabledProperty.reset();
    this.soundOutputLevelProperty.reset();
  }

  /**
   * Resets the harmonics. Since this causes amplitudesProperty to go through intermediate states,
   * notification of amplitudesProperty listeners is deferred until all harmonics have been updated.
   */
  private resetHarmonics(): void {
    this.amplitudesProperty.setDeferred( true );
    this.harmonics.forEach( harmonic => harmonic.reset() );
    const notifyListeners = this.amplitudesProperty.setDeferred( false );
    notifyListeners && notifyListeners();
  }

  /**
   * Sets the amplitudes for harmonics. Since this causes amplitudesProperty to go through intermediate states,
   * notification of amplitudesProperty listeners is deferred until all harmonics have been updated.
   */
  public setAmplitudes( amplitudes: number[] ): void {
    assert && assert( amplitudes.length === this.harmonics.length, 'requires an amplitude for each harmonic' );

    this.amplitudesProperty.setDeferred( true );
    for ( let i = 0; i < amplitudes.length; i++ ) {
      this.harmonics[ i ].amplitudeProperty.value = amplitudes[ i ];
    }
    const notifyListeners = this.amplitudesProperty.setDeferred( false );
    notifyListeners && notifyListeners();
  }

  /**
   * Sets all amplitudes to the specified value. Since this causes amplitudesProperty to go through intermediate states,
   * notification of amplitudesProperty listeners is deferred until all harmonics have been updated.
   */
  public setAllAmplitudes( amplitude: number ): void {
    this.amplitudesProperty.setDeferred( true );
    this.harmonics.forEach( harmonic => {
      harmonic.amplitudeProperty.value = amplitude;
    } );
    const notifyListeners = this.amplitudesProperty.setDeferred( false );
    notifyListeners && notifyListeners();
  }

  /**
   * Creates the data set for the sum of the harmonics in the Fourier Series. Points are ordered by increasing x value.
   *
   * This does not use Harmonic.createDataSet or the datasets that it creates, because:
   * (1) Calling Harmonic.createDataSet would create many more Vector2 instances.
   * (2) Harmonic.createDataSet does not provide all of the points needed to compute the sum. The number of points
   *     in the data set created by Harmonic.createDataSet is a function of the harmonic's frequency, as more points
   *     are required to plot higher-frequency harmonics.
   */
  public createSumDataSet( xAxisDescription: AxisDescription, domain: Domain, seriesType: SeriesType, t: number ): Vector2[] {
    assert && assert( t >= 0 );

    const sumDataSet = []; // {Vector2[]}

    const xRange = xAxisDescription.createRangeForDomain( domain, this.L, this.T );
    const dx = xRange.getLength() / FMWConstants.MAX_POINTS_PER_DATA_SET;
    const amplitudeFunction = getAmplitudeFunction( domain, seriesType ); // {function}

    let x = xRange.min;
    while ( x <= xRange.max ) {
      let y = 0;
      for ( let i = 0; i < this.harmonics.length; i++ ) {
        const harmonic = this.harmonics[ i ];
        const amplitude = harmonic.amplitudeProperty.value;
        if ( amplitude !== 0 ) {
          y += amplitudeFunction( amplitude, harmonic.order, x, t, this.L, this.T );
        }
      }
      sumDataSet.push( new Vector2( x, y ) );
      x += dx;
    }

    return sumDataSet;
  }

  /**
   * Gets the harmonics that have zero amplitude.
   */
  public getZeroHarmonics(): Harmonic[] {
    return this.harmonics.filter( harmonic => harmonic.amplitudeProperty.value === 0 );
  }

  /**
   * Gets the harmonics that have non-zero amplitude.
   */
  public getNonZeroHarmonics(): Harmonic[] {
    return this.harmonics.filter( harmonic => harmonic.amplitudeProperty.value !== 0 );
  }

  /**
   * Gets the number of harmonics in the answer that have non-zero amplitude.
   */
  public getNumberOfNonZeroHarmonics(): number {

    // Rather than return this.getNonZeroHarmonics().length, this implementation is optimized so that nothing is allocated.
    let count = 0;
    this.harmonics.forEach( harmonic => {
      if ( harmonic.amplitudeProperty.value !== 0 ) {
        count++;
      }
    } );
    return count;
  }
}

fourierMakingWaves.register( 'FourierSeries', FourierSeries );