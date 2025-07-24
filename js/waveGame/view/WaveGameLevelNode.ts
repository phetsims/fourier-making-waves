// Copyright 2021-2025, University of Colorado Boulder

/**
 * WaveGameLevelNode is the view for a game level.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import EraserButton, { EraserButtonOptions } from '../../../../scenery-phet/js/buttons/EraserButton.js';
import FaceNode from '../../../../scenery-phet/js/FaceNode.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HotkeyData from '../../../../scenery/js/input/HotkeyData.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import KeyboardListener from '../../../../scenery/js/listeners/KeyboardListener.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import nullSoundPlayer from '../../../../tambo/js/nullSoundPlayer.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import GameAudioPlayer from '../../../../vegas/js/GameAudioPlayer.js';
import InfiniteStatusBar from '../../../../vegas/js/InfiniteStatusBar.js';
import RewardDialog from '../../../../vegas/js/RewardDialog.js';
import FMWColors from '../../common/FMWColors.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWQueryParameters from '../../common/FMWQueryParameters.js';
import AmplitudeKeypadDialog from '../../common/view/AmplitudeKeypadDialog.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';
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
const BUTTON_TEXT_MAX_WIDTH = 150; // maxWidth for button text, determined empirically
const CHECK_ANSWER_PRESSES = 1; // number of 'Check Answer' button presses required to enabled the 'Show Answers' button
const TITLE_TOP_SPACING = 10; // space above the title of a chart
const TITLE_BOTTOM_SPACING = 10; // space below the title of a chart

export default class WaveGameLevelNode extends Node {

  public readonly level: WaveGameLevel;
  private readonly layoutBounds: Bounds2;
  private readonly gameAudioPlayer: GameAudioPlayer;
  private readonly harmonicsChartRectangleLocalBounds: Bounds2;
  private readonly pointsAwardedNode: PointsAwardedNode;
  private readonly frownyFaceNode: FaceNode;
  private frownyFaceAnimation: Animation | null;
  private pointsAwardedAnimation: Animation | null;

  public constructor( level: WaveGameLevel, levelProperty: Property<WaveGameLevel | null>, layoutBounds: Bounds2,
                      visibleBoundsProperty: TReadOnlyProperty<Bounds2>, gameAudioPlayer: GameAudioPlayer,
                      rewardNode: WaveGameRewardNode, rewardDialog: RewardDialog, rewardScore: number,
                      tandem: Tandem ) {

    //------------------------------------------------------------------------------------------------------------------
    // Status Bar
    //------------------------------------------------------------------------------------------------------------------

    const statusBarTandem = tandem.createTandem( 'statusBar' );

    // Level description, displayed in the status bar
    const levelDescriptionText = new RichText( level.statusBarMessageStringProperty, {
      font: DEFAULT_FONT,
      maxWidth: 650 // determined empirically
    } );

    // Bar across the top of the screen
    const statusBar = new InfiniteStatusBar( layoutBounds, visibleBoundsProperty, levelDescriptionText, level.scoreProperty, {
      floatToTop: false,
      spacing: 20,
      barFill: FMWColors.levelSelectionButtonFillProperty, // same as level-selection buttons!
      backButtonListener: () => {
        this.interruptSubtreeInput();
        levelProperty.value = null; // back to the level-selection UI
      },
      tandem: statusBarTandem
    } );

    //------------------------------------------------------------------------------------------------------------------
    // Amplitudes chart
    //------------------------------------------------------------------------------------------------------------------

    // Parent tandem for all charts
    const chartsTandem = tandem.createTandem( 'charts' );

    // Parent tandem for all elements related to the Amplitudes chart
    const amplitudesTandem = chartsTandem.createTandem( 'amplitudes' );

    // Keypad Dialog, for changing amplitude value
    const amplitudeKeypadDialog = new AmplitudeKeypadDialog( level.guessSeries.amplitudeRange, {
      decimalPlaces: FMWConstants.WAVE_GAME_AMPLITUDE_DECIMAL_PLACES,
      layoutBounds: layoutBounds,
      tandem: amplitudesTandem.createTandem( 'amplitudeKeypadDialog' )
    } );

    const amplitudesChartNode = new WaveGameAmplitudesChartNode( level.amplitudesChart, amplitudeKeypadDialog,
      amplitudesTandem.createTandem( 'amplitudesChartNode' ) );

    // Enabled when any amplitude is non-zero.
    const eraserButtonEnabledProperty = new DerivedProperty(
      [ level.guessSeries.amplitudesProperty ],
      amplitudes => !!_.find( amplitudes, amplitude => ( amplitude !== 0 ) )
    );

    // Eraser button sets all amplitudes in the guess to zero.
    const eraserButton = new EraserButton( combineOptions<EraserButtonOptions>( {}, FMWConstants.ERASER_BUTTON_OPTIONS, {
      listener: () => {
        this.interruptSubtreeInput();
        level.eraseAmplitudes();
        guessChangedProperty.value = false;
      },
      enabledProperty: eraserButtonEnabledProperty,
      tandem: amplitudesTandem.createTandem( 'eraserButton' )
    } ) );

    // When the ?showAnswers query parameter is present, show the answer to the current challenge.
    // This Node has very low overhead. So it is added to the scene graph in all cases so that it gets tested.
    const answersNode = new AnswersNode( amplitudesChartNode.chartTransform, level.answerSeries );

    // Elements that should be hidden when chartExpandedProperty is set to false.
    // In this screen, amplitudesChart.chartExpandedProperty can only be changed via PhET-iO.
    const amplitudesParentNode = new Node( {
      visibleProperty: level.amplitudesChart.chartExpandedProperty,
      children: [ amplitudesChartNode, eraserButton, answersNode ]
    } );

    //------------------------------------------------------------------------------------------------------------------
    // Harmonics chart
    //------------------------------------------------------------------------------------------------------------------

    // Parent tandem for all elements related to the Harmonics chart
    const harmonicsTandem = chartsTandem.createTandem( 'harmonics' );

    const harmonicsTitleText = new Text( FourierMakingWavesStrings.harmonicsChartStringProperty, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 150
    } );

    const harmonicsChartNode = new WaveGameHarmonicsChartNode( level.harmonicsChart,
      harmonicsTandem.createTandem( 'harmonicsChartNode' ) );

    // All the elements that should be hidden when chartExpandedProperty is set to false.
    // In this screen, harmonicsChart.chartExpandedProperty can only be changed via PhET-iO.
    const harmonicsParentNode = new Node( {
      visibleProperty: level.harmonicsChart.chartExpandedProperty,
      children: [ harmonicsTitleText, harmonicsChartNode ]
    } );

    //------------------------------------------------------------------------------------------------------------------
    // Sum chart
    //------------------------------------------------------------------------------------------------------------------

    // Parent tandem for all components related to the Sum chart
    const sumTandem = chartsTandem.createTandem( 'sum' );

    const sumTitleNode = new Text( FourierMakingWavesStrings.sumStringProperty, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: FMWConstants.CHART_TITLE_MAX_WIDTH
    } );

    const sumChartNode = new WaveGameSumChartNode( level.sumChart, sumTandem.createTandem( 'sumChartNode' ) );

    // All of the elements that should be hidden when chartExpandedProperty is set to false.
    // In this screen, sumChart.chartExpandedProperty can only be changed via PhET-iO.
    const sumParentNode = new Node( {
      visibleProperty: level.sumChart.chartExpandedProperty,
      children: [ sumTitleNode, sumChartNode ]
    } );

    //------------------------------------------------------------------------------------------------------------------
    // Controls to the right of the charts
    //------------------------------------------------------------------------------------------------------------------

    // Controls the number of amplitude controls (sliders) visible in the Amplitudes chart.
    const amplitudeControlsSpinner = new AmplitudeControlsSpinner( level.numberOfAmplitudeControlsProperty, {
      textOptions: {
        font: DEFAULT_FONT
      },
      tandem: tandem.createTandem( 'amplitudeControlsSpinner' )
    } );

    // Parent tandem for all buttons
    const buttonsTandem = tandem.createTandem( 'buttons' );

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
      content: new Text( FourierMakingWavesStrings.checkAnswerStringProperty, {
        font: DEFAULT_FONT,
        maxWidth: BUTTON_TEXT_MAX_WIDTH
      } ),
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      listener: checkAnswerListener,
      soundPlayer: nullSoundPlayer,
      enabledProperty: checkAnswerButtonEnabledProperty,
      tandem: buttonsTandem.createTandem( 'checkAnswerButton' )
    } );

    // Smiley face is visible when the waveform is matched.
    const faceVisibleProperty = new DerivedProperty(
      [ level.isSolvedProperty, level.isMatchedProperty ],
      ( isSolved, isMatched ) => isSolved && isMatched
    );

    // 'Show Answer' button is enabled after the user has tried 'Check Answer'.
    const showAnswerButtonEnabledProperty = new DerivedProperty(
      [ numberOfCheckAnswerButtonPressesProperty, level.isSolvedProperty, faceVisibleProperty ],
      ( numberOfCheckAnswerButtonPresses, isSolved, faceVisible ) =>
        ( !isSolved && numberOfCheckAnswerButtonPresses >= CHECK_ANSWER_PRESSES ) || ( isSolved && !faceVisible )
    );

    // Show Answer button shows the answer to the challenge. Points will NOT be awarded after pressing this button.
    const showAnswerButton = new RectangularPushButton( {
      content: new Text( FourierMakingWavesStrings.showAnswerStringProperty, {
        font: DEFAULT_FONT,
        maxWidth: BUTTON_TEXT_MAX_WIDTH
      } ),
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      listener: () => {
        this.interruptSubtreeInput();
        level.showAnswer();
      },
      enabledProperty: showAnswerButtonEnabledProperty,
      tandem: buttonsTandem.createTandem( 'showAnswerButton' )
    } );

    // Creates a new challenge, a new waveform to match.
    const newWaveform = () => {
      this.interruptSubtreeInput();
      level.newWaveform();
    };

    // New Waveform button loads a new challenge.
    const newWaveformButton = new RectangularPushButton( {
      listener: newWaveform,
      content: new Text( FourierMakingWavesStrings.newWaveformStringProperty, {
        font: DEFAULT_FONT,
        maxWidth: BUTTON_TEXT_MAX_WIDTH
      } ),
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      tandem: buttonsTandem.createTandem( 'newWaveformButton' )
    } );

    const buttonsBox = new VBox( {
      spacing: 20,
      children: [
        checkAnswerButton,
        showAnswerButton,
        newWaveformButton
      ],
      tandem: buttonsTandem
    } );

    //------------------------------------------------------------------------------------------------------------------
    // Transient UI elements that provide game feedback
    //------------------------------------------------------------------------------------------------------------------

    const feedbackTandem = tandem.createTandem( 'feedback' );

    const smileyFaceNode = new FaceNode( 125 /* headDiameter */, {
      visibleProperty: faceVisibleProperty,
      tandem: feedbackTandem.createTandem( 'smileyFaceNode' ),
      phetioReadOnly: true
    } );

    // Shown when a correct guess is made, then fades out.
    const pointsAwardedNode = new PointsAwardedNode( {
      visible: false,
      tandem: feedbackTandem.createTandem( 'pointsAwardedNode' ),
      phetioReadOnly: true
    } );

    // Shown when an incorrect guess is made, then fades out.
    const frownyFaceNode = new FaceNode( 250 /* headDiameter */, {
      visible: false,
      tandem: feedbackTandem.createTandem( 'frownyFaceNode' ),
      phetioReadOnly: true
    } );
    frownyFaceNode.frown();

    //------------------------------------------------------------------------------------------------------------------
    // Rendering order
    //------------------------------------------------------------------------------------------------------------------

    super( {
      isDisposable: false,
      children: [
        statusBar,
        amplitudesParentNode,
        harmonicsParentNode,
        sumParentNode,
        amplitudeControlsSpinner,
        buttonsBox,
        smileyFaceNode,
        pointsAwardedNode,
        frownyFaceNode
      ],
      tandem: tandem,
      visiblePropertyOptions: { phetioReadOnly: true }
    } );

    //------------------------------------------------------------------------------------------------------------------
    // Layout
    //------------------------------------------------------------------------------------------------------------------

    amplitudesChartNode.x = FMWConstants.X_CHART_RECTANGLES;
    amplitudesChartNode.top = statusBar.bottom + 5;
    const amplitudesChartRectangleLocalBounds = amplitudesChartNode.chartRectangle.boundsTo( this );

    harmonicsTitleText.boundsProperty.link( bounds => {
      harmonicsTitleText.left = layoutBounds.left + FMWConstants.SCREEN_VIEW_X_MARGIN;
      harmonicsTitleText.top = amplitudesChartNode.bottom + TITLE_TOP_SPACING;
    } );

    harmonicsChartNode.x = amplitudesChartNode.x;
    harmonicsChartNode.y = harmonicsTitleText.bottom + TITLE_BOTTOM_SPACING;
    const harmonicsChartRectangleLocalBounds = harmonicsChartNode.chartRectangle.boundsTo( this );

    sumTitleNode.boundsProperty.link( bounds => {
      sumTitleNode.left = harmonicsTitleText.left;
      sumTitleNode.top = harmonicsChartNode.bottom + TITLE_TOP_SPACING;
    } );

    sumChartNode.x = amplitudesChartNode.x;
    sumChartNode.y = sumTitleNode.bottom + TITLE_BOTTOM_SPACING;
    const sumChartRectangleLocalBounds = sumChartNode.chartRectangle.boundsTo( this );

    // Below the Amplitudes chart
    answersNode.x = amplitudesChartNode.x;
    answersNode.top = amplitudesChartNode.bottom;

    // To the right of the amplitude NumberDisplays
    const amplitudesChartRightTop = amplitudesChartNode.localToGlobalPoint( amplitudesChartNode.chartRectangle.rightTop );
    eraserButton.left = amplitudesChartRightTop.x + 10;
    eraserButton.bottom = amplitudesChartRightTop.y - 10;

    // centered on the Harmonics chart
    frownyFaceNode.centerX = harmonicsChartRectangleLocalBounds.centerX;
    frownyFaceNode.centerY = harmonicsChartRectangleLocalBounds.centerY;

    // Center of the space to the right of the charts
    const controlsCenterX = amplitudesChartNode.right + ( layoutBounds.right - amplitudesChartNode.right ) / 2;

    // centered on the Amplitudes chart
    amplitudeControlsSpinner.boundsProperty.link( bounds => {
      amplitudeControlsSpinner.centerX = controlsCenterX;
      amplitudeControlsSpinner.centerY = amplitudesChartRectangleLocalBounds.centerY;
    } );

    // buttons centered on Harmonics chart
    buttonsBox.boundsProperty.link( bounds => {
      buttonsBox.centerX = controlsCenterX;
      buttonsBox.centerY = harmonicsChartRectangleLocalBounds.centerY;
    } );

    // centered on the Sum chart
    smileyFaceNode.centerX = controlsCenterX;
    smileyFaceNode.centerY = sumChartRectangleLocalBounds.centerY;

    //------------------------------------------------------------------------------------------------------------------
    // Misc. listeners related to game flow
    //------------------------------------------------------------------------------------------------------------------

    // When a new waveform (challenge) is presented, reset some things.
    level.newWaveformEmitter.addListener( () => {
      pointsAwardedNode.visible = false;
      frownyFaceNode.visible = false;
      guessChangedProperty.value = false;
      numberOfCheckAnswerButtonPressesProperty.value = 0;
    } );

    // When the user's guess is correct, provide feedback.
    level.correctEmitter.addListener( pointsAwarded => {

      // Interrupt any in-progress interactions, since the challenge has been solved.
      // The user is free to resume experimenting with the current challenge after this point.
      this.interruptSubtreeInput();

      if ( level.scoreProperty.value === rewardScore || FMWQueryParameters.showReward ) {

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
    level.incorrectEmitter.addListener( () => this.incorrectFeedback() );

    // Pressing alt+c will check the answer, if the game is in the appropriate state.
    KeyboardListener.createGlobal( checkAnswerButton, {
      keyStringProperties: WaveGameLevelNode.CHECK_ANSWER_HOTKEY_DATA.keyStringProperties,
      fire: () => checkAnswerListener()
    } );

    //------------------------------------------------------------------------------------------------------------------
    // PDOM
    //------------------------------------------------------------------------------------------------------------------

    // pdom - traversal order
    // See https://github.com/phetsims/fourier-making-waves/issues/53
    this.pdomOrder = [
      statusBar,
      amplitudesChartNode,
      eraserButton,
      amplitudeControlsSpinner,
      checkAnswerButton,
      showAnswerButton,
      newWaveformButton
    ];

    //------------------------------------------------------------------------------------------------------------------
    // Class fields
    //------------------------------------------------------------------------------------------------------------------

    this.level = level;

    this.layoutBounds = layoutBounds; // {Bounds2}
    this.gameAudioPlayer = gameAudioPlayer; // {GameAudioPlayer}
    this.harmonicsChartRectangleLocalBounds = harmonicsChartRectangleLocalBounds; // {Bounds2}
    this.pointsAwardedNode = pointsAwardedNode; // {PointsAwardedNode}
    this.pointsAwardedAnimation = null; // {Animation|null}
    this.frownyFaceNode = frownyFaceNode; // {FaceNode}
    this.frownyFaceAnimation = null; // {Animation|null}
  }

  /**
   * @param dt - elapsed time, in seconds
   */
  public step( dt: number ): void {
    this.pointsAwardedAnimation && this.pointsAwardedAnimation.step( dt );
    this.frownyFaceAnimation && this.frownyFaceAnimation.step( dt );
  }

  /**
   * Provides feedback when the user has made a correct guess.
   */
  private correctFeedback( pointsAwarded: number ): void {
    assert && assert( Number.isInteger( pointsAwarded ) && pointsAwarded > 0 );

    // Audio feedback
    this.gameAudioPlayer.correctAnswer();

    // Show points awarded, centered on charts.
    this.pointsAwardedNode.setPoints( pointsAwarded );
    this.pointsAwardedNode.centerX = this.harmonicsChartRectangleLocalBounds.centerX;
    this.pointsAwardedNode.centerY = this.harmonicsChartRectangleLocalBounds.centerY;

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

    this.pointsAwardedAnimation.finishEmitter.addListener( () => {
      this.pointsAwardedNode.visible = false;
      this.pointsAwardedAnimation = null;
    } );

    this.pointsAwardedAnimation.start();
  }

  /**
   * Provides feedback when the user has made an incorrect guess.
   */
  private incorrectFeedback(): void {

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

    this.frownyFaceAnimation.finishEmitter.addListener( () => {
      this.frownyFaceNode.visible = false;
      this.frownyFaceAnimation = null;
    } );

    this.frownyFaceAnimation.start();
  }

  public static readonly CHECK_ANSWER_HOTKEY_DATA = new HotkeyData( {
    keys: [ 'alt+c' ],
    repoName: fourierMakingWaves.name,
    keyboardHelpDialogLabelStringProperty: FourierMakingWavesStrings.keyboardHelpDialog.checkYourAnswerStringProperty,
    global: true
  } );
}

fourierMakingWaves.register( 'WaveGameLevelNode', WaveGameLevelNode );