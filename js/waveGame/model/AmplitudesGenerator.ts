// Copyright 2021-2023, University of Colorado Boulder

/**
 * AmplitudesGenerator is responsible for generating a random set of amplitudes for a Fourier series.
 * It is used in the Wave Game to create answers for challenges.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize from '../../../../phet-core/js/optionize.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

type SelfOptions = {
  numberOfHarmonics?: number;
  maxAmplitude?: number;

  // gets the number of non-zero harmonics in the waveform
  getNumberOfNonZeroHarmonics?: () => number;
};

type AmplitudesGeneratorOptions = SelfOptions;

export default class AmplitudesGenerator {

  // See SelfOptions
  private readonly numberOfHarmonics: number;
  private readonly maxAmplitude: number;
  private readonly getNumberOfNonZeroHarmonics: () => number;

  public constructor( providedOptions?: AmplitudesGeneratorOptions ) {

    const options = optionize<AmplitudesGeneratorOptions, SelfOptions>()( {

      // SelfOptions
      numberOfHarmonics: FMWConstants.MAX_HARMONICS,
      maxAmplitude: FMWConstants.MAX_AMPLITUDE,
      getNumberOfNonZeroHarmonics: () => 1
    }, providedOptions );

    this.numberOfHarmonics = options.numberOfHarmonics;
    this.maxAmplitude = options.maxAmplitude;
    this.getNumberOfNonZeroHarmonics = options.getNumberOfNonZeroHarmonics;
  }

  /**
   * Creates a set of amplitudes for the harmonics in a Fourier series.
   * Attempts to prevent consecutive sets of amplitudes from being similar.
   * @param [previousAmplitudes] - optional previous amplitudes
   */
  public createAmplitudes( previousAmplitudes?: number[] ): number[] {
    assert && assert( !previousAmplitudes || previousAmplitudes.length === this.numberOfHarmonics );

    let amplitudes;
    const numberOfNonZeroHarmonics = this.getNumberOfNonZeroHarmonics();
    let attempts = 0;
    const maxAttempts = 10;

    // Generate a set of random amplitudes. If optional previousAmplitudes was provided, continue to iterate until
    // the amplitudes are not "similar" to the previous amplitudes, or until we reach a maximum number of attempts.
    // The no-unmodified-loop-condition lint rule is disabled here because it apparently doesn't understand the
    // approach of using a constant to ensure that a do-while loop executes exactly once. In this case, it complains
    // because previousAmplitudes is not modified in the loop.
    // See https://github.com/phetsims/fourier-making-waves/issues/96.
    do {
      amplitudes = generateRandomAmplitudes( this.numberOfHarmonics, numberOfNonZeroHarmonics, this.maxAmplitude );
      attempts++;
      // eslint-disable-next-line no-unmodified-loop-condition
    } while ( previousAmplitudes && ( attempts < maxAttempts ) && isSimilar( amplitudes, previousAmplitudes ) );

    // If we reached the max number of attempts, log a warning and continue with a 'similar' set of amplitudes.
    // In practice, this should occur rarely, if ever.  If it occurs too frequently, increase maxAttempts.
    if ( attempts === maxAttempts ) {
      phet.log && phet.log( `WARNING: Similar amplitudes were generated ${attempts} times in a row.` );
    }

    assert && AssertUtils.assertArrayOf( amplitudes, 'number' );
    assert && assert( amplitudes.length === this.numberOfHarmonics );
    return amplitudes;
  }
}

/**
 * Determines whether 2 sets of amplitudes are similar. This is used to prevent consecutive challenges from being
 * similar during game play. The definition of 'similar' was a moving target during development, so consult
 * the implementation of this method for the ground truth.
 */
function isSimilar( amplitudes1: number[], amplitudes2: number[] ): boolean {
  assert && assert( amplitudes1.length === amplitudes2.length );

  // Similar series have answers with identical amplitude values.
  return _.isEqual( amplitudes1, amplitudes2 );
}

/**
 * Generates a set of random amplitudes.
 * @param numberOfAmplitudes - total number of amplitudes
 * @param numberOfNonZeroHarmonics - number of non-zero amplitudes
 * @param maxAmplitude - maximum amplitude of a harmonic
 */
function generateRandomAmplitudes( numberOfAmplitudes: number, numberOfNonZeroHarmonics: number, maxAmplitude: number ): number[] {
  assert && assert( Number.isInteger( numberOfAmplitudes ) && numberOfAmplitudes > 0 );
  assert && assert( Number.isInteger( numberOfNonZeroHarmonics ) && numberOfNonZeroHarmonics > 0 );
  assert && assert( numberOfAmplitudes >= numberOfNonZeroHarmonics, 'requested too many numberOfNonZeroHarmonics' );
  assert && assert( maxAmplitude > 0 );

  // Indices for the amplitudes. We'll choose randomly from this set.
  const amplitudesIndices = [];
  for ( let i = 0; i < numberOfAmplitudes; i++ ) {
    amplitudesIndices.push( i );
  }

  // All amplitudes default to zero.
  const amplitudes = Array( numberOfAmplitudes ).fill( 0 );

  // Choose non-zero amplitudes and randomly generate their values.
  for ( let i = 0; i < numberOfNonZeroHarmonics; i++ ) {

    // Randomly choose which amplitude to set.
    const index = dotRandom.nextIntBetween( 0, amplitudesIndices.length - 1 ); // [min,max)
    const amplitudesIndex = amplitudesIndices[ index ];
    amplitudesIndices.splice( index, 1 );

    // Randomly choose a non-zero amplitude value, rounded to the same interval used for the amplitude sliders.
    let amplitude = dotRandom.nextDoubleBetween( -maxAmplitude, 0 );
    if ( amplitude !== -maxAmplitude ) {
      amplitude = Utils.roundToInterval( amplitude, FMWConstants.WAVE_GAME_AMPLITUDE_STEP );
    }
    if ( amplitude === 0 ) {
      amplitude = -FMWConstants.WAVE_GAME_AMPLITUDE_STEP;
    }
    amplitude *= dotRandom.nextBoolean() ? 1 : -1;
    assert && assert( amplitude >= -maxAmplitude && amplitude <= maxAmplitude && amplitude !== 0,
      `unexpected amplitude: ${amplitude}` );
    amplitudes[ amplitudesIndex ] = amplitude;
  }
  assert && assert( amplitudes.length === numberOfAmplitudes, `expected ${numberOfAmplitudes} amplitudes` );

  return amplitudes;
}

fourierMakingWaves.register( 'AmplitudesGenerator', AmplitudesGenerator );