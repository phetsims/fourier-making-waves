// Copyright 2020-2023, University of Colorado Boulder

/**
 * DiscreteInfoDialog is a dialog that shows a key to the math symbols used in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { RichText, Text } from '../../../../scenery/js/imports.js';
import Dialog from '../../../../sun/js/Dialog.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWDerivedStrings from '../../common/FMWDerivedStrings.js';

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

    // Put a line break between each of the above strings.
    const stringProperty = DerivedProperty.deriveAny( stringProperties,
      () => stringProperties.map( p => p.value ).join( '<br>' ) );

    // RichText with one symbol's key per line
    const richText = new RichText( stringProperty, {
      font: FMWConstants.EQUATION_FONT,
      leading: 11
    } );

    super( richText, {

      // DialogOptions
      title: titleText,
      xSpacing: 30,
      cornerRadius: FMWConstants.PANEL_CORNER_RADIUS,
      tandem: tandem,
      phetioReadOnly: true
    } );
  }
}

fourierMakingWaves.register( 'DiscreteInfoDialog', DiscreteInfoDialog );