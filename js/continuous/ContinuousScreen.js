// Copyright 2020, University of Colorado Boulder

/**
 * ContinuousScreen is the 'Continuous' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import Screen from '../../../joist/js/Screen.js';
import fourierMakingWaves from '../fourierMakingWaves.js';
import FourierMakingWavesColorProfile from '../common/FourierMakingWavesColorProfile.js';
import fourierMakingWavesStrings from '../fourierMakingWavesStrings.js';
import ContinuousModel from './model/ContinuousModel.js';
import ContinuousScreenView from './view/ContinuousScreenView.js';

class ContinuousScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      //TODO if you include homeScreenIcon or navigationBarIcon, use JOIST/ScreenIcon
      name: fourierMakingWavesStrings.screen.continuous,
      backgroundColorProperty: FourierMakingWavesColorProfile.screenBackgroundColorProperty,
      tandem: tandem
    };

    super(
      () => new ContinuousModel( tandem.createTandem( 'model' ) ),
      model => new ContinuousScreenView( model, tandem.createTandem( 'view' ) ),
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

fourierMakingWaves.register( 'ContinuousScreen', ContinuousScreen );
export default ContinuousScreen;