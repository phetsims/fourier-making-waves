// Copyright 2021, University of Colorado Boulder

/**
 * WaveGameChallengeGenerator is responsible for generating game challenges.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import FourierSeries from '../../common/model/FourierSeries.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import merge from '../../../../phet-core/js/merge.js';
import WaveGameChallenge from './WaveGameChallenge.js';

class WaveGameChallengeGenerator {

  /**
   * @param {Object} [options]
   * @abstract
   */
  constructor( options ) {

    options = merge( {
      getNumberOfNonZeroHarmonics: () => 1
    }, options );

    // @public (read-only)
    this.userSeries = new FourierSeries();
    this.challengeSeries = new FourierSeries();
  }

  /**
   * Creates the next challenge.
   * @returns {WaveGameChallenge}
   * @public
   */
  nextChallenge() {
    return new WaveGameChallenge();
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