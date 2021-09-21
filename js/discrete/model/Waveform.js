// Copyright 2020-2021, University of Colorado Boulder

/**
 * Waveform is a rich enumeration for the preset waveforms that appear in the 'Discrete' screen.
 * These preset waveforms are all based on a peak amplitude of 1.
 * Since the 'Infinite Harmonics' data sets are small, the data sets always cover the maximum x range.
 *
 * Much of this file is ported from, or loosely based on, Presets.java.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import merge from '../../../../phet-core/js/merge.js';
import required from '../../../../phet-core/js/required.js';
import FMWConstants from '../../common/FMWConstants.js';
import Domain from '../../common/model/Domain.js';
import SeriesType from '../../common/model/SeriesType.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

// constants
const PI = Math.PI; // to improve readability

// These are coefficients for the waveform presets that support getInfiniteHarmonicsDataSet. They are multiplied
// by L (wavelength) or T (period), depending on Domain, to produce a data set that will plot the actual waveform.
// These hard-coded values support both sine and cosine, but for a limited x-axis range. Elements in the arrays
// must be ordered by ascending x-coordinate value.
const INFINITE_HARMONICS_BASE_POINTS = {

  // Ported from Preset.java SINE_TRIANGLE_POINTS
  TRIANGLE: [
    new Vector2( -11 / 4, 1 ),
    new Vector2( -9 / 4, -1 ),
    new Vector2( -7 / 4, 1 ),
    new Vector2( -5 / 4, -1 ),
    new Vector2( -3 / 4, 1 ),
    new Vector2( -1 / 4, -1 ),
    new Vector2( 1 / 4, 1 ),
    new Vector2( 3 / 4, -1 ),
    new Vector2( 5 / 4, 1 ),
    new Vector2( 7 / 4, -1 ),
    new Vector2( 9 / 4, 1 ),
    new Vector2( 11 / 4, -1 )
  ],

  // Ported from Preset.java SINE_SQUARE_POINTS
  SQUARE: [
    new Vector2( -3, -1 ),
    new Vector2( -3, 1 ),
    new Vector2( -5 / 2, 1 ),
    new Vector2( -5 / 2, -1 ),
    new Vector2( -2, -1 ),
    new Vector2( -2, 1 ),
    new Vector2( -3 / 2, 1 ),
    new Vector2( -3 / 2, -1 ),
    new Vector2( -1, -1 ),
    new Vector2( -1, 1 ),
    new Vector2( -1 / 2, 1 ),
    new Vector2( -1 / 2, -1 ),
    new Vector2( 0, -1 ),
    new Vector2( 0, 1 ),
    new Vector2( 1 / 2, 1 ),
    new Vector2( 1 / 2, -1 ),
    new Vector2( 1, -1 ),
    new Vector2( 1, 1 ),
    new Vector2( 3 / 2, 1 ),
    new Vector2( 3 / 2, -1 ),
    new Vector2( 2, -1 ),
    new Vector2( 2, 1 ),
    new Vector2( 5 / 2, 1 ),
    new Vector2( 5 / 2, -1 ),
    new Vector2( 3, -1 ),
    new Vector2( 3, 1 )
  ],

  // Ported from Preset.java SINE_SAWTOOTH_POINTS
  SAWTOOTH: [
    new Vector2( -7 / 2, 1 ),
    new Vector2( -7 / 2, -1 ),
    new Vector2( -5 / 2, 1 ),
    new Vector2( -5 / 2, -1 ),
    new Vector2( -3 / 2, 1 ),
    new Vector2( -3 / 2, -1 ),
    new Vector2( -1 / 2, 1 ),
    new Vector2( -1 / 2, -1 ),
    new Vector2( 1 / 2, 1 ),
    new Vector2( 1 / 2, -1 ),
    new Vector2( 3 / 2, 1 ),
    new Vector2( 3 / 2, -1 ),
    new Vector2( 5 / 2, 1 ),
    new Vector2( 5 / 2, -1 ),
    new Vector2( 7 / 2, 1 ),
    new Vector2( 7 / 2, -1 )
  ]
};

/**
 * Determines if an array of Vector2 is ordered by ascending x coordinate.
 * @param {Vector2[]} array
 * @returns {boolean}
 */
function isOrderedByAscendingX( array ) {
  return _.every( array, ( vector, index, array ) => ( index === 0 || array[ index - 1 ].x <= vector.x ) );
}

assert && assert( isOrderedByAscendingX( INFINITE_HARMONICS_BASE_POINTS.TRIANGLE ) );
assert && assert( isOrderedByAscendingX( INFINITE_HARMONICS_BASE_POINTS.SQUARE ) );
assert && assert( isOrderedByAscendingX( INFINITE_HARMONICS_BASE_POINTS.SAWTOOTH ) );

class WaveformValue {

  /**
   * @param {Object} config
   */
  constructor( config ) {

    config = merge( {

      /**
       * {function} Gets the amplitudes for the harmonics that approximate the waveform.
       * @param {number} numberOfHarmonics - number of non-zero harmonics is the series
       * @param {SeriesType} seriesType - sin or cos
       * @returns {number[]} ordered by increasing harmonic order
       */
      getAmplitudes: required( config.getAmplitudes ),

      /**
       * {function} Gets the data set that can be used to plot the actual waveform, as if the waveform were
       * approximated using a Fourier series with an infinite number of harmonics. Ordered by increasing x coordinate.
       * @param {Domain} domain - Domain of the x axis
       * @param {SeriesType} seriesType - sin or cos
       * @param {number} t - time, in milliseconds
       * @param {number} L - wavelength of the fundamental harmonic, in meters
       * @param {number} T - period of the fundamental harmonic, in milliseconds
       * @returns {Vector2[]}
       */
      getInfiniteHarmonicsDataSet: required( config.getInfiniteHarmonicsDataSet )
    }, config );

    // @public (read-only)
    this.getAmplitudes = config.getAmplitudes;
    this.getInfiniteHarmonicsDataSet = config.getInfiniteHarmonicsDataSet;
  }
}

const SINUSOID = new WaveformValue( {

  getAmplitudes: ( numberOfHarmonics, seriesType ) => {
    const amplitudes = [];
    for ( let n = 1; n <= numberOfHarmonics; n++ ) {

      // A1 = 1, all others are 0
      amplitudes.push( n === 1 ? 1 : 0 );
    }
    return amplitudes;
  },

  getInfiniteHarmonicsDataSet: ( domain, seriesType, t, L, T ) => {
    throw new Error( 'getInfiniteHarmonicsDataSet is not supported. Use the sum data set for SINUSOID.' );
  }
} );

const TRIANGLE = new WaveformValue( {

  // See https://mathworld.wolfram.com/FourierSeriesTriangleWave.html
  getAmplitudes: ( numberOfHarmonics, seriesType ) => {
    const amplitudes = [];
    for ( let n = 1; n <= numberOfHarmonics; n++ ) {
      if ( seriesType === SeriesType.SINE ) {

        // 8/(1*PI^2), 0, -8/(9*PI^2), 0, 8/(25*PI^2), 0, -8/(49*PI^2), 0, 8/(81*PI^2), 0, -8/(121*PI^2), ...
        amplitudes.push( n % 2 === 0 ? 0 : Math.pow( -1, ( n - 1 ) / 2 ) * ( 8 / ( n * n * PI * PI ) ) );
      }
      else {

        // 8/(1*PI^2), 0, 8/(9*PI^2), 0, 8/(25*PI^2), 0, 8/(49*PI^2), 0, 8/(81*PI^2), 0, 8/(121*PI^2), ...
        amplitudes.push( n % 2 === 0 ? 0 : ( 8 / ( n * n * PI * PI ) ) );
      }
    }
    return amplitudes;
  },

  getInfiniteHarmonicsDataSet: ( domain, seriesType, t, L, T ) => {
    return mapBasePointsToDataSet( INFINITE_HARMONICS_BASE_POINTS.TRIANGLE, domain, seriesType, t, L, T );
  }
} );

const SQUARE = new WaveformValue( {

  // See https://mathworld.wolfram.com/FourierSeriesSquareWave.html
  getAmplitudes: ( numberOfHarmonics, seriesType ) => {
    const amplitudes = [];
    for ( let n = 1; n <= numberOfHarmonics; n++ ) {
      if ( seriesType === SeriesType.SINE ) {

        // 4/(1*PI), 0, 4/(3*PI), 0, 4/(5*PI), 0, 4/(7*PI), 0, 4/(9*PI), 0, 4/(11*PI), ...
        amplitudes.push( n % 2 === 0 ? 0 : ( 4 / ( n * PI ) ) );
      }
      else {

        // 4/(1*PI), 0, -4/(3*PI), 0, 4/(5*PI), 0, -4/(7*PI), 0, 4/(9*PI), 0, -4/(11*PI), ...
        amplitudes.push( n % 2 === 0 ? 0 : Math.pow( -1, ( n - 1 ) / 2 ) * ( 4 / ( n * PI ) ) );
      }
    }
    return amplitudes;
  },

  getInfiniteHarmonicsDataSet: ( domain, seriesType, t, L, T ) => {
    return mapBasePointsToDataSet( INFINITE_HARMONICS_BASE_POINTS.SQUARE, domain, seriesType, t, L, T );
  }
} );

const SAWTOOTH = new WaveformValue( {

  // See https://mathworld.wolfram.com/FourierSeriesSawtoothWave.html
  getAmplitudes: ( numberOfHarmonics, seriesType ) => {

    assert && assert( seriesType !== SeriesType.COSINE, 'cannot make a sawtooth wave out of cosines' );

    const amplitudes = [];
    for ( let n = 1; n <= numberOfHarmonics; n++ ) {

      // 2/(1*PI), -2/(2*PI), 2/(3*PI), -2/(4*PI), 2/(5*PI), -2/(6*PI), 2/(7*PI), -2/(8*PI), 2/(9*PI), -2/(10*PI), 2/(11*PI), ...
      amplitudes.push( Math.pow( -1, n - 1 ) * ( 2 / ( n * PI ) ) );
    }
    return amplitudes;
  },

  getInfiniteHarmonicsDataSet: ( domain, seriesType, t, L, T ) => {
    return mapBasePointsToDataSet( INFINITE_HARMONICS_BASE_POINTS.SAWTOOTH, domain, seriesType, t, L, T );
  }
} );

const WAVE_PACKET = new WaveformValue( {

  // Presets.java used these same hardcoded amplitude values. It documented an equation, but that equation did not
  // produce these values, and in fact produced invalid values. After repeated attempts to identify a correct equation,
  // we gave up and decided to stick with the hardcoded values.
  // See https://github.com/phetsims/fourier-making-waves/issues/18
  getAmplitudes: ( numberOfHarmonics, seriesType ) => {
    return [
      [ 1.000000 ],
      [ 0.457833, 0.457833 ],
      [ 0.249352, 1.000000, 0.249352 ],
      [ 0.172422, 0.822578, 0.822578, 0.172422 ],
      [ 0.135335, 0.606531, 1.000000, 0.606531, 0.135335 ],
      [ 0.114162, 0.457833, 0.916855, 0.916855, 0.457833, 0.114162 ],
      [ 0.100669, 0.360448, 0.774837, 1.000000, 0.774837, 0.360448, 0.100669 ],
      [ 0.091394, 0.295023, 0.644389, 0.952345, 0.952345, 0.644389, 0.295023, 0.091394 ],
      [ 0.084658, 0.249352, 0.539408, 0.856997, 1.000000, 0.856997, 0.539408, 0.249352, 0.084658 ],
      [ 0.079560, 0.216255, 0.457833, 0.754840, 0.969233, 0.969233, 0.754840, 0.457833, 0.216255, 0.079560 ],
      [ 0.075574, 0.191495, 0.394652, 0.661515, 0.901851, 1.000000, 0.901851, 0.661515, 0.394652, 0.191495, 0.075574 ]
    ][ numberOfHarmonics - 1 ];
  },

  getInfiniteHarmonicsDataSet: ( domain, seriesType, t, L, T ) => {
    return FMWConstants.EMPTY_DATA_SET;
  }
} );

const CUSTOM = new WaveformValue( {

  getAmplitudes: ( domain, seriesType, t, L, T ) => {
    throw new Error( 'getAmplitudes is not supported for CUSTOM.' );
  },

  getInfiniteHarmonicsDataSet: ( domain, seriesType, t, L, T ) => {
    return FMWConstants.EMPTY_DATA_SET;
  }
} );

/**
 * Take an array of base points that describe an 'infinite harmonics' waveform, map it to a data set that is
 * appropriate for a specified Domain, SeriesType, etc.
 * @param {Vector2[]} basePoints - one of the arrays in INFINITE_HARMONICS_BASE_POINTS
 * @param {Domain} domain
 * @param {SeriesType} seriesType - sine or cosine
 * @param {number} t - the current time
 * @param {number} L - wavelength of the fundamental harmonic, in meters
 * @param {number} T - period of the fundamental harmonic, in milliseconds
 * @returns {Vector2[]}
 */
function mapBasePointsToDataSet( basePoints, domain, seriesType, t, L, T ) {

  // Get the quantity to use for the x axis, based on Domain.
  const x = ( domain === Domain.TIME ) ? T : L;

  // cosine shifts the waveform left by 1/4 of the wavelength or period.
  let shiftX = ( seriesType === SeriesType.SINE ) ? 0 : ( -0.25 * x );

  // space & time shifts the waveform by a portion of the wavelength.
  // This computation is similar to what's used in getAmplitudeSpaceAndTimeSine, in getAmplitudeFunction.js.
  if ( domain === Domain.SPACE_AND_TIME ) {
    const remainder = ( t / T - x / L ) % 1;
    shiftX += ( remainder * x );
  }

  // Apply x and shiftX to the base points.
  return basePoints.map( point => new Vector2( ( x * point.x ) + shiftX, point.y ) );
}

const Waveform = Enumeration.byMap( {
  SINUSOID: SINUSOID,
  TRIANGLE: TRIANGLE,
  SQUARE: SQUARE,
  SAWTOOTH: SAWTOOTH,
  WAVE_PACKET: WAVE_PACKET,
  CUSTOM: CUSTOM
} );

fourierMakingWaves.register( 'Waveform', Waveform );
export default Waveform;