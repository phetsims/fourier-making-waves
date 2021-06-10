// Copyright 2021, University of Colorado Boulder

/**
 * SumSymbolNode displays a symbol that indicates a sum of quantities. It can use either the summation symbol
 * (sum of a small number of large quantities) or the integration symbol (sum of a large number of small quantities).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import FMWSymbols from '../FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

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
      indexFontSize: 10,
      ySpacing: 0 // must work with both summation and integration symbols!
    }, options );

    // The symbol for the type of sum.
    const symbolNode = new RichText( '', {
      font: new PhetFont( options.fontSize )
    } );

    // true=integration, false=summation
    const integrationProperty = new BooleanProperty( options.integration );
    integrationProperty.link( integration => {
      symbolNode.text = integration ? FMWSymbols.integral : FMWSymbols.SIGMA;
    } );

    const minMaxOptions = { font: new PhetFont( options.indexFontSize ) };

    // Index and min (starting) value, which appears below the sum symbol. E.g. 'n = 0'
    const minNode = new RichText( `${indexSymbol} ${MathSymbols.EQUAL_TO} ${indexToString( indexMin )}`, minMaxOptions );

    // Max (stopping) value, which appears above the sum symbol
    const maxNode = new Text( '', minMaxOptions );
    const indexMaxListener = indexMax => {
      maxNode.text = indexToString( indexMax );
    };
    indexMaxProperty.link( indexMaxListener );

    assert && assert( !options.children, 'SumSymbolNode sets children' );
    options.children = [ maxNode, symbolNode, minNode ];

    super( options );

    // Update layout if subcomponents of this Node change size.
    Property.multilink(
      [ symbolNode.boundsProperty, minNode.boundsProperty, maxNode.boundsProperty ],
      () => {
        minNode.centerX = symbolNode.centerX;
        minNode.top = symbolNode.bottom + options.ySpacing;
        maxNode.centerX = symbolNode.centerX;
        maxNode.bottom = symbolNode.top - options.ySpacing;
      } );

    // @public
    this.integrationProperty = integrationProperty;

    // @private
    this.disposeSummationSymbolNode = () => {
      indexMaxProperty.unlink( indexMaxListener );
      this.integrationProperty.dispose();
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