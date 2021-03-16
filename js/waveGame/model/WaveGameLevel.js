// Copyright 2018-2020, University of Colorado Boulder

/**
 * WaveGameLevel is the model for a game level.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import EmphasizedHarmonics from '../../common/model/EmphasizedHarmonics.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WaveGameChallenge from './WaveGameChallenge.js';
import WaveGameChallengeGenerator from './WaveGameChallengeGenerator.js';
import WaveGameHarmonicsChart from './WaveGameHarmonicsChart.js';

// constants
const POINTS_PER_CHALLENGE = 1;

class WaveGameLevel {

  /**
   * @param {number} levelNumber - game level, numbered from 1 in the model and view
   * @param {string} description - displayed in the status bar
   * @param {Object} [options]
   */
  constructor( levelNumber, description, options ) {

    assert && assert( typeof levelNumber === 'number' && levelNumber > 0, `invalid level, numbering starts with 1: ${levelNumber}` );
    assert && assert( typeof description === 'string', 'invalid description' );

    options = merge( {
      getNumberOfNonZeroHarmonics: () => 1
    }, options );

    // @public (read-only)
    this.levelNumber = levelNumber;
    this.description = description;

    // @public
    this.scoreProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      isValidValue: value => ( value >= 0 ),
      phetioReadOnly: true,
      tandem: options.tandem.createTandem( 'scoreProperty' )
    } );

    // @private
    this.challengeGenerator = new WaveGameChallengeGenerator( {
      getNumberOfNonZeroHarmonics: options.getNumberOfNonZeroHarmonics,
      isCorrectCallback: () => {
        phet.log && phet.log( 'Correct answer!' );
        this.scoreProperty.value += POINTS_PER_CHALLENGE;
      },
      tandem: options.tandem.createTandem( 'challengeGenerator' )
    } );

    //TODO this should probably be null initially, we don't want to always reset to the same challenge
    // @public (read-only) {Property.<WaveGameChallenge>} the current challenge
    this.challengeProperty = new Property( this.challengeGenerator.nextChallenge( null ), {
      isValidValue: value => ( value instanceof WaveGameChallenge )
      //TODO tandem, phetioType
    } );

    // @public
    this.emphasizedHarmonics = new EmphasizedHarmonics();

    // @public
    this.harmonicsChart = new WaveGameHarmonicsChart( this.challengeProperty );

    this.challengeProperty.link( challenge => {
      phet.log && phet.log( `level=${levelNumber} challenge=${challenge.toString()}` );
      this.emphasizedHarmonics.clear();
    } );
  }

  /**
   * @public
   */
  reset() {
    this.scoreProperty.reset();
    this.challengeProperty.reset();
    //TODO call this.nextChallenge(), so that we're not always resetting to the same initial challenge?
  }

  /**
   * Creates the next challenge.
   * @public
   */
  nextChallenge() {
    this.challengeProperty.value = this.challengeGenerator.nextChallenge( this.challengeProperty.value );
  }

  /**
   * Solves the current challenge.
   * This is used for development and QA, when ?showAnswers is present.
   * @public
   */
  solve() {
    this.challengeProperty.value.solve();
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