// Copyright 2021-2023, University of Colorado Boulder

/**
 * SumSymbolNode displays a symbol that indicates a sum of quantities. It can use either the summation symbol
 * (sum of a small number of large quantities) or the integration symbol (sum of a large number of small quantities).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import merge from '../../../../phet-core/js/merge.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, Node, RichText, Text } from '../../../../scenery/js/imports.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWSymbols from '../FMWSymbols.js';

// constants
const DEFAULT_SYMBOL_FONT = new PhetFont( 30 );
const DEFAULT_N_EQUALS_FONT = new PhetFont( 14 );
const DEFAULT_MIN_MAX_FONT = new PhetFont( 12 );

// This extends Node instead of VBox so that the origin will be at the origin of symbolNode, useful for
// layout with other text.
export default class SumSymbolNode extends Node {

  /**
   * @param {TReadOnlyProperty.<string>} indexSymbolProperty - symbol for the index of summation
   * @param {number} indexMin - index min value
   * @param {Property.<number>} indexMaxProperty - index max value
   * @param {Object} [options]
   */
  constructor( indexSymbolProperty, indexMin, indexMaxProperty, options ) {

    options = merge( {

      // SumSymbolNode options
      integration: false, // true=integration, false=summation
      symbolFont: DEFAULT_SYMBOL_FONT,
      nEqualsFont: DEFAULT_N_EQUALS_FONT, // font for 'n ='
      minMaxFont: DEFAULT_MIN_MAX_FONT
    }, options );

    // The symbol for the type of sum.
    const symbolNode = new RichText( '', {
      font: options.symbolFont
    } );

    const nEqualsStringProperty = new DerivedProperty( [ indexSymbolProperty ],
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

    assert && assert( !options.children, 'SumSymbolNode sets children' );
    options.children = [ maxValueNode, symbolNode, minNode ];

    super( options );

    // @public true=integration, false=summation
    // dispose is required.
    this.integrationProperty = new BooleanProperty( options.integration );

    // Update the equation form and layout. dispose is required.
    const multilink = new Multilink(
      [ this.integrationProperty, indexMaxProperty, nEqualsNode.boundsProperty ],
      ( integration, indexMax, nEqualsBounds ) => {

        // update text
        if ( integration ) {
          symbolNode.string = FMWSymbols.integral;
          minValueNode.string = indexToString( indexMin );
        }
        else {
          symbolNode.string = FMWSymbols.SIGMA;
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