// Copyright 2018-2020, University of Colorado Boulder

/**
 * WaveGameLevel is the model for a game level.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WaveGameChallenge from './WaveGameChallenge.js';
import WaveGameChallengeGenerator from './WaveGameChallengeGenerator.js';

class WaveGameLevel {

  /**
   * @param {number} levelNumber - game level, numbered from 1 in the model and view
   * @param {string} description - displayed in the status bar
   * @param {Object} [options]
   */
  constructor( levelNumber, description, options ) {

    assert && assert( typeof levelNumber === 'number' && levelNumber > 0, 'invalid level, numbering starts with 1: ' + levelNumber );
    assert && assert( typeof description === 'string', 'invalid description' );

    options = merge( {
      getNumberOfNonZeroHarmonics: () => 1
    }, options );

    // @public (read-only)
    this.levelNumber = levelNumber;
    this.description = description;

    // @private
    this.challengeGenerator = new WaveGameChallengeGenerator( {
      getNumberOfNonZeroHarmonics: options.getNumberOfNonZeroHarmonics,
      tandem: options.tandem.createTandem( 'challengeGenerator' )
    } );

    // @public
    this.scoreProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      isValidValue: value => ( value >= 0 ),
      phetioReadOnly: true,
      tandem: options.tandem.createTandem( 'scoreProperty' )
    } );

    // @public (read-only) {Property.<WaveGameChallenge>} the current challenge
    this.challengeProperty = new Property( this.challengeGenerator.nextChallenge( null ), {
      isValidValue: value => ( value instanceof WaveGameChallenge )
      //TODO tandem
    } );

    phet.log && this.challengeProperty.link( challenge => {
      phet.log && phet.log( `level=${levelNumber} challenge=${challenge.toString()}` );
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
    this.challengeProperty.value = this.challengeGenerator.nextChallenge( this.challengeProperty.value );
  }

  /**
   * Tests this game level.
   * @public
   */
  test() {
    this.challengeGenerator.test();
  }
}

fourierMakingWaves.register( 'WaveGameLevel', WaveGameLevel );
export default WaveGameLevel;