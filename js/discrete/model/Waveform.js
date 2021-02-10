// Copyright 2020, University of Colorado Boulder

/**
 * Waveforms for the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import SeriesType from './SeriesType.js';

// constants
const PI = Math.PI; // to improve readability

class WaveformValue {

  /**
   * @param {function(numberOfHarmonics:number, seriesType:SeriesType)} [getAmplitudes]
   */
  constructor( getAmplitudes ) {

    assert && assert( typeof getAmplitudes === 'function', 'invalid getAmplitudes' );

    // @public (read-only) wrap getAmplitudes with common validation for args and return value
    this.getAmplitudes = ( numberOfHarmonics, seriesType ) => {
      assert && assert( typeof numberOfHarmonics === 'number' && numberOfHarmonics > 0, 'invalid numberOfHarmonics' );
      assert && assert( SeriesType.includes( seriesType ), 'invalid seriesType' );

      const amplitudes = getAmplitudes( numberOfHarmonics, seriesType );
      assert && assert( amplitudes.length === numberOfHarmonics, 'unexpected number of amplitudes' );
      return amplitudes;
    };
  }
}

const SINUSOID = new WaveformValue( ( numberOfHarmonics, seriesType ) => {
  const amplitudes = [];
  for ( let n = 1; n <= numberOfHarmonics; n++ ) {

    // A1 = 1, all others are 0
    amplitudes.push( n === 1 ? 1 : 0 );
  }
  return amplitudes;
} );

// See https://mathworld.wolfram.com/FourierSeriesTriangleWave.html
const TRIANGLE = new WaveformValue( ( numberOfHarmonics, seriesType ) => {
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
} );

// See https://mathworld.wolfram.com/FourierSeriesSquareWave.html
const SQUARE = new WaveformValue( ( numberOfHarmonics, seriesType ) => {
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
} );

// See https://mathworld.wolfram.com/FourierSeriesSawtoothWave.html
const SAWTOOTH = new WaveformValue( ( numberOfHarmonics, seriesType ) => {

  assert && assert( seriesType !== SeriesType.COSINE, 'cannot make a sawtooth wave out of cosines' );

  const amplitudes = [];
  for ( let n = 1; n <= numberOfHarmonics; n++ ) {

    // 2/(1*PI), -2/(2*PI), 2/(3*PI), -2/(4*PI), 2/(5*PI), -2/(6*PI), 2/(7*PI), -2/(8*PI), 2/(9*PI), -2/(10*PI), 2/(11*PI), ...
    amplitudes.push( Math.pow( -1, n - 1 ) * ( 2 / ( n * PI ) ) );
  }
  return amplitudes;
} );

//TODO https://github.com/phetsims/fourier-making-waves/issues/18 provide a reference for how amplitudes are computed
const WAVE_PACKET = new WaveformValue( ( numberOfHarmonics, seriesType ) => {

  // An = (1 / (p * sqrt(2 * PI))) ^ (-(n-no)^2 / (2 * p^2))
  // where p = 1.5, N = number of harmonics, no = (N + 1) / 2

  //TODO https://github.com/phetsims/fourier-making-waves/issues/18 this fails with invalid value, doesn't match hardcoded values from Preset.java
  // const amplitudes = [];
  // const p = 1.5;
  // const no = ( numberOfHarmonics + 1 ) / 2;
  // for ( let n = 1; n <= numberOfHarmonics; n++ ) {
  //   const base = 1 / ( p * Math.sqrt( 2 * PI ) );
  //   const exponent = -Math.pow( n - no, 2 ) / ( 2 * p * p );
  //   const amplitude = Math.pow( base, exponent );
  //   console.log( `N=${numberOfHarmonics} n=${n} amplitude=${amplitude}` );//TODO delete me
  //   amplitudes.push( amplitude );
  // }
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
} );

const CUSTOM = new WaveformValue( ( numberOfHarmonics, seriesType ) => {
  throw new Error( 'getAmplitudes is not supported for custom waveform' );
} );

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