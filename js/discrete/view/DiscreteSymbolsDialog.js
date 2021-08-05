// Copyright 2020-2021, University of Colorado Boulder

/**
 * DiscreteSymbolsDialog is a dialog that shows a key to the symbols used in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Dialog from '../../../../sun/js/Dialog.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';

// constants
const MAX_WIDTH = 800; // determined empirically

class DiscreteSymbolsDialog extends Dialog {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // Dialog options
      xSpacing: 30,
      cornerRadius: FMWConstants.PANEL_CORNER_RADIUS
    }, options );

    assert && assert( !options.title, 'DiscreteSymbolsDialog sets children' );
    options.title = new Text( fourierMakingWavesStrings.symbolsDialog.title, {
      font: FMWConstants.DIALOG_TITLE_FONT,
      maxWidth: MAX_WIDTH
    } );

    // For each translated string describing a symbol, fill in the symbol.
    const strings = [
      StringUtils.fillIn( fourierMakingWavesStrings.symbolsDialog.A, { A: FMWSymbols.A } ),
      StringUtils.fillIn( fourierMakingWavesStrings.symbolsDialog.f, { f: FMWSymbols.f } ),
      StringUtils.fillIn( fourierMakingWavesStrings.symbolsDialog.lambda, { lambda: FMWSymbols.lambda } ),
      StringUtils.fillIn( fourierMakingWavesStrings.symbolsDialog.k, { k: FMWSymbols.k } ),
      StringUtils.fillIn( fourierMakingWavesStrings.symbolsDialog.L, { L: FMWSymbols.L } ),
      StringUtils.fillIn( fourierMakingWavesStrings.symbolsDialog.n, { n: FMWSymbols.n } ),
      StringUtils.fillIn( fourierMakingWavesStrings.symbolsDialog.t, { t: FMWSymbols.t } ),
      StringUtils.fillIn( fourierMakingWavesStrings.symbolsDialog.T, { T: FMWSymbols.T } ),
      StringUtils.fillIn( fourierMakingWavesStrings.symbolsDialog.omega, { omega: FMWSymbols.omega } ),
      StringUtils.fillIn( fourierMakingWavesStrings.symbolsDialog.x, { x: FMWSymbols.x } )
    ];

    // RichText markup with one symbol's key per line
    let text = '';
    for ( let i = 0; i < strings.length; i++ ) {
      text += strings[ i ];
      if ( i < strings.length - 1 ) {
        text += '<br>';
      }
    }

    const richText = new RichText( text, {
      font: FMWConstants.EQUATION_FONT,
      leading: 11
    } );

    super( richText, options );
  }
}

fourierMakingWaves.register( 'DiscreteSymbolsDialog', DiscreteSymbolsDialog );
export default DiscreteSymbolsDialog;