// Copyright 2018-2020, University of Colorado Boulder

/**
 * WaveGameLevel is the model for a game level.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
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

    // @public
    this.scoreProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      isValidValue: value => ( value >= 0 ),
      phetioReadOnly: true,
      tandem: config.tandem.createTandem( 'scoreProperty' )
    } );

    // @public (read-only) Has the current challenge been solved?
    this.isSolvedProperty = new BooleanProperty( false );

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

    // @public
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
    this.emphasizedHarmonics.reset();
    this.newWaveform(); //TODO Is it OK that we're not resetting to the original answer?
  }

  /**
   * Evaluates the guess to see if it's close enough to the answer. The guess is only evaluated when the user has
   * stopped dragging amplitude sliders, so it's the responsibility of the view to call this method.
   * @public
   */
  evaluateGuess() {
    assert && assert( !this.isSolvedProperty.value );
    if ( !this.isSolvedProperty.value ) {

      const answerAmplitudes = this.answerSeries.amplitudesProperty.value;
      const guessAmplitudes = this.guessSeries.amplitudesProperty.value;

      let isSolved = true;
      for ( let i = 0; i < guessAmplitudes.length && isSolved; i++ ) {
        isSolved = Math.abs( guessAmplitudes[ i ] - answerAmplitudes[ i ] ) <= AMPLITUDE_THRESHOLD;
      }

      this.isSolvedProperty.value = isSolved;

      // If the challenge was solved, award points.
      if ( isSolved ) {
        this.scoreProperty.value += FMWConstants.POINTS_PER_CHALLENGE;
      }
    }
  }

  /**
   * Creates a new challenge, by settings all guess amplitudes to zero, and creating a new set of answer amplitudes.
   * Called when the 'New Waveform' button is pressed.
   * @public
   */
  newWaveform() {

    // Set the guess amplitudes to zero.
    this.guessSeries.setAllAmplitudes( 0 );

    // Create a new waveform (the answer) to be matched.
    const previousAmplitudes = this.answerSeries.amplitudesProperty.value;
    const newAmplitudes = this.amplitudesGenerator.createAmplitudes( previousAmplitudes );
    this.answerSeries.setAmplitudes( newAmplitudes );
    phet.log && phet.log( `newWaveform: level=${this.levelNumber} answer=[${newAmplitudes}]` );

    // Reset Properties that should be reset at the start of each new challenge.
    this.isSolvedProperty.value = false;
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
   * Called when the 'Show Answer' button is pressed.
   * @public
   */
  showAnswer() {
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