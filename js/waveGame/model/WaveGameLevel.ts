// Copyright 2021-2023, University of Colorado Boulder

/**
 * WaveGameLevel is the model for a game level.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
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
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';
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

type SelfOptions = {

  // default number of amplitude controls to show for a challenge
  defaultNumberOfAmplitudeControls: number;

  // the number of non-zero harmonics is each challenge, by default same as level number
  getNumberOfNonZeroHarmonics?: () => number;

  // message shown in the status bar that appears at the top of the Wave Game screen
  statusBarMessageProperty?: TReadOnlyProperty<string>;

  // shown in the info dialog that describes the game levels, default will be set below
  infoDialogDescriptionProperty?: TReadOnlyProperty<string>;
};

type WaveGameLevelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class WaveGameLevel extends PhetioObject {

  public readonly levelNumber: number; // numbered starting from 1
  public readonly statusBarMessageProperty: TReadOnlyProperty<string>;
  public readonly infoDialogDescriptionProperty: TReadOnlyProperty<string>;

  private readonly defaultNumberOfAmplitudeControls: number;

  // The score is the total number of points that have been awarded for this level.
  public readonly scoreProperty: NumberProperty;

  // Whether the current challenge has been solved. A challenge is considered solved when the user has
  // correctly guessed the answer, or when the user has pressed the 'Show Answer' button.
  public readonly isSolvedProperty: Property<boolean>;

  // Generates amplitudes for answerSeries
  private readonly amplitudesGenerator: AmplitudesGenerator;

  // Answer for the challenge, the waveform that the user is attempting to match
  private readonly answerSeries: FourierSeries;

  // The Fourier series that corresponds to the user's guess
  private readonly guessSeries: FourierSeries;

  // Does the guess currently match the answer, within some threshold?
  public readonly isMatchedProperty: TReadOnlyProperty<boolean>;

  // the number of amplitude controls (sliders) to show in the Amplitudes chart
  public readonly numberOfAmplitudeControlsProperty: NumberProperty;

  // The harmonics (in guessSeries) to be emphasized in the Harmonics chart, as the result of UI interactions.
  private readonly emphasizedHarmonics: EmphasizedHarmonics;

  // charts
  public readonly amplitudesChart: WaveGameAmplitudesChart;
  public readonly harmonicsChart: WaveGameHarmonicsChart;
  public readonly sumChart: WaveGameSumChart;

  // Fires when a new waveform has been fully initialized, see method newWaveform.
  public readonly newWaveformEmitter: Emitter;

  // Fires when the guess is checked and found to be correct. The argument is the number of points awarded.
  public readonly correctEmitter: Emitter<[number]>;

  // Fires when the guess is checked and found to be incorrect.
  public readonly incorrectEmitter: Emitter;

  /**
   * @param levelNumber - numbered starting from 1
   * @param providedOptions
   */
  public constructor( levelNumber: number, providedOptions: WaveGameLevelOptions ) {

    assert && AssertUtils.assertPositiveInteger( levelNumber ); // numbered starting from 1

    const options = optionize<WaveGameLevelOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      getNumberOfNonZeroHarmonics: () => levelNumber,

      statusBarMessageProperty: new PatternStringProperty( FourierMakingWavesStrings.matchUsingNHarmonicsStringProperty, {
        levelNumber: levelNumber,
        numberOfHarmonics: levelNumber
      } ),

      infoDialogDescriptionProperty: new PatternStringProperty( FourierMakingWavesStrings.infoNHarmonicsStringProperty, {
        levelNumber: levelNumber,
        numberOfHarmonics: levelNumber
      } ),

      phetioType: WaveGameLevel.WaveGameLevelIO,
      phetioState: false
    }, providedOptions );

    assert && assert( Number.isInteger( options.defaultNumberOfAmplitudeControls ) && options.defaultNumberOfAmplitudeControls >= 0 );
    assert && assert( options.defaultNumberOfAmplitudeControls >= levelNumber && options.defaultNumberOfAmplitudeControls <= FMWConstants.MAX_HARMONICS );

    super( options );

    this.levelNumber = levelNumber;
    this.statusBarMessageProperty = options.statusBarMessageProperty;
    this.infoDialogDescriptionProperty = options.infoDialogDescriptionProperty;

    this.defaultNumberOfAmplitudeControls = options.defaultNumberOfAmplitudeControls;

    this.scoreProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      isValidValue: value => ( value >= 0 ),
      phetioReadOnly: true,
      tandem: options.tandem.createTandem( 'scoreProperty' )
    } );

    this.isSolvedProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isSolvedProperty' ),
      phetioReadOnly: true
    } );

    this.amplitudesGenerator = new AmplitudesGenerator( {
      getNumberOfNonZeroHarmonics: options.getNumberOfNonZeroHarmonics
    } );

    const firstAnswer = ( this.levelNumber === 5 && FMWQueryParameters.answer5 ) ?
                        FMWQueryParameters.answer5 :
                        this.amplitudesGenerator.createAmplitudes();

    this.answerSeries = new FourierSeries( {
      amplitudes: firstAnswer,
      tandem: options.tandem.createTandem( 'answerSeries' )
    } );

    this.guessSeries = new FourierSeries( {
      tandem: options.tandem.createTandem( 'guessSeries' )
    } );

    this.isMatchedProperty = new DerivedProperty(
      [ this.guessSeries.amplitudesProperty, this.answerSeries.amplitudesProperty ],
      ( guessAmplitudes, answerAmplitudes ) => {
        let isMatched = true;
        for ( let i = 0; i < guessAmplitudes.length && isMatched; i++ ) {
          isMatched = Math.abs( guessAmplitudes[ i ] - answerAmplitudes[ i ] ) <= AMPLITUDE_THRESHOLD;
        }
        return isMatched;
      } );

    this.numberOfAmplitudeControlsProperty = new NumberProperty( options.defaultNumberOfAmplitudeControls, {
      numberType: 'Integer',
      range: new Range( this.answerSeries.getNumberOfNonZeroHarmonics(), this.answerSeries.harmonics.length ),
      rangePropertyOptions: {
        phetioDocumentation: 'Determines the range of the Amplitude Controls spinner',
        phetioValueType: Range.RangeIO
      },
      tandem: options.tandem.createTandem( 'numberOfAmplitudeControlsProperty' )
    } );

    this.emphasizedHarmonics = new EmphasizedHarmonics();

    // Parent tandem for all charts
    const chartsTandem = options.tandem.createTandem( 'charts' );

    this.amplitudesChart = new WaveGameAmplitudesChart( this.answerSeries, this.guessSeries, this.emphasizedHarmonics,
      this.numberOfAmplitudeControlsProperty, chartsTandem.createTandem( 'amplitudesChart' ) );

    this.harmonicsChart = new WaveGameHarmonicsChart( this.guessSeries, this.emphasizedHarmonics, DOMAIN, SERIES_TYPE, t,
      DiscreteAxisDescriptions.DEFAULT_X_AXIS_DESCRIPTION, DiscreteAxisDescriptions.DEFAULT_Y_AXIS_DESCRIPTION,
      chartsTandem.createTandem( 'harmonicsChart' ) );

    this.sumChart = new WaveGameSumChart( this.answerSeries, this.guessSeries, DOMAIN, SERIES_TYPE, t,
      DiscreteAxisDescriptions.DEFAULT_X_AXIS_DESCRIPTION, chartsTandem.createTandem( 'sumChart' ) );

    this.newWaveformEmitter = new Emitter();

    this.correctEmitter = new Emitter( {
      tandem: options.tandem.createTandem( 'correctEmitter' ),
      parameters: [
        { name: 'pointsAwarded', phetioType: NumberIO }
      ]
    } );

    this.incorrectEmitter = new Emitter( {
      tandem: options.tandem.createTandem( 'incorrectEmitter' )
    } );
  }

  public reset(): void {
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
   */
  public eraseAmplitudes(): void {
    this.guessSeries.setAllAmplitudes( 0 );
  }

  /**
   * Checks the user's guess, awards points if appropriate, and notifies listeners of the result.
   * This method is called when the 'Check Answer' button is pressed.
   */
  public checkAnswer(): void {
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
   */
  public showAnswer(): void {
    this.isSolvedProperty.value = true;
    this.guessSeries.setAmplitudes( this.answerSeries.amplitudesProperty.value );
  }

  /**
   * Creates a new challenge, by settings all guess amplitudes to zero, and creating a new set of answer amplitudes.
   * This method is called when the 'New Waveform' button is pressed.
   */
  public newWaveform(): void {

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

  /**
   * WaveGameLevelIO handles PhET-iO serialization of WaveGameLevel. Since all WaveGameLevels are instantiated at
   * startup, it implements 'Reference type serialization', as described in the Serialization section of
   * https://github.com/phetsims/phet-io/blob/master/doc/phet-io-instrumentation-technical-guide.md#serialization
   */
  public static readonly WaveGameLevelIO = new IOType( 'WaveGameLevelIO', {
    valueType: WaveGameLevel,
    supertype: ReferenceIO( IOType.ObjectIO )
  } );
}

fourierMakingWaves.register( 'WaveGameLevel', WaveGameLevel );