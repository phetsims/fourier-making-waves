// Copyright 2020, University of Colorado Boulder

/**
 * SumEquationNode is the equation that appears above the 'Sum' chart in the 'Discrete' screen.
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
import WaveType from '../model/WaveType.js';
import EquationMarkup from './EquationMarkup.js';
import SummationSymbolNode from './SummationSymbolNode.js';

// To improve readability of markup creation. Each of these is a string than may also include markup.
const A = FMWSymbols.A;
const EQUAL_TO = MathSymbols.EQUAL_TO;
const n = FMWSymbols.n;
const An = `${A}<sub>${n}</sub>`;

class SumEquationNode extends Node {

  /**
   * @param {Property.<number>} numberOfHarmonicsProperty
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<WaveType>} waveTypeProperty
   * @param {EnumerationProperty.<MathForm>} mathFormProperty
   * @param {Object} [options]
   */
  constructor( numberOfHarmonicsProperty, domainProperty, waveTypeProperty, mathFormProperty, options ) {

    assert && AssertUtils.assertPropertyOf( numberOfHarmonicsProperty, 'number' );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertEnumerationPropertyOf( waveTypeProperty, WaveType );
    assert && AssertUtils.assertEnumerationPropertyOf( mathFormProperty, MathForm );

    options = merge( {
      font: FMWConstants.EQUATION_FONT
    }, options );

    // Everything to the left of the summation symbol
    const leftNode = new RichText( '', {
      font: options.font
    } );

    // Capital sigma, summation symbol
    const summationNode = new SummationSymbolNode( n, 1, numberOfHarmonicsProperty, {
      font: options.font
    } );

    // Everything to the right of the summation symbol
    const rightNode = new RichText( '', {
      font: options.font
    } );

    assert && assert( !options.children, 'SumEquationNode sets children' );
    options.children = [ leftNode, summationNode, rightNode ];

    super( options );

    // Update the equation to match the domain and math form.
    const multilink = new Multilink(
      [ domainProperty, waveTypeProperty, mathFormProperty ],
      ( domain, waveType, mathForm ) => {

        this.visible = ( mathForm !== MathForm.HIDDEN );

        // F(...) =
        leftNode.text = `${EquationMarkup.getFunctionOfMarkup( domain )} ${EQUAL_TO}`;

        summationNode.left = leftNode.right + 2;
        summationNode.y = leftNode.y + 5; // lower summation a bit, determined empirically

        rightNode.text = EquationMarkup.getRichTextMarkup( domain, waveType, mathForm, n, An );
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