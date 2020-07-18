// Copyright 2020, University of Colorado Boulder

/**
 * ContinuousScreen is the 'Continuous' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import Screen from '../../../joist/js/Screen.js';
import FourierMakingWavesColors from '../common/FourierMakingWavesColors.js';
import fourierMakingWaves from '../fourierMakingWaves.js';
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
      backgroundColorProperty: FourierMakingWavesColors.SCREEN_VIEW_BACKGROUND,
      tandem: tandem
    };

    super(
      () => new ContinuousModel( tandem.createTandem( 'model' ) ),
      model => new ContinuousScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

fourierMakingWaves.register( 'ContinuousScreen', ContinuousScreen );
export default ContinuousScreen;