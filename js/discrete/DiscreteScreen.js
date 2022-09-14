// Copyright 2020-2021, University of Colorado Boulder

/**
 * DiscreteScreen is the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import Screen from '../../../joist/js/Screen.js';
import merge from '../../../phet-core/js/merge.js';
import Tandem from '../../../tandem/js/Tandem.js';
import FMWColors from '../common/FMWColors.js';
import FMWIconFactory from '../common/view/FMWIconFactory.js';
import fourierMakingWaves from '../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../FourierMakingWavesStrings.js';
import DiscreteModel from './model/DiscreteModel.js';
import DiscreteKeyboardHelpContent from './view/DiscreteKeyboardHelpContent.js';
import DiscreteScreenView from './view/DiscreteScreenView.js';

class DiscreteScreen extends Screen {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // Screen options
      name: FourierMakingWavesStrings.screen.discreteStringProperty,
      backgroundColorProperty: FMWColors.discreteScreenBackgroundColorProperty,
      homeScreenIcon: FMWIconFactory.createDiscreteHomeScreenIcon(),

      // pdom options
      keyboardHelpNode: new DiscreteKeyboardHelpContent(),

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    super(
      () => new DiscreteModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new DiscreteScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
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