// Copyright 2018-2020, University of Colorado Boulder

/**
 * WaveGameLevel is the model for a game level.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import FourierSeries from '../../common/model/FourierSeries.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WaveGameChallenge from './WaveGameChallenge.js';
import WaveGameChallengeGenerator from './WaveGameChallengeGenerator.js';
import WaveGameHarmonicsChart from './WaveGameHarmonicsChart.js';
import WaveGameSumChart from './WaveGameSumChart.js';

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

    //TODO eliminate the need for adapterGuessFourierSeries by making charts mutable

    // @public This is a static instance of FourierSeries that is passed to the charts.
    // We update the charts by keeping this series in sync with the current challenge's guessFourierSeries.
    this.adapterGuessFourierSeries = new FourierSeries();

    const guessAmplitudesListener = amplitudes => this.adapterGuessFourierSeries.setAmplitudes( amplitudes );

    // When the challenge changes...
    this.challengeProperty.link( ( challenge, previousChallenge ) => {

      // Log the challenge to the console.
      phet.log && phet.log( `level=${levelNumber} challenge=${challenge.toString()}` );

      // Add a listener to keep adapterGuessFourierSeries synchronized with the challenge's guessFourierSeries.
      if ( previousChallenge ) {
        previousChallenge.guessFourierSeries.amplitudesProperty.unlink( guessAmplitudesListener );
      }
      challenge.guessFourierSeries.amplitudesProperty.link( guessAmplitudesListener );
    } );

    // When an amplitude is changed via the chart, update the corresponding amplitude in the challenge's guess.
    // unlink is not needed.
    for ( let i = 0; i < this.adapterGuessFourierSeries.harmonics.length; i++ ) {
      const order = i + 1;
      this.adapterGuessFourierSeries.harmonics[ i ].amplitudeProperty.link( amplitude => {
        this.challengeProperty.value.guessFourierSeries.harmonics[ order - 1 ].amplitudeProperty.value = amplitude;
      } );
    }

    // @public
    this.harmonicsChart = new WaveGameHarmonicsChart( this.adapterGuessFourierSeries );

    // @public
    this.sumChart = new WaveGameSumChart( this.adapterGuessFourierSeries,
      this.harmonicsChart.xZoomLevelProperty, this.harmonicsChart.xAxisDescriptionProperty );
  }

  /**
   * @public
   */
  reset() {
    this.scoreProperty.reset();

    // Instead of this.challengeProperty.reset(), call this.nextChallenge(), so that we're not always
    // resetting to same challenge
    this.nextChallenge();
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