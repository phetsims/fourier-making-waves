// Copyright 2018-2020, University of Colorado Boulder

/**
 * WaveGameLevel is the model for a game level.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import required from '../../../../phet-core/js/required.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import Domain from '../../common/model/Domain.js';
import EmphasizedHarmonics from '../../common/model/EmphasizedHarmonics.js';
import FourierSeries from '../../common/model/FourierSeries.js';
import SeriesType from '../../common/model/SeriesType.js';
import XAxisDescription from '../../common/model/XAxisDescription.js';
import DiscreteYAxisDescriptions from '../../discrete/model/DiscreteYAxisDescriptions.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import AmplitudesGenerator from './AmplitudesGenerator.js';
import WaveGameAmplitudesChart from './WaveGameAmplitudesChart.js';
import WaveGameHarmonicsChart from './WaveGameHarmonicsChart.js';
import WaveGameSumChart from './WaveGameSumChart.js';

// constants

// Chart properties that are fixed in the Wave Game, and shared by the Harmonics and Sum charts.
const DOMAIN = Domain.SPACE;
const SERIES_TYPE = SeriesType.SINE;
const t = 0; // lowercase t (time) to distinguish from uppercase T (period)
const AMPLITUDE_THRESHOLD = 0.01; // a guess amplitude must be at least this close to an answer amplitude

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
   * @param {number} levelNumber
   * @param {Object} config
   */
  constructor( levelNumber, config ) {

    assert && AssertUtils.assertPositiveInteger( levelNumber ); // Level numbering starts from 1.

    config = merge( {

      // {number} default number of amplitude controls to show for a challenge
      numberOfAmplitudeControls: required( config.numberOfAmplitudeControls ),

      // {function():number} the number of non-zero harmonics is each challenge
      getNumberOfNonZeroHarmonics: () => levelNumber,

      // {string} message shown in the status bar that appears at the top of the Wave Game screen
      statusBarMessage: StringUtils.fillIn( fourierMakingWavesStrings.statusNumberHarmonics, {
        levelNumber: levelNumber,
        numberOfHarmonics: levelNumber
      } ),

      // {string} shown in the info dialog that describes the game levels
      infoDialogDescription: StringUtils.fillIn( fourierMakingWavesStrings.infoNumberHarmonics, {
        levelNumber: levelNumber,
        numberOfHarmonics: levelNumber
      } ),

      tandem: Tandem.REQUIRED
    }, config );

    assert && assert( typeof config.getNumberOfNonZeroHarmonics === 'function' );
    assert && AssertUtils.assertNonNegativeInteger( config.numberOfAmplitudeControls );
    assert && assert( config.numberOfAmplitudeControls >= levelNumber && config.numberOfAmplitudeControls <= FMWConstants.MAX_HARMONICS );
    assert && assert( typeof config.statusBarMessage === 'string' );
    assert && assert( typeof config.infoDialogDescription === 'string' );

    // @public (read-only)
    this.levelNumber = levelNumber;
    this.statusBarMessage = config.statusBarMessage;
    this.infoDialogDescription = config.infoDialogDescription;

    // @public
    this.scoreProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      isValidValue: value => ( value >= 0 ),
      phetioReadOnly: true,
      tandem: config.tandem.createTandem( 'scoreProperty' )
    } );

    // @private
    this.amplitudesGenerator = new AmplitudesGenerator( {
      getNumberOfNonZeroHarmonics: config.getNumberOfNonZeroHarmonics
    } );

    // @private the Fourier series that corresponds to the answer to the challenge
    this.answerSeries = new FourierSeries( {
      amplitudes: this.amplitudesGenerator.createAmplitudes(),
      tandem: config.tandem.createTandem( 'answerSeries' )
    } );

    // @private the Fourier series that corresponds to the user's guess
    this.guessSeries = new FourierSeries( {
      tandem: config.tandem.createTandem( 'guessSeries' )
    } );

    // @public whether it's OK to evaluate the user's guess
    this.okToEvaluateProperty = new BooleanProperty( true );

    // @public
    this.numberOfAmplitudeControlsProperty = new NumberProperty( 1, {
      range: new Range( 1, this.guessSeries.harmonics.length )
    } );

    // The harmonics to be emphasized in the Harmonics chart, as the result of UI interactions.
    // These are harmonics in guessSeries.
    const emphasizedHarmonics = new EmphasizedHarmonics( {
      tandem: config.tandem.createTandem( 'emphasizedHarmonics' )
    } );

    // @public
    this.amplitudesChart = new WaveGameAmplitudesChart( this.answerSeries, this.guessSeries, emphasizedHarmonics,
      this.numberOfAmplitudeControlsProperty );

    // y-axis scale is fixed for the Harmonics chart. There are no zoom controls
    const harmonicsYAxisDescription = DiscreteYAxisDescriptions[ DiscreteYAxisDescriptions.length - 1 ];

    // @public
    this.harmonicsChart = new WaveGameHarmonicsChart( this.guessSeries, emphasizedHarmonics,
      DOMAIN, SERIES_TYPE, t, X_AXIS_DESCRIPTION, harmonicsYAxisDescription );

    // @public
    this.sumChart = new WaveGameSumChart( this.answerSeries, this.guessSeries,
      DOMAIN, SERIES_TYPE, t, X_AXIS_DESCRIPTION, DiscreteYAxisDescriptions );

    // @public Has the current challenge been solved?
    this.isSolvedProperty = new BooleanProperty( false );

    // When the challenge is solved, award points.
    this.isSolvedProperty.lazyLink( isSolved => {
      if ( isSolved ) {
        this.scoreProperty.value += FMWConstants.POINTS_PER_CHALLENGE;
      }
    } );

    //TODO this is called 11 times when pressing EraserButton or newWaveformButton
    // Evaluate the user's guess.
    Property.multilink(
      [ this.okToEvaluateProperty, this.guessSeries.amplitudesProperty ],
      ( okToEvaluate, guessAmplitudes ) => {
        if ( okToEvaluate && !this.isSolvedProperty.value ) {
          this.evaluateGuess();
        }
      } );

    //TODO this is called 11 times when pressing newWaveformButton
    // When the answer changes...
    this.answerSeries.amplitudesProperty.link( answerAmplitudes => {

      // Log the answer to the console.
      phet.log && phet.log( `level=${this.levelNumber} answer=[${answerAmplitudes}]` );

      this.okToEvaluateProperty.reset();
      this.isSolvedProperty.reset();
      emphasizedHarmonics.reset();

      // Adjust the value and range of numberOfAmplitudeControlsProperty to match the answer.
      // If the current value is greater than the default value for the level, keep the current value.
      // See https://github.com/phetsims/fourier-making-waves/issues/63#issuecomment-845466971
      const min = this.answerSeries.getNumberOfNonZeroHarmonics();
      const max = this.numberOfAmplitudeControlsProperty.rangeProperty.value.max;
      const value = Math.max( this.numberOfAmplitudeControlsProperty.value, config.numberOfAmplitudeControls );
      this.numberOfAmplitudeControlsProperty.setValueAndRange( value, new Range( min, max ) );

      // Start over with counting the number of times that the user has pressed on an interactive part
      // of the Amplitudes chart.  This determines when the 'Show Answer' button becomes enabled.
      this.amplitudesChart.numberOfPressesProperty.value = 0;
    } );

    // @private
    this.resetWaveGameLevel = () => {
      this.scoreProperty.reset();
      this.okToEvaluateProperty.reset();
      this.isSolvedProperty.reset();
      emphasizedHarmonics.reset();
      this.newWaveform(); //TODO Is it OK that we're not resetting to the original answer?
    };
  }

  /**
   * @public
   */
  reset() {
    this.resetWaveGameLevel();
  }

  /**
   * Evaluates the guess to see if it's close enough to the answer.
   * @private
   */
  evaluateGuess() {
    assert && assert( !this.isSolvedProperty.value );

    const answerAmplitudes = this.answerSeries.amplitudesProperty.value;
    const guessAmplitudes = this.guessSeries.amplitudesProperty.value;

    let isSolved = true;
    for ( let i = 0; i < guessAmplitudes.length && isSolved; i++ ) {
      isSolved = Math.abs( guessAmplitudes[ i ] - answerAmplitudes[ i ] ) <= AMPLITUDE_THRESHOLD;
    }

    this.isSolvedProperty.value = isSolved;
  }

  /**
   * Creates a new challenge, by settings all guess amplitudes to zero, and creating a new set of answer amplitudes.
   * Called when the 'New Waveform' button is pressed.
   * @public
   */
  newWaveform() {
    this.guessSeries.setAllAmplitudes( 0 );
    const previousAmplitudes = this.answerSeries.amplitudesProperty.value;
    this.answerSeries.setAmplitudes( this.amplitudesGenerator.createAmplitudes( previousAmplitudes ) );
    this.okToEvaluateProperty.value = true;
  }

  /**
   * Shows the answer for the challenge.
   * Called when the 'Show Answer' button is pressed.
   * @public
   */
  showAnswer() {
    this.okToEvaluateProperty.value = false;
    this.guessSeries.setAmplitudes( this.answerSeries.amplitudesProperty.value );
  }

  /**
   * Sets all amplitudes to zero for the guess.
   * Called when the eraser button is pressed.
   * @public
   */
  eraseAmplitudes() {
    this.guessSeries.setAllAmplitudes( 0 );
  }
}

fourierMakingWaves.register( 'WaveGameLevel', WaveGameLevel );
export default WaveGameLevel;