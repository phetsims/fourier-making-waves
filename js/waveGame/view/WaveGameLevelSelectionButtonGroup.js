// Copyright 2022, University of Colorado Boulder

/**
 * WaveGameLevelSelectionButtonGroup is the group of level-selection buttons for the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import LevelSelectionButtonGroup from '../../../../vegas/js/LevelSelectionButtonGroup.js';
import FMWColors from '../../common/FMWColors.js';
import FMWQueryParameters from '../../common/FMWQueryParameters.js';
import FMWIconFactory from '../../common/view/FMWIconFactory.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class WaveGameLevelSelectionButtonGroup extends LevelSelectionButtonGroup {

  /**
   * @param {Property.<WaveGameLevel|null} levelProperty
   * @param {WaveGameLevel[]} levels
   * @param {Object} [options]
   */
  constructor( levelProperty, levels, options ) {

    options = merge( {
      levelSelectionButtonOptions: {
        baseColor: FMWColors.levelSelectionButtonFillProperty
      },
      flowBoxOptions: {
        orientation: 'horizontal',
        spacing: 20, // horizontal spacing
        lineSpacing: 20, // vertical spacing
        preferredWidth: 500, // set empirically, to provide a maximum of 3 buttons per row
        wrap: true, // start a new row when preferredWidth is reached
        justify: 'center' // horizontal justification
      },
      gameLevels: FMWQueryParameters.gameLevels,
      tandem: Tandem.REQUIRED
    }, options );

    const items = levels.map( level => {
      return {
        icon: FMWIconFactory.createLevelSelectionButtonIcon( level.levelNumber, levels.length ),
        scoreProperty: level.scoreProperty,
        options: {
          soundPlayerIndex: level.levelNumber - 1,
          listener: () => {
            levelProperty.value = level;
          }
        }
      };
    } );

    super( items, options );
  }
}

fourierMakingWaves.register( 'WaveGameLevelSelectionButtonGroup', WaveGameLevelSelectionButtonGroup );
export default WaveGameLevelSelectionButtonGroup;