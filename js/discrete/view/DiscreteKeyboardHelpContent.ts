// Copyright 2021-2023, University of Colorado Boulder

/**
 * DiscreteKeyboardHelpContent is the content for the keyboard-help dialog in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import MeasurementToolsKeyboardHelpSection from '../../common/view/MeasurementToolsKeyboardHelpSection.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

export default class DiscreteKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  constructor() {

    const leftSections = [
      new MeasurementToolsKeyboardHelpSection(),
      new SliderControlsKeyboardHelpSection()
    ];

    const rightSections = [
      new BasicActionsKeyboardHelpSection( {
        withCheckboxContent: true
      } )
    ];

    super( leftSections, rightSections );

    this.disposeDiscreteKeyboardHelpContent = () => {
      leftSections.forEach( section => section.dispose() );
      rightSections.forEach( section => section.dispose() );
    };
  }

  // @public @override
  dispose() {
    this.disposeDiscreteKeyboardHelpContent();
    super.dispose();
  }
}

fourierMakingWaves.register( 'DiscreteKeyboardHelpContent', DiscreteKeyboardHelpContent );