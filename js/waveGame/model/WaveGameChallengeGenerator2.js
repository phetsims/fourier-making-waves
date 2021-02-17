// Copyright 2021, University of Colorado Boulder

/**
 * WaveGameChallengeGenerator2 is the challenge generator for level 2.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import fourierMakingWaves from '../../fourierMakingWaves.js';
import WaveGameChallenge from './WaveGameChallenge.js';
import WaveGameChallengeGenerator from './WaveGameChallengeGenerator.js';

class WaveGameChallengeGenerator2 extends WaveGameChallengeGenerator {

  /**
   * @param {Object} [options]
   * @abstract
   */
  constructor( options ) {
    super( options );
    //TODO
  }

  /**
   * Creates the next challenge.
   * @returns {WaveGameChallenge}
   * @public
   * @override
   */
  nextChallenge() {
    return new WaveGameChallenge();
  }

  /**
   * Called when the 'test challenge generators' button is pressed in the level-selection UI.
   * @public
   * @override
   */
  test() {
    console.log( 'testing WaveGameChallengeGenerator2...' );
    //TODO
  }
}

fourierMakingWaves.register( 'WaveGameChallengeGenerator2', WaveGameChallengeGenerator2 );
export default WaveGameChallengeGenerator2;