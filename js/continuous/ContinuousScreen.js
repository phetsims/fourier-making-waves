// Copyright 2020-2021, University of Colorado Boulder

/**
 * ContinuousScreen is the 'Continuous' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import Screen from '../../../joist/js/Screen.js';
import merge from '../../../phet-core/js/merge.js';
import GeneralKeyboardHelpSection from '../../../scenery-phet/js/keyboard/help/GeneralKeyboardHelpSection.js';
import Tandem from '../../../tandem/js/Tandem.js';
import FMWColorProfile from '../common/FMWColorProfile.js';
import fourierMakingWaves from '../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../fourierMakingWavesStrings.js';
import ContinuousModel from './model/ContinuousModel.js';
import ContinuousScreenView from './view/ContinuousScreenView.js';

class ContinuousScreen extends Screen {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // Screen options
      name: fourierMakingWavesStrings.screen.continuous,
      backgroundColorProperty: FMWColorProfile.screenBackgroundColorProperty,
      //TODO add homeScreenIcon using ScreenIcon, see https://github.com/phetsims/fourier-making-waves/issues/44

      // pdom
      keyboardHelpNode: new GeneralKeyboardHelpSection( {
        labelMaxWidth: 250,
        withCheckboxContent: true
      } ),

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    super(
      () => new ContinuousModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new ContinuousScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
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