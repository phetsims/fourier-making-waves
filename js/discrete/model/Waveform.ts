// Copyright 2020-2023, University of Colorado Boulder

/**
 * Waveform is a set of static instances for the preset waveforms that appear in the 'Discrete' screen.
 * These preset waveforms are all based on a peak amplitude of 1.
 * Since the 'Infinite Harmonics' data sets are small, the data sets always cover the maximum x range.
 *
 * Much of this file is ported from, or loosely based on, Presets.java.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import Domain from '../../common/model/Domain.js';
import SeriesType from '../../common/model/SeriesType.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

const PI = Math.PI; // to improve readability

// parent tandem for all static instances of Waveform
const WAVEFORM_TANDEM = Tandem.ROOT.createTandem( 'discreteScreen' ).createTandem( 'model' ).createTandem( 'waveforms' );

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
 */
function isOrderedByAscendingX( array: Vector2[] ): boolean {
  return _.every( array, ( vector, index, array ) => ( index === 0 || array[ index - 1 ].x <= vector.x ) );
}

assert && assert( isOrderedByAscendingX( INFINITE_HARMONICS_BASE_POINTS.TRIANGLE ) );
assert && assert( isOrderedByAscendingX( INFINITE_HARMONICS_BASE_POINTS.SQUARE ) );
assert && assert( isOrderedByAscendingX( INFINITE_HARMONICS_BASE_POINTS.SAWTOOTH ) );

/**
 * Gets the amplitudes for the harmonics that approximate the waveform.
 * @param numberOfHarmonics - number of non-zero harmonics is the series
 * @param seriesType - sin or cos
 * @returns ordered by increasing harmonic order
 */
type GetAmplitudesFunction = ( numberOfHarmonics: number, seriesType: SeriesType ) => number[];

/**
 * Gets the data set that can be used to plot the actual waveform, as if the waveform were
 * approximated using a Fourier series with an infinite number of harmonics. Ordered by increasing x coordinate.
 * If this function is null, it means that the waveform does not support the 'Infinite Harmonics' feature.
 * @param domain - Domain of the x-axis
 * @param seriesType - sin or cos
 * @param t - time, in milliseconds
 * @param L - wavelength of the fundamental harmonic, in meters
 * @param T - period of the fundamental harmonic, in milliseconds
 */
type GetInfiniteHarmonicsDataSetFunction = ( domain: Domain, seriesType: SeriesType, t: number, L: number, T: number ) => Vector2[];

type SelfOptions = {
  getAmplitudes: GetAmplitudesFunction;
  getInfiniteHarmonicsDataSet: GetInfiniteHarmonicsDataSetFunction | null;
};

type WaveformOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class Waveform extends PhetioObject {

  // See SelfOptions
  public readonly getAmplitudes: GetAmplitudesFunction;
  public readonly getInfiniteHarmonicsDataSet: GetInfiniteHarmonicsDataSetFunction | null;

  public readonly supportsInfiniteHarmonics: boolean;

  private constructor( providedOptions: WaveformOptions ) {

    const options = optionize<WaveformOptions, SelfOptions, PhetioObjectOptions>()( {

      // PhetioObjectOptions
      phetioType: Waveform.WaveformIO,
      phetioState: false
    }, providedOptions );

    super( options );

    this.getAmplitudes = options.getAmplitudes;
    this.getInfiniteHarmonicsDataSet = options.getInfiniteHarmonicsDataSet;
    this.supportsInfiniteHarmonics = !!options.getInfiniteHarmonicsDataSet;
  }

  public static readonly WaveformIO = new IOType( 'WaveformIO', {
    valueType: Waveform,
    supertype: ReferenceIO( IOType.ObjectIO )
  } );

  public static readonly SINUSOID = new Waveform( {

    getAmplitudes: ( numberOfHarmonics: number, seriesType: SeriesType ): number[] => {
      const amplitudes = [];
      for ( let n = 1; n <= numberOfHarmonics; n++ ) {

        // A1 = 1, all others are 0
        amplitudes.push( n === 1 ? 1 : 0 );
      }
      return amplitudes;
    },

    // Infinite Harmonics is not supported for sinusoid.
    getInfiniteHarmonicsDataSet: null,

    tandem: WAVEFORM_TANDEM.createTandem( 'sinusoid' )
  } );

  public static readonly TRIANGLE = new Waveform( {

    // See https://mathworld.wolfram.com/FourierSeriesTriangleWave.html
    getAmplitudes: ( numberOfHarmonics: number, seriesType: SeriesType ): number[] => {
      const amplitudes = [];
      for ( let n = 1; n <= numberOfHarmonics; n++ ) {
        if ( seriesType === SeriesType.SIN ) {

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

    getInfiniteHarmonicsDataSet: ( domain: Domain, seriesType: SeriesType, t: number, L: number, T: number ): Vector2[] => {
      return mapBasePointsToDataSet( INFINITE_HARMONICS_BASE_POINTS.TRIANGLE, domain, seriesType, t, L, T );
    },

    tandem: WAVEFORM_TANDEM.createTandem( 'triangle' )
  } );

  public static readonly SQUARE = new Waveform( {

    // See https://mathworld.wolfram.com/FourierSeriesSquareWave.html
    getAmplitudes: ( numberOfHarmonics: number, seriesType: SeriesType ): number[] => {
      const amplitudes = [];
      for ( let n = 1; n <= numberOfHarmonics; n++ ) {
        if ( seriesType === SeriesType.SIN ) {

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

    getInfiniteHarmonicsDataSet: ( domain: Domain, seriesType: SeriesType, t: number, L: number, T: number ): Vector2[] => {
      return mapBasePointsToDataSet( INFINITE_HARMONICS_BASE_POINTS.SQUARE, domain, seriesType, t, L, T );
    },

    tandem: WAVEFORM_TANDEM.createTandem( 'square' )
  } );

  public static readonly SAWTOOTH = new Waveform( {

    // See https://mathworld.wolfram.com/FourierSeriesSawtoothWave.html
    getAmplitudes: ( numberOfHarmonics: number, seriesType: SeriesType ): number[] => {

      assert && assert( seriesType !== SeriesType.COS, 'cannot make a sawtooth wave out of cosines' );

      const amplitudes = [];
      for ( let n = 1; n <= numberOfHarmonics; n++ ) {

        // 2/(1*PI), -2/(2*PI), 2/(3*PI), -2/(4*PI), 2/(5*PI), -2/(6*PI), 2/(7*PI), -2/(8*PI), 2/(9*PI), -2/(10*PI), 2/(11*PI), ...
        amplitudes.push( Math.pow( -1, n - 1 ) * ( 2 / ( n * PI ) ) );
      }
      return amplitudes;
    },

    getInfiniteHarmonicsDataSet: ( domain: Domain, seriesType: SeriesType, t: number, L: number, T: number ): Vector2[] => {
      return mapBasePointsToDataSet( INFINITE_HARMONICS_BASE_POINTS.SAWTOOTH, domain, seriesType, t, L, T );
    },

    tandem: WAVEFORM_TANDEM.createTandem( 'sawtooth' )
  } );

  public static readonly WAVE_PACKET = new Waveform( {

    // Presets.java used these same hardcoded amplitude values. It documented an equation, but that equation did not
    // produce these values, and in fact produced invalid values. After repeated attempts to identify a correct equation,
    // we gave up and decided to stick with the hardcoded values.
    // See https://github.com/phetsims/fourier-making-waves/issues/18
    getAmplitudes: ( numberOfHarmonics: number, seriesType: SeriesType ): number[] => {
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

    // Infinite Harmonics is not supported for wave packet.
    getInfiniteHarmonicsDataSet: null,

    tandem: WAVEFORM_TANDEM.createTandem( 'wavePacket' )
  } );

  public static readonly CUSTOM = new Waveform( {

    getAmplitudes: ( numberOfHarmonics: number, seriesType: SeriesType ): number[] => {
      throw new Error( 'getAmplitudes is not supported for CUSTOM.' );
    },

    // Infinite Harmonics is not supported for custom.
    getInfiniteHarmonicsDataSet: null,

    tandem: WAVEFORM_TANDEM.createTandem( 'custom' )
  } );
}

/**
 * Take an array of base points that describe an 'infinite harmonics' waveform, map it to a data set that is
 * appropriate for a specified Domain, SeriesType, etc.
 * @param basePoints - one of the arrays in INFINITE_HARMONICS_BASE_POINTS
 * @param domain
 * @param seriesType - sine or cosine
 * @param t - the current time
 * @param L - wavelength of the fundamental harmonic, in meters
 * @param T - period of the fundamental harmonic, in milliseconds
 */
function mapBasePointsToDataSet( basePoints: Vector2[], domain: Domain, seriesType: SeriesType,
                                 t: number, L: number, T: number ): Vector2[] {

  // Get the quantity to use for the x axis, based on Domain.
  const x = ( domain === Domain.TIME ) ? T : L;

  // cosine shifts the waveform left by 1/4 of the wavelength or period.
  let shiftX = ( seriesType === SeriesType.SIN ) ? 0 : ( -0.25 * x );

  // space & time shifts the waveform by a portion of the wavelength.
  // This computation is similar to what's used in getAmplitudeSpaceAndTimeSine, in getAmplitudeFunction.ts.
  if ( domain === Domain.SPACE_AND_TIME ) {
    const remainder = ( t / T - x / L ) % 1;
    shiftX += ( remainder * x );
  }

  // Apply x and shiftX to the base points.
  return basePoints.map( point => new Vector2( ( x * point.x ) + shiftX, point.y ) );
}

fourierMakingWaves.register( 'Waveform', Waveform );