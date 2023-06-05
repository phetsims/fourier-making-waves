// Copyright 2020-2023, University of Colorado Boulder

/**
 * WavePacketInfoDialog is a dialog that shows a key to the math symbols used in the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import Dialog from '../../../../sun/js/Dialog.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWDerivedStrings from '../../common/FMWDerivedStrings.js';

// constants
const MAX_WIDTH = 800; // determined empirically

export default class WavePacketInfoDialog extends Dialog {

  public constructor( tandem: Tandem ) {

    const titleText = new Text( FourierMakingWavesStrings.symbolsDialog.titleStringProperty, {
      font: FMWConstants.DIALOG_TITLE_FONT,
      maxWidth: MAX_WIDTH
    } );

    // For each translated string describing a symbol, fill in the symbol.
    const stringProperties = [
      FMWDerivedStrings.ADescriptionStringProperty,
      FMWDerivedStrings.lambdaDescriptionStringProperty,
      FMWDerivedStrings.kDescriptionStringProperty,
      FMWDerivedStrings.sigmaDescriptionStringProperty,
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
      title: titleText,
      xSpacing: 30,
      cornerRadius: FMWConstants.PANEL_CORNER_RADIUS,
      tandem: tandem,
      phetioReadOnly: true
    } );
  }
}

fourierMakingWaves.register( 'WavePacketInfoDialog', WavePacketInfoDialog );