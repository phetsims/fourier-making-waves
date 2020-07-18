// Copyright 2020, University of Colorado Boulder

/**
 * @author Chris Malley (PixelZoom, Inc.
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import fourierMakingWaves from '../fourierMakingWaves.js';
import FourierMakingWavesModel from './model/FourierMakingWavesModel.js';
import FourierMakingWavesScreenView from './view/FourierMakingWavesScreenView.js';

class FourierMakingWavesScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      //TODO if you include homeScreenIcon or navigationBarIcon, use JOIST/ScreenIcon
      backgroundColorProperty: new Property( 'white' ),
      tandem: tandem
    };

    super(
      () => new FourierMakingWavesModel( tandem.createTandem( 'model' ) ),
      model => new FourierMakingWavesScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

fourierMakingWaves.register( 'FourierMakingWavesScreen', FourierMakingWavesScreen );
export default FourierMakingWavesScreen;