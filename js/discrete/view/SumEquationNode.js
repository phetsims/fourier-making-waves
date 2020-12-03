// Copyright 2020, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import Domain from '../model/Domain.js';
import MathForm from '../model/MathForm.js';
import HarmonicsEquationNode from './HarmonicsEquationNode.js';
import SummationSymbolNode from './SummationSymbolNode.js';

// To improve readability of markup creation. Each of these is a string than may also include markup.
const EQUAL_TO = MathSymbols.EQUAL_TO;
const F = FMWSymbols.CAPITAL_F;
const n = FMWSymbols.SMALL_N;
const t = FMWSymbols.SMALL_T;
const x = FMWSymbols.SMALL_X;

class SumEquationNode extends Node {

  /**
   * @param {Property.<number>} numberOfHarmonicsProperty
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<MathForm>} mathFormProperty
   * @param {Object} [options]
   */
  constructor( numberOfHarmonicsProperty, domainProperty, mathFormProperty, options ) {

    assert && AssertUtils.assertPropertyOf( numberOfHarmonicsProperty, 'number' );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertEnumerationPropertyOf( mathFormProperty, MathForm );

    options = merge( {
      font: FMWConstants.EQUATION_FONT
    }, options );

    const leftNode = new RichText( '', {
      font: options.font
    } );

    const summationNode = new SummationSymbolNode( n, 1, numberOfHarmonicsProperty, {
      font: options.font
    } );

    const rightNode = new RichText( '', {
      font: options.font
    } );

    assert && assert( !options.children, 'SumEquationNode sets children' );
    options.children = [ leftNode, summationNode, rightNode ];

    super( options );

    // Update the equation
    const multilink = new Multilink(
      [ domainProperty, mathFormProperty ],
      ( domain, mathForm ) => {

      this.visible = ( mathForm !== MathForm.HIDDEN );

      leftNode.text = ( domain === Domain.SPACE ) ? `${F}(${x}) ${EQUAL_TO} ` :
                      ( domain === Domain.TIME ) ? `${F}(${t}) ${EQUAL_TO} ` :
                      `${F}(${x},${t}) ${EQUAL_TO} `;

      summationNode.left = leftNode.right + 2;
      summationNode.y = leftNode.y + 5; // lower summation a bit, determined empirically

      rightNode.text = HarmonicsEquationNode.getRichTextMarkup( domain, mathForm );
      rightNode.left = summationNode.right + 2;
      rightNode.y = leftNode.y;
    } );

    // @private
    this.disposeSumEquationNode = () => {
      multilink.dispose();
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeSumEquationNode();
    super.dispose();
  }
}

fourierMakingWaves.register( 'SumEquationNode', SumEquationNode );
export default SumEquationNode;