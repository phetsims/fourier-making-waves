// Copyright 2020, University of Colorado Boulder

/**
 * FourierSeries is the model of a Fourier series.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import AxisDescription from '../../discrete/model/AxisDescription.js';
import Domain from '../../discrete/model/Domain.js';
import HarmonicsChart from '../../discrete/model/HarmonicsChart.js';
import SeriesType from '../../discrete/model/SeriesType.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWColorProfile from '../FMWColorProfile.js';
import FMWConstants from '../FMWConstants.js';
import Harmonic from './Harmonic.js';

// constants
const DEFAULT_AMPLITUDES = Array( FMWConstants.MAX_HARMONICS ).fill( 0 );
const DEFAULT_AMPLITUDE_RANGE = new Range( -FMWConstants.MAX_ABSOLUTE_AMPLITUDE, FMWConstants.MAX_ABSOLUTE_AMPLITUDE );

class FourierSeries extends PhetioObject {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      amplitudes: DEFAULT_AMPLITUDES, // {number[]} initial amplitudes for the harmonics
      amplitudeRange: DEFAULT_AMPLITUDE_RANGE, // {Range} the range of all harmonic amplitudes
      tandem: Tandem.OPTIONAL,
      phetioState: false
    }, options );

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

    // @public the number of harmonics in this series
    this.numberOfHarmonicsProperty = new NumberProperty( FMWConstants.MAX_HARMONICS, {
      numberType: 'Integer',
      range: new Range( 1, FMWConstants.MAX_HARMONICS ),
      tandem: options.tandem.createTandem( 'numberOfHarmonicsProperty' )
    } );

    // Parent tandem for harmonics
    const harmonicsTandem = options.tandem.createTandem( 'harmonics' );

    // @public {Harmonic[]} an instance for each possible harmonic, with order numbered from 1.
    // All possible harmonics are created eagerly, and only the relevant ones should be considered, based on
    // numberOfHarmonicsProperty. This was a fundamental team decision, based on anticipated PhET-iO requirements.
    // See https://github.com/phetsims/fourier-making-waves/issues/6.
    this.harmonics = [];
    for ( let order = 1; order <= this.numberOfHarmonicsProperty.range.max; order++ ) {
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

    // @public {DerivedProperty.<number[]>} amplitudesProperty - amplitudes for the relevant harmonics
    // This was requested for the PhET-iO API, but has proven to be generally useful.
    // dispose is not needed
    this.amplitudesProperty = new DerivedProperty(
      [ this.numberOfHarmonicsProperty, ..._.map( this.harmonics, harmonic => harmonic.amplitudeProperty ) ],
      numberOfHarmonics => {
        const amplitudes = [];
        for ( let i = 0; i < numberOfHarmonics; i++ ) {
          amplitudes.push( this.harmonics[ i ].amplitudeProperty.value );
        }
        return amplitudes;
      }, {
        phetioDocumentation: 'the amplitudes of all harmonics',
        phetioType: DerivedProperty.DerivedPropertyIO( ArrayIO( NumberIO ) ),
        tandem: options.tandem.createTandem( 'amplitudesProperty' )
      } );

    // Zero out amplitudes that are not relevant. unlink is not necessary.
    this.numberOfHarmonicsProperty.link( numberOfHarmonics => {
      for ( let i = numberOfHarmonics; i < this.numberOfHarmonicsProperty.range.max; i++ ) {
        this.harmonics[ i ].amplitudeProperty.value = 0;
      }
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
    this.numberOfHarmonicsProperty.reset();
    this.harmonics.forEach( harmonic => harmonic.reset() );
  }

  /**
   * Creates the data set for one harmonic.
   * @param {Harmonic} harmonic
   * @param {number} numberOfPoints
   * @param {AxisDescription} xAxisDescription
   * @param {Domain} domain
   * @param {SeriesType} seriesType
   * @param {number} t
   * @returns {Vector2[]}
   * @public
   */
  createHarmonicDataSet( harmonic, numberOfPoints, xAxisDescription, domain, seriesType, t ) {

    assert && assert( harmonic instanceof Harmonic, 'harmonic' );
    assert && assert( this.harmonics.includes( harmonic ), 'harmonic is not part of this series' );
    assert && assert( typeof numberOfPoints === 'number' && numberOfPoints > 0, 'invalid numberOfPoints' );
    assert && assert( xAxisDescription instanceof AxisDescription, 'invalid xAxisDescription' );
    assert && assert( Domain.includes( domain ), 'invalid domain' );
    assert && assert( SeriesType.includes( seriesType ), 'invalid seriesType' );
    assert && assert( typeof t === 'number' && t >= 0, 'invalid t' );

    const amplitudeFunction = AMPLITUDE_FUNCTIONS.getFunction( domain, seriesType );
    const order = harmonic.order;
    const amplitude = harmonic.amplitudeProperty.value;

    const xRange = AxisDescription.createXRange( xAxisDescription, domain, this.L, this.T );
    const dx = xRange.getLength() / ( numberOfPoints - 1 );

    const dataSet = [];
    for ( let i = 0; i < numberOfPoints; i++ ) {
      const x = xRange.min + ( i * dx );
      const y = amplitudeFunction( x, order, amplitude, this.L, this.T, t );
      dataSet.push( new Vector2( x, y ) );
    }
    assert && assert( dataSet.length === numberOfPoints, 'incorrect number of points in dataSet' );

    return dataSet;
  }

  //TODO performance: reuse harmonic data sets to compute the sum
  /**
   * Creates the data set for the sum of the relevant harmonics in the Fourier Series.
   * This does not reuse HarmonicsChart harmonicDataSetProperties, because (1) that creates all kinds of problems with
   * ordering and intermediate states, and (2) harmonic plots use different numbers of points based on harmonic
   * frequency, because more points are required to draw higher-frequency harmonics.
   * @param {AxisDescription} xAxisDescription
   * @param {Domain} domain
   * @param {SeriesType} seriesType
   * @param {number} t
   * @returns {Vector2[]}
   * @public
   */
  createSumDataSet( xAxisDescription, domain, seriesType, t ) {

    assert && assert( xAxisDescription instanceof AxisDescription, 'invalid xAxisDescription' );
    assert && assert( Domain.includes( domain ), 'invalid domain' );
    assert && assert( SeriesType.includes( seriesType ), 'invalid seriesType' );
    assert && assert( typeof t === 'number' && t >= 0, 'invalid t' );

    // Sum only the relevant harmonics.
    const relevantHarmonics = this.harmonics.slice( 0, this.numberOfHarmonicsProperty.value );

    // The presence of higher-frequency harmonics require more points to draw a smooth plot.
    // See documentation for HarmonicsChart.MAX_POINTS_PER_DATA_SET.
    const numberOfPoints = Math.ceil( HarmonicsChart.MAX_POINTS_PER_DATA_SET *
                                      relevantHarmonics.length / this.harmonics.length );

    // {Vector2[][]} compute a data set for each relevant harmonic
    const harmonicDataSets = [];
    relevantHarmonics.forEach( harmonic => {
      harmonicDataSets.push( this.createHarmonicDataSet( harmonic, numberOfPoints, xAxisDescription, domain, seriesType, t ) );
    } );
    assert && assert( _.every( harmonicDataSets, dataSet => dataSet.length === numberOfPoints ),
      `all data sets should contain ${numberOfPoints} points` );

    // Sum the data sets
    const sumDataSet = [];
    for ( let i = 0; i < numberOfPoints; i++ ) {
      const x = harmonicDataSets[ 0 ][ i ].x;
      let ySum = 0;
      for ( let j = 0; j < harmonicDataSets.length; j++ ) {
        const point = harmonicDataSets[ j ][ i ];
        assert && assert( point.x === x, 'the corresponding points in all data sets should have the same x coordinate' );
        ySum += point.y;
      }
      sumDataSet.push( new Vector2( x, ySum ) );
    }
    return sumDataSet;
  }
}

/**
 * The equation that is used to compute amplitude depends on what domain (space, time, space & time) and
 * equation form (sin/cos) is being used. This object provides an optimized way to retrieve a function
 * that implements the appropriate equation.
 */
const AMPLITUDE_FUNCTIONS = {

  /**
   * Gets the function that computes amplitude at an x value.
   * @param {Domain} domain
   * @param {SeriesType} seriesType
   * @returns {function(x:number, order:number, amplitude:number, L:number, T:number, t:number):number}
   * @public
   */
  getFunction( domain, seriesType ) {

    assert && assert( Domain.includes( domain ), 'invalid domain' );
    assert && assert( SeriesType.includes( seriesType ), 'invalid seriesType' );

    let f;
    if ( domain === Domain.SPACE ) {
      f = ( seriesType === SeriesType.SINE ) ? AMPLITUDE_FUNCTIONS.getAmplitudeSpaceSin : AMPLITUDE_FUNCTIONS.getAmplitudeSpaceCos;
    }
    else if ( domain === Domain.TIME ) {
      f = ( seriesType === SeriesType.SINE ) ? AMPLITUDE_FUNCTIONS.getAmplitudeTimeSin : AMPLITUDE_FUNCTIONS.getAmplitudeTimeCos;
    }
    else { // Domain.SPACE_AND_TIME
      f = ( seriesType === SeriesType.SINE ) ? AMPLITUDE_FUNCTIONS.getAmplitudeSpaceAndTimeSin : AMPLITUDE_FUNCTIONS.getAmplitudeSpaceAndTimeCos;
    }
    return f;
  },

  /**
   * These 6 functions all have the same signature, and use the equation that corresponds to EquationForm.MODE.
   * @param {number} x - x coordinate, whose semantics depends on domain
   * @param {number} n - the harmonic's order
   * @param {number} A - the harmonic's amplitude, unitless
   * @param {number} L - the harmonic's wavelength, in meters
   * @param {number} T - the harmonic's period, in milliseconds
   * @param {number} t - the current time, in milliseconds
   * @returns {number} y value (amplitude) at x
   * @private
   */

  getAmplitudeSpaceSin( x, n, A, L, T, t ) {
    return A * Math.sin( 2 * Math.PI * n * x / L );
  },

  getAmplitudeSpaceCos( x, n, A, L, T, t ) {
    return A * Math.cos( 2 * Math.PI * n * x / L );
  },

  getAmplitudeTimeSin( x, n, A, L, T, t ) {
    return A * Math.sin( 2 * Math.PI * n * x / T );
  },

  getAmplitudeTimeCos( x, n, A, L, T, t ) {
    return A * Math.cos( 2 * Math.PI * n * x / T );
  },

  getAmplitudeSpaceAndTimeSin( x, n, A, L, T, t ) {
    return A * Math.sin( 2 * Math.PI * n * ( x / L - t / T ) );
  },

  getAmplitudeSpaceAndTimeCos( x, n, A, L, T, t ) {
    return A * Math.cos( 2 * Math.PI * n * ( x / L - t / T ) );
  }
};

fourierMakingWaves.register( 'FourierSeries', FourierSeries );
export default FourierSeries;