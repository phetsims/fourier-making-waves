// Copyright 2021, University of Colorado Boulder

/**
 * WaveGameChallengeGenerator is responsible for generating game challenges.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WaveGameChallenge from './WaveGameChallenge.js';

class WaveGameChallengeGenerator {

  /**
   * @param {Object} [options]
   * @abstract
   */
  constructor( options ) {

    options = merge( {

      // {function():number} gets the number of non-zero harmonics in the challenge
      getNumberOfNonZeroHarmonics: () => 1,

      // {function} called when a challenge is correctly answered
      isCorrectCallback: null,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // @private
    this.getNumberOfNonZeroHarmonics = options.getNumberOfNonZeroHarmonics;

    // @private
    this.isCorrectCallback = options.isCorrectCallback;
  }

  /**
   * Creates the next challenge.
   * @param {WaveGameChallenge|null} previousChallenge
   * @returns {WaveGameChallenge}
   * @public
   */
  nextChallenge( previousChallenge ) {
    assert && assert( previousChallenge instanceof WaveGameChallenge || previousChallenge === null,
      'invalid previousChallenge' );

    // {WaveGameChallenge} Generate a challenge.
    let challenge = this.createWaveGameChallenge();

    if ( previousChallenge ) {

      // If the previous challenge is 'similar' to the current challenge, generate another challenge.
      // Do this a finite number of times.
      let attempts = 1;
      const maxAttempts = 10;
      while ( challenge.isSimilar( previousChallenge ) && attempts < maxAttempts ) {
        challenge = this.createWaveGameChallenge();
        attempts++;
      }

      // If we reached the max number of attempts, log a warning and continue with a 'similar' challenge.
      // In practice, this should occur rarely, if ever.  If it occurs too frequently, increase maxAttempts.
      if ( attempts === maxAttempts ) {
        phet.log && phet.log( `WARNING: Similar challenges were generated ${attempts} times in a row.` );
      }
    }

    return challenge;
  }

  /**
   * Creates a random WaveGameChallenge.
   * @returns {WaveGameChallenge}
   * @private
   */
  createWaveGameChallenge() {
    const numberOfNonZeroHarmonics = this.getNumberOfNonZeroHarmonics();
    assert && AssertUtils.assertPositiveInteger( numberOfNonZeroHarmonics );
    return new WaveGameChallenge( FMWConstants.MAX_HARMONICS, numberOfNonZeroHarmonics,
      FMWConstants.MAX_ABSOLUTE_AMPLITUDE, this.isCorrectCallback );
  }

  /**
   * Tests this challenge generator.
   * @public
   */
  test() {
    const numberOfTests = 1000;
    for ( let i = 0; i < numberOfTests; i++ ) {
      this.createWaveGameChallenge();
    }
  }
}

fourierMakingWaves.register( 'WaveGameChallengeGenerator', WaveGameChallengeGenerator );
export default WaveGameChallengeGenerator;