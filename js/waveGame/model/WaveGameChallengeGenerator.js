// Copyright 2021, University of Colorado Boulder

/**
 * WaveGameChallengeGenerator is responsible for generating game challenges.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
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
      getNumberOfNonZeroHarmonics: () => 1,
      tandem: Tandem.REQUIRED
    }, options );

    // @public (read-only) the Fourier series that corresponds to the answer to the challenge
    this.answerFourierSeries = new FourierSeries( {
      tandem: options.tandem.createTandem( 'answerFourierSeries' )
    } );

    // @public (read-only) the Fourier series that corresponds to the user's guess
    this.guessFourierSeries = new FourierSeries( {
      tandem: options.tandem.createTandem( 'guessFourierSeries' )
    } );
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