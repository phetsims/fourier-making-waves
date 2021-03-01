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
import RefreshButton from '../../../../scenery-phet/js/buttons/RefreshButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import GameAudioPlayer from '../../../../vegas/js/GameAudioPlayer.js';
import InfiniteStatusBar from '../../../../vegas/js/InfiniteStatusBar.js';
import FMWColorProfile from '../../common/FMWColorProfile.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WaveGameLevel from '../model/WaveGameLevel.js';

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
      //TODO
    }, options );

    const children = [];

    // Level description, displayed in the status bar
    const levelDescriptionNode = new RichText( level.description, {
      font: new PhetFont( 20 ),
      maxWidth: 650 // determined empirically
    } );

    // Bar across the top of the screen
    const statusBar = new InfiniteStatusBar( layoutBounds, visibleBoundsProperty, levelDescriptionNode, level.scoreProperty, {
      floatToTop: true,
      spacing: 20,
      barFill: FMWColorProfile.scoreBoardFillColorProperty,
      backButtonListener: () => {
        this.interruptSubtreeInput();
        levelProperty.value = null; // back to the level-selection UI
      }
    } );
    children.push( statusBar );

    // Pressing the refresh button creates the next random challenge.
    const refreshButton = new RefreshButton( {
      listener: () => level.nextChallenge(),
      center: layoutBounds.center
    } );
    children.push( refreshButton );

    //TODO display the challenge

    assert && assert( !options.children, 'WaveGameLevelNode sets children' );
    options.children = children;

    super( options );

    // This Node is visible when its level is selected.
    levelProperty.link( levelValue => {
      this.visible = ( levelValue === level );
    } );
  }
}

fourierMakingWaves.register( 'WaveGameLevelNode', WaveGameLevelNode );
export default WaveGameLevelNode;