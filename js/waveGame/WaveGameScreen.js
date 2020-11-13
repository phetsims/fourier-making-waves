// Copyright 2020, University of Colorado Boulder

/**
 * WaveGameScreen is the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import Screen from '../../../joist/js/Screen.js';
import FourierMakingWavesColors from '../common/FourierMakingWavesColors.js';
import fourierMakingWaves from '../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../fourierMakingWavesStrings.js';
import WaveGameModel from './model/WaveGameModel.js';
import WaveGameScreenView from './view/WaveGameScreenView.js';

class WaveGameScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      //TODO if you include homeScreenIcon or navigationBarIcon, use JOIST/ScreenIcon
      name: fourierMakingWavesStrings.screen.waveGame,
      backgroundColorProperty: FourierMakingWavesColors.SCREEN_VIEW_BACKGROUND,
      tandem: tandem
    };

    super(
      () => new WaveGameModel( tandem.createTandem( 'model' ) ),
      model => new WaveGameScreenView( model, tandem.createTandem( 'view' ) ),
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

fourierMakingWaves.register( 'WaveGameScreen', WaveGameScreen );
export default WaveGameScreen;