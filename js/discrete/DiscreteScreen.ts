// Copyright 2020-2023, University of Colorado Boulder

/**
 * DiscreteScreen is the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import Screen from '../../../joist/js/Screen.js';
import Tandem from '../../../tandem/js/Tandem.js';
import FMWColors from '../common/FMWColors.js';
import FMWIconFactory from '../common/view/FMWIconFactory.js';
import fourierMakingWaves from '../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../FourierMakingWavesStrings.js';
import DiscreteModel from './model/DiscreteModel.js';
import DiscreteKeyboardHelpContent from './view/DiscreteKeyboardHelpContent.js';
import DiscreteScreenView from './view/DiscreteScreenView.js';

export default class DiscreteScreen extends Screen<DiscreteModel, DiscreteScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {
      name: FourierMakingWavesStrings.screen.discreteStringProperty,
      backgroundColorProperty: FMWColors.discreteScreenBackgroundColorProperty,
      homeScreenIcon: FMWIconFactory.createDiscreteHomeScreenIcon(),
      createKeyboardHelpNode: () => new DiscreteKeyboardHelpContent(),
      tandem: tandem
    };

    super(
      () => new DiscreteModel( options.tandem.createTandem( 'model' ) ),
      model => new DiscreteScreenView( model, options.tandem.createTandem( 'view' ) ),
      options
    );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

fourierMakingWaves.register( 'DiscreteScreen', DiscreteScreen );