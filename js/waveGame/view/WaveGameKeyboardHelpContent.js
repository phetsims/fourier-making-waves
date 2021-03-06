// Copyright 2021, University of Colorado Boulder

/**
 * WaveGameKeyboardHelpContent is the content for the keyboard-help dialog in the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import SliderAndGeneralKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/SliderAndGeneralKeyboardHelpContent.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class WaveGameKeyboardHelpContent extends SliderAndGeneralKeyboardHelpContent {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      labelMaxWidth: 250
    }, options );

    super( options );
  }
}

fourierMakingWaves.register( 'WaveGameKeyboardHelpContent', WaveGameKeyboardHelpContent );
export default WaveGameKeyboardHelpContent;