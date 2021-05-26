// Copyright 2021, University of Colorado Boulder

/**
 * WaveGameLevelNode is the view for a game level.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
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

    // Whether the current challenge has been solved.
    const isSolvedProperty = new BooleanProperty( false );

    // Level description, displayed in the status bar
    const levelDescriptionText = new RichText( level.statusBarMessage, {
      font: DEFAULT_FONT,
      maxWidth: 650, // determined empirically
      tandem: options.tandem.createTandem( 'levelDescriptionText' )
    } );

    const backButtonListener = () => {
      this.interruptSubtreeInput();
      levelProperty.value = null; // back to the level-selection UI
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
    const amplitudeKeypadDialog = new AmplitudeKeypadDialog( level.guessSeries.amplitudeRange, layoutBounds, {
      tandem: amplitudesTandem.createTandem( 'amplitudeKeypadDialog' )
    } );

    const amplitudesChartNode = new WaveGameAmplitudesChartNode( level.amplitudesChart, amplitudeKeypadDialog, {
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

    const faceVisibleProperty = new DerivedProperty(
      [ isSolvedProperty, level.isMatchedProperty, amplitudesChartNode.numberOfSlidersDraggingProperty ],
      ( isSolved, isMatched, numberOfSlidersDragging ) =>
        isSolved && isMatched && ( numberOfSlidersDragging === 0 )
    );

    // Smiley face, shown when a challenge has been successfully completed. Fades out to reveal the Next button.
    const faceNode = new FaceNode( 125 /* headDiameter */, {
      visibleProperty: faceVisibleProperty,
      tandem: options.tandem.createTandem( 'faceNode' ),
      phetioReadOnly: true
    } );

    const pointsAwardedNode = new PointsAwardedNode( {
      visible: false
    } );

    const eraserButton = new EraserButton( {
      scale: 0.85,
      listener: () => {
        this.interruptSubtreeInput();
        level.eraseAmplitudes();
      }
    } );

    const amplitudeControlsSpinner = new AmplitudeControlsSpinner( level.numberOfAmplitudeControlsProperty, {
      textOptions: {
        font: DEFAULT_FONT
      },
      tandem: options.tandem.createTandem( 'amplitudeControlsSpinner' )
    } );

    // Enable the Show Answers button when the challenge has been solved, or the user has made an attempt to solve.
    const showAnswersEnabledProperty = new DerivedProperty(
      [ level.isMatchedProperty, isSolvedProperty, amplitudesChartNode.numberOfPressesProperty ],
      ( isMatched, isSolved, numberOfPresses ) =>
        !isMatched && ( isSolved || numberOfPresses >= MIN_NUMBER_OF_AMPLITUDE_PRESSES )
    );

    const showAnswerButton = new RectangularPushButton( {
      content: new Text( fourierMakingWavesStrings.showAnswer, {
        font: DEFAULT_FONT,
        maxWidth: BUTTON_TEXT_MAX_WIDTH
      } ),
      baseColor: FMWColorProfile.showAnswerButtonFillProperty,
      listener: () => {
        this.interruptSubtreeInput();
        isSolvedProperty.value = true;
        level.showAnswer();
      },
      enabledProperty: showAnswersEnabledProperty
    } );

    const newWaveform = () => {
      this.interruptSubtreeInput();
      isSolvedProperty.value = false;
      amplitudesChartNode.numberOfPressesProperty.value = 0;
      pointsAwardedNode.visible = false;
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

      // centered on the screen
      pointsAwardedNode.center = layoutBounds.center;
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
      pointsAwardedNode,
      rewardNode
    ];

    // When the ?showAnswers query parameter is present, show the answer to the current challenge.
    if ( phet.chipper.queryParameters.showAnswers ) {
      const answersNode = new AnswersNode( amplitudesChartNode.chartTransform, level.answerSeries, {
        x: amplitudesChartNode.x,
        top: amplitudesChartNode.bottom
      } );
      options.children.push( answersNode );
    }

    // {RewardDialog} dialog that is displayed when score reaches the reward value
    const rewardDialog = new RewardDialog( FMWConstants.REWARD_SCORE, {

      // 'Keep Going' hides the dialog
      keepGoingButtonListener: () => rewardDialog.hide(),

      // 'New Level' has the same effect as the back button in the status bar, except that it also pre-loads a new
      // challenge for this level.
      newLevelButtonListener: () => {
        rewardDialog.hide();
        backButtonListener();
        this.newWaveform();
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

    super( options );

    // This Node is visible when its level is selected.
    levelProperty.link( levelValue => {
      this.visible = ( levelValue === level );
    } );

    // Evaluate the guess when all sliders have been released.
    // If the challenge has not been previously solved, award points.
    Property.multilink( [ level.isMatchedProperty, amplitudesChartNode.numberOfSlidersDraggingProperty ],
      ( isMatched, numberOfSlidersDragging ) => {
        if ( isMatched && numberOfSlidersDragging === 0 ) {
          if ( !isSolvedProperty.value ) {
            isSolvedProperty.value = true;
            level.scoreProperty.value += FMWConstants.POINTS_PER_CHALLENGE;
          }
        }
      } );

    // @private {Animation|null} animation of pointAwardedNode
    this.pointsAwardedAnimation = null;

    // When points are awarded, provide feedback.
    // unlink is not needed.
    level.scoreProperty.link( ( score, previousScore ) => {

      // Do nothing when the score is reset.
      if ( score === 0 ) { return; }

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

        // ding!
        gameAudioPlayer.correctAnswer();

        // Show points awarded.
        pointsAwardedNode.setPoints( score - previousScore );
        pointsAwardedNode.center = layoutBounds.center;
        pointsAwardedNode.visible = true;

        // Animate opacity of pointsAwardedNode, fade it out.
        pointsAwardedNode.opacityProperty.value = 1;
        this.pointsAwardedAnimation = new Animation( {
          stepEmitter: null, // via step function
          delay: 1,
          duration: 0.8,
          targets: [ {
            property: pointsAwardedNode.opacityProperty,
            easing: Easing.LINEAR,
            to: 0
          } ]
        } );

        // removeListener not needed
        this.pointsAwardedAnimation.finishEmitter.addListener( () => {
          pointsAwardedNode.visible = false;
          this.pointsAwardedAnimation = null;
        } );

        this.pointsAwardedAnimation.start();
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
    this.pointsAwardedAnimation && this.pointsAwardedAnimation.step( dt );
    this.rewardNode.visible && this.rewardNode.step( dt );
  }
}

fourierMakingWaves.register( 'WaveGameLevelNode', WaveGameLevelNode );
export default WaveGameLevelNode;