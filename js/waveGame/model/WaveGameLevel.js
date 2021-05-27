// Copyright 2021, University of Colorado Boulder

/**
 * WaveGameLevel is the model for a game level.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
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
      defaultNumberOfAmplitudeControls: required( config.defaultNumberOfAmplitudeControls ),

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
    assert && AssertUtils.assertNonNegativeInteger( config.defaultNumberOfAmplitudeControls );
    assert && assert( config.defaultNumberOfAmplitudeControls >= levelNumber && config.defaultNumberOfAmplitudeControls <= FMWConstants.MAX_HARMONICS );
    assert && assert( typeof config.statusBarMessage === 'string' );
    assert && assert( typeof config.infoDialogDescription === 'string' );

    // @public (read-only)
    this.levelNumber = levelNumber;
    this.statusBarMessage = config.statusBarMessage;
    this.infoDialogDescription = config.infoDialogDescription;

    // @private
    this.defaultNumberOfAmplitudeControls = config.defaultNumberOfAmplitudeControls;

    // @public The score is the total number of points that have been awarded for this level.
    this.scoreProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      isValidValue: value => ( value >= 0 ),
      phetioReadOnly: true,
      tandem: config.tandem.createTandem( 'scoreProperty' )
    } );

    // @public Whether the current challenge has been solved. A challenge is considered solved when the user has
    // correctly guessed the answer, or when the user has pressed the 'Show Answer' button.
    this.isSolvedProperty = new BooleanProperty( false );

    // @private Generates amplitudes for answerSeries
    this.amplitudesGenerator = new AmplitudesGenerator( {
      getNumberOfNonZeroHarmonics: config.getNumberOfNonZeroHarmonics
    } );

    // @private answer for the challenge, the waveform that the user is attempting to match
    this.answerSeries = new FourierSeries( {
      amplitudes: this.amplitudesGenerator.createAmplitudes(),
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
      range: new Range( config.defaultNumberOfAmplitudeControls, this.guessSeries.harmonics.length )
    } );

    // @private The harmonics to be emphasized in the Harmonics chart, as the result of UI interactions.
    // These are harmonics in guessSeries.
    this.emphasizedHarmonics = new EmphasizedHarmonics( {
      tandem: config.tandem.createTandem( 'emphasizedHarmonics' )
    } );

    // @public
    this.amplitudesChart = new WaveGameAmplitudesChart( this.answerSeries, this.guessSeries, this.emphasizedHarmonics,
      this.numberOfAmplitudeControlsProperty );

    // y-axis scale is fixed for the Harmonics chart. There are no zoom controls
    const harmonicsYAxisDescription = DiscreteYAxisDescriptions[ DiscreteYAxisDescriptions.length - 1 ];

    // @public
    this.harmonicsChart = new WaveGameHarmonicsChart( this.guessSeries, this.emphasizedHarmonics,
      DOMAIN, SERIES_TYPE, t, X_AXIS_DESCRIPTION, harmonicsYAxisDescription );

    // @public
    this.sumChart = new WaveGameSumChart( this.answerSeries, this.guessSeries,
      DOMAIN, SERIES_TYPE, t, X_AXIS_DESCRIPTION, DiscreteYAxisDescriptions );
  }

  /**
   * @public
   */
  reset() {
    this.scoreProperty.reset();
    this.isSolvedProperty.reset();
    // Not necessary to reset this.numberOfAmplitudeControlsProperty
    this.emphasizedHarmonics.reset();
    this.newWaveform(); //TODO PhET-iO Is it OK that we're not resetting to the original answer?
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
   * Sets all amplitudes to zero for the guess.
   * This method is called when the eraser button is pressed.
   * @public
   */
  eraseAmplitudes() {
    this.guessSeries.setAllAmplitudes( 0 );
  }
}

fourierMakingWaves.register( 'WaveGameLevel', WaveGameLevel );
export default WaveGameLevel;