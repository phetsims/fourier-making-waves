// Copyright 2020-2021, University of Colorado Boulder

/**
 * WavePacketScreen is the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import merge from '../../../phet-core/js/merge.js';
import SliderAndGeneralKeyboardHelpContent from '../../../scenery-phet/js/keyboard/help/SliderAndGeneralKeyboardHelpContent.js';
import Image from '../../../scenery/js/nodes/Image.js';
import Tandem from '../../../tandem/js/Tandem.js';
import continuousHomeScreenImage from '../../images/Continuous-home-screen-icon_png.js';
import FMWColorProfile from '../common/FMWColorProfile.js';
import fourierMakingWaves from '../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../fourierMakingWavesStrings.js';
import WavePacketModel from './model/WavePacketModel.js';
import WavePacketScreenView from './view/WavePacketScreenView.js';

class WavePacketScreen extends Screen {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // Screen options
      name: fourierMakingWavesStrings.screen.wavePacket,
      backgroundColorProperty: FMWColorProfile.screenBackgroundColorProperty,
      homeScreenIcon: createHomeScreenIcon(),

      // pdom
      keyboardHelpNode: new SliderAndGeneralKeyboardHelpContent( {
        labelMaxWidth: 250,
        generalSectionOptions: {
          withCheckboxContent: true
        }
      } ),

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    super(
      () => new WavePacketModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new WavePacketScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

//TODO delete Wave-Packet-home-screen-icon.png if it is not used
/**
 * Creates the Home screen icon for this screen.
 * @returns {ScreenIcon}
 */
function createHomeScreenIcon() {
  const iconNode = new Image( continuousHomeScreenImage );
  return new ScreenIcon( iconNode, {
    fill: FMWColorProfile.screenBackgroundColorProperty
  } );
}

fourierMakingWaves.register( 'WavePacketScreen', WavePacketScreen );
export default WavePacketScreen;