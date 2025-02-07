// Copyright 2020-2024, University of Colorado Boulder

/**
 * DiscreteInfoDialog is a dialog that shows a key to the math symbols used in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Dialog from '../../../../sun/js/Dialog.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWDerivedStrings from '../../common/FMWDerivedStrings.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';

// constants
const MAX_WIDTH = 800; // determined empirically

export default class DiscreteInfoDialog extends Dialog {

  public constructor( tandem: Tandem ) {

    const titleText = new Text( FourierMakingWavesStrings.symbolsDialog.titleStringProperty, {
      font: FMWConstants.DIALOG_TITLE_FONT,
      maxWidth: MAX_WIDTH
    } );

    // For each translated string describing a symbol, fill in the symbol.
    const stringProperties = [
      FMWDerivedStrings.ADescriptionStringProperty,
      FMWDerivedStrings.fDescriptionStringProperty,
      FMWDerivedStrings.lambdaDescriptionStringProperty,
      FMWDerivedStrings.kDescriptionStringProperty,
      FMWDerivedStrings.LDescriptionStringProperty,
      FMWDerivedStrings.nDescriptionStringProperty,
      FMWDerivedStrings.tDescriptionStringProperty,
      FMWDerivedStrings.TDescriptionStringProperty,
      FMWDerivedStrings.omegaDescriptionStringProperty,
      FMWDerivedStrings.xDescriptionStringProperty
    ];

    const richTextOptions = {
      font: FMWConstants.EQUATION_FONT
    };
    const children = stringProperties.map( stringProperty => new RichText( stringProperty, richTextOptions ) );

    const content = new VBox( {
      children: children,
      align: 'left',
      spacing: 11
    } );

    super( content, {

      // DialogOptions
      isDisposable: false,
      title: titleText,
      xSpacing: 30,
      cornerRadius: FMWConstants.PANEL_CORNER_RADIUS,
      tandem: tandem,
      phetioReadOnly: true
    } );
  }
}

fourierMakingWaves.register( 'DiscreteInfoDialog', DiscreteInfoDialog );