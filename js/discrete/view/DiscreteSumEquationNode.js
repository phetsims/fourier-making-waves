// Copyright 2020-2021, University of Colorado Boulder

/**
 * DiscreteSumEquationNode is the equation that appears above the 'Sum' chart in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import Domain from '../../common/model/Domain.js';
import EquationForm from '../model/EquationForm.js';
import SeriesType from '../../common/model/SeriesType.js';
import EquationMarkup from '../../common/view/EquationMarkup.js';
import SumSymbolNode from '../../common/view/SumSymbolNode.js';

// To improve readability of markup creation. Each of these is a string than may also include markup.
const EQUAL_TO = MathSymbols.EQUAL_TO;
const n = FMWSymbols.n;

class DiscreteSumEquationNode extends Node {

  /**
   * @param {NumberProperty} numberOfHarmonicsProperty
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<SeriesType>} seriesTypeProperty
   * @param {EnumerationProperty.<EquationForm>} equationFormProperty
   * @param {Object} [options]
   */
  constructor( numberOfHarmonicsProperty, domainProperty, seriesTypeProperty, equationFormProperty, options ) {

    assert && assert( numberOfHarmonicsProperty instanceof NumberProperty );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertEnumerationPropertyOf( seriesTypeProperty, SeriesType );
    assert && AssertUtils.assertEnumerationPropertyOf( equationFormProperty, EquationForm );

    options = merge( {

      // DiscreteSumEquationNode options
      font: FMWConstants.EQUATION_FONT
    }, options );

    // Everything to the left of the summation symbol, set in multilink below
    const leftNode = new RichText( '', {
      font: options.font
    } );

    // Capital sigma, summation symbol
    const summationNode = new SumSymbolNode( n, 1, numberOfHarmonicsProperty, {
      font: options.font
    } );

    // Everything to the right of the summation symbol, set in multilink below
    const rightNode = new RichText( '', {
      font: options.font
    } );

    assert && assert( !options.children, 'DiscreteSumEquationNode sets children' );
    options.children = [ leftNode, summationNode, rightNode ];

    super( options );

    // Update the equation to match the domain and math form.
    const multilink = new Multilink(
      [ domainProperty, seriesTypeProperty, equationFormProperty ],
      ( domain, seriesType, equationForm ) => {

        // F(...) =
        leftNode.text = `${EquationMarkup.getFunctionOfMarkup( domain )} ${EQUAL_TO}`;

        summationNode.left = leftNode.right + 2;
        summationNode.y = leftNode.y + 5; // lower summation a bit, determined empirically

        rightNode.text = EquationMarkup.getGeneralFormMarkup( domain, seriesType, equationForm );
        rightNode.left = summationNode.right + 2;
        rightNode.y = leftNode.y;
      } );

    // @private
    this.disposeSumEquationNode = () => {
      multilink.dispose();
    };
  }

  /**
   * This equation is used in 2 places: above the Sum chart, and in the Expanded Form dialog.
   * In the former, one instance is created and it exists for the lifetime of the sim.
   * In the latter, a new instance is created each time the dialog is opened, and therefore needs to be disposed.
   * @public
   * @override
   */
  dispose() {
    this.disposeSumEquationNode();
    super.dispose();
  }
}

fourierMakingWaves.register( 'DiscreteSumEquationNode', DiscreteSumEquationNode );
export default DiscreteSumEquationNode;