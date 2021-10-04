// Copyright 2021, University of Colorado Boulder

/**
 * WaveGameKeyboardHelpContent is the content for the keyboard-help dialog in the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import GeneralKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/GeneralKeyboardHelpSection.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import SliderKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import LetterKeyNode from '../../../../scenery-phet/js/keyboard/LetterKeyNode.js';
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
    const sliderHelpSection = new SliderKeyboardHelpSection( options.sliderSectionOptions );
    const generalNavigationHelpSection = new GeneralKeyboardHelpSection( options.generalSectionOptions );

    super( [ gameControlsHelpSection, sliderHelpSection ], [ generalNavigationHelpSection ], options );
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

    const checkAnswerRow = KeyboardHelpSection.createGlobalHotkeyRow(
      fourierMakingWavesStrings.keyboardHelpDialog.checkYourAnswer,
      fourierMakingWavesStrings.a11y.keyboardHelpDialog.checkYourAnswerDescription,
      new LetterKeyNode( 'C' )
    );

    super( fourierMakingWavesStrings.keyboardHelpDialog.gameControls, [ checkAnswerRow ], options );
  }
}

fourierMakingWaves.register( 'WaveGameKeyboardHelpContent', WaveGameKeyboardHelpContent );
export default WaveGameKeyboardHelpContent;