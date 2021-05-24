// Copyright 2021, University of Colorado Boulder

/**
 * WaveGameLevelNode is the view for a game level.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import EraserButton from '../../../../scenery-phet/js/buttons/EraserButton.js';
import FaceNode from '../../../../scenery-phet/js/FaceNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
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
import WaveGameAmplitudesChartNode from './WaveGameAmplitudesChartNode.js';
import WaveGameHarmonicsChartNode from './WaveGameHarmonicsChartNode.js';
import WaveGameRewardNode from './WaveGameRewardNode.js';
import WaveGameSumChartNode from './WaveGameSumChartNode.js';

// constants
const DEFAULT_FONT = new PhetFont( 16 );
const CHART_RECTANGLE_SIZE = DiscreteScreenView.CHART_RECTANGLE_SIZE;
const X_CHART_RECTANGLES = DiscreteScreenView.X_CHART_RECTANGLES;
const BUTTON_TEXT_MAX_WIDTH = 150; // maxWidth for button text, determined empirically

// Show Answer button is enabled when the user has interacted with the Amplitudes chart this many times.
const MIN_NUMBER_OF_AMPLITUDE_PRESSES = 3;

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
      tandem: Tandem.REQUIRED
    }, options );

    // Level description, displayed in the status bar
    const levelDescriptionText = new RichText( level.statusBarMessage, {
      font: DEFAULT_FONT,
      maxWidth: 650, // determined empirically
      tandem: options.tandem.createTandem( 'levelDescriptionText' )
    } );

    const backButtonListener = () => {
      this.interruptSubtreeInput();
      levelProperty.value = null; // back to the level-selection UI
      //TODO clean up faceAnimation, rewardDialog, rewardNode?
      //TODO can we return to the challenge that we were working on, or should we call level.nextChallenge?
    };

    // Bar across the top of the screen
    const statusBar = new InfiniteStatusBar( layoutBounds, visibleBoundsProperty, levelDescriptionText, level.scoreProperty, {
      floatToTop: false,
      spacing: 20,
      barFill: FMWColorProfile.scoreBoardFillProperty,
      backButtonListener: backButtonListener,
      tandem: options.tandem.createTandem( 'statusBar' )
    } );

    // Parent tandem for all components related to the Amplitudes chart
    const amplitudesTandem = options.tandem.createTandem( 'amplitudes' );

    // Keypad Dialog, for changing amplitude value
    const amplitudeKeypadDialog = new AmplitudeKeypadDialog( level.amplitudeRange, layoutBounds, {
      tandem: amplitudesTandem.createTandem( 'amplitudeKeypadDialog' )
    } );

    const amplitudesChartNode = new WaveGameAmplitudesChartNode(
      level.amplitudesChart, amplitudeKeypadDialog, {
        viewWidth: CHART_RECTANGLE_SIZE.width,
        viewHeight: CHART_RECTANGLE_SIZE.height,
        tandem: amplitudesTandem.createTandem( 'amplitudesChartNode' )
      } );

    // Parent tandem for all components related to the Harmonics chart
    const harmonicsTandem = options.tandem.createTandem( 'harmonics' );

    const harmonicsTitleNode = new Text( fourierMakingWavesStrings.harmonicsChart, {
      font: FMWConstants.TITLE_FONT,
      tandem: harmonicsTandem.createTandem( 'harmonicsTitleNode' )
    } );

    const harmonicsChartNode = new WaveGameHarmonicsChartNode( level.harmonicsChart, {
      viewWidth: CHART_RECTANGLE_SIZE.width,
      viewHeight: CHART_RECTANGLE_SIZE.height,
      tandem: harmonicsTandem.createTandem( 'harmonicsChartNode' )
    } );

    const sumChartNode = new WaveGameSumChartNode( level.sumChart, {
      viewWidth: CHART_RECTANGLE_SIZE.width,
      viewHeight: CHART_RECTANGLE_SIZE.height,
      tandem: harmonicsTandem.createTandem( 'sumChartNode' )
    } );

    // Parent tandem for all components related to the Sum chart
    const sumTandem = options.tandem.createTandem( 'sum' );

    const sumTitleNode = new Text( fourierMakingWavesStrings.sum, {
      font: FMWConstants.TITLE_FONT,
      tandem: sumTandem.createTandem( 'harmonicsTitleNode' )
    } );

    const eraserButton = new EraserButton( {
      scale: 0.85,
      listener: () => level.challengeProperty.value.guessFourierSeries.setAllAmplitudes( 0 )
    } );

    const amplitudeControlsSpinner = new AmplitudeControlsSpinner( level.numberOfAmplitudeControlsProperty, {
      textOptions: {
        font: DEFAULT_FONT
      },
      tandem: options.tandem.createTandem( 'amplitudeControlsSpinner' )
    } );

    const showAnswerButton = new RectangularPushButton( {
      content: new Text( fourierMakingWavesStrings.showAnswer, {
        font: DEFAULT_FONT,
        maxWidth: BUTTON_TEXT_MAX_WIDTH
      } ),
      baseColor: FMWColorProfile.showAnswerButtonFillProperty,
      listener: () => level.challengeProperty.value.showAnswer()
    } );

    // New Game button loads a new challenge.
    const newWaveformButton = new RectangularPushButton( {
      listener: () => {
        this.interruptSubtreeInput();
        faceNode.visible = false;
        level.newChallenge();
      },
      content: new Text( fourierMakingWavesStrings.newWaveform, {
        font: DEFAULT_FONT,
        maxWidth: BUTTON_TEXT_MAX_WIDTH
      } ),
      baseColor: FMWColorProfile.newWaveformButtonFillProperty,
      tandem: options.tandem.createTandem( 'newWaveformButton' ),
      phetioReadOnly: true
    } );

    // Smiley face, shown when a challenge has been successfully completed. Fades out to reveal the Next button.
    const faceNode = new FaceNode( 200 /* headDiameter */, {
      visible: false,
      tandem: options.tandem.createTandem( 'faceNode' ),
      phetioReadOnly: true
    } );

    // @private {WaveGameRewardNode|null} reward shown while rewardDialog is open
    const rewardNode = new WaveGameRewardNode( level.levelNumber, {
      visible: false
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

      // To the right of the amplitude NumberDisplays
      const amplitudesChartRightTop = amplitudesChartNode.localToGlobalPoint( amplitudesChartNode.chartRectangle.rightTop );
      eraserButton.left = amplitudesChartRightTop.x + 10;
      eraserButton.bottom = amplitudesChartRightTop.y - 10;

      // center of the space to the right of the charts
      const controlsCenterX = amplitudesChartNode.right + ( layoutBounds.right - amplitudesChartNode.right ) / 2;

      // centered on the Amplitudes chart
      amplitudeControlsSpinner.centerX = controlsCenterX;
      amplitudeControlsSpinner.centerY = amplitudesChartNode.localToGlobalPoint( amplitudesChartNode.chartRectangle.center ).y;

      // centered on Harmonics chart
      const harmonicsChartCenterY = harmonicsChartNode.localToGlobalPoint( harmonicsChartNode.chartRectangle.center ).y;
      showAnswerButton.centerX = controlsCenterX;
      showAnswerButton.bottom = harmonicsChartCenterY - 10;
      newWaveformButton.centerX = controlsCenterX;
      newWaveformButton.top = harmonicsChartCenterY + 10;

      // centered on the Sum chart
      faceNode.centerX = controlsCenterX;
      faceNode.centerY = sumChartNode.localToGlobalPoint( sumChartNode.chartRectangle.center ).y;
    }

    assert && assert( !options.children, 'WaveGameLevelNode sets children' );
    options.children = [
      statusBar,
      amplitudesChartNode,
      harmonicsTitleNode,
      harmonicsChartNode,
      sumTitleNode,
      sumChartNode,
      eraserButton,
      amplitudeControlsSpinner,
      showAnswerButton,
      newWaveformButton,
      faceNode,
      rewardNode
    ];

    // When the ?showAnswers query parameter is present, show the answer to the current challenge.
    if ( phet.chipper.queryParameters.showAnswers ) {
      const answersNode = new AnswersNode( amplitudesChartNode.chartTransform, level.challengeProperty, {
        x: amplitudesChartNode.x,
        top: amplitudesChartNode.bottom
      } );
      options.children.push( answersNode );
    }

    super( options );

    // This Node is visible when its level is selected.
    levelProperty.link( levelValue => {
      this.visible = ( levelValue === level );
    } );

    //TODO showAnswerButton should also be enabled once the challenge has been solved
    level.amplitudesChart.numberOfPressesProperty.link( numberOfPresses => {
      showAnswerButton.enabled = ( numberOfPresses >= MIN_NUMBER_OF_AMPLITUDE_PRESSES );
    } );

    // {RewardDialog} dialog that is displayed when score reaches the reward value
    const rewardDialog = new RewardDialog( FMWConstants.REWARD_SCORE, {

      // 'Keep Going' hides the dialog
      keepGoingButtonListener: () => rewardDialog.hide(),

      // 'New Level' has the same effect as the back button in the status bar
      newLevelButtonListener: () => {
        rewardDialog.hide();
        backButtonListener();
        // Does backButtonListener call level.nextChallenge, or should we call it here?
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

    // @private {Animation|null} animation of faceNode
    this.faceAnimation = null;

    // A change of score means that the challenge was solved by the user. This listener provides user feedback.
    // unlink is not needed.
    level.scoreProperty.lazyLink( ( score, oldScore ) => {

      // do nothing when the score is reset
      if ( score < oldScore ) {
        return;
      }

      // Interrupt any in-progress interactions, since the challenge has been solved.
      // The user is free to resume experimenting with the current challenge after this point.
      this.interruptSubtreeInput();

      if ( score === FMWConstants.REWARD_SCORE || FMWQueryParameters.showReward ) {

        // The score has reached the magic number where a reward is display.
        gameAudioPlayer.gameOverPerfectScore();
        rewardDialog.show();
      }
      else {

        // The score doesn't warrant a reward, so just show a smiley face, etc.

        // ding!
        gameAudioPlayer.correctAnswer();

        // Show smiley face, fade it out, then show the Next button.
        faceNode.opacityProperty.value = 1;
        faceNode.visible = true;

        this.faceAnimation = new Animation( {
          stepEmitter: null, // via step function
          delay: 1,
          duration: 0.8,
          targets: [ {
            property: faceNode.opacityProperty,
            easing: Easing.LINEAR,
            to: 0
          } ]
        } );

        // removeListener not needed
        this.faceAnimation.finishEmitter.addListener( () => {
          faceNode.visible = false;
          newWaveformButton.visible = true;
          this.faceAnimation = null;
        } );

        this.faceAnimation.start();
      }
    } );

    // @private
    this.rewardNode = rewardNode;
  }

  /**
   * @param {number} dt - elapsed time, in seconds
   * @public
   */
  step( dt ) {
    this.faceAnimation && this.faceAnimation.step( dt );
    this.rewardNode.visible && this.rewardNode.step( dt );
  }
}

fourierMakingWaves.register( 'WaveGameLevelNode', WaveGameLevelNode );
export default WaveGameLevelNode;