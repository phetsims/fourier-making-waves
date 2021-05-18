// Copyright 2018-2020, University of Colorado Boulder

/**
 * WaveGameLevel is the model for a game level.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import FMWConstants from '../../common/FMWConstants.js';
import Domain from '../../common/model/Domain.js';
import FourierSeries from '../../common/model/FourierSeries.js';
import SeriesType from '../../common/model/SeriesType.js';
import XAxisDescription from '../../common/model/XAxisDescription.js';
import DiscreteYAxisDescriptions from '../../discrete/model/DiscreteYAxisDescriptions.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WaveGameChallenge from './WaveGameChallenge.js';
import WaveGameChallengeGenerator from './WaveGameChallengeGenerator.js';
import WaveGameHarmonicsChart from './WaveGameHarmonicsChart.js';
import WaveGameSumChart from './WaveGameSumChart.js';

// constants

// Chart properties that are fixed in the Wave Game, and shared by the Harmonics and Sum charts.
const DOMAIN = Domain.SPACE;
const SERIES_TYPE = SeriesType.SINE;
const t = 0; // lowercase t (time) to distinguish from uppercase T (period)

// Fixed x-axis description, because Wave Game has no zoom buttons for the x axes.
const X_AXIS_DESCRIPTION = new XAxisDescription( {
  max: 1 / 2,
  gridLineSpacing: 1 / 8,
  tickMarkSpacing: 1 / 4,
  tickLabelSpacing: 1 / 4
} );
assert && assert( X_AXIS_DESCRIPTION.range.getLength() >= 0.5,
  'The implementation of y-axis auto-scaling requires that at least 1/2 of the wavelength is always visible. ' +
  'X_AXIS_DESCRIPTION violates that requirement.' );

class WaveGameLevel {

  /**
   * @param {number} levelNumber - game level, numbered from 1 in the model and view
   * @param {string} description - displayed in the status bar
   * @param {Object} [options]
   */
  constructor( levelNumber, description, options ) {

    assert && assert( typeof levelNumber === 'number' && levelNumber > 0, `invalid level, numbering starts with 1: ${levelNumber}` );
    assert && assert( typeof description === 'string' );

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
        this.scoreProperty.value += FMWConstants.POINTS_PER_CHALLENGE;
      },
      tandem: options.tandem.createTandem( 'challengeGenerator' )
    } );

    //TODO this should probably be null initially, we don't want to always reset to the same challenge
    // @public (read-only) {Property.<WaveGameChallenge>} the current challenge
    this.challengeProperty = new Property( this.challengeGenerator.nextChallenge( null ), {
      isValidValue: value => ( value instanceof WaveGameChallenge )
      //TODO tandem, phetioType
    } );

    //TODO eliminate the need for adapterGuessFourierSeries and adapterAnswerFourierSeries by making charts mutable

    // @public This is a static instance of FourierSeries that is passed to the charts.
    // We update the charts by keeping this series in sync with the current challenge's guessFourierSeries.
    this.adapterGuessFourierSeries = new FourierSeries();

    // @public  This is a static instance of FourierSeries that is passed to the Sum chart.
    // We update the Sum chart by keeping this series in sync with the current challenge's answerFourierSeries.
    this.adapterAnswerFourierSeries = new FourierSeries();

    // @public
    this.harmonicsChart = new WaveGameHarmonicsChart( this.adapterGuessFourierSeries, DOMAIN, SERIES_TYPE, t,
      X_AXIS_DESCRIPTION );

    // @public
    this.sumChart = new WaveGameSumChart( this.adapterAnswerFourierSeries, this.adapterGuessFourierSeries,
      DOMAIN, SERIES_TYPE, t, X_AXIS_DESCRIPTION, DiscreteYAxisDescriptions );

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

      // Set the amplitudes for the new answer
      for ( let i = 0; i < this.adapterAnswerFourierSeries.harmonics.length; i++ ) {
        this.adapterAnswerFourierSeries.harmonics[ i ].amplitudeProperty.value =
          challenge.answerFourierSeries.harmonics[ i ].amplitudeProperty.value;
      }
    } );

    // When an amplitude is changed via the chart, update the corresponding amplitude in the challenge's guess.
    // unlink is not needed.
    for ( let i = 0; i < this.adapterGuessFourierSeries.harmonics.length; i++ ) {
      const order = i + 1;
      this.adapterGuessFourierSeries.harmonics[ i ].amplitudeProperty.link( amplitude => {
        this.challengeProperty.value.guessFourierSeries.harmonics[ order - 1 ].amplitudeProperty.value = amplitude;
      } );
    }
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