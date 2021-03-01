// Copyright 2021, University of Colorado Boulder

/**
 * WaveGameChallenge is the model of a game challenge.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import Utils from '../../../../dot/js/Utils.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import FMWConstants from '../../common/FMWConstants.js';
import FourierSeries from '../../common/model/FourierSeries.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

// constants
const AMPLITUDE_THRESHOLD = 0.01; // a guess amplitude must be at least this close to an answer amplitude

class WaveGameChallenge {

  /**
   * @param {number} numberOfHarmonics
   * @param {number} numberOfNonZeroHarmonics
   * @param {number} maxAbsoluteAmplitude
   * @param {function} isCorrectCallback
   * @param {Object} [options]
   */
  constructor( numberOfHarmonics, numberOfNonZeroHarmonics, maxAbsoluteAmplitude, isCorrectCallback, options ) {
    assert && AssertUtils.assertPositiveInteger( numberOfHarmonics );
    assert && AssertUtils.assertPositiveInteger( numberOfNonZeroHarmonics );
    assert && assert( numberOfHarmonics >= numberOfNonZeroHarmonics, 'requested too many numberOfNonZeroHarmonics' );
    assert && AssertUtils.assertPositiveNumber( maxAbsoluteAmplitude );
    assert && assert( typeof isCorrectCallback === 'function', 'invalid isCorrectCallback' );

    // @public (read-only) the Fourier series that corresponds to the answer to the challenge
    this.answerFourierSeries = new FourierSeries( {
      amplitudes: generateRandomAmplitudes( numberOfHarmonics, numberOfNonZeroHarmonics, maxAbsoluteAmplitude )
    } );

    // @public (read-only) the Fourier series that corresponds to the user's guess
    this.guessFourierSeries = new FourierSeries();

    //TODO do not evaluate the guess until the user has released all sliders
    const guessAmplitudesListener = guessAmplitudes => {

      // Evaluate the guess to see if it's close enough to the answer.
      let isCorrect = true;
      const answerAmplitudes = this.answerFourierSeries.amplitudesProperty.value;
      for ( let i = 0; i < guessAmplitudes.length && isCorrect; i++ ) {
        isCorrect = Math.abs( guessAmplitudes[ i ] - answerAmplitudes[ i ] ) <= AMPLITUDE_THRESHOLD;
      }

      if ( isCorrect ) {

        // unlink this listener because a challenge can only be completed once.
        this.guessFourierSeries.amplitudesProperty.unlink( guessAmplitudesListener );

        isCorrectCallback();
      }
    };
    this.guessFourierSeries.amplitudesProperty.lazyLink( guessAmplitudesListener ); // unlink is not needed.
  }

  /**
   * Determines whether this challenge is 'similar' to some other challenge. This is used to prevent the user from
   * encountering consecutive similar challenges.
   * @param {WaveGameChallenge} challenge
   * @returns {boolean}
   * @public
   */
  isSimilar( challenge ) {
    assert && assert( challenge instanceof WaveGameChallenge, 'invalid challenge' );
    return false; //TODO
  }

  /**
   * Creates a string representation of this challenge. This is for debugging, do not rely on the format!
   * @returns {string}
   * @public
   */
  toString() {
    return `{\nanswer:[${this.answerFourierSeries.amplitudesProperty.value}],\n` +
           `guess:[${this.guessFourierSeries.amplitudesProperty.value}]\n}`;
  }

  /**
   * Gets the amplitudes for the answer, in harmonic order.
   * @returns {number[]}
   * @public
   */
  getAnswerAmplitudes() {
    return this.answerFourierSeries.amplitudesProperty.value;
  }

  /**
   * Solves the challenge by copying the amplitudes for the answer to the guess.
   * This is used for development and QA, when ?showAnswers is present.
   * @public
   */
  solve() {
    const answerAmplitudes = this.getAnswerAmplitudes();
    for ( let i = 0; i < answerAmplitudes.length; i++ ) {
      this.guessFourierSeries.harmonics[ i ].amplitudeProperty.value = answerAmplitudes[ i ];
    }
  }
}

/**
 * Generates a set of random amplitudes.
 * @param {number} numberOfAmplitudes - total number of amplitudes
 * @param {number} numberOfNonZeroHarmonics - number of non-zero amplitudes
 * @param {number} maxAbsoluteAmplitude
 * @returns {number[]}
 */
function generateRandomAmplitudes( numberOfAmplitudes, numberOfNonZeroHarmonics, maxAbsoluteAmplitude ) {
  assert && AssertUtils.assertPositiveInteger( numberOfAmplitudes );
  assert && AssertUtils.assertPositiveInteger( numberOfNonZeroHarmonics );
  assert && assert( numberOfAmplitudes >= numberOfNonZeroHarmonics, 'requested too many numberOfNonZeroHarmonics' );
  assert && AssertUtils.assertPositiveNumber( maxAbsoluteAmplitude );

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
    let amplitude = dotRandom.nextDoubleBetween( -maxAbsoluteAmplitude, 0 );
    if ( amplitude !== -maxAbsoluteAmplitude ) {
      amplitude = Utils.roundToInterval( amplitude, FMWConstants.AMPLITUDE_SLIDER_SNAP_INTERVAL );
    }
    if ( amplitude === 0 ) {
      amplitude = -FMWConstants.AMPLITUDE_SLIDER_SNAP_INTERVAL;
    }
    amplitude *= dotRandom.nextBoolean() ? 1 : -1;
    assert && assert( amplitude >= -maxAbsoluteAmplitude && amplitude <= maxAbsoluteAmplitude && amplitude !== 0,
      `unexpected amplitude: ${amplitude}` );
    amplitudes[ amplitudesIndex ] = amplitude;
  }
  assert && assert( amplitudes.length === numberOfAmplitudes, `expected ${numberOfAmplitudes} amplitudes` );

  return amplitudes;
}

fourierMakingWaves.register( 'WaveGameChallenge', WaveGameChallenge );
export default WaveGameChallenge;