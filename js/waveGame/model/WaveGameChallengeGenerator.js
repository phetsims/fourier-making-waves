// Copyright 2021, University of Colorado Boulder

/**
 * WaveGameChallengeGenerator is the abstract base class for generating game challenges.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import fourierMakingWaves from '../../fourierMakingWaves.js';

class WaveGameChallengeGenerator {

  /**
   * @param {Object} [options]
   * @abstract
   */
  constructor( options ) {
    //TODO
  }

  /**
   * Creates the next challenge.
   * @returns {WaveGameChallenge}
   * @public
   * @abstract
   */
  nextChallenge() {
    throw new Error( 'nextChallenge must be implemented by subclass' );
  }

  /**
   * Called when the 'test challenge generators' button is pressed in the level-selection UI.
   * @public
   * @abstract
   */
  test() {
    throw new Error( 'test must be implemented by subclass' );
  }
}

fourierMakingWaves.register( 'WaveGameChallengeGenerator', WaveGameChallengeGenerator );
export default WaveGameChallengeGenerator;