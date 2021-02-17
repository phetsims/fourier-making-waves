// Copyright 2020, University of Colorado Boulder

/**
 * WaveGameScreenView is the view for the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import Node from '../../../../scenery/js/nodes/Node.js';
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
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {
    assert && assert( model instanceof WaveGameModel, 'invalid model' );
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( {
      tandem: tandem
    } );

    const gameAudioPlayer = new GameAudioPlayer();

    // UI for level selection and other game settings
    const levelSelectionNode = new WaveGameLevelSelectionNode( model, this.layoutBounds, {
      resetCallback: () => {
        model.reset();
        this.reset();
      }
    } );

    // @private {SolveItSceneNode[]} a Node for each level of the game
    this.levelNodes = _.map( model.levels, level => new WaveGameLevelNode( level, model.levelProperty,
      this.layoutBounds, this.visibleBoundsProperty, gameAudioPlayer ) );

    // Parent for all WaveGameLevelNode instances
    const levelsParent = new Node( {
      children: this.levelNodes
    } );

    // Handles the animated 'slide' transition between level-selection and challenges (scenesParent)
    this.transitionNode = new TransitionNode( this.visibleBoundsProperty, {
      content: ( model.levelProperty.value === null ) ? levelSelectionNode : levelsParent,
      cachedNodes: [ levelsParent ]
    } );
    this.addChild( this.transitionNode );

    // Transition between the level-selection UI and the selected scene.
    model.levelProperty.lazyLink( level => {
      if ( level ) {
        this.transitionNode.slideLeftTo( levelsParent, TRANSITION_OPTIONS );
      }
      else {
        this.transitionNode.slideRightTo( levelSelectionNode, TRANSITION_OPTIONS );
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
}

fourierMakingWaves.register( 'WaveGameScreenView', WaveGameScreenView );
export default WaveGameScreenView;