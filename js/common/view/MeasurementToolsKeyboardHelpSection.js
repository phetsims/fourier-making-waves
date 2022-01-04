// Copyright 2021, University of Colorado Boulder

/**
 * MeasurementToolsKeyboardHelpSection provides keyboard help for the measurement tools that are found
 * in the 'Discrete' and 'Wave Packet' screens.
 *
 * Specification is in https://github.com/phetsims/fourier-making-waves/issues/168
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import KeyboardHelpIconFactory from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpIconFactory.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';

class MeasurementToolsKeyboardHelpSection extends KeyboardHelpSection {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    // {HelpSectionRow} First row, for normal motion
    const normalRow = KeyboardHelpSection.labelWithIcon(
      fourierMakingWavesStrings.keyboardHelpDialog.moveTool,
      KeyboardHelpIconFactory.arrowOrWasdKeysRowIcon(), {
        labelInnerContent: fourierMakingWavesStrings.a11y.keyboardHelpDialog.moveToolSlowerDescription
      } );

    // {HelpSectionRow} Second row, for slower motion
    const slowerRow = KeyboardHelpSection.labelWithIconList(
      fourierMakingWavesStrings.keyboardHelpDialog.moveToolSlower,
      [
        KeyboardHelpIconFactory.shiftPlusIcon( KeyboardHelpIconFactory.arrowKeysRowIcon() ),
        KeyboardHelpIconFactory.shiftPlusIcon( KeyboardHelpIconFactory.wasdRowIcon() )
      ], {
        labelInnerContent: fourierMakingWavesStrings.a11y.keyboardHelpDialog.moveToolDescription
      } );

    super( fourierMakingWavesStrings.keyboardHelpDialog.measurementTools, [ normalRow, slowerRow ], options );
  }
}

fourierMakingWaves.register( 'MeasurementToolsKeyboardHelpSection', MeasurementToolsKeyboardHelpSection );
export default MeasurementToolsKeyboardHelpSection;