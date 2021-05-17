// Copyright 2021, University of Colorado Boulder

/**
 * WaveGameLevelSelectionButton is a level-selection button for the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import LevelSelectionButton from '../../../../vegas/js/LevelSelectionButton.js';
import ScoreDisplayNumberAndStar from '../../../../vegas/js/ScoreDisplayNumberAndStar.js';
import FMWColorProfile from '../../common/FMWColorProfile.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WaveGameLevel from '../model/WaveGameLevel.js';

class WaveGameLevelSelectionButton extends LevelSelectionButton {

  /**
   * @param {WaveGameLevel} level
   * @param {Property.<WaveGameLevel|null} levelProperty
   * @param {Object} [options]
   */
  constructor( level, levelProperty, options ) {

    assert && assert( level instanceof WaveGameLevel, 'invalid level' );
    assert && assert( levelProperty instanceof Property, 'invalid levelProperty' );

    options = merge( {
      scoreDisplayConstructor: ScoreDisplayNumberAndStar,
      baseColor: FMWColorProfile.levelSelectionButtonFillProperty,
      listener: () => {
        levelProperty.value = level;
      },
      tandem: Tandem.REQUIRED
    }, options );

    //TODO https://github.com/phetsims/fourier-making-waves/issues/57 better icons?
    const iconString = ( level.levelNumber < 5 ) ? level.levelNumber : `${level.levelNumber}+`;
    const icon = new Text( iconString, {
      font: new PhetFont( 50 )
    } );

    super( icon, level.scoreProperty, options );
  }
}

fourierMakingWaves.register( 'WaveGameLevelSelectionButton', WaveGameLevelSelectionButton );
export default WaveGameLevelSelectionButton;