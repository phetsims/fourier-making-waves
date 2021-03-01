// Copyright 2021, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import LevelSelectionButton from '../../../../vegas/js/LevelSelectionButton.js';
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
      baseColor: FMWColorProfile.levelSelectionButtonColorProperty,
      listener: () => {
        this.interruptSubtreeInput();
        levelProperty.value = level;
      },
      tandem: Tandem.REQUIRED
    }, options );

    //TODO placeholder icon
    const iconString = ( level.levelNumber < 5 ) ? level.levelNumber : `${level.levelNumber}+`;
    const icon = new Text( iconString, {
      font: new PhetFont( 50 )
    } );

    super( icon, level.scoreProperty, options );
  }
}

fourierMakingWaves.register( 'WaveGameLevelSelectionButton', WaveGameLevelSelectionButton );
export default WaveGameLevelSelectionButton;