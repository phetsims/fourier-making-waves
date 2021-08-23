// Copyright 2021, University of Colorado Boulder

/**
 * SumSymbolNode displays a symbol that indicates a sum of quantities. It can use either the summation symbol
 * (sum of a small number of large quantities) or the integration symbol (sum of a large number of small quantities).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import merge from '../../../../phet-core/js/merge.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWSymbols from '../FMWSymbols.js';

// This extends Node instead of VBox so that the origin will be at the origin of symbolNode, useful for
// layout with other text.
class SumSymbolNode extends Node {

  /**
   * @param {string} indexSymbol - symbol for the index of summation
   * @param {number} indexMin - index min value
   * @param {Property.<number>} indexMaxProperty - index max value
   * @param {Object} [options]
   */
  constructor( indexSymbol, indexMin, indexMaxProperty, options ) {

    options = merge( {

      // SumSymbolNode options
      integration: false, // true=integration, false=summation
      fontSize: 30,
      indexFontSize: 12
    }, options );

    // The symbol for the type of sum.
    const symbolNode = new RichText( '', {
      font: new PhetFont( options.fontSize )
    } );

    const minMaxOptions = { font: new PhetFont( options.indexFontSize ) };

    // Index and min (starting) value, which appears below the sum symbol. E.g. 'n = 0'
    const minNode = new RichText( '', minMaxOptions );

    // Max (stopping) value, which appears above the sum symbol
    const maxNode = new Text( '', minMaxOptions );

    assert && assert( !options.children, 'SumSymbolNode sets children' );
    options.children = [ maxNode, symbolNode, minNode ];

    super( options );

    // @public true=integration, false=summation
    // dispose is required.
    this.integrationProperty = new BooleanProperty( options.integration );

    // Update the equation form and layout. dispose is required.
    const multilink = new Multilink(
      [ this.integrationProperty, indexMaxProperty ],
      ( integration, indexMax ) => {

        // update text
        if ( integration ) {
          symbolNode.text = FMWSymbols.integral;
          minNode.text = indexToString( indexMin );
        }
        else {
          symbolNode.text = FMWSymbols.SIGMA;
          minNode.text = `${indexSymbol} ${MathSymbols.EQUAL_TO} ${indexToString( indexMin )}`;
        }
        maxNode.text = indexToString( indexMax );

        // update layout
        // WARNING - magic numbers herein were arrived at empirically, tuned because RichText bounds are inaccurate
        if ( integration ) {
          minNode.left = symbolNode.right;
          minNode.bottom = symbolNode.bottom;
          maxNode.left = symbolNode.right + 3;
          maxNode.top = symbolNode.top - 5;
        }
        else {
          minNode.centerX = symbolNode.centerX;
          minNode.top = symbolNode.bottom - 3;
          maxNode.centerX = symbolNode.centerX;
          maxNode.bottom = symbolNode.top + 5;
        }
      } );

    // @private
    this.disposeSummationSymbolNode = () => {
      this.integrationProperty.dispose();
      multilink.dispose();
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

fourierMakingWaves.register( 'SumSymbolNode', SumSymbolNode );
export default SumSymbolNode;