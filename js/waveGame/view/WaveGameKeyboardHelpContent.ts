// Copyright 2021-2024, University of Colorado Boulder

/**
 * WaveGameKeyboardHelpContent is the content for the keyboard-help dialog in the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';
import WaveGameLevelNode from './WaveGameLevelNode.js';

export default class WaveGameKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  public constructor() {

    const leftSections = [
      new GameControlsHelpSection(),
      new SliderControlsKeyboardHelpSection()
    ];

    const rightSections = [
      new BasicActionsKeyboardHelpSection()
    ];

    super( leftSections, rightSections, {
      isDisposable: false // See https://github.com/phetsims/fourier-making-waves/issues/236
    } );
  }
}

/**
 * Hotkeys related to the game.
 */
class GameControlsHelpSection extends KeyboardHelpSection {

  public constructor() {

    // Alt+C
    const checkAnswerRow = KeyboardHelpSectionRow.fromHotkeyData( WaveGameLevelNode.CHECK_ANSWER_HOTKEY_DATA );
    super( FourierMakingWavesStrings.keyboardHelpDialog.gameControlsStringProperty, [ checkAnswerRow ], {
      textMaxWidth: 250,
      isDisposable: false // See https://github.com/phetsims/fourier-making-waves/issues/236
    } );
  }
}

fourierMakingWaves.register( 'WaveGameKeyboardHelpContent', WaveGameKeyboardHelpContent );