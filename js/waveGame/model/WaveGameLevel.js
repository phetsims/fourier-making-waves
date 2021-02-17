// Copyright 2018-2020, University of Colorado Boulder

/**
 * WaveGameLevel is the model for a game level.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WaveGameChallenge from './WaveGameChallenge.js';
import WaveGameChallengeGenerator from './WaveGameChallengeGenerator.js';

class WaveGameLevel {

  /**
   * @param {number} levelNumber - game level, numbered from 1 in the model and view
   * @param {string} description - displayed in the status bar
   * @param {WaveGameChallengeGenerator1} challengeGenerator
   */
  constructor( levelNumber, description, challengeGenerator ) {

    assert && assert( typeof levelNumber === 'number' && levelNumber > 0, 'invalid level, numbering starts with 1: ' + levelNumber );
    assert && assert( typeof description === 'string', 'invalid description' );
    assert && assert( challengeGenerator instanceof WaveGameChallengeGenerator, 'invalid challengeGenerator' );

    // @public (read-only)
    this.levelNumber = levelNumber;
    this.description = description;
    this.challengeGenerator = challengeGenerator;

    // @public
    this.scoreProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      isValidValue: value => ( value >= 0 )
    } );

    // @public (read-only) {Property.<WaveGameChallenge>} the current challenge
    this.challengeProperty = new Property( challengeGenerator.nextChallenge(), {
      isValidValue: value => ( value instanceof WaveGameChallenge )
    } );
  }

  /**
   * @public
   */
  reset() {
    this.scoreProperty.reset();
    this.challengeProperty.reset();
  }

  /**
   * Creates the next challenge.
   * @public
   */
  next() {
    this.challengeProperty.value = this.challengeGenerator.nextChallenge();
  }
}

fourierMakingWaves.register( 'WaveGameLevel', WaveGameLevel );
export default WaveGameLevel;