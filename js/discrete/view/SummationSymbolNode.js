// Copyright 2020, University of Colorado Boulder

/**
 * SummationSymbolNode displays a typical summation symbol, showing the index symbol and range of the index.
 * I briefly considered using FormulaNode (which uses katex) here, but was dissuaded by the experience of other
 * developers, and the prospective of adding katex solely for this symbol.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

//TODO extends Node instead of VBox, so we can use align: 'origin' in SumEquationNode and have more control over spacing
class SummationSymbolNode extends VBox {

  /**
   * @param {string} indexSymbol - symbol for the index of summation
   * @param {Range} indexRange - range of the index
   * @param {Object} [options]
   */
  constructor( indexSymbol, indexRange, options ) {

    options = merge( {
      fontSize: 30,
      indexFontSize: 10,

      // VBox options
      spacing: 0
    }, options );

    // Capital sigma, the summation character
    const sigmaNode = new RichText( FMWSymbols.CAPITAL_SIGMA, {
      font: new PhetFont( options.fontSize )
    } );

    const indexTextOptions = {
      font: new PhetFont( options.indexFontSize )
    };

    // Index and min (starting) value, which appears below the sigma character
    const minNode = new RichText( `${indexSymbol} ${MathSymbols.EQUAL_TO} ${indexRange.min}`, indexTextOptions );

    // Max (stopping) value, which appears above the sigma character
    const maxNode = new Text( `${indexRange.max}`, indexTextOptions );

    assert && assert( !options.children, 'SummationSymbolNode sets children' );
    options.children = [ maxNode, sigmaNode, minNode ];

    super( options );
  }
}

fourierMakingWaves.register( 'SummationSymbolNode', SummationSymbolNode );
export default SummationSymbolNode;