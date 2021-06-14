// Copyright 2020-2021, University of Colorado Boulder

/**
 * WaveGameScreen is the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import Screen from '../../../joist/js/Screen.js';
import merge from '../../../phet-core/js/merge.js';
import SliderAndGeneralKeyboardHelpContent from '../../../scenery-phet/js/keyboard/help/SliderAndGeneralKeyboardHelpContent.js';
import Tandem from '../../../tandem/js/Tandem.js';
import FMWColorProfile from '../common/FMWColorProfile.js';
import FMWIconFactory from '../common/view/FMWIconFactory.js';
import fourierMakingWaves from '../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../fourierMakingWavesStrings.js';
import WaveGameModel from './model/WaveGameModel.js';
import WaveGameScreenView from './view/WaveGameScreenView.js';

class WaveGameScreen extends Screen {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // Screen options
      name: fourierMakingWavesStrings.screen.waveGame,
      backgroundColorProperty: FMWColorProfile.screenBackgroundColorProperty,
      homeScreenIcon: FMWIconFactory.createWaveGameHomeScreenIcon(),

      // pdom
      keyboardHelpNode: new SliderAndGeneralKeyboardHelpContent( {
        labelMaxWidth: 250
      } ),

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    super(
      () => new WaveGameModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new WaveGameScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
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