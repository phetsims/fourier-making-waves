// Copyright 2021-2022, University of Colorado Boulder

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
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';

class MeasurementToolsKeyboardHelpSection extends KeyboardHelpSection {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    // arrows or WASD
    const normalRow = KeyboardHelpSectionRow.labelWithIcon(
      FourierMakingWavesStrings.keyboardHelpDialog.moveToolStringProperty,
      KeyboardHelpIconFactory.arrowOrWasdKeysRowIcon() );

    // Shift+arrows or Shift+WASD
    const slowerRow = KeyboardHelpSectionRow.labelWithIconList(
      FourierMakingWavesStrings.keyboardHelpDialog.moveToolSlowerStringProperty,
      [
        KeyboardHelpIconFactory.shiftPlusIcon( KeyboardHelpIconFactory.arrowKeysRowIcon() ),
        KeyboardHelpIconFactory.shiftPlusIcon( KeyboardHelpIconFactory.wasdRowIcon() )
      ] );

    super( FourierMakingWavesStrings.keyboardHelpDialog.measurementToolsStringProperty, [ normalRow, slowerRow ], options );
  }
}

fourierMakingWaves.register( 'MeasurementToolsKeyboardHelpSection', MeasurementToolsKeyboardHelpSection );
export default MeasurementToolsKeyboardHelpSection;