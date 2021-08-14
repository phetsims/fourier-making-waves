// Copyright 2021, University of Colorado Boulder

/**
 * AmplitudesGenerator is responsible for generating a random set of amplitudes for a Fourier series.
 * It is used in the Wave Game to create answers for challenges.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class AmplitudesGenerator {

  /**
   * @param {Object} [options]
   * @abstract
   */
  constructor( options ) {

    options = merge( {

      // AmplitudesGenerator options
      numberOfHarmonics: FMWConstants.MAX_HARMONICS,
      maxAmplitude: FMWConstants.MAX_AMPLITUDE,

      // {function():number} gets the number of non-zero harmonics in the waveform
      getNumberOfNonZeroHarmonics: () => 1
    }, options );

    // @private
    this.numberOfHarmonics = options.numberOfHarmonics;
    this.maxAmplitude = options.maxAmplitude;
    this.getNumberOfNonZeroHarmonics = options.getNumberOfNonZeroHarmonics;
  }

  /**
   * Creates a set of amplitudes for the harmonics in a Fourier series.
   * Attempts to prevent consecutive sets of amplitudes from being similar.
   * @param {number[]} [previousAmplitudes] - optional previous amplitudes
   * @returns {number[]}
   * @public
   */
  createAmplitudes( previousAmplitudes ) {
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
 * similar during game play. The definition of 'similar' was moving target during development, so consult
 * the implementation of this method for the ground truth.
 * @param {number[]} amplitudes1
 * @param {number[]} amplitudes2
 * @returns {boolean}
 * @public
 */
function isSimilar( amplitudes1, amplitudes2 ) {
  assert && AssertUtils.assertArrayOf( amplitudes1, 'number' );
  assert && AssertUtils.assertArrayOf( amplitudes2, 'number' );
  assert && assert( amplitudes1.length === amplitudes2.length );

  // Similar series have answers with identical amplitude values.
  return _.isEqual( amplitudes1, amplitudes2 );
}

/**
 * Generates a set of random amplitudes.
 * @param {number} numberOfAmplitudes - total number of amplitudes
 * @param {number} numberOfNonZeroHarmonics - number of non-zero amplitudes
 * @param {number} maxAmplitude - maximum amplitude of a harmonic
 * @returns {number[]}
 */
function generateRandomAmplitudes( numberOfAmplitudes, numberOfNonZeroHarmonics, maxAmplitude ) {
  assert && AssertUtils.assertPositiveInteger( numberOfAmplitudes );
  assert && AssertUtils.assertPositiveInteger( numberOfNonZeroHarmonics );
  assert && assert( numberOfAmplitudes >= numberOfNonZeroHarmonics, 'requested too many numberOfNonZeroHarmonics' );
  assert && AssertUtils.assertPositiveNumber( maxAmplitude );

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
export default AmplitudesGenerator;