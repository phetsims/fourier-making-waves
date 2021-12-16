// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketKeyboardHelpContent is the content for the keyboard-help dialog in the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import SliderKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import MeasurementToolsKeyboardHelpSection from '../../common/view/MeasurementToolsKeyboardHelpSection.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class WavePacketKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

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

    const measurementToolsHelpSection = new MeasurementToolsKeyboardHelpSection();
    const sliderHelpSection = new SliderKeyboardHelpSection( options.sliderSectionOptions );
    const basicActionsHelpSection = new BasicActionsKeyboardHelpSection( options.generalSectionOptions );

    super( [ measurementToolsHelpSection, sliderHelpSection ], [ basicActionsHelpSection ], options );
  }
}

fourierMakingWaves.register( 'WavePacketKeyboardHelpContent', WavePacketKeyboardHelpContent );
export default WavePacketKeyboardHelpContent;