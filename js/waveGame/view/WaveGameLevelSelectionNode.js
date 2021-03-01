// Copyright 2018-2020, University of Colorado Boulder

/**
 * LevelSelectionNode is the user interface for level selection and other game settings in the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Dialog from '../../../../sun/js/Dialog.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WaveGameLevelSelectionButton from './WaveGameLevelSelectionButton.js';

class WaveGameLevelSelectionNode extends Node {

  /**
   * @param {WaveGameModel} model
   * @param {Bounds2} layoutBounds
   * @param {Object} [options]
   */
  constructor( model, layoutBounds, options ) {

    options = merge( {
      resetCallback: null, // {function|null}
      tandem: Tandem.REQUIRED
    }, options );

    // {WaveGameLevelSelectionButton[]} a level-selection button for each level
    const levelSelectionButtons = _.map( model.levels,
      level => new WaveGameLevelSelectionButton( level, model.levelProperty, {
        tandem: options.tandem.createTandem( `level${level.levelNumber}SelectionButton` )
      } )
    );

    // Layout the level-selection buttons in a grid.
    const BUTTONS_PER_ROW = 3;
    const vBoxChildren = [];
    let i = 0;
    while ( i < levelSelectionButtons.length ) {

      // Create a row of buttons.
      const hBoxChildren = [];
      for ( let j = 0; j < BUTTONS_PER_ROW && i < levelSelectionButtons.length; j++ ) {
        hBoxChildren.push( levelSelectionButtons[ i ] );
        i++;
      }
      vBoxChildren.push( new HBox( {
        children: hBoxChildren,
        spacing: 40
      } ) );
    }
    const levelSelectionButtonsBox = new VBox( {
      children: vBoxChildren,
      align: 'center',
      spacing: 30
    } );

    // Center the buttons on the screen. Observe bounds in case PhET-iO hides a button.
    levelSelectionButtonsBox.boundsProperty.link( () => {
      levelSelectionButtonsBox.center = layoutBounds.center;
    } );

    // Reset All button, at lower right
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        phet.log && phet.log( 'ResetAllButton pressed' );
        options.resetCallback && options.resetCallback();
      },
      right: layoutBounds.maxX - FMWConstants.SCREEN_VIEW_X_MARGIN,
      bottom: layoutBounds.maxY - FMWConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );

    assert && assert( !options.children, 'LevelSelectionNode sets children' );
    options.children = [ levelSelectionButtonsBox, resetAllButton ];

    // Press this button to test each game level. See output in console.
    // This test is only useful if assertions are enabled.
    // Also disable if fuzz is enabled, since this takes a long time and is not relevant to fuzz testing.
    if ( assert && phet.chipper.queryParameters.showAnswers && !phet.chipper.isFuzzEnabled() ) {
      const testButton = new RectangularPushButton( {
        content: new Text( 'test game levels', { fill: 'white', font: new PhetFont( 20 ) } ),
        baseColor: 'red',
        listener: () => {
          console.log( 'begin test of game levels...' );
          model.levels.forEach( level => {
            console.log( `testing level ${level.levelNumber}` );
            level.test();
          } );
          console.log( 'end test of game levels' );
          const messageNode = new RichText( 'Test completed.<br>See results in browser console.' );
          const dialog = new Dialog( messageNode, {
            topMargin: 20,
            bottomMargin: 20,
            leftMargin: 20,
            rightMargin: 20
          } );
          dialog.show();
        },
        centerX: layoutBounds.centerX,
        bottom: layoutBounds.bottom - 20
      } );
      options.children.push( testButton );
    }

    super( options );
  }
}

fourierMakingWaves.register( 'WaveGameLevelSelectionNode', WaveGameLevelSelectionNode );
export default WaveGameLevelSelectionNode;