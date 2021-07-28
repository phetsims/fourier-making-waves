// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketSumEquationNode is the equation that appears above the 'Sum' chart in the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import Domain from '../../common/model/Domain.js';
import SeriesType from '../../common/model/SeriesType.js';
import SumSymbolNode from '../../common/view/SumSymbolNode.js';
import EquationMarkup from '../../discrete/view/EquationMarkup.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

// To improve readability of markup creation. Each of these is a string than may also include markup.
const EQUAL_TO = MathSymbols.EQUAL_TO;
const n = FMWSymbols.n;

class WavePacketSumEquationNode extends Node {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<SeriesType>} seriesTypeProperty
   * @param {Property.<number>} componentSpacingProperty
   * @param {Object} [options]
   */
  constructor( domainProperty, seriesTypeProperty, componentSpacingProperty, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertEnumerationPropertyOf( seriesTypeProperty, SeriesType );
    assert && AssertUtils.assertPropertyOf( componentSpacingProperty, 'number' );

    options = merge( {

      // WavePacketSumEquationNode options
      font: FMWConstants.EQUATION_FONT
    }, options );

    // Everything to the left of the summation symbol, set in domainProperty listener below.
    const leftNode = new RichText( '', {
      font: options.font
    } );

    // Capital sigma, summation symbol
    const sumSymbolNode = new SumSymbolNode( n, -Infinity, new NumberProperty( Infinity ), {
      font: options.font
    } );

    // Everything to the right of the summation symbol, same as the equation above the Components chart.
    const rightNode = new RichText( '', {
      font: options.font
    } );

    assert && assert( !options.children, 'WavePacketSumEquationNode sets children' );
    options.children = [ leftNode, sumSymbolNode, rightNode ];

    super( options );

    Property.multilink(
      [ domainProperty, seriesTypeProperty, componentSpacingProperty ],
      ( domain, seriesType, componentSpacing ) => {

        // Update the left side of the equation to match the domain.
        leftNode.text = `${EquationMarkup.getFunctionOfMarkup( domain )} ${EQUAL_TO}`; // F(...) =

        const hasInfiniteComponents = ( componentSpacing === 0 );

        // Summation vs integration
        sumSymbolNode.integrationProperty.value = hasInfiniteComponents;

        // Right side of the equation
        if ( hasInfiniteComponents ) {

          // Infinite number of components
          const domainSymbol = ( domain === Domain.SPACE ) ? FMWSymbols.x : FMWSymbols.t;
          const componentSymbol = ( domain === Domain.SPACE ) ? FMWSymbols.k : FMWSymbols.omega;
          const seriesTypeString = ( seriesType === SeriesType.SINE ) ? FMWSymbols.sin : FMWSymbols.cos;
          rightNode.text = `${FMWSymbols.A}(${componentSymbol}) ` +
                           `${seriesTypeString}( ${componentSymbol}${domainSymbol} ) ${FMWSymbols.d}${componentSymbol}`;
        }
        else {

          // Finite number of components, use same equation as above the Components chart.
          rightNode.text = EquationMarkup.getComponentsEquationMarkup( domain, seriesType );
        }
      }
    );

    Property.multilink(
      [ leftNode.boundsProperty, sumSymbolNode.boundsProperty, rightNode.boundsProperty ],
      () => {
        sumSymbolNode.left = leftNode.right + 2;
        sumSymbolNode.y = leftNode.y + 5; // lower sum symbol a bit, determined empirically
        rightNode.left = sumSymbolNode.right + 2;
        rightNode.y = leftNode.y;
      } );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

fourierMakingWaves.register( 'WavePacketSumEquationNode', WavePacketSumEquationNode );
export default WavePacketSumEquationNode;