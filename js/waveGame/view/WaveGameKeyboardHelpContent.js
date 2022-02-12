// Copyright 2021-2022, University of Colorado Boulder

/**
 * WaveGameKeyboardHelpContent is the content for the keyboard-help dialog in the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';

class WaveGameKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      labelMaxWidth: 250
    }, options );

    const gameControlsHelpSection = new GameControlsHelpSection( {
      labelMaxWidth: options.labelMaxWidth
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
    const checkAnswerRow = KeyboardHelpSection.createGlobalHotkeyRow(
      fourierMakingWavesStrings.keyboardHelpDialog.checkYourAnswer,
      'C' );

    super( fourierMakingWavesStrings.keyboardHelpDialog.gameControls, [ checkAnswerRow ], options );
  }
}

fourierMakingWaves.register( 'WaveGameKeyboardHelpContent', WaveGameKeyboardHelpContent );
export default WaveGameKeyboardHelpContent;