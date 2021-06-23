// Copyright 2021, University of Colorado Boulder

/**
 * WaveGameLevelNode is the view for a game level.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import EraserButton from '../../../../scenery-phet/js/buttons/EraserButton.js';
import FaceNode from '../../../../scenery-phet/js/FaceNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import globalKeyStateTracker from '../../../../scenery/js/accessibility/globalKeyStateTracker.js';
import KeyboardUtils from '../../../../scenery/js/accessibility/KeyboardUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import GameAudioPlayer from '../../../../vegas/js/GameAudioPlayer.js';
import InfiniteStatusBar from '../../../../vegas/js/InfiniteStatusBar.js';
import RewardDialog from '../../../../vegas/js/RewardDialog.js';
import FMWColorProfile from '../../common/FMWColorProfile.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWQueryParameters from '../../common/FMWQueryParameters.js';
import AmplitudeKeypadDialog from '../../common/view/AmplitudeKeypadDialog.js';
import DiscreteScreenView from '../../discrete/view/DiscreteScreenView.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import WaveGameLevel from '../model/WaveGameLevel.js';
import AmplitudeControlsSpinner from './AmplitudeControlsSpinner.js';
import AnswersNode from './AnswersNode.js';
import PointsAwardedNode from './PointsAwardedNode.js';
import WaveGameAmplitudesChartNode from './WaveGameAmplitudesChartNode.js';
import WaveGameHarmonicsChartNode from './WaveGameHarmonicsChartNode.js';
import WaveGameRewardNode from './WaveGameRewardNode.js';
import WaveGameSumChartNode from './WaveGameSumChartNode.js';

// constants
const DEFAULT_FONT = new PhetFont( 16 );
const CHART_RECTANGLE_SIZE = DiscreteScreenView.CHART_RECTANGLE_SIZE;
const X_CHART_RECTANGLES = DiscreteScreenView.X_CHART_RECTANGLES;
const BUTTON_TEXT_MAX_WIDTH = 150; // maxWidth for button text, determined empirically
const CHECK_ANSWER_PRESSES = 2; // number of 'Check Answer' button presses required to enabled the 'Show Answers' button

class WaveGameLevelNode extends Node {

  /**
   * @param {WaveGameLevel} level
   * @param {Property.<WaveGameLevel>} levelProperty
   * @param {Bounds2} layoutBounds
   * @param {Property.<Bounds2>} visibleBoundsProperty
   * @param {GameAudioPlayer} gameAudioPlayer
   * @param {Object} [options]
   */
  constructor( level, levelProperty, layoutBounds, visibleBoundsProperty, gameAudioPlayer, options ) {

    assert && assert( level instanceof WaveGameLevel );
    assert && assert( levelProperty instanceof Property );
    assert && assert( layoutBounds instanceof Bounds2 );
    assert && AssertUtils.assertPropertyOf( visibleBoundsProperty, Bounds2 );
    assert && assert( gameAudioPlayer instanceof GameAudioPlayer );

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // Level description, displayed in the status bar
    const levelDescriptionText = new RichText( level.statusBarMessage, {
      font: DEFAULT_FONT,
      maxWidth: 650, // determined empirically
      tandem: options.tandem.createTandem( 'levelDescriptionText' )
    } );

    // Bar across the top of the screen
    const statusBar = new InfiniteStatusBar( layoutBounds, visibleBoundsProperty, levelDescriptionText, level.scoreProperty, {
      floatToTop: false,
      spacing: 20,
      barFill: FMWColorProfile.scoreBoardFillProperty,
      backButtonListener: () => {
        this.interruptSubtreeInput();
        levelProperty.value = null; // back to the level-selection UI
      },
      tandem: options.tandem.createTandem( 'statusBar' )
    } );

    // Parent tandem for all components related to the Amplitudes chart
    const amplitudesTandem = options.tandem.createTandem( 'amplitudes' );

    // Keypad Dialog, for changing amplitude value
    const amplitudeKeypadDialog = new AmplitudeKeypadDialog( level.guessSeries.amplitudeRange, layoutBounds, {
      tandem: amplitudesTandem.createTandem( 'amplitudeKeypadDialog' )
    } );

    const amplitudesChartNode = new WaveGameAmplitudesChartNode( level.amplitudesChart, amplitudeKeypadDialog, {
      transformOptions: {
        viewWidth: CHART_RECTANGLE_SIZE.width,
        viewHeight: CHART_RECTANGLE_SIZE.height
      },
      tandem: amplitudesTandem.createTandem( 'amplitudesChartNode' )
    } );

    // When the ?showAnswers query parameter is present, show the answer to the current challenge.
    // This Node has very low overhead. So it is added to the scenegraph in all cases so that it gets tested.
    const answersNode = new AnswersNode( amplitudesChartNode.chartTransform, level.answerSeries, {
      visible: phet.chipper.queryParameters.showAnswers
    } );

    // Parent tandem for all components related to the Harmonics chart
    const harmonicsTandem = options.tandem.createTandem( 'harmonics' );

    const harmonicsTitleNode = new Text( fourierMakingWavesStrings.harmonicsChart, {
      font: FMWConstants.TITLE_FONT,
      tandem: harmonicsTandem.createTandem( 'harmonicsTitleNode' )
    } );

    const harmonicsChartNode = new WaveGameHarmonicsChartNode( level.harmonicsChart, {
      transformOptions: {
        viewWidth: CHART_RECTANGLE_SIZE.width,
        viewHeight: CHART_RECTANGLE_SIZE.height
      },
      tandem: harmonicsTandem.createTandem( 'harmonicsChartNode' )
    } );

    // Parent tandem for all components related to the Sum chart
    const sumTandem = options.tandem.createTandem( 'sum' );

    const sumTitleNode = new Text( fourierMakingWavesStrings.sum, {
      font: FMWConstants.TITLE_FONT,
      tandem: sumTandem.createTandem( 'harmonicsTitleNode' )
    } );

    const sumChartNode = new WaveGameSumChartNode( level.sumChart, {
      transformOptions: {
        viewWidth: CHART_RECTANGLE_SIZE.width,
        viewHeight: CHART_RECTANGLE_SIZE.height
      },
      tandem: sumTandem.createTandem( 'sumChartNode' )
    } );

    // Smiley face is visible when the waveform is matched.
    const faceVisibleProperty = new DerivedProperty(
      [ level.isSolvedProperty, level.isMatchedProperty ],
      ( isSolved, isMatched ) => isSolved && isMatched
    );
    const smileyFaceNode = new FaceNode( 125 /* headDiameter */, {
      visibleProperty: faceVisibleProperty,
      tandem: options.tandem.createTandem( 'smileyFaceNode' ),
      phetioReadOnly: true
    } );

    // Shown when a correct guess is made, then fades out.
    const pointsAwardedNode = new PointsAwardedNode( {
      visible: false,
      tandem: options.tandem.createTandem( 'pointsAwardedNode' ),
      phetioReadOnly: true
    } );

    // Shown when an incorrect guess is made, then fades out.
    const frownyFaceNode = new FaceNode( 250 /* headDiameter */, {
      visible: false,
      tandem: options.tandem.createTandem( 'frownyFaceNode' ),
      phetioReadOnly: true
    } );
    frownyFaceNode.frown();

    // Enabled when any amplitude is non-zero.
    const eraserButtonEnabledProperty = new DerivedProperty(
      [ level.guessSeries.amplitudesProperty ],
      amplitudes => !!_.find( amplitudes, amplitude => ( amplitude !== 0 ) )
    );

    // Eraser button sets all of the amplitudes in the guess to zero.
    const eraserButton = new EraserButton( {
      scale: 0.85,
      listener: () => {
        this.interruptSubtreeInput();
        level.eraseAmplitudes();
      },
      enabledProperty: eraserButtonEnabledProperty
    } );

    // Controls the number of amplitude controls (sliders) visible in the Amplitudes chart.
    const amplitudeControlsSpinner = new AmplitudeControlsSpinner( level.numberOfAmplitudeControlsProperty, {
      textOptions: {
        font: DEFAULT_FONT
      },
      tandem: options.tandem.createTandem( 'amplitudeControlsSpinner' )
    } );

    // Whether the user has changed the guess since the last time that 'Check Answer' button was pressed.
    const guessChangedProperty = new BooleanProperty( false );
    level.guessSeries.amplitudesProperty.lazyLink( () => {
      guessChangedProperty.value = true;
    } );

    // The number of times that the 'Check Answer' button has been pressed for the current challenge.
    const numberOfCheckAnswerButtonPressesProperty = new NumberProperty( 0, {
      numberType: 'Integer'
    } );

    // 'Check Answer' button is enabled when the challenge has not been solved, and the user has
    // changed something about their guess that is checkable.
    const checkAnswerButtonEnabledProperty = new DerivedProperty(
      [ level.isSolvedProperty, guessChangedProperty ],
      ( isSolved, guessChanged ) => ( !isSolved && guessChanged )
    );

    const checkAnswerListener = () => {
      this.interruptSubtreeInput();
      numberOfCheckAnswerButtonPressesProperty.value++;
      guessChangedProperty.value = false;
      level.checkAnswer();
    };

    const checkAnswerButton = new RectangularPushButton( {
      content: new Text( fourierMakingWavesStrings.checkAnswer, {
        font: DEFAULT_FONT,
        maxWidth: BUTTON_TEXT_MAX_WIDTH
      } ),
      baseColor: FMWColorProfile.checkAnswerButtonFillProperty,
      listener: checkAnswerListener,
      enabledProperty: checkAnswerButtonEnabledProperty
    } );

    // Hotkey support for 'Check Answer'
    globalKeyStateTracker.keyupEmitter.addListener( event => {
      if ( checkAnswerButton.pdomDisplayed && checkAnswerButton.enabledProperty.value ) {
        phet.log && phet.log( `key=${event.key}` );
        if ( KeyboardUtils.isKeyEvent( event, KeyboardUtils.KEY_C ) && globalKeyStateTracker.altKeyDown ) {
          checkAnswerListener();
        }
      }
    } );

    // 'Show Answer' button is enabled after the user has tried 'Check Answer'.
    const showAnswerButtonEnabledProperty = new DerivedProperty(
      [ numberOfCheckAnswerButtonPressesProperty, level.isSolvedProperty, faceVisibleProperty ],
      ( numberOfCheckAnswerButtonPresses, isSolved, faceVisible ) =>
        ( !isSolved && numberOfCheckAnswerButtonPresses >= CHECK_ANSWER_PRESSES ) || ( isSolved && !faceVisible )
    );

    // Show Answer button shows the answer to the challenge. Points will NOT be awarded after pressing this button.
    const showAnswerButton = new RectangularPushButton( {
      content: new Text( fourierMakingWavesStrings.showAnswer, {
        font: DEFAULT_FONT,
        maxWidth: BUTTON_TEXT_MAX_WIDTH
      } ),
      baseColor: FMWColorProfile.showAnswerButtonFillProperty,
      listener: () => {
        this.interruptSubtreeInput();
        level.showAnswer();
      },
      enabledProperty: showAnswerButtonEnabledProperty
    } );

    // Creates a new challenge, a new waveform to match.
    const newWaveform = () => {
      this.interruptSubtreeInput();
      level.newWaveform();
    };

    // New Waveform button loads a new challenge.
    const newWaveformButton = new RectangularPushButton( {
      listener: newWaveform,
      content: new Text( fourierMakingWavesStrings.newWaveform, {
        font: DEFAULT_FONT,
        maxWidth: BUTTON_TEXT_MAX_WIDTH
      } ),
      baseColor: FMWColorProfile.newWaveformButtonFillProperty,
      tandem: options.tandem.createTandem( 'newWaveformButton' ),
      phetioReadOnly: true
    } );

    const buttonsBox = new VBox( {
      spacing: 20,
      children: [
        checkAnswerButton,
        showAnswerButton,
        newWaveformButton
      ]
    } );

    // The reward shown while rewardDialog is open.
    const rewardNode = new WaveGameRewardNode( level.levelNumber, {
      visible: false
    } );

    // {RewardDialog} dialog that is displayed when the score reaches the reward value.
    const rewardDialog = new RewardDialog( FMWConstants.REWARD_SCORE, {

      // 'Keep Going' hides the dialog
      keepGoingButtonListener: () => rewardDialog.hide(),

      // 'New Level' takes us back to the level-selection interface, and pre-loads a new challenge for this level.
      newLevelButtonListener: () => {
        rewardDialog.hide();
        levelProperty.value = null; // back to the level-selection UI
        newWaveform();
      },

      // When the dialog is shown, show the reward.
      showCallback: () => {
        rewardNode.visible = true;
      },

      // When the dialog is hidden, hide the reward.
      hideCallback: () => {
        rewardNode.visible = false;
      }
    } );

    // Layout
    {
      amplitudesChartNode.x = X_CHART_RECTANGLES;
      amplitudesChartNode.top = statusBar.bottom + 5;
      harmonicsTitleNode.left = layoutBounds.left + FMWConstants.SCREEN_VIEW_X_MARGIN;
      harmonicsTitleNode.top = amplitudesChartNode.bottom + 10;
      harmonicsChartNode.x = amplitudesChartNode.x;
      harmonicsChartNode.y = harmonicsTitleNode.bottom + 10;
      sumTitleNode.left = harmonicsTitleNode.left;
      sumTitleNode.top = harmonicsChartNode.bottom + 10;
      sumChartNode.x = amplitudesChartNode.x;
      sumChartNode.y = sumTitleNode.bottom + 10;

      // Below the Amplitudes chart
      answersNode.x = amplitudesChartNode.x;
      answersNode.top = amplitudesChartNode.bottom;

      // To the right of the amplitude NumberDisplays
      const amplitudesChartRightTop = amplitudesChartNode.localToGlobalPoint( amplitudesChartNode.chartRectangle.rightTop );
      eraserButton.left = amplitudesChartRightTop.x + 10;
      eraserButton.bottom = amplitudesChartRightTop.y - 10;

      // centered on the Harmonics chart
      frownyFaceNode.centerX = amplitudesChartNode.localToGlobalPoint( amplitudesChartNode.chartRectangle.center ).x;
      frownyFaceNode.centerY = layoutBounds.centerY;

      // center of the space to the right of the charts
      const controlsCenterX = amplitudesChartNode.right + ( layoutBounds.right - amplitudesChartNode.right ) / 2;

      // centered on the Amplitudes chart
      amplitudeControlsSpinner.centerX = controlsCenterX;
      amplitudeControlsSpinner.centerY = amplitudesChartNode.localToGlobalPoint( amplitudesChartNode.chartRectangle.center ).y;

      // buttons centered on Harmonics chart
      const harmonicsChartCenterY = harmonicsChartNode.localToGlobalPoint( harmonicsChartNode.chartRectangle.center ).y;
      buttonsBox.centerX = controlsCenterX;
      buttonsBox.centerY = harmonicsChartCenterY;

      // centered on the Sum chart
      smileyFaceNode.centerX = controlsCenterX;
      smileyFaceNode.centerY = sumChartNode.localToGlobalPoint( sumChartNode.chartRectangle.center ).y;
    }

    assert && assert( !options.children, 'WaveGameLevelNode sets children' );
    options.children = [
      statusBar,
      amplitudesChartNode,
      answersNode,
      harmonicsTitleNode,
      harmonicsChartNode,
      sumTitleNode,
      sumChartNode,
      eraserButton,
      amplitudeControlsSpinner,
      buttonsBox,
      smileyFaceNode,
      pointsAwardedNode,
      frownyFaceNode,
      rewardNode
    ];

    super( options );

    // When a new waveform (challenge) is presented, reset some things.
    level.newWaveformEmitter.addListener( () => {
      pointsAwardedNode.visible = false;
      frownyFaceNode.visible = false;
      guessChangedProperty.value = false;
      numberOfCheckAnswerButtonPressesProperty.value = 0;
    } );

    // When the user's guess is correct, provide feedback.
    // removeListener is not needed.
    level.correctEmitter.addListener( pointsAwarded => {

      // Interrupt any in-progress interactions, since the challenge has been solved.
      // The user is free to resume experimenting with the current challenge after this point.
      this.interruptSubtreeInput();

      if ( level.scoreProperty.value === FMWConstants.REWARD_SCORE || FMWQueryParameters.showReward ) {

        // The score has reached the magic number where a reward is display.
        gameAudioPlayer.gameOverPerfectScore();
        rewardDialog.show();
      }
      else {

        // The score doesn't warrant a reward, so just show the points that were rewarded.
        this.correctFeedback( pointsAwarded );
      }
    } );

    // When the user's guess is incorrect, provide feedback.
    // removeListener is not needed.
    level.incorrectEmitter.addListener( () => this.incorrectFeedback() );

    // @public
    this.level = level;

    // @private
    this.layoutBounds = layoutBounds;
    this.gameAudioPlayer = gameAudioPlayer;
    this.amplitudesChartNode = amplitudesChartNode;
    this.rewardNode = rewardNode;
    this.pointsAwardedNode = pointsAwardedNode;
    this.pointsAwardedAnimation = null; // {Animation|null}
    this.frownyFaceNode = frownyFaceNode;
    this.frownyFaceAnimation = null; // {Animation|null}

    // pdom - traversal order
    // See https://github.com/phetsims/fourier-making-waves/issues/53
    this.pDomOrder = [
      statusBar,
      amplitudesChartNode,
      eraserButton,
      amplitudeControlsSpinner,
      checkAnswerButton,
      showAnswerButton,
      newWaveformButton
    ];
  }

  /**
   * @param {number} dt - elapsed time, in seconds
   * @public
   */
  step( dt ) {
    this.rewardNode.visible && this.rewardNode.step( dt );
    this.pointsAwardedAnimation && this.pointsAwardedAnimation.step( dt );
    this.frownyFaceAnimation && this.frownyFaceAnimation.step( dt );
  }

  /**
   * Provides feedback when the user has made a correct guess.
   * @param {number} pointsAwarded
   * @private
   */
  correctFeedback( pointsAwarded ) {
    assert && AssertUtils.assertPositiveNumber( pointsAwarded );

    // Audio feedback
    this.gameAudioPlayer.correctAnswer();

    // Show points awarded, centered on charts.
    this.pointsAwardedNode.setPoints( pointsAwarded );
    this.pointsAwardedNode.centerX = this.amplitudesChartNode.localToGlobalPoint( this.amplitudesChartNode.chartRectangle.center ).x;
    this.pointsAwardedNode.centerY = this.layoutBounds.centerY;

    // Animate opacity of pointsAwardedNode, fade it out.
    this.pointsAwardedNode.visible = true;
    this.pointsAwardedNode.opacityProperty.value = 1;
    this.pointsAwardedAnimation = new Animation( {
      stepEmitter: null, // via step function
      delay: 1,
      duration: 0.8,
      targets: [ {
        property: this.pointsAwardedNode.opacityProperty,
        easing: Easing.LINEAR,
        to: 0
      } ]
    } );

    // removeListener not needed
    this.pointsAwardedAnimation.finishEmitter.addListener( () => {
      this.pointsAwardedNode.visible = false;
      this.pointsAwardedAnimation = null;
    } );

    this.pointsAwardedAnimation.start();
  }

  /**
   * Provides feedback when the user has made an incorrect guess.
   * @private
   */
  incorrectFeedback() {

    // Audio feedback
    this.gameAudioPlayer.wrongAnswer();

    // Animate opacity of frownyFaceNode, fade it out.
    this.frownyFaceNode.visible = true;
    this.frownyFaceNode.opacityProperty.value = 1;
    this.frownyFaceAnimation = new Animation( {
      stepEmitter: null, // via step function
      delay: 1,
      duration: 0.8,
      targets: [ {
        property: this.frownyFaceNode.opacityProperty,
        easing: Easing.LINEAR,
        to: 0
      } ]
    } );

    // removeListener not needed
    this.frownyFaceAnimation.finishEmitter.addListener( () => {
      this.frownyFaceNode.visible = false;
      this.frownyFaceAnimation = null;
    } );

    this.frownyFaceAnimation.start();
  }
}

fourierMakingWaves.register( 'WaveGameLevelNode', WaveGameLevelNode );
export default WaveGameLevelNode;