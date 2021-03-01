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
import GameAudioPlayer from '../../../../vegas/js/GameAudioPlayer.js';
import InfiniteStatusBar from '../../../../vegas/js/InfiniteStatusBar.js';
import FMWColorProfile from '../../common/FMWColorProfile.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import WaveGameLevel from '../model/WaveGameLevel.js';
import AmplitudeControlsSpinner from './AmplitudeControlsSpinner.js';

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

    // Pressing the refresh button creates the next random challenge.
    const refreshButton = new RefreshButton( {
      listener: () => {
        this.interruptSubtreeInput();
        level.nextChallenge();
      },
      scale: 0.75,
      right: layoutBounds.right - 20,
      top: statusBar.bottom + 20,
      tandem: options.tandem.createTandem( 'refreshButton' )
    } );

    const tryToMatchText = new Text( fourierMakingWavesStrings.tryToMatchThePinkFunction, {
      font: DEFAULT_FONT,
      maxWidth: 200,
      tandem: options.tandem.createTandem( 'tryToMatchText' )
    } );

    //TODO this needs to be properly initialized and adjusted when level.challengeProperty changes
    const numberOfAmplitudeControlsProperty = new NumberProperty( 1, {
      range: new Range( 1, FMWConstants.MAX_HARMONICS )
    } );

    const amplitudeControlsSpinner = new AmplitudeControlsSpinner( numberOfAmplitudeControlsProperty, {
      tandem: options.tandem.createTandem( 'amplitudeControlsSpinner' )
    } );

    // Smiley face, shown when a challenge has been successfully completed. Fades out to reveal the Next button.
    const faceNode = new FaceNode( 200 /* headDiameter */, {
      visible: false,
      tandem: options.tandem.createTandem( 'faceNode' ),
      phetioReadOnly: true
    } );

    // Next button is shown after a challenge has been successfully completed.
    const nextButton = new RectangularPushButton( {
      content: new Text( fourierMakingWavesStrings.next, {
        font: DEFAULT_FONT,
        maxWidth: 200 // determined empirically
      } ),
      listener: () => {
        this.interruptSubtreeInput();
        nextButton.visible = false;
        faceNode.visible = false;
        level.nextChallenge();
      },
      baseColor: FMWColorProfile.nextButtonFillProperty,
      visible: false,
      tandem: options.tandem.createTandem( 'nextButton' ),
      phetioReadOnly: true
    } );

    const controlPanelChildren = [
      tryToMatchText,
      refreshButton,
      amplitudeControlsSpinner,
      faceNode,
      nextButton
    ];

    // When the ?showAnswers query parameter is present, add some stuff to assist with development and QA.
    if ( phet.chipper.queryParameters.showAnswers ) {

      // Pressing this button solves the challenge.
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
      controlPanelChildren.push( solveButton );

      // Shows the answer (amplitudes) for the challenge.
      const answerText = new Text( '', {
        font: DEFAULT_FONT,
        fill: 'red'
      } );
      controlPanelChildren.push( answerText );

      // unlink is not needed.
      level.challengeProperty.link( challenge => {
        answerText.text = `[${challenge.getAnswerAmplitudes()}]`;
      } );
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

    //TODO display the challenge

    assert && assert( !options.children, 'WaveGameLevelNode sets children' );
    options.children = [ statusBar, controlPanel ];

    super( options );

    // This Node is visible when its level is selected.
    levelProperty.link( levelValue => {
      this.visible = ( levelValue === level );
    } );

    level.isCorrectEmitter.addListener( () => {
      phet.log && phet.log( 'Correct answer!' );
      gameAudioPlayer.correctAnswer();
      faceNode.visible = true; //TODO animated fade out
      nextButton.visible = true; //TODO show after faceNode fades out
    } );
  }
}

fourierMakingWaves.register( 'WaveGameLevelNode', WaveGameLevelNode );
export default WaveGameLevelNode;