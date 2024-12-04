// Copyright 2021-2024, University of Colorado Boulder

/**
 * WaveGameLevelSelectionNode is the user interface for level selection and other game settings in the 'Wave Game'
 * screen. It displays a set of level-selection buttons, an Info button for opening a dialog that describes the levels,
 * and a ResetAllButton.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, Text, VBox } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';
import WaveGameLevel from '../model/WaveGameLevel.js';
import WaveGameModel from '../model/WaveGameModel.js';
import WaveGameInfoDialog from './WaveGameInfoDialog.js';
import WaveGameLevelSelectionButtonGroup from './WaveGameLevelSelectionButtonGroup.js';

export default class WaveGameLevelSelectionNode extends Node {

  private readonly levelSelectionButtonGroup: WaveGameLevelSelectionButtonGroup;

  public constructor( model: WaveGameModel, layoutBounds: Bounds2, tandem: Tandem ) {

    const chooseYourLevelText = new Text( FourierMakingWavesStrings.chooseYourLevelStringProperty, {
      font: new PhetFont( 50 ),
      maxWidth: 0.65 * layoutBounds.width
    } );

    // Displays info about the levels. Created eagerly and reused for PhET-iO.
    const infoDialog = new WaveGameInfoDialog( model.levels, tandem.createTandem( 'infoDialog' ) );

    const infoButton = new InfoButton( {
      iconFill: 'rgb( 41, 106, 163 )',
      maxHeight: 40, // determined empirically
      listener: () => infoDialog.show(),
      tandem: tandem.createTandem( 'infoButton' )
    } );

    const levelSelectionButtonGroup = new WaveGameLevelSelectionButtonGroup( model.levelProperty, model.levels,
      tandem.createTandem( 'levelSelectionButtonGroup' ) );

    const titleAndButtonsBox = new VBox( {
      children: [ chooseYourLevelText, levelSelectionButtonGroup ],
      spacing: 50,
      excludeInvisibleChildrenFromBounds: false
    } );

    // Center the title & buttons on the screen. Observe bounds in case PhET-iO hides a button.
    titleAndButtonsBox.boundsProperty.link( () => {
      titleAndButtonsBox.center = layoutBounds.center;
    } );

    // Reset All button, at lower right
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput();
        model.reset();
      },
      right: layoutBounds.maxX - FMWConstants.SCREEN_VIEW_X_MARGIN,
      bottom: layoutBounds.maxY - FMWConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    super( {
      isDisposable: false,
      children: [ titleAndButtonsBox, resetAllButton, infoButton ],
      tandem: tandem
    } );

    // InfoButton to the right of title. This is handled dynamically in case the title is changed via PhET-iO.
    Multilink.multilink(
      [ titleAndButtonsBox.boundsProperty, chooseYourLevelText.boundsProperty ],
      () => {
        const localBounds = chooseYourLevelText.boundsTo( this );
        infoButton.left = localBounds.right + 40;
        infoButton.centerY = localBounds.centerY;
      } );

    this.levelSelectionButtonGroup = levelSelectionButtonGroup;

    // pdom - traversal order
    // See https://github.com/phetsims/fourier-making-waves/issues/53
    this.pdomOrder = [ levelSelectionButtonGroup, infoButton, resetAllButton ];
  }

  /**
   * Sets focus to the level-selection button associated with the specified level.
   */
  public focusLevelSelectionButton( level: WaveGameLevel ): void {
    this.levelSelectionButtonGroup.focusLevelSelectionButton( level.levelNumber );
  }
}

fourierMakingWaves.register( 'WaveGameLevelSelectionNode', WaveGameLevelSelectionNode );