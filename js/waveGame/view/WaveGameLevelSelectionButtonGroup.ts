// Copyright 2022-2024, University of Colorado Boulder

/**
 * WaveGameLevelSelectionButtonGroup is the group of level-selection buttons for the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import LevelSelectionButtonGroup from '../../../../vegas/js/LevelSelectionButtonGroup.js';
import ScoreDisplayNumberAndStar from '../../../../vegas/js/ScoreDisplayNumberAndStar.js';
import FMWColors from '../../common/FMWColors.js';
import FMWQueryParameters from '../../common/FMWQueryParameters.js';
import FMWIconFactory from '../../common/view/FMWIconFactory.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WaveGameLevel from '../model/WaveGameLevel.js';

const BUTTON_WIDTH = 150;
const BUTTON_HEIGHT = 150;

// Layout of buttons
const X_SPACING = 40;
const Y_SPACING = 30;

export default class WaveGameLevelSelectionButtonGroup extends LevelSelectionButtonGroup {

  public constructor( levelProperty: Property<WaveGameLevel | null>, levels: WaveGameLevel[], tandem: Tandem ) {

    const items = levels.map( level => {
      return {
        icon: FMWIconFactory.createLevelSelectionButtonIcon( level.levelNumber, levels.length ),
        scoreProperty: level.scoreProperty,
        options: {
          soundPlayerIndex: level.levelNumber - 1,
          listener: () => {
            levelProperty.value = level;
          },
          createScoreDisplay: () => new ScoreDisplayNumberAndStar( level.scoreProperty )
        }
      };
    } );

    const buttonsPerRow = ( FMWQueryParameters.gameLevels.length <= 4 ) ? 4 : 3;

    super( items, {
      levelSelectionButtonOptions: {
        baseColor: FMWColors.levelSelectionButtonFillProperty
      },
      groupButtonWidth: BUTTON_WIDTH,
      groupButtonHeight: BUTTON_HEIGHT,

      // A maximum number of buttons per row, wrapping to a new row
      flowBoxOptions: {
        spacing: X_SPACING, // horizontal spacing
        lineSpacing: Y_SPACING, // vertical spacing
        preferredWidth: buttonsPerRow * ( BUTTON_WIDTH + X_SPACING ),
        wrap: true, // start a new row when preferredWidth is reached
        justify: 'center' // horizontal justification
      },
      gameLevels: FMWQueryParameters.gameLevels,
      tandem: tandem
    } );
  }
}

fourierMakingWaves.register( 'WaveGameLevelSelectionButtonGroup', WaveGameLevelSelectionButtonGroup );