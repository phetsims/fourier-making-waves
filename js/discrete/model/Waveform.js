// Copyright 2020, University of Colorado Boulder

//TODO https://github.com/phetsims/fourier-making-waves/issues/18 equations in Preset.java do not match values
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

    // @public (read-only)
    this.getAmplitudes = getAmplitudes;
  }
}

const SINUSOID = new WaveformValue( ( numberOfHarmonics, seriesType ) => {
  const amplitudes = [];
  for ( let n = 1; n <= numberOfHarmonics; n++ ) {

    // A1 = 1, all others are 0
    amplitudes.push( n === 1 ? 1 : 0 );
  }
  assert && assert( amplitudes.length === numberOfHarmonics, 'unexpected number of amplitudes' );
  return amplitudes;
} );

const TRIANGLE = new WaveformValue( ( numberOfHarmonics, seriesType ) => {
  // const amplitudes = [];
  // for ( let n = 1; n <= numberOfHarmonics; n++ ) {
  //   seriesType === SeriesType.SINE ?
  //
  //     //TODO amplitudes are smaller than Java version
  //     amplitudes.push( ( ( 2 * Math.sin( n * PI / 2 ) ) - ( 2 * Math.sin( n * PI ) ) ) / ( n * n * PI * PI ) ) :
  //
  //     //TODO fails with invalid value
  //     amplitudes.push( ( ( 4 * Math.cos( n * PI ) ) - ( 2 * n * PI * Math.sin( n * PI ) ) / ( n * n * PI * PI ) ) );
  // }
  // assert && assert( amplitudes.length === numberOfHarmonics, 'unexpected number of amplitudes' );
  // return amplitudes;

  //TODO workaround by using hardcoded values from Preset.java, describe these values with new equations
  if ( seriesType === SeriesType.SINE ) {
    return [ 8 / ( PI * PI ), 0, -8 / ( 9 * PI * PI ), 0, 8 / ( 25 * PI * PI ), 0, -8 / ( 49 * PI * PI ), 0, 8 / ( 81 * PI * PI ), 0, -8 / ( 121 * PI * PI ) ].slice( 0, numberOfHarmonics );
  }
  else {
    return [ 8 / ( PI * PI ), 0, 8 / ( 9 * PI * PI ), 0, 8 / ( 25 * PI * PI ), 0, 8 / ( 49 * PI * PI ), 0, 8 / ( 81 * PI * PI ), 0, 8 / ( 121 * PI * PI ) ].slice( 0, numberOfHarmonics );
  }
} );

const SQUARE = new WaveformValue( ( numberOfHarmonics, seriesType ) => {
  const amplitudes = [];
  for ( let n = 1; n <= numberOfHarmonics; n++ ) {
    seriesType === SeriesType.SINE ?
      //TODO describe these values with a simpler equation: 4/PI, 0, 4/(3*PI), 0, 4/(5*PI), 0, 4/(7*PI), 0, 4/(9*PI), 0, 4/(11*PI)
    amplitudes.push( ( 2 - ( 2 * Math.cos( n * PI ) ) ) / ( n * PI ) ) :

      //TODO describe these values with a simpler equation:  4/PI, 0, -4/(3*PI), 0, 4/(5*PI), 0, -4/(7*PI), 0, 4/(9*PI), 0, -4/(11*PI)
    amplitudes.push( ( ( 4 * Math.sin( n * PI / 2 ) ) - ( 2 * Math.sin( n * PI ) ) ) / ( n * PI ) );
  }
  assert && assert( amplitudes.length === numberOfHarmonics, 'unexpected number of amplitudes' );
  return amplitudes;
} );

const SAWTOOTH = new WaveformValue( ( numberOfHarmonics, seriesType ) => {

  //TODO enable this assertion when it's handled correctly in the model
  // assert && assert( seriesType !== SeriesType.COSINE, 'cannot make a sawtooth wave out of cosines' );

  const amplitudes = [];
  for ( let n = 1; n <= numberOfHarmonics; n++ ) {

    //TODO equation in Preset.java did not match values, used https://lpsa.swarthmore.edu/Fourier/Series/ExFS.html
    amplitudes.push( -( 2 / ( n * PI ) ) * Math.pow( -1, n ) );
  }
  assert && assert( amplitudes.length === numberOfHarmonics, 'unexpected number of amplitudes' );
  return amplitudes;
} );

const WAVE_PACKET = new WaveformValue( ( numberOfHarmonics, seriesType ) => {
  // const amplitudes = [];
  // const p = 1.5;
  // const no = ( numberOfHarmonics + 1 ) / 2;
  // for ( let n = 1; n <= numberOfHarmonics; n++ ) {
  //
  //   //TODO fails with invalid value
  //   amplitudes.push( Math.pow(
  //     1 / ( p * Math.sqrt( 2 * PI ) ),
  //     -( ( numberOfHarmonics - no ) * ( ( numberOfHarmonics - no ) ) / ( 2 * p * p ) )
  //   ) );
  // }
  // assert && assert( amplitudes.length === numberOfHarmonics, 'unexpected number of amplitudes' );
  // return amplitudes;

  //TODO workaround by using hardcoded values from Preset.java
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