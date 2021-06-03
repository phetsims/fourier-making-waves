// Copyright 2020-2021, University of Colorado Boulder

//TODO move to common/
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
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

// This extends Node instead of VBox so that the origin will be at the origin of sigma, useful for layout with other text.
class SummationSymbolNode extends Node {

  /**
   * @param {string} indexSymbol - symbol for the index of summation
   * @param {number} indexMin - index min value
   * @param {Property.<number>} indexMaxProperty - index max value
   * @param {Object} [options]
   */
  constructor( indexSymbol, indexMin, indexMaxProperty, options ) {

    options = merge( {

      // SummationSymbolNode options
      fontSize: 30,
      indexFontSize: 10,
      spacing: -4 // yes, this is a weird default, determined empirically
    }, options );

    // Capital sigma, the summation character
    const sigmaNode = new RichText( FMWSymbols.SIGMA, {
      font: new PhetFont( options.fontSize )
    } );

    const indexFont = new PhetFont( options.indexFontSize );

    // Index and min (starting) value, which appears below the sigma character
    const minNode = new RichText( `${indexSymbol} ${MathSymbols.EQUAL_TO} ${indexToString( indexMin )}`, {
      font: indexFont,
      centerX: sigmaNode.centerX,
      top: sigmaNode.bottom + options.spacing
    } );

    // Max (stopping) value, which appears above the sigma character
    const maxNode = new Text( '', {
      font: indexFont
    } );

    assert && assert( !options.children, 'SummationSymbolNode sets children' );
    options.children = [ maxNode, sigmaNode, minNode ];

    super( options );

    const indexMaxListener = indexMax => {
      maxNode.text = indexToString( indexMaxProperty.value );
      maxNode.centerX = sigmaNode.centerX;
      maxNode.bottom = sigmaNode.top - options.spacing;
    };
    indexMaxProperty.link( indexMaxListener );

    // @private
    this.disposeSummationSymbolNode = () => {
      indexMaxProperty.unlink( indexMaxListener );
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeSummationSymbolNode();
    super.dispose();
  }
}

/**
 * Converts a summation index to a string.
 * @param {number} index
 * @returns {string}
 */
function indexToString( index ) {
  if ( index === Infinity ) {
    return `${MathSymbols.INFINITY}`;
  }
  else if ( index === -Infinity ) {
    return `-${MathSymbols.INFINITY}`;
  }
  else {
    return `${index}`;
  }
}

fourierMakingWaves.register( 'SummationSymbolNode', SummationSymbolNode );
export default SummationSymbolNode;