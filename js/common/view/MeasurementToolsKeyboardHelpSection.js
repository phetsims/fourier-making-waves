// Copyright 2021-2023, University of Colorado Boulder

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

export default class MeasurementToolsKeyboardHelpSection extends KeyboardHelpSection {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    // arrows or WASD
    const arrowOrWASDKeysRowIcon = KeyboardHelpIconFactory.arrowOrWasdKeysRowIcon();
    const normalRow = KeyboardHelpSectionRow.labelWithIcon(
      FourierMakingWavesStrings.keyboardHelpDialog.moveToolStringProperty,
      arrowOrWASDKeysRowIcon );

    // Shift+arrows or Shift+WASD
    const arrowKeysIcon = KeyboardHelpIconFactory.arrowKeysRowIcon();
    const wasdKeysIcon = KeyboardHelpIconFactory.wasdRowIcon();
    const shiftPlusArrowsIcon = KeyboardHelpIconFactory.shiftPlusIcon( arrowKeysIcon );
    const shiftPlusWASDsIcon = KeyboardHelpIconFactory.shiftPlusIcon( wasdKeysIcon );
    const slowerRow = KeyboardHelpSectionRow.labelWithIconList(
      FourierMakingWavesStrings.keyboardHelpDialog.moveToolSlowerStringProperty,
      [
        shiftPlusArrowsIcon,
        shiftPlusWASDsIcon
      ] );

    super( FourierMakingWavesStrings.keyboardHelpDialog.measurementToolsStringProperty, [ normalRow, slowerRow ], options );

    this.disposeEmitter.addListener( () => {
      shiftPlusArrowsIcon.dispose();
      shiftPlusWASDsIcon.dispose();
      arrowKeysIcon.dispose();
      wasdKeysIcon.dispose();
      arrowOrWASDKeysRowIcon.dispose();
    } );
  }
}

fourierMakingWaves.register( 'MeasurementToolsKeyboardHelpSection', MeasurementToolsKeyboardHelpSection );