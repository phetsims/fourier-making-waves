// Copyright 2021-2022, University of Colorado Boulder

/**
 * WaveGameKeyboardHelpContent is the content for the keyboard-help dialog in the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';

class WaveGameKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      textMaxWidth: 250
    }, options );

    const gameControlsHelpSection = new GameControlsHelpSection( {
      textMaxWidth: options.textMaxWidth
    } );
    const sliderHelpSection = new SliderControlsKeyboardHelpSection( options.sliderSectionOptions );
    const basicActionsHelpSection = new BasicActionsKeyboardHelpSection( options.generalSectionOptions );

    super( [ gameControlsHelpSection, sliderHelpSection ], [ basicActionsHelpSection ], options );
  }
}

/**
 * Hotkeys related to the game.
 */
class GameControlsHelpSection extends KeyboardHelpSection {
  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    // Alt+C
    const checkAnswerRow = KeyboardHelpSectionRow.createGlobalHotkeyRow(
      FourierMakingWavesStrings.keyboardHelpDialog.checkYourAnswerStringProperty,
      'C' );

    super( FourierMakingWavesStrings.keyboardHelpDialog.gameControlsStringProperty, [ checkAnswerRow ], options );
  }
}

fourierMakingWaves.register( 'WaveGameKeyboardHelpContent', WaveGameKeyboardHelpContent );
export default WaveGameKeyboardHelpContent;