// Copyright 2021, University of Colorado Boulder

/**
 * WaveGameChallenge is the model of a game challenge.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import FMWConstants from '../../common/FMWConstants.js';
import FourierSeries from '../../common/model/FourierSeries.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

// constants
const AMPLITUDE_THRESHOLD = 0.01; // a guess amplitude must be at least this close to an answer amplitude

class WaveGameChallenge {

  /**
   * @param {number} numberOfNonZeroHarmonics
   * @param {Object} [options]
   */
  constructor( numberOfNonZeroHarmonics, options ) {
    assert && assert( typeof numberOfNonZeroHarmonics === 'number' &&
    numberOfNonZeroHarmonics > 0 && numberOfNonZeroHarmonics <= FMWConstants.MAX_HARMONICS,
      'invalid numberOfNonZeroHarmonics' );

    // @public (read-only) the Fourier series that corresponds to the answer to the challenge
    this.answerFourierSeries = new FourierSeries();

    // @public (read-only) the Fourier series that corresponds to the user's guess
    this.guessFourierSeries = new FourierSeries();

    // @public emits when the guess is sufficiently close to the answer
    this.isCorrectEmitter = new Emitter();

    //TODO do not evaluate the guess until the user has released all sliders

    // Evaluate the guess to see if it's close enough to the answer. unlink is not needed.
    this.guessFourierSeries.amplitudesProperty.lazyLink( guessAmplitudes => {
      let isCorrect = true;
      const answerAmplitudes = this.answerFourierSeries.amplitudesProperty.value;
      for ( let i = 0; i < guessAmplitudes.length && isCorrect; i++ ) {
        isCorrect = Math.abs( guessAmplitudes[ i ] - answerAmplitudes[ i ] ) <= AMPLITUDE_THRESHOLD;
      }
      isCorrect && this.isCorrectEmitter.emit();
    } );
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
    return `{ answer:[${this.answerFourierSeries.amplitudesProperty.value}], ` +
           `guess:[${this.guessFourierSeries.amplitudesProperty.value}] }`;
  }
}

fourierMakingWaves.register( 'WaveGameChallenge', WaveGameChallenge );
export default WaveGameChallenge;