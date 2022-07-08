// Copyright 2021-2022, University of Colorado Boulder

/**
 * WaveGameLevelSelectionButton is a level-selection button for the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import LevelSelectionButton from '../../../../vegas/js/LevelSelectionButton.js';
import ScoreDisplayNumberAndStar from '../../../../vegas/js/ScoreDisplayNumberAndStar.js';
import FMWColors from '../../common/FMWColors.js';
import FMWIconFactory from '../../common/view/FMWIconFactory.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WaveGameLevel from '../model/WaveGameLevel.js';

class WaveGameLevelSelectionButton extends LevelSelectionButton {

  /**
   * @param {WaveGameLevel} level
   * @param {number} numberOfLevels
   * @param {Property.<WaveGameLevel|null} levelProperty
   * @param {Object} [options]
   */
  constructor( level, numberOfLevels, levelProperty, options ) {

    assert && assert( level instanceof WaveGameLevel );
    assert && AssertUtils.assertPositiveNumber( numberOfLevels );
    assert && assert( levelProperty instanceof Property );

    options = merge( {

      // LevelSelectionButton options
      createScoreDisplay: scoreProperty => new ScoreDisplayNumberAndStar( scoreProperty ),
      baseColor: FMWColors.levelSelectionButtonFillProperty,
      listener: () => {
        levelProperty.value = level;
      }
    }, options );

    const icon = FMWIconFactory.createLevelSelectionButtonIcon( level.levelNumber, numberOfLevels );

    super( icon, level.scoreProperty, options );

    // @public
    this.level = level; // {WaveGameLevel}
  }
}

fourierMakingWaves.register( 'WaveGameLevelSelectionButton', WaveGameLevelSelectionButton );
export default WaveGameLevelSelectionButton;