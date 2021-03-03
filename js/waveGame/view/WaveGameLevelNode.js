// Copyright 2021, University of Colorado Boulder

/**
 * WaveGameLevelNode is the view for a game level.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import RefreshButton from '../../../../scenery-phet/js/buttons/RefreshButton.js';
import FaceNode from '../../../../scenery-phet/js/FaceNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import GameAudioPlayer from '../../../../vegas/js/GameAudioPlayer.js';
import InfiniteStatusBar from '../../../../vegas/js/InfiniteStatusBar.js';
import RewardDialog from '../../../../vegas/js/RewardDialog.js';
import FMWColorProfile from '../../common/FMWColorProfile.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWQueryParameters from '../../common/FMWQueryParameters.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import WaveGameLevel from '../model/WaveGameLevel.js';
import AmplitudeControlsSpinner from './AmplitudeControlsSpinner.js';
import WaveGameRewardNode from './WaveGameRewardNode.js';

// constants
const DEFAULT_FONT = new PhetFont( 16 );

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

    assert && assert( level instanceof WaveGameLevel, 'invalid level' );
    assert && assert( levelProperty instanceof Property, 'invalid levelProperty' );
    assert && assert( layoutBounds instanceof Bounds2, 'invalid layoutBounds' );
    assert && AssertUtils.assertPropertyOf( visibleBoundsProperty, Bounds2 );
    assert && assert( gameAudioPlayer instanceof GameAudioPlayer, 'invalid gameAudioPlayer' );

    options = merge( {
      tandem: Tandem.REQUIRED
    }, options );

    // Level description, displayed in the status bar
    const levelDescriptionText = new RichText( level.description, {
      font: DEFAULT_FONT,
      maxWidth: 650, // determined empirically
      tandem: options.tandem.createTandem( 'levelDescriptionText' )
    } );

    const backButtonListener = () => {
      this.interruptSubtreeInput();
      levelProperty.value = null; // back to the level-selection UI
      //TODO clean up faceAnimation, rewardDialog, rewardNode?
    };

    // Bar across the top of the screen
    const statusBar = new InfiniteStatusBar( layoutBounds, visibleBoundsProperty, levelDescriptionText, level.scoreProperty, {
      floatToTop: false,
      spacing: 20,
      barFill: FMWColorProfile.scoreBoardFillProperty,
      backButtonListener: backButtonListener,
      tandem: options.tandem.createTandem( 'statusBar' )
    } );

    // Pressing the refresh button creates the next random challenge.
    const refreshButton = new RefreshButton( {
      scale: 0.75,
      right: layoutBounds.right - 20,
      top: statusBar.bottom + 20,
      tandem: options.tandem.createTandem( 'refreshButton' )
    } );

    //TODO this needs to be properly initialized and adjusted when level.challengeProperty changes
    const numberOfAmplitudeControlsProperty = new NumberProperty( 1, {
      range: new Range( 1, FMWConstants.MAX_HARMONICS )
    } );

    const amplitudeControlsSpinner = new AmplitudeControlsSpinner( numberOfAmplitudeControlsProperty, {
      textOptions: {
        font: DEFAULT_FONT
      },
      tandem: options.tandem.createTandem( 'amplitudeControlsSpinner' )
    } );

    // Smiley face, shown when a challenge has been successfully completed. Fades out to reveal the Next button.
    const faceNode = new FaceNode( 200 /* headDiameter */, {
      visible: false,
      tandem: options.tandem.createTandem( 'faceNode' ),
      phetioReadOnly: true
    } );

    // Property that controls opacity of smiley face.  This is required because opacityProperty is a TinyProperty,
    // which currently does not qualify as an AnimationTarget. See https://github.com/phetsims/twixt/issues/29.
    const faceOpacityProperty = new NumberProperty( faceNode.opacity, {
      range: new Range( 0, 1 )
    } );
    faceOpacityProperty.link( faceOpacity => {
      faceNode.opacity = faceOpacity;
    } );

    // Next button is shown after a challenge has been successfully completed.
    const nextButton = new RectangularPushButton( {
      content: new Text( fourierMakingWavesStrings.next, {
        font: DEFAULT_FONT,
        maxWidth: 200 // determined empirically
      } ),
      baseColor: FMWColorProfile.nextButtonFillProperty,
      visible: false,
      tandem: options.tandem.createTandem( 'nextButton' ),
      phetioReadOnly: true
    } );

    const controlPanelChildren = [
      refreshButton,
      amplitudeControlsSpinner,
      faceNode,
      nextButton
    ];

    // Solve button immediately solves the challenge.  It's for development and QA, and is added to the
    // scenegraph only when the ?showAnswers query parameter is present.
    const solveButton = new RectangularPushButton( {
      content: new Text( 'Solve', {
        font: DEFAULT_FONT,
        fill: 'white'
      } ),
      baseColor: 'red',
      listener: () => {
        this.interruptSubtreeInput();
        level.solve();
      }
    } );
    if ( phet.chipper.queryParameters.showAnswers ) {
      controlPanelChildren.push( solveButton );
    }

    const controlPanel = new Panel( new VBox( {
      excludeInvisibleChildrenFromBounds: false,
      align: 'center',
      spacing: 20,
      children: controlPanelChildren
    } ), {
      fill: null,
      stroke: null,
      xMargin: 0,
      yMargin: 0,
      cornerRadius: 0,
      right: layoutBounds.right - 20,
      top: statusBar.bottom + 20
    } );

    // Next and Refresh buttons do the same thing.
    const next = () => {
      this.interruptSubtreeInput();
      nextButton.visible = false;
      faceNode.visible = false;
      level.nextChallenge();
      refreshButton.enabled = true;
      solveButton.enabled = true;
    };
    nextButton.addListener( next );
    refreshButton.addListener( next );

    // @private {WaveGameRewardNode|null} reward shown while rewardDialog is open
    const rewardNode = new WaveGameRewardNode( level.levelNumber, {
      visible: false
    } );

    //TODO display the challenge

    assert && assert( !options.children, 'WaveGameLevelNode sets children' );
    options.children = [ statusBar, controlPanel, rewardNode ];

    // When the ?showAnswers query parameter is present, show the answers near the amplitude sliders.
    if ( phet.chipper.queryParameters.showAnswers ) {

      // Shows the answer (amplitudes) for the challenge.
      const answerText = new Text( '', {
        font: DEFAULT_FONT,
        fill: 'red',
        left: layoutBounds.left + 20,
        top: statusBar.bottom + 20
      } );
      options.children.push( answerText );

      // unlink is not needed.
      level.challengeProperty.link( challenge => {
        answerText.text = `[${challenge.getAnswerAmplitudes()}]`;
      } );
    }

    super( options );

    // This Node is visible when its level is selected.
    levelProperty.link( levelValue => {
      this.visible = ( levelValue === level );
    } );

    const rewardScore = FMWQueryParameters.rewardScore;

    // {RewardDialog} dialog that is displayed when score reaches the reward value
    const rewardDialog = new RewardDialog( rewardScore, {

      // 'Keep Going' hides the dialog
      keepGoingButtonListener: () => rewardDialog.hide(),

      // 'New Level' has the same effect as the back button in the status bar
      newLevelButtonListener: () => {
        rewardDialog.hide();
        backButtonListener();
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

    // unlink not needed.
    level.scoreProperty.lazyLink( ( score, oldScore ) => {

      // do nothing when the score is reset
      if ( score < oldScore ) {
        return;
      }

      refreshButton.enabled = false;
      solveButton.enabled = false;

      if ( score === rewardScore ) {

        // The score has reached the magic number where a reward is display.
        gameAudioPlayer.gameOverPerfectScore();
        nextButton.visible = true;
        rewardDialog.show();
      }
      else {

        // The score doesn't warrant a reward, so just show a smiley face, etc.

        // ding!
        gameAudioPlayer.correctAnswer();

        // Show smiley face, fade it out, then show the Next button.
        faceOpacityProperty.value = 1;
        faceNode.visible = true;

        this.faceAnimation = new Animation( {
          stepEmitter: null, // via step function
          delay: 1,
          duration: 0.8,
          targets: [ {
            property: faceOpacityProperty,
            easing: Easing.LINEAR,
            to: 0
          } ]
        } );

        // removeListener not needed
        this.faceAnimation.finishEmitter.addListener( () => {
          faceNode.visible = false;
          nextButton.visible = true;
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