// Copyright 2020, University of Colorado Boulder

/**
 * Waveforms is a rich enumeration for the preset waveforms that appear in the 'Discrete' screen.
 * These preset waveforms are all based on a peak amplitude of 1.
 * Since the 'Infinite Harmonics' data sets are small, the data sets always cover the maximum x range.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import merge from '../../../../phet-core/js/merge.js';
import Domain from '../../common/model/Domain.js';
import SeriesType from '../../common/model/SeriesType.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import DiscreteXAxisDescriptions from './DiscreteXAxisDescriptions.js';

// constants
const PI = Math.PI; // to improve readability

// The data sets herein are hardcoded, ported from Preset.java.
assert && assert( DiscreteXAxisDescriptions[ 0 ].range.max === 2,
  'hardcoded data sets herein assume that the maximum x-axis multiplier is 2' );

class WaveformValue {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      /**
       * {null|function}
       * Gets the amplitudes for the harmonics in the Fourier series that approximates the waveform.
       * @param {number} numberOfHarmonics - number of non-zero harmonics is the series
       * @param {SeriesType} SeriesType - sin or cos
       * @returns {number[]}
       */
      getAmplitudes: null,

      /**
       * {null|function}
       * Gets the data set that can be used to plot the actual waveform, as if the waveform were approximated using
       * a Fourier series with an infinite number of harmonics.
       * @param {Domain} domain - domain of the x axis
       * @param {SeriesType} seriesType - sin or cos
       * @param {number} t - time, in milliseconds
       * @param {number} L - wavelength of the fundamental harmonic, in meters
       * @param {number} T - period of the fundamental harmonic, in milliseconds
       * @returns {Vector2[]}
       */
      getInfiniteHarmonicsDataSet: null
    }, options );

    // @public (read-only)
    this.getAmplitudes = options.getAmplitudes;
    this.getInfiniteHarmonicsDataSet = options.getInfiniteHarmonicsDataSet;
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
  }

  // getInfiniteHarmonicsDataSet is not needed. The sum is an exact approximation, and we'll reuse its data set.
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

    //TODO handle Domain.SPACE_AND_TIME
    const x = ( domain === Domain.TIME ) ? T : L;
    const phaseShift = ( seriesType === SeriesType.SINE ) ? 0 : ( -0.25 * x );

    return [
      new Vector2( -9 * x / 4 + phaseShift, -1 ),
      new Vector2( -7 * x / 4 + phaseShift, 1 ),
      new Vector2( -5 * x / 4 + phaseShift, -1 ),
      new Vector2( -3 * x / 4 + phaseShift, 1 ),
      new Vector2( -x / 4 + phaseShift, -1 ),
      new Vector2( x / 4 + phaseShift, 1 ),
      new Vector2( 3 * x / 4 + phaseShift, -1 ),
      new Vector2( 5 * x / 4 + phaseShift, 1 ),
      new Vector2( 7 * x / 4 + phaseShift, -1 ),
      new Vector2( 9 * x / 4 + phaseShift, 1 )
    ];
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

    //TODO handle Domain.SPACE_AND_TIME
    const x = ( domain === Domain.TIME ) ? T : L;
    const phaseShift = ( seriesType === SeriesType.SINE ) ? 0 : ( -0.25 * x );

    return [
      new Vector2( -2 * x + phaseShift, -1 ),
      new Vector2( -2 * x + phaseShift, 1 ),
      new Vector2( -3 * x / 2 + phaseShift, 1 ),
      new Vector2( -3 * x / 2 + phaseShift, -1 ),
      new Vector2( -x + phaseShift, -1 ),
      new Vector2( -x + phaseShift, 1 ),
      new Vector2( -x / 2 + phaseShift, 1 ),
      new Vector2( -x / 2 + phaseShift, -1 ),
      new Vector2( 0 + phaseShift, -1 ),
      new Vector2( 0 + phaseShift, 1 ),
      new Vector2( x / 2 + phaseShift, 1 ),
      new Vector2( x / 2 + phaseShift, -1 ),
      new Vector2( x + phaseShift, -1 ),
      new Vector2( x + phaseShift, 1 ),
      new Vector2( 3 * x / 2 + phaseShift, 1 ),
      new Vector2( 3 * x / 2 + phaseShift, -1 ),
      new Vector2( 2 * x + phaseShift, -1 ),
      new Vector2( 2 * x + phaseShift, 1 ),
      new Vector2( 5 * x / 2 + phaseShift, 1 )
    ];
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

    // There is no cosine form of Waveform.SAW_TOOTH.
    if ( seriesType === SeriesType.COSINE ) {
      return [];
    }

    //TODO handle Domain.SPACE_AND_TIME
    const x = ( domain === Domain.TIME ) ? T : L;

    // sine
    return [
      new Vector2( -5 * x / 2, 1 ),
      new Vector2( -5 * x / 2, -1 ),
      new Vector2( -3 * x / 2, 1 ),
      new Vector2( -3 * x / 2, -1 ),
      new Vector2( -x / 2, 1 ),
      new Vector2( -x / 2, -1 ),
      new Vector2( x / 2, 1 ),
      new Vector2( x / 2, -1 ),
      new Vector2( 3 * x / 2, 1 ),
      new Vector2( 3 * x / 2, -1 ),
      new Vector2( 5 * x / 2, 1 )
    ];
  }
} );


const WAVE_PACKET = new WaveformValue( {

  //TODO https://github.com/phetsims/fourier-making-waves/issues/18 provide a reference for how amplitudes are computed
  getAmplitudes: ( numberOfHarmonics, seriesType ) => {

    //TODO https://github.com/phetsims/fourier-making-waves/issues/18 see p 26 of 'Fourier Design Outline'
    // An = (1 / (p * sqrt(2 * PI)))^( -(n-no)^2 / (2 * p^2))
    // where p = 1.5, N = number of harmonics, no = (N + 1) / 2

    //TODO https://github.com/phetsims/fourier-making-waves/issues/18 creates large (invalid) amplitudes that do not match hardcoded values from Preset.java
    // const amplitudes = [];
    // const p = 1.5;
    // const no = ( numberOfHarmonics + 1 ) / 2;
    // const base = 1 / ( p * Math.sqrt( 2 * PI ) );
    // for ( let n = 1; n <= numberOfHarmonics; n++ ) {
    //   const exponent = -Math.pow( n - no, 2 ) / ( 2 * p * p );
    //   const amplitude = Math.pow( base, exponent );
    //   amplitudes.push( amplitude );
    // }
    // console.log( `N=${numberOfHarmonics} amplitudes=${amplitudes}` );//TODO delete me
    // debugger;
    // return amplitudes;

    //TODO https://github.com/phetsims/fourier-making-waves/issues/18 workaround by using hardcoded values from Preset.java
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
  }
} );

const CUSTOM = new WaveformValue();

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