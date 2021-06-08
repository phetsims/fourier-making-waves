// Copyright 2021, University of Colorado Boulder

/**
 * LevelSelectionNode is the user interface for level selection and other game settings in the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import HStrut from '../../../../scenery/js/nodes/HStrut.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import WaveGameLevel from '../model/WaveGameLevel.js';
import WaveGameInfoDialog from './WaveGameInfoDialog.js';
import WaveGameLevelSelectionButton from './WaveGameLevelSelectionButton.js';

class WaveGameLevelSelectionNode extends Node {

  /**
   * @param {WaveGameModel} model
   * @param {Bounds2} layoutBounds
   * @param {Object} [options]
   */
  constructor( model, layoutBounds, options ) {

    options = merge( {

      // WaveGameLevelSelectionNode options
      resetCallback: null, // {function|null}

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    const chooseYourLevelNode = new Text( fourierMakingWavesStrings.chooseYourLevel, {
      font: new PhetFont( 50 ),
      maxWidth: 0.65 * layoutBounds.width
    } );

    // {WaveGameInfoDialog} Info dialog is created on demand, then reused.
    let infoDialog = null;

    const infoButton = new InfoButton( {
      iconFill: 'rgb( 41, 106, 163 )',
      maxHeight: 40, // determined empirically
      listener: () => {
        infoDialog = infoDialog || new WaveGameInfoDialog( model.levels );
        infoDialog.show();
      }
    } );

    // Add an invisible strut to the left of chooseYourLevelNode, to balance the Info button at the right.
    // This results in 'Choose Your Level' looking horizontally centered.
    const invisibleStrut = new HStrut( infoButton.width );

    const titleBox = new HBox( {
      children: [ invisibleStrut, chooseYourLevelNode, infoButton ],
      spacing: 40
    } );

    // {WaveGameLevelSelectionButton[]} a level-selection button for each level
    const levelSelectionButtons = _.map( model.levels,
      level => new WaveGameLevelSelectionButton( level, model.levelProperty, {
        tandem: options.tandem.createTandem( `level${level.levelNumber}SelectionButton` )
      } )
    );

    // Lay out the level-selection buttons in a grid.
    const BUTTONS_PER_ROW = 3;
    const rows = [];
    let i = 0;
    while ( i < levelSelectionButtons.length ) {

      // Create a row of buttons.
      const hBoxChildren = [];
      for ( let j = 0; j < BUTTONS_PER_ROW && i < levelSelectionButtons.length; j++ ) {
        hBoxChildren.push( levelSelectionButtons[ i ] );
        i++;
      }
      rows.push( new HBox( {
        children: hBoxChildren,
        spacing: 40
      } ) );
    }
    const buttonsBox = new VBox( {
      children: rows,
      align: 'center',
      spacing: 30
    } );

    const titleAndButtonsBox = new VBox( {
      children: [ titleBox, buttonsBox ],
      spacing: 50
    } );

    // Center the title & buttons on the screen. Observe bounds in case PhET-iO hides a button.
    titleAndButtonsBox.boundsProperty.link( () => {
      titleAndButtonsBox.center = layoutBounds.center;
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
    options.children = [ titleAndButtonsBox, resetAllButton ];

    super( options );

    // @private
    this.levelSelectionButtons = levelSelectionButtons;

    // pdom - traversal order
    // See https://github.com/phetsims/fourier-making-waves/issues/53
    this.pdomOrder = [ buttonsBox, infoButton, resetAllButton ];
  }

  /**
   * Gets the button associated with a specified level.
   * @param {WaveGameLevel} level
   * @returns {WaveGameLevelSelectionButton}
   * @public
   */
  getButtonForLevel( level ) {
    assert && assert( level instanceof WaveGameLevel );
    return _.find( this.levelSelectionButtons, button => button.level === level );
  }
}

fourierMakingWaves.register( 'WaveGameLevelSelectionNode', WaveGameLevelSelectionNode );
export default WaveGameLevelSelectionNode;