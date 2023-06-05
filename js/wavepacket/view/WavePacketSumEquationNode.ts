// Copyright 2021-2023, University of Colorado Boulder

/**
 * WavePacketSumEquationNode is the equation that appears above the 'Sum' chart in the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
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
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class WavePacketSumEquationNode extends Node {

  public constructor( domainProperty: EnumerationProperty<Domain>,
                      seriesTypeProperty: EnumerationProperty<SeriesType>,
                      componentSpacingProperty: TReadOnlyProperty<number>,
                      tandem: Tandem ) {

    // Everything to the left of the summation symbol, set in domainProperty listener below.
    const leftNode = new RichText( '', {
      font: FMWConstants.EQUATION_FONT
    } );

    // Capital sigma, summation symbol
    const sumSymbolNode = new SumSymbolNode( FMWSymbols.nMarkupStringProperty, -Infinity, new NumberProperty( Infinity ), {
      minMaxFont: new PhetFont( 16 )
    } );

    // Everything to the right of the summation symbol, same as the equation above the Components chart.
    const rightNode = new RichText( '', {
      font: FMWConstants.EQUATION_FONT
    } );

    super( {
      children: [ leftNode, sumSymbolNode, rightNode ],
      maxWidth: 0.5 * FMWConstants.CHART_RECTANGLE_SIZE.width,
      tandem: tandem
    } );

    Multilink.multilink( [
        domainProperty, seriesTypeProperty, componentSpacingProperty,
        FMWSymbols.xMarkupStringProperty, FMWSymbols.tMarkupStringProperty, FMWSymbols.kMarkupStringProperty, FMWSymbols.omegaMarkupStringProperty,
        FMWSymbols.sinMarkupStringProperty, FMWSymbols.cosMarkupStringProperty, FMWSymbols.AMarkupStringProperty, FMWSymbols.dMarkupStringProperty
      ],
      ( domain, seriesType, componentSpacing, x, t, k, omega, sin, cos, A, d ) => {

        // Update the left side of the equation to match the Domain.
        leftNode.string = `${EquationMarkup.getFunctionOfMarkup( domain )} ${MathSymbols.EQUAL_TO}`; // F(...) =

        const hasInfiniteComponents = ( componentSpacing === 0 );

        // Summation vs integration
        sumSymbolNode.integrationProperty.value = hasInfiniteComponents;

        // Right side of the equation
        if ( hasInfiniteComponents ) {

          // Infinite number of components
          const domainSymbol = ( domain === Domain.SPACE ) ? x : t;
          const componentSymbol = ( domain === Domain.SPACE ) ? k : omega;
          const seriesTypeString = ( seriesType === SeriesType.SIN ) ? sin : cos;
          rightNode.string = `${A}(${componentSymbol}) ${seriesTypeString}( ${componentSymbol}${domainSymbol} ) ${d}${componentSymbol}`;
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

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

fourierMakingWaves.register( 'WavePacketSumEquationNode', WavePacketSumEquationNode );