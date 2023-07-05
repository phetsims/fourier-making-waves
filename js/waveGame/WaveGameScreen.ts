// Copyright 2020-2023, University of Colorado Boulder

/**
 * WaveGameScreen is the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import Screen from '../../../joist/js/Screen.js';
import Tandem from '../../../tandem/js/Tandem.js';
import FMWColors from '../common/FMWColors.js';
import FMWIconFactory from '../common/view/FMWIconFactory.js';
import fourierMakingWaves from '../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../FourierMakingWavesStrings.js';
import WaveGameModel from './model/WaveGameModel.js';
import WaveGameKeyboardHelpContent from './view/WaveGameKeyboardHelpContent.js';
import WaveGameScreenView from './view/WaveGameScreenView.js';

export default class WaveGameScreen extends Screen<WaveGameModel, WaveGameScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {
      name: FourierMakingWavesStrings.screen.waveGameStringProperty,
      backgroundColorProperty: FMWColors.waveGameScreenBackgroundColorProperty,
      homeScreenIcon: FMWIconFactory.createWaveGameHomeScreenIcon(),
      createKeyboardHelpNode: () => new WaveGameKeyboardHelpContent(),
      isDisposable: false,
      tandem: tandem
    };

    super(
      () => new WaveGameModel( options.tandem.createTandem( 'model' ) ),
      model => new WaveGameScreenView( model, options.tandem.createTandem( 'view' ) ),
      options
    );
  }
}

fourierMakingWaves.register( 'WaveGameScreen', WaveGameScreen );