// Copyright 2021-2022, University of Colorado Boulder

/**
 * WavePacketSumEquationNode is the equation that appears above the 'Sum' chart in the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, RichText } from '../../../../scenery/js/imports.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import Domain from '../../common/model/Domain.js';
import SeriesType from '../../common/model/SeriesType.js';
import EquationMarkup from '../../common/view/EquationMarkup.js';
import SumSymbolNode from '../../common/view/SumSymbolNode.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class WavePacketSumEquationNode extends Node {

  /**
   * @param {EnumerationDeprecatedProperty.<Domain>} domainProperty
   * @param {EnumerationDeprecatedProperty.<SeriesType>} seriesTypeProperty
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
    const sumSymbolNode = new SumSymbolNode( FMWSymbols.n, -Infinity, new NumberProperty( Infinity ), {
      minMaxFont: new PhetFont( 16 )
    } );

    // Everything to the right of the summation symbol, same as the equation above the Components chart.
    const rightNode = new RichText( '', {
      font: options.font
    } );

    assert && assert( !options.children, 'WavePacketSumEquationNode sets children' );
    options.children = [ leftNode, sumSymbolNode, rightNode ];

    super( options );

    Multilink.multilink(
      [ domainProperty, seriesTypeProperty, componentSpacingProperty ],
      ( domain, seriesType, componentSpacing ) => {

        // Update the left side of the equation to match the Domain.
        leftNode.string = `${EquationMarkup.getFunctionOfMarkup( domain )} ${MathSymbols.EQUAL_TO}`; // F(...) =

        const hasInfiniteComponents = ( componentSpacing === 0 );

        // Summation vs integration
        sumSymbolNode.integrationProperty.value = hasInfiniteComponents;

        // Right side of the equation
        if ( hasInfiniteComponents ) {

          // Infinite number of components
          const domainSymbol = ( domain === Domain.SPACE ) ? FMWSymbols.x : FMWSymbols.t;
          const componentSymbol = ( domain === Domain.SPACE ) ? FMWSymbols.k : FMWSymbols.omega;
          const seriesTypeString = ( seriesType === SeriesType.SIN ) ? FMWSymbols.sin : FMWSymbols.cos;
          rightNode.string = `${FMWSymbols.A}(${componentSymbol}) ` +
                           `${seriesTypeString}( ${componentSymbol}${domainSymbol} ) ${FMWSymbols.d}${componentSymbol}`;
        }
        else {

          // Finite number of components, use same equation as above the Components chart.
          rightNode.string = EquationMarkup.getComponentsEquationMarkup( domain, seriesType );
        }
      }
    );

    // Layout
    Multilink.multilink(
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