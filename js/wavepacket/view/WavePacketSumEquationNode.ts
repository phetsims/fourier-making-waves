// Copyright 2021-2024, University of Colorado Boulder

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
import { DerivedStringProperty } from '../../../../axon/js/imports.js';

export default class WavePacketSumEquationNode extends Node {

  public constructor( domainProperty: EnumerationProperty<Domain>,
                      seriesTypeProperty: EnumerationProperty<SeriesType>,
                      componentSpacingProperty: TReadOnlyProperty<number>,
                      tandem: Tandem ) {

    // Everything to the left of the summation symbol: F(...) =
    // Because we are using one of the EquationMarkup functions, our dependencies must include EquationMarkup.STRING_PROPERTY_DEPENDENCIES.
    const leftStringProperty = DerivedStringProperty.deriveAny(
      [ domainProperty, ...EquationMarkup.STRING_PROPERTY_DEPENDENCIES ],
      () => `${EquationMarkup.getFunctionOfMarkup( domainProperty.value )} ${MathSymbols.EQUAL_TO}`
    );
    const leftNode = new RichText( leftStringProperty, {
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
    Multilink.multilink( [
        domainProperty, seriesTypeProperty, componentSpacingProperty,
        FMWSymbols.xMarkupStringProperty, FMWSymbols.tMarkupStringProperty, FMWSymbols.kMarkupStringProperty, FMWSymbols.omegaMarkupStringProperty,
        FMWSymbols.sinMarkupStringProperty, FMWSymbols.cosMarkupStringProperty, FMWSymbols.AMarkupStringProperty, FMWSymbols.dMarkupStringProperty
      ],
      ( domain, seriesType, componentSpacing, x, t, k, omega, sin, cos, A, d ) => {

        const hasInfiniteComponents = ( componentSpacing === 0 );

        // Summation vs integration
        sumSymbolNode.integrationProperty.value = hasInfiniteComponents;

        // Right side of the equation
        let rightString: string;
        if ( hasInfiniteComponents ) {

          // Infinite number of components
          const domainSymbol = ( domain === Domain.SPACE ) ? x : t;
          const componentSymbol = ( domain === Domain.SPACE ) ? k : omega;
          const seriesTypeString = ( seriesType === SeriesType.SIN ) ? sin : cos;
          rightString = `${A}(${componentSymbol}) ${seriesTypeString}( ${componentSymbol}${domainSymbol} ) ${d}${componentSymbol}`;
        }
        else {

          // Finite number of components, use same equation as above the Components chart.
          rightString = EquationMarkup.getComponentsEquationMarkup( domain, seriesType );
        }
        rightNode.string = rightString;
      }
    );

    super( {
      children: [ leftNode, sumSymbolNode, rightNode ],
      maxWidth: 0.5 * FMWConstants.CHART_RECTANGLE_SIZE.width,
      isDisposable: false,
      tandem: tandem
    } );

    // Dynamic layout
    Multilink.multilink(
      [ leftNode.boundsProperty, sumSymbolNode.boundsProperty, rightNode.boundsProperty ],
      () => {
        sumSymbolNode.left = leftNode.right + 2;
        sumSymbolNode.y = leftNode.y + 5; // lower sum symbol a bit, determined empirically
        rightNode.left = sumSymbolNode.right + 2;
        rightNode.y = leftNode.y;
      } );
  }
}

fourierMakingWaves.register( 'WavePacketSumEquationNode', WavePacketSumEquationNode );