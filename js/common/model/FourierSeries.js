// Copyright 2020, University of Colorado Boulder

/**
 * FourierSeries is the model of a Fourier series.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWColorProfile from '../FMWColorProfile.js';
import FMWConstants from '../FMWConstants.js';
import Domain from './Domain.js';
import getAmplitudeFunction from './getAmplitudeFunction.js';
import Harmonic from './Harmonic.js';
import SeriesType from './SeriesType.js';
import XAxisDescription from './XAxisDescription.js';

// constants
const DEFAULT_AMPLITUDES = Array( FMWConstants.MAX_HARMONICS ).fill( 0 );
const DEFAULT_AMPLITUDE_RANGE = new Range( -FMWConstants.MAX_AMPLITUDE, FMWConstants.MAX_AMPLITUDE );

class FourierSeries extends PhetioObject {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      numberOfHarmonics: FMWConstants.MAX_HARMONICS,
      amplitudeRange: DEFAULT_AMPLITUDE_RANGE, // {Range} the range of all harmonic amplitudes
      amplitudes: DEFAULT_AMPLITUDES, // {number[]} initial amplitudes for the harmonics
      tandem: Tandem.OPTIONAL,
      phetioState: false
    }, options );

    assert && AssertUtils.assertPositiveInteger( options.numberOfHarmonics );
    assert && assert( options.amplitudeRange instanceof Range );
    assert && AssertUtils.assertArrayOf( options.amplitudes, 'number' );
    assert && assert( _.every( options.amplitudes, amplitude => options.amplitudeRange.contains( amplitude ) ),
      'one or more amplitudes are out of range' );

    super( options );

    // @public (read-only) properties of the fundamental (first, n=1) harmonic
    this.fundamentalFrequency = 440;  // frequency, in Hz
    this.fundamentalPeriod = 1000 / this.fundamentalFrequency; // period, in milliseconds
    this.fundamentalWavelength = 1; //  wavelength, in meters

    // @public (read-only) aliases that correspond to symbols used in equations
    this.L = this.fundamentalWavelength;
    this.T = this.fundamentalPeriod;

    // @public (read-only) the range of all harmonic amplitudes
    this.amplitudeRange = options.amplitudeRange;

    // Parent tandem for harmonics
    const harmonicsTandem = options.tandem.createTandem( 'harmonics' );

    // @public {Harmonic[]}
    this.harmonics = [];
    for ( let order = 1; order <= options.numberOfHarmonics; order++ ) {
      this.harmonics.push( new Harmonic( {
        order: order,
        frequency: this.fundamentalFrequency * order,
        wavelength: this.L / order,
        colorProperty: FMWColorProfile.getHarmonicColorProperty( order ),
        amplitude: options.amplitudes[ order - 1 ],
        amplitudeRange: this.amplitudeRange,
        tandem: harmonicsTandem.createTandem( `harmonic${order}` )
      } ) );
    }
    assert && assert( this.harmonics.length === options.numberOfHarmonics, 'unexpected number of harmonics' );

    // @public {DerivedProperty.<number[]>} amplitudesProperty - amplitudes for all harmonics
    // This was requested for PhET-iO, but has proven to be generally useful.
    // dispose is not needed
    this.amplitudesProperty = new DerivedProperty(
      [ ..._.map( this.harmonics, harmonic => harmonic.amplitudeProperty ) ],
      () => {
        const amplitudes = [];
        for ( let i = 0; i < this.harmonics.length; i++ ) {
          amplitudes.push( this.harmonics[ i ].amplitudeProperty.value );
        }
        return amplitudes;
      }, {
        phetioDocumentation: 'the amplitudes of all harmonics',
        phetioType: DerivedProperty.DerivedPropertyIO( ArrayIO( NumberIO ) ),
        tandem: options.tandem.createTandem( 'amplitudesProperty' )
      } );
  }

  /**
   * @public
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }

  /**
   * @public
   */
  reset() {
    this.harmonics.forEach( harmonic => harmonic.reset() );
  }

  /**
   * Sets the amplitudes for all harmonics.
   * @param {number[]} amplitudes
   * @public
   */
  setAmplitudes( amplitudes ) {
    assert && AssertUtils.assertArrayOf( amplitudes, 'number' );
    assert && assert( amplitudes.length === this.harmonics.length, 'requires an amplitude for each harmonic' );

    for ( let i = 0; i < amplitudes.length; i++ ) {
      this.harmonics[ i ].amplitudeProperty.value = amplitudes[ i ];
    }
  }

  /**
   * Creates the data set for the sum of the harmonics in the Fourier Series.
   *
   * This does not use Harmonic.createDataSet or the datasets that it creates, because:
   * (1) Calling Harmonic.createDataSet would create many more Vector2 instances.
   * (2) Harmonic.createDataSet creates different numbers of points depending on the harmonic's frequency, as
   *     more points are required to plot higher-frequency harmonics.
   *
   * @param {XAxisDescription} xAxisDescription
   * @param {Domain} domain
   * @param {SeriesType} seriesType
   * @param {number} t
   * @returns {Vector2[]}
   * @public
   */
  createSumDataSet( xAxisDescription, domain, seriesType, t ) {

    assert && assert( xAxisDescription instanceof XAxisDescription );
    assert && assert( Domain.includes( domain ) );
    assert && assert( SeriesType.includes( seriesType ) );
    assert && assert( typeof t === 'number' && t >= 0, `invalid t: ${t}` );

    const sumDataSet = []; // {Vector2[]}

    const xRange = xAxisDescription.createAxisRange( domain, this.L, this.T );
    const numberOfHarmonics = this.harmonics.length;
    const dx = xRange.getLength() / FMWConstants.MAX_POINTS_PER_DATA_SET;
    const amplitudeFunction = getAmplitudeFunction( domain, seriesType );

    let x = xRange.min;
    let y;
    let amplitude;

    while ( x <= xRange.max ) {
      y = 0;
      for ( let j = 0; j < numberOfHarmonics; j++ ) {
        amplitude = this.harmonics[ j ].amplitudeProperty.value;
        if ( amplitude !== 0 ) {
          y += amplitudeFunction( x, t, this.L, this.T, this.harmonics[ j ].order, amplitude );
        }
      }
      sumDataSet.push( new Vector2( x, y ) );
      x += dx;
    }

    return sumDataSet;
  }
}

fourierMakingWaves.register( 'FourierSeries', FourierSeries );
export default FourierSeries;