// Copyright 2020-2021, University of Colorado Boulder

/**
 * DiscreteScreen is the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import Screen from '../../../joist/js/Screen.js';
import merge from '../../../phet-core/js/merge.js';
import Tandem from '../../../tandem/js/Tandem.js';
import FMWColorProfile from '../common/FMWColorProfile.js';
import FMWIconFactory from '../common/view/FMWIconFactory.js';
import fourierMakingWaves from '../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../fourierMakingWavesStrings.js';
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
      name: fourierMakingWavesStrings.screen.discrete,
      backgroundColorProperty: FMWColorProfile.screenBackgroundColorProperty,
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

  //TODO https://github.com/phetsims/fourier-making-waves/issues/101 this is a temporary workaround, do not publish
  /**
   * @public (joist-internal) TODO internal to joist, should not be using this in sim code
   */
  initializeModel() {
    super.initializeModel();

    // Sound for the Fourier series is a continuous tone, and it's specific to the Discrete screen.
    // soundManager provides no support for screen-specific sounds, so we have to manage this ourselves.
    // Otherwise the sound will continue to play when we switch to another screen.
    // See https://github.com/phetsims/fourier-making-waves/issues/101
    let fourierSeriesSoundEnabled = this.model.fourierSeriesSoundEnabledProperty.value;
    phet.joist.sim.screenProperty.link( screen => {
      if ( screen === this ) {
        this.model.fourierSeriesSoundEnabledProperty.value = fourierSeriesSoundEnabled;
      }
      else {
        fourierSeriesSoundEnabled = this.model.fourierSeriesSoundEnabledProperty.value;
        this.model.fourierSeriesSoundEnabledProperty.value = false;
      }
    } );
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