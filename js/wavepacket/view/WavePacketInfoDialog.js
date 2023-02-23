// Copyright 2020-2023, University of Colorado Boulder

/**
 * WavePacketInfoDialog is a dialog that shows a key to the math symbols used in the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import { RichText, Text } from '../../../../scenery/js/imports.js';
import Dialog from '../../../../sun/js/Dialog.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';

// constants
const MAX_WIDTH = 800; // determined empirically

export default class WavePacketInfoDialog extends Dialog {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // Dialog options
      xSpacing: 30,
      cornerRadius: FMWConstants.PANEL_CORNER_RADIUS,

      // phet-io
      phetioReadOnly: true
    }, options );

    assert && assert( !options.title, 'WavePacketInfoDialog sets children' );
    options.title = new Text( FourierMakingWavesStrings.symbolsDialog.titleStringProperty, {
      font: FMWConstants.DIALOG_TITLE_FONT,
      maxWidth: MAX_WIDTH
    } );

    // For each translated string describing a symbol, fill in the symbol.
    const stringProperties = [
      new PatternStringProperty( FourierMakingWavesStrings.symbolsDialog.AStringProperty, {
        A: FMWSymbols.AStringProperty
      } ),
      new PatternStringProperty( FourierMakingWavesStrings.symbolsDialog.lambdaStringProperty, {
        lambda: FMWSymbols.lambdaStringProperty
      } ),
      new PatternStringProperty( FourierMakingWavesStrings.symbolsDialog.kStringProperty, {
        k: FMWSymbols.kStringProperty
      } ),
      new PatternStringProperty( FourierMakingWavesStrings.symbolsDialog.sigmaStringProperty, {
        sigma: FMWSymbols.sigmaStringProperty
      } ),
      new PatternStringProperty( FourierMakingWavesStrings.symbolsDialog.nStringProperty, {
        n: FMWSymbols.nStringProperty
      } ),
      new PatternStringProperty( FourierMakingWavesStrings.symbolsDialog.tStringProperty, {
        t: FMWSymbols.tStringProperty
      } ),
      new PatternStringProperty( FourierMakingWavesStrings.symbolsDialog.TStringProperty, {
        T: FMWSymbols.TStringProperty
      } ),
      new PatternStringProperty( FourierMakingWavesStrings.symbolsDialog.omegaStringProperty, {
        omega: FMWSymbols.omegaStringProperty
      } ),
      new PatternStringProperty( FourierMakingWavesStrings.symbolsDialog.xStringProperty, {
        x: FMWSymbols.xStringProperty
      } )
    ];

    // Put a line break between each of the above strings.
    const stringProperty = DerivedProperty.deriveAny( stringProperties,
      () => stringProperties.map( p => p.value ).join( '<br>' ) );

    // RichText with one symbol's key per line
    const richText = new RichText( stringProperty, {
      font: FMWConstants.EQUATION_FONT,
      leading: 11
    } );

    super( richText, options );
  }
}

fourierMakingWaves.register( 'WavePacketInfoDialog', WavePacketInfoDialog );