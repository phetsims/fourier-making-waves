// Copyright 2021-2023, University of Colorado Boulder

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
import SceneryPhetStrings from '../../../../scenery-phet/js/SceneryPhetStrings.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';

export default class WaveGameKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  private readonly disposeWaveGameKeyboardHelpContent: () => void;

  public constructor() {

    const leftSections = [
      new GameControlsHelpSection(),
      new SliderControlsKeyboardHelpSection()
    ];

    const rightSections = [
      new BasicActionsKeyboardHelpSection()
    ];

    super( leftSections, rightSections );

    this.disposeWaveGameKeyboardHelpContent = () => {
      leftSections.forEach( section => section.dispose() );
      rightSections.forEach( section => section.dispose() );
    };
  }

  public override dispose(): void {
    this.disposeWaveGameKeyboardHelpContent();
    super.dispose();
  }
}

/**
 * Hotkeys related to the game.
 */
class GameControlsHelpSection extends KeyboardHelpSection {

  private readonly disposeGameControlsHelpSection: () => void;

  public constructor() {

    // Alt+C
    const checkAnswerRow = KeyboardHelpSectionRow.createGlobalHotkeyRow(
      FourierMakingWavesStrings.keyboardHelpDialog.checkYourAnswerStringProperty,
      SceneryPhetStrings.key.cStringProperty );

    super( FourierMakingWavesStrings.keyboardHelpDialog.gameControlsStringProperty, [ checkAnswerRow ], {
      textMaxWidth: 250
    } );

    this.disposeGameControlsHelpSection = () => {
      checkAnswerRow.dispose();
    };
  }

  public override dispose(): void {
    this.disposeGameControlsHelpSection();
    super.dispose();
  }
}

fourierMakingWaves.register( 'WaveGameKeyboardHelpContent', WaveGameKeyboardHelpContent );