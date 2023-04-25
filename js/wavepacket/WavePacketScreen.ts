// Copyright 2020-2023, University of Colorado Boulder

/**
 * WavePacketScreen is the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import Screen from '../../../joist/js/Screen.js';
import Tandem from '../../../tandem/js/Tandem.js';
import FMWColors from '../common/FMWColors.js';
import FMWIconFactory from '../common/view/FMWIconFactory.js';
import fourierMakingWaves from '../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../FourierMakingWavesStrings.js';
import WavePacketModel from './model/WavePacketModel.js';
import WavePacketKeyboardHelpContent from './view/WavePacketKeyboardHelpContent.js';
import WavePacketScreenView from './view/WavePacketScreenView.js';

export default class WavePacketScreen extends Screen<WavePacketModel, WavePacketScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {
      name: FourierMakingWavesStrings.screen.wavePacketStringProperty,
      backgroundColorProperty: FMWColors.wavePacketScreenBackgroundColorProperty,
      homeScreenIcon: FMWIconFactory.createWavePacketHomeScreenIcon(),
      createKeyboardHelpNode: () => new WavePacketKeyboardHelpContent(),
      tandem: tandem
    };

    super(
      () => new WavePacketModel( options.tandem.createTandem( 'model' ) ),
      model => new WavePacketScreenView( model, options.tandem.createTandem( 'view' ) ),
      options
    );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

fourierMakingWaves.register( 'WavePacketScreen', WavePacketScreen );