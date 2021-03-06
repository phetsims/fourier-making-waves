// Copyright 2021, University of Colorado Boulder

/**
 * DiscreteKeyboardHelpContent is the content for the keyboard-help dialog in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import SliderAndGeneralKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/SliderAndGeneralKeyboardHelpContent.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class DiscreteKeyboardHelpContent extends SliderAndGeneralKeyboardHelpContent {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      labelMaxWidth: 250,
      generalSectionOptions: {
        withCheckboxContent: true
      }
    }, options );

    super( options );
  }
}

fourierMakingWaves.register( 'DiscreteKeyboardHelpContent', DiscreteKeyboardHelpContent );
export default DiscreteKeyboardHelpContent;