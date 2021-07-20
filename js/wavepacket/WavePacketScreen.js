// Copyright 2020-2021, University of Colorado Boulder

/**
 * WavePacketScreen is the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import Screen from '../../../joist/js/Screen.js';
import merge from '../../../phet-core/js/merge.js';
import Tandem from '../../../tandem/js/Tandem.js';
import FMWColors from '../common/FMWColors.js';
import FMWIconFactory from '../common/view/FMWIconFactory.js';
import fourierMakingWaves from '../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../fourierMakingWavesStrings.js';
import WavePacketModel from './model/WavePacketModel.js';
import WavePacketKeyboardHelpContent from './view/WavePacketKeyboardHelpContent.js';
import WavePacketScreenView from './view/WavePacketScreenView.js';

class WavePacketScreen extends Screen {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // Screen options
      name: fourierMakingWavesStrings.screen.wavePacket,
      backgroundColorProperty: FMWColors.screenBackgroundColorProperty,
      homeScreenIcon: FMWIconFactory.createWavePacketHomeScreenIcon(),

      // pdom options
      keyboardHelpNode: new WavePacketKeyboardHelpContent(),

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

fourierMakingWaves.register( 'WavePacketScreen', WavePacketScreen );
export default WavePacketScreen;