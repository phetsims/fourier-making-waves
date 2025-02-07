// Copyright 2020-2023, University of Colorado Boulder

/**
 * WaveGameScreenView is the view for the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import PDOMUtils from '../../../../scenery/js/accessibility/pdom/PDOMUtils.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Easing from '../../../../twixt/js/Easing.js';
import TransitionNode from '../../../../twixt/js/TransitionNode.js';
import GameAudioPlayer from '../../../../vegas/js/GameAudioPlayer.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WaveGameModel from '../model/WaveGameModel.js';
import WaveGameLevelNode from './WaveGameLevelNode.js';
import WaveGameLevelSelectionNode from './WaveGameLevelSelectionNode.js';
import WaveGameRewardDialog from './WaveGameRewardDialog.js';
import WaveGameRewardNode from './WaveGameRewardNode.js';

// constants
const TRANSITION_OPTIONS = {
  duration: 0.5, // sec
  targetOptions: {
    easing: Easing.QUADRATIC_IN_OUT
  }
};

export default class WaveGameScreenView extends ScreenView {

  // The reward shown while rewardDialog is open.
  private readonly rewardNode: WaveGameRewardNode;

  // a Node for each level of the game
  private readonly levelNodes: WaveGameLevelNode[];

  // Handles the animated 'slide' transition between levelSelectionNode and a level.
  private readonly transitionNode: TransitionNode;

  public constructor( model: WaveGameModel, tandem: Tandem ) {

    super( {
      isDisposable: false,
      tandem: tandem
    } );

    // To improve readability
    const layoutBounds = this.layoutBounds;

    const gameAudioPlayer = new GameAudioPlayer();

    // UI for level selection and other game settings
    const levelSelectionNode = new WaveGameLevelSelectionNode( model, layoutBounds, tandem.createTandem( 'levelSelectionNode' ) );

    this.rewardNode = new WaveGameRewardNode( {
      visible: false,
      tandem: tandem.createTandem( 'rewardNode' )
    } );

    // Dialog that is displayed when the score reaches the reward value.
    const rewardDialog = new WaveGameRewardDialog( model.levelProperty, this.rewardNode, model.rewardScore,
      tandem.createTandem( 'rewardDialog' ) );

    this.levelNodes = model.levels.map( level => new WaveGameLevelNode( level, model.levelProperty,
      layoutBounds, this.visibleBoundsProperty, gameAudioPlayer, this.rewardNode, rewardDialog, model.rewardScore,
      tandem.createTandem( `level${level.levelNumber}Node` ) ) );

    this.transitionNode = new TransitionNode( this.visibleBoundsProperty, {
      content: levelSelectionNode,
      cachedNodes: [ levelSelectionNode, ...this.levelNodes ]
    } );

    // Transition between levelSelectionNode and the selected level.
    // A null value for levelProperty indicates that no level is selected, and levelSelectionNode should be shown.
    model.levelProperty.lazyLink( ( level, previousLevel ) => {

      this.interruptSubtreeInput();

      if ( level ) {

        // Transition to the selected level.
        const selectedLevelNode = _.find( this.levelNodes, levelNode => ( levelNode.level === level ) )!;
        assert && assert( selectedLevelNode );
        const transition = this.transitionNode.slideLeftTo( selectedLevelNode, TRANSITION_OPTIONS );

        // Set focus to the first focusable element in selectedLevelNode.
        // See specification at https://github.com/phetsims/vegas/issues/90#issuecomment-854034816
        const transitionEndedListener = () => {
          assert && assert( this.transitionNode.hasChild( selectedLevelNode ) && selectedLevelNode.visible );

          // This is a little brittle. If anything else is added to the screen in the future that is
          // not associated with transitionNode, then it might get the focus.
          PDOMUtils.getFirstFocusable().focus();
          transition.endedEmitter.removeListener( transitionEndedListener );
        };
        transition.endedEmitter.addListener( transitionEndedListener );
      }
      else {

        // Selected level was null, so transition to levelSelectionNode.
        const transition = this.transitionNode.slideRightTo( levelSelectionNode, TRANSITION_OPTIONS );

        // Set focus to the level-selection button that is associated with previousLevel.
        // See specification at https://github.com/phetsims/vegas/issues/90#issuecomment-854034816
        const transitionEndedListener = () => {
          assert && assert( this.transitionNode.hasChild( levelSelectionNode ) && levelSelectionNode.visible );
          assert && assert( previousLevel );
          levelSelectionNode.focusLevelSelectionButton( previousLevel! );
          transition.endedEmitter.removeListener( transitionEndedListener );
        };
        transition.endedEmitter.addListener( transitionEndedListener );
      }
    } );

    this.addChild( this.transitionNode );
    this.addChild( this.rewardNode );
  }

  /**
   * Steps the view.
   * @param dt - time step, in seconds
   */
  public override step( dt: number ): void {

    this.rewardNode.visible && this.rewardNode.step( dt );

    // animate the view for the selected level
    for ( let i = 0; i < this.levelNodes.length; i++ ) {
      const levelNode = this.levelNodes[ i ];
      if ( levelNode.visible ) {
        levelNode.step( dt );
        break;
      }
    }

    super.step( dt );
  }
}

fourierMakingWaves.register( 'WaveGameScreenView', WaveGameScreenView );