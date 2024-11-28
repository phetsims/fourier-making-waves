// Copyright 2021-2024, University of Colorado Boulder

/**
 * SumSymbolNode displays a symbol that indicates a sum of quantities. It can use either the summation symbol
 * (sum of a small number of large quantities) or the integration symbol (sum of a large number of small quantities).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Node, NodeOptions, RichText, Text } from '../../../../scenery/js/imports.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWSymbols from '../FMWSymbols.js';

// constants
const DEFAULT_SYMBOL_FONT = new PhetFont( 30 );
const DEFAULT_N_EQUALS_FONT = new PhetFont( 14 );
const DEFAULT_MIN_MAX_FONT = new PhetFont( 12 );

type SelfOptions = {
  integration?: boolean; // true=integration, false=summation
  symbolFont?: PhetFont;
  nEqualsFont?: PhetFont; // font for 'n ='
  minMaxFont?: PhetFont;
};

type SumSymbolNodeOptions = SelfOptions;

// This extends Node instead of VBox so that the origin will be at the origin of symbolNode, useful for
// layout with other text.
export default class SumSymbolNode extends Node {

  public readonly integrationProperty: Property<boolean>; // true=integration, false=summation
  private readonly disposeSummationSymbolNode: () => void;

  /**
   * @param indexMarkupStringProperty - symbol for the index of summation
   * @param indexMin - index min value
   * @param indexMaxProperty - index max value
   * @param [providedOptions]
   */
  public constructor( indexMarkupStringProperty: TReadOnlyProperty<string>, indexMin: number,
                      indexMaxProperty: TReadOnlyProperty<number>, providedOptions?: SumSymbolNodeOptions ) {

    const options = optionize<SumSymbolNodeOptions, SelfOptions, NodeOptions>()( {

      // SumSymbolNode options
      integration: false, // true=integration, false=summation
      symbolFont: DEFAULT_SYMBOL_FONT,
      nEqualsFont: DEFAULT_N_EQUALS_FONT, // font for 'n ='
      minMaxFont: DEFAULT_MIN_MAX_FONT
    }, providedOptions );

    // The symbol for the type of sum.
    const symbolNode = new RichText( '', {
      font: options.symbolFont
    } );

    // Not instrumented for PhET-iO.
    const nEqualsStringProperty = new DerivedProperty( [ indexMarkupStringProperty ],
      indexSymbol => `${indexSymbol} ${MathSymbols.EQUAL_TO}&nbsp` );

    // Index and min (starting) value, which appears below the sum symbol. E.g. 'n = 0'
    // The 'n =' and '0' are separate Nodes so that we can tweak their font sizes separately.
    // See https://github.com/phetsims/fourier-making-waves/issues/186
    const nEqualsNode = new RichText( nEqualsStringProperty, {
      font: options.nEqualsFont
    } );
    const minValueNode = new RichText( '', {
      font: options.minMaxFont
    } );
    const minNode = new HBox( {
      spacing: 0,
      children: [ nEqualsNode, minValueNode ]
    } );

    // Max (stopping) value, which appears above the sum symbol
    const maxValueNode = new Text( '', {
      font: options.minMaxFont
    } );

    options.children = [ maxValueNode, symbolNode, minNode ];

    super( options );

    this.integrationProperty = new BooleanProperty( options.integration );

    // Update the equation form and layout. dispose is required.
    const multilink = new Multilink(
      [ this.integrationProperty, indexMaxProperty, nEqualsNode.boundsProperty ],
      ( integration, indexMax, nEqualsBounds ) => {

        // update text
        if ( integration ) {
          symbolNode.string = FMWSymbols.integralMarkup;
          minValueNode.string = indexToString( indexMin );
        }
        else {
          symbolNode.string = FMWSymbols.sigmaMarkup;
          minValueNode.string = indexToString( indexMin );
        }
        maxValueNode.string = indexToString( indexMax );

        // update layout
        // WARNING - magic numbers herein were arrived at empirically, tuned because RichText bounds are inaccurate
        if ( integration ) {
          nEqualsNode.visible = false;
          minNode.left = symbolNode.right;
          minNode.bottom = symbolNode.bottom;
          maxValueNode.left = symbolNode.right + 3;
          maxValueNode.top = symbolNode.top - 5;
        }
        else {
          nEqualsNode.visible = true;
          minNode.centerX = symbolNode.centerX;
          minNode.top = symbolNode.bottom - 3;
          maxValueNode.centerX = symbolNode.centerX;
          maxValueNode.bottom = symbolNode.top + 5;
        }
      } );

    this.disposeSummationSymbolNode = () => {
      this.integrationProperty.dispose();
      multilink.dispose();
    };
  }

  public override dispose(): void {
    this.disposeSummationSymbolNode();
    super.dispose();
  }
}

/**
 * Converts a summation index to a string.
 */
function indexToString( index: number ): string {
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