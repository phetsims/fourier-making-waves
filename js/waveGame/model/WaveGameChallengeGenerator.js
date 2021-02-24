// Copyright 2021, University of Colorado Boulder

/**
 * WaveGameChallengeGenerator is responsible for generating game challenges.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
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

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // @private {function():number} gets the number of non-zero harmonics in the challenge
    this.getNumberOfNonZeroHarmonics = options.getNumberOfNonZeroHarmonics;
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

    let challenge = new WaveGameChallenge( this.getNumberOfNonZeroHarmonics() );

    if ( previousChallenge ) {

      // If the previous challenge is 'similar' to the current challenge, generate another challenge.
      // Do this a finite number of times.
      let attempts = 1;
      const maxAttempts = 10;
      while ( challenge.isSimilar( previousChallenge ) && attempts < maxAttempts ) {
        challenge = new WaveGameChallenge( this.getNumberOfNonZeroHarmonics() );
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
   * Tests this challenge generator.
   * @public
   */
  test() {
    //TODO
  }
}

fourierMakingWaves.register( 'WaveGameChallengeGenerator', WaveGameChallengeGenerator );
export default WaveGameChallengeGenerator;