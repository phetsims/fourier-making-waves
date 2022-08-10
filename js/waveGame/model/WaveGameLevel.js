// Copyright 2021-2022, University of Colorado Boulder

/**
 * WaveGameLevel is the model for a game level.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import required from '../../../../phet-core/js/required.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWQueryParameters from '../../common/FMWQueryParameters.js';
import Domain from '../../common/model/Domain.js';
import EmphasizedHarmonics from '../../common/model/EmphasizedHarmonics.js';
import FourierSeries from '../../common/model/FourierSeries.js';
import SeriesType from '../../common/model/SeriesType.js';
import DiscreteAxisDescriptions from '../../discrete/model/DiscreteAxisDescriptions.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import AmplitudesGenerator from './AmplitudesGenerator.js';
import WaveGameAmplitudesChart from './WaveGameAmplitudesChart.js';
import WaveGameHarmonicsChart from './WaveGameHarmonicsChart.js';
import WaveGameSumChart from './WaveGameSumChart.js';

// constants

// Chart properties that are fixed in the Wave Game, and shared by the Harmonics and Sum charts.
const DOMAIN = Domain.SPACE;
const SERIES_TYPE = SeriesType.SIN;
const t = 0; // lowercase t (time) to distinguish from uppercase T (period)

// A guess amplitude must be at least this close to an answer amplitude,
// see https://github.com/phetsims/fourier-making-waves/issues/97
const AMPLITUDE_THRESHOLD = 0;

class WaveGameLevel extends PhetioObject {

  /**
   * @param {number} levelNumber - numbered starting from 1
   * @param {Object} config
   */
  constructor( levelNumber, config ) {

    assert && AssertUtils.assertPositiveInteger( levelNumber ); // numbered starting from 1

    config = merge( {

      // {number} default number of amplitude controls to show for a challenge
      defaultNumberOfAmplitudeControls: required( config.defaultNumberOfAmplitudeControls ),

      // {function():number} the number of non-zero harmonics is each challenge, by default same as level number
      getNumberOfNonZeroHarmonics: () => levelNumber,

      // {string} message shown in the status bar that appears at the top of the Wave Game screen
      statusBarMessage: StringUtils.fillIn( fourierMakingWavesStrings.matchUsingNHarmonics, {
        levelNumber: levelNumber,
        numberOfHarmonics: levelNumber
      } ),

      // {string} shown in the info dialog that describes the game levels
      infoDialogDescription: StringUtils.fillIn( fourierMakingWavesStrings.infoNHarmonics, {
        levelNumber: levelNumber,
        numberOfHarmonics: levelNumber
      } ),

      tandem: Tandem.REQUIRED,
      phetioType: WaveGameLevel.WaveGameLevelIO,
      phetioState: false
    }, config );

    assert && assert( typeof config.getNumberOfNonZeroHarmonics === 'function' );
    assert && AssertUtils.assertNonNegativeInteger( config.defaultNumberOfAmplitudeControls );
    assert && assert( config.defaultNumberOfAmplitudeControls >= levelNumber && config.defaultNumberOfAmplitudeControls <= FMWConstants.MAX_HARMONICS );
    assert && assert( typeof config.statusBarMessage === 'string' );
    assert && assert( typeof config.infoDialogDescription === 'string' );

    super( config );

    // @public (read-only)
    this.levelNumber = levelNumber; // {number} numbered starting from 1
    this.statusBarMessage = config.statusBarMessage; // {string}
    this.infoDialogDescription = config.infoDialogDescription; // {string}

    // @private
    this.defaultNumberOfAmplitudeControls = config.defaultNumberOfAmplitudeControls; // {number}

    // @public The score is the total number of points that have been awarded for this level.
    this.scoreProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      isValidValue: value => ( value >= 0 ),
      phetioReadOnly: true,
      tandem: config.tandem.createTandem( 'scoreProperty' )
    } );

    // @public Whether the current challenge has been solved. A challenge is considered solved when the user has
    // correctly guessed the answer, or when the user has pressed the 'Show Answer' button.
    this.isSolvedProperty = new BooleanProperty( false, {
      tandem: config.tandem.createTandem( 'isSolvedProperty' ),
      phetioReadOnly: true
    } );

    // @private Generates amplitudes for answerSeries
    this.amplitudesGenerator = new AmplitudesGenerator( {
      getNumberOfNonZeroHarmonics: config.getNumberOfNonZeroHarmonics
    } );

    const firstAnswer = ( this.levelNumber === 5 && FMWQueryParameters.answer5 ) ?
                        FMWQueryParameters.answer5 :
                        this.amplitudesGenerator.createAmplitudes();

    // @private answer for the challenge, the waveform that the user is attempting to match
    this.answerSeries = new FourierSeries( {
      amplitudes: firstAnswer,
      tandem: config.tandem.createTandem( 'answerSeries' )
    } );

    // @private the Fourier series that corresponds to the user's guess
    this.guessSeries = new FourierSeries( {
      tandem: config.tandem.createTandem( 'guessSeries' )
    } );

    // @public (read-only) Does the guess currently match the answer, within some threshold?
    this.isMatchedProperty = new DerivedProperty(
      [ this.guessSeries.amplitudesProperty, this.answerSeries.amplitudesProperty ],
      ( guessAmplitudes, answerAmplitudes ) => {
        let isMatched = true;
        for ( let i = 0; i < guessAmplitudes.length && isMatched; i++ ) {
          isMatched = Math.abs( guessAmplitudes[ i ] - answerAmplitudes[ i ] ) <= AMPLITUDE_THRESHOLD;
        }
        return isMatched;
      } );

    // @public the number of amplitude controls (sliders) to show in the Amplitudes chart
    this.numberOfAmplitudeControlsProperty = new NumberProperty( config.defaultNumberOfAmplitudeControls, {
      numberType: 'Integer',
      range: new Range( this.answerSeries.getNumberOfNonZeroHarmonics(), this.answerSeries.harmonics.length ),
      rangePropertyOptions: {
        phetioDocumentation: 'Determines the range of the Amplitude Controls spinner',
        phetioValueType: Range.RangeIO
      },
      tandem: config.tandem.createTandem( 'numberOfAmplitudeControlsProperty' )
    } );

    // @private The harmonics to be emphasized in the Harmonics chart, as the result of UI interactions.
    // These are harmonics in guessSeries.
    this.emphasizedHarmonics = new EmphasizedHarmonics();

    // Parent tandem for all charts
    const chartsTandem = config.tandem.createTandem( 'charts' );

    // @public
    this.amplitudesChart = new WaveGameAmplitudesChart( this.answerSeries, this.guessSeries, this.emphasizedHarmonics,
      this.numberOfAmplitudeControlsProperty, {
        tandem: chartsTandem.createTandem( 'amplitudesChart' )
      } );

    // @public
    this.harmonicsChart = new WaveGameHarmonicsChart( this.guessSeries, this.emphasizedHarmonics, DOMAIN, SERIES_TYPE, t,
      DiscreteAxisDescriptions.DEFAULT_X_AXIS_DESCRIPTION, DiscreteAxisDescriptions.DEFAULT_Y_AXIS_DESCRIPTION, {
        tandem: chartsTandem.createTandem( 'harmonicsChart' )
      } );

    // @public
    this.sumChart = new WaveGameSumChart( this.answerSeries, this.guessSeries, DOMAIN, SERIES_TYPE, t,
      DiscreteAxisDescriptions.DEFAULT_X_AXIS_DESCRIPTION, {
        tandem: chartsTandem.createTandem( 'sumChart' )
      } );

    // @public Fires when a new waveform has been fully initialized, see method newWaveform.
    this.newWaveformEmitter = new Emitter();

    // @public Fires when the guess is checked and found to be correct.
    this.correctEmitter = new Emitter( {
      tandem: config.tandem.createTandem( 'correctEmitter' ),
      parameters: [
        { name: 'pointsAwarded', phetioType: NumberIO }
      ]
    } );

    // @public Fires when the guess is checked and found to be incorrect.
    this.incorrectEmitter = new Emitter( {
      tandem: config.tandem.createTandem( 'incorrectEmitter' )
    } );
  }

  /**
   * @public
   */
  reset() {
    this.scoreProperty.reset();
    this.isSolvedProperty.reset();
    // Not necessary to reset this.numberOfAmplitudeControlsProperty
    this.emphasizedHarmonics.reset();

    // If reset was not called as the result of setting state, start with a new challenge.
    if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {
      this.newWaveform();
    }
  }

  /**
   * Sets all amplitudes to zero for the guess.
   * This method is called when the eraser button is pressed.
   * @public
   */
  eraseAmplitudes() {
    this.guessSeries.setAllAmplitudes( 0 );
  }

  /**
   * Checks the user's guess, awards points if appropriate, and notifies listeners of the result.
   * This method is called when the 'Check Answer' button is pressed.
   * @public
   */
  checkAnswer() {
    assert && assert( !this.isSolvedProperty.value );
    if ( this.isMatchedProperty.value ) {
      const pointAwarded = FMWConstants.POINTS_PER_CHALLENGE;
      this.scoreProperty.value += pointAwarded;
      this.isSolvedProperty.value = true;
      this.correctEmitter.emit( pointAwarded );
    }
    else {
      this.incorrectEmitter.emit();
    }
  }

  /**
   * Shows the answer for the challenge.
   * This method is called when the 'Show Answer' button is pressed.
   * @public
   */
  showAnswer() {
    this.isSolvedProperty.value = true;
    this.guessSeries.setAmplitudes( this.answerSeries.amplitudesProperty.value );
  }

  /**
   * Creates a new challenge, by settings all guess amplitudes to zero, and creating a new set of answer amplitudes.
   * This method is called when the 'New Waveform' button is pressed.
   * @public
   */
  newWaveform() {

    // Set the guess amplitudes to zero.
    this.guessSeries.setAllAmplitudes( 0 );

    // Create a new answer.
    const previousAmplitudes = this.answerSeries.amplitudesProperty.value;
    const newAmplitudes = this.amplitudesGenerator.createAmplitudes( previousAmplitudes );
    this.answerSeries.setAmplitudes( newAmplitudes );
    phet.log && phet.log( `newWaveform: level=${this.levelNumber} answer=[${newAmplitudes}]` );

    // Things that need to be reset when we start a new challenge.
    this.isSolvedProperty.reset();
    this.emphasizedHarmonics.reset();

    // Adjust the value and range of numberOfAmplitudeControlsProperty to match the answer.
    // If the current value is greater than the default value for the level, keep the current value.
    // See https://github.com/phetsims/fourier-making-waves/issues/63#issuecomment-845466971
    const min = this.answerSeries.getNumberOfNonZeroHarmonics();
    const max = this.numberOfAmplitudeControlsProperty.rangeProperty.value.max;
    const value = Math.max( this.numberOfAmplitudeControlsProperty.value, this.defaultNumberOfAmplitudeControls );
    this.numberOfAmplitudeControlsProperty.setValueAndRange( value, new Range( min, max ) );

    // Notify listeners that the new waveform is fully initialized
    this.newWaveformEmitter.emit();
  }
}

WaveGameLevel.WaveGameLevelIO = new IOType( 'WaveGameLevelIO', {
  valueType: WaveGameLevel,
  supertype: ReferenceIO( IOType.ObjectIO )
} );

fourierMakingWaves.register( 'WaveGameLevel', WaveGameLevel );
export default WaveGameLevel;