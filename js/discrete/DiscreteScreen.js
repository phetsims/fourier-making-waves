// Copyright 2020, University of Colorado Boulder

/**
 * DiscreteScreen is the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import Screen from '../../../joist/js/Screen.js';
import fourierMakingWaves from '../fourierMakingWaves.js';
import FMWColorProfile from '../common/FMWColorProfile.js';
import fourierMakingWavesStrings from '../fourierMakingWavesStrings.js';
import DiscreteModel from './model/DiscreteModel.js';
import DiscreteScreenView from './view/DiscreteScreenView.js';

class DiscreteScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      //TODO add homeScreenIcon using ScreenIcon, see https://github.com/phetsims/fourier-making-waves/issues/44
      name: fourierMakingWavesStrings.screen.discrete,
      backgroundColorProperty: FMWColorProfile.screenBackgroundColorProperty,
      tandem: tandem
    };

    super(
      () => new DiscreteModel( tandem.createTandem( 'model' ) ),
      model => new DiscreteScreenView( model, tandem.createTandem( 'view' ) ),
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

fourierMakingWaves.register( 'DiscreteScreen', DiscreteScreen );
export default DiscreteScreen;