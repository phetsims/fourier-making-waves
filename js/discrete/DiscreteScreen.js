// Copyright 2020, University of Colorado Boulder

/**
 * DiscreteScreen is the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import Screen from '../../../joist/js/Screen.js';
import FourierMakingWavesColors from '../common/FourierMakingWavesColors.js';
import fourierMakingWaves from '../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../fourierMakingWavesStrings.js';
import DiscreteModel from './model/DiscreteModel.js';
import DiscreteScreenView from './view/DiscreteScreenView.js';

class DiscreteScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      //TODO if you include homeScreenIcon or navigationBarIcon, use JOIST/ScreenIcon
      name: fourierMakingWavesStrings.screen.discrete,
      backgroundColorProperty: FourierMakingWavesColors.SCREEN_VIEW_BACKGROUND,
      tandem: tandem
    };

    super(
      () => new DiscreteModel( tandem.createTandem( 'model' ) ),
      model => new DiscreteScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

fourierMakingWaves.register( 'DiscreteScreen', DiscreteScreen );
export default DiscreteScreen;