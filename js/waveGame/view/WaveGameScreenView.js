// Copyright 2020-2021, University of Colorado Boulder

/**
 * WaveGameScreenView is the view for the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import merge from '../../../../phet-core/js/merge.js';
import PDOMUtils from '../../../../scenery/js/accessibility/pdom/PDOMUtils.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Easing from '../../../../twixt/js/Easing.js';
import TransitionNode from '../../../../twixt/js/TransitionNode.js';
import GameAudioPlayer from '../../../../vegas/js/GameAudioPlayer.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WaveGameModel from '../model/WaveGameModel.js';
import WaveGameLevelNode from './WaveGameLevelNode.js';
import WaveGameLevelSelectionNode from './WaveGameLevelSelectionNode.js';

// constants
const TRANSITION_OPTIONS = {
  duration: 0.5, // sec
  targetOptions: {
    easing: Easing.QUADRATIC_IN_OUT
  }
};

class WaveGameScreenView extends ScreenView {

  /**
   * @param {WaveGameModel} model
   * @param {Object} [options]
   */
  constructor( model, options ) {
    assert && assert( model instanceof WaveGameModel );

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    super( options );

    // To improve readability
    const layoutBounds = this.layoutBounds;

    const gameAudioPlayer = new GameAudioPlayer();

    // UI for level selection and other game settings
    const levelSelectionNode = new WaveGameLevelSelectionNode( model, layoutBounds, {
      resetCallback: () => {
        model.reset();
        this.reset();
      },
      tandem: options.tandem.createTandem( 'levelSelectionNode' )
    } );

    // @private {SolveItSceneNode[]} a Node for each level of the game
    this.levelNodes = _.map( model.levels, level => new WaveGameLevelNode( level, model.levelProperty,
      layoutBounds, this.visibleBoundsProperty, gameAudioPlayer, {
        tandem: options.tandem.createTandem( `level${level.levelNumber}Node` )
      } ) );

    // Handles the animated 'slide' transition between levelSelectionNode and a level.
    this.transitionNode = new TransitionNode( this.visibleBoundsProperty, {
      content: levelSelectionNode,
      cachedNodes: [ levelSelectionNode, ...this.levelNodes ]
    } );
    this.addChild( this.transitionNode );

    // Transition between levelSelectionNode and the selected level.
    // A null value for levelProperty indicates that no level is selected, and levelSelectionNode should be shown.
    model.levelProperty.lazyLink( ( level, previousLevel ) => {

      this.interruptSubtreeInput();

      if ( level ) {

        // Transition to the selected level.
        const selectedLevelNode = _.find( this.levelNodes, levelNode => ( levelNode.level === level ) );
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
          levelSelectionNode.getButtonForLevel( previousLevel ).focus();
          transition.endedEmitter.removeListener( transitionEndedListener );
        };
        transition.endedEmitter.addListener( transitionEndedListener );
      }


    } );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Resets the view.
   * @public
   */
  reset() {
    //TODO
  }

  /**
   * Steps the view.
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {

    // animate the view for the selected level
    for ( let i = 0; i < this.levelNodes.length; i++ ) {
      const levelNode = this.levelNodes[ i ];
      if ( levelNode.visible ) {
        levelNode.step( dt );
        break;
      }
    }
  }
}

fourierMakingWaves.register( 'WaveGameScreenView', WaveGameScreenView );
export default WaveGameScreenView;