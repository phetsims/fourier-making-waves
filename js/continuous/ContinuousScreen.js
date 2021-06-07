// Copyright 2020-2021, University of Colorado Boulder

/**
 * ContinuousScreen is the 'Continuous' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import merge from '../../../phet-core/js/merge.js';
import SliderAndGeneralKeyboardHelpContent from '../../../scenery-phet/js/keyboard/help/SliderAndGeneralKeyboardHelpContent.js';
import Image from '../../../scenery/js/nodes/Image.js';
import Tandem from '../../../tandem/js/Tandem.js';
import continuousHomeScreenImage from '../../images/Continuous-home-screen-icon_png.js';
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
      homeScreenIcon: createHomeScreenIcon(),

      // pdom
      keyboardHelpNode: new SliderAndGeneralKeyboardHelpContent( {
        labelMaxWidth: 250,
        generalSectionOptions: {
          withCheckboxContent: true
        }
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

//TODO delete Continuous-home-screen-icon.png if it is not used
/**
 * Creates the Home screen icon for this screen.
 * @returns {ScreenIcon}
 */
function createHomeScreenIcon() {
  const iconNode = new Image( continuousHomeScreenImage );
  return new ScreenIcon( iconNode, {
    fill: FMWColorProfile.screenBackgroundColorProperty
  } );
}

fourierMakingWaves.register( 'ContinuousScreen', ContinuousScreen );
export default ContinuousScreen;