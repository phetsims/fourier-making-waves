// Copyright 2020-2023, University of Colorado Boulder

/**
 * DiscreteSumEquationNode is the equation that appears above the 'Sum' chart in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import { Node, RichText } from '../../../../scenery/js/imports.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import EquationMarkup from '../../common/view/EquationMarkup.js';
import SumSymbolNode from '../../common/view/SumSymbolNode.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

// To improve readability of markup creation. Each of these is a string than may also include markup.
const EQUAL_TO = MathSymbols.EQUAL_TO;

export default class DiscreteSumEquationNode extends Node {

  /**
   * @param {NumberProperty} numberOfHarmonicsProperty
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<SeriesType>} seriesTypeProperty
   * @param {EnumerationProperty.<EquationForm>} equationFormProperty
   * @param {Object} [options]
   */
  constructor( numberOfHarmonicsProperty, domainProperty, seriesTypeProperty, equationFormProperty, options ) {

    assert && assert( numberOfHarmonicsProperty instanceof NumberProperty );
    assert && assert( domainProperty instanceof EnumerationProperty );
    assert && assert( seriesTypeProperty instanceof EnumerationProperty );
    assert && assert( equationFormProperty instanceof EnumerationProperty );

    options = merge( {

      // DiscreteSumEquationNode options
      font: FMWConstants.EQUATION_FONT
    }, options );

    // Everything to the left of the summation symbol, set in multilink below
    const leftNode = new RichText( '', {
      font: options.font
    } );

    // Capital sigma, summation symbol
    const summationNode = new SumSymbolNode( FMWSymbols.nStringProperty, 1, numberOfHarmonicsProperty );

    // Everything to the right of the summation symbol, set in multilink below
    const rightNode = new RichText( '', {
      font: options.font
    } );

    assert && assert( !options.children, 'DiscreteSumEquationNode sets children' );
    options.children = [ leftNode, summationNode, rightNode ];

    super( options );

    // Update the equation to match the Domain and math form.
    const multilink = new Multilink(
      [ domainProperty, seriesTypeProperty, equationFormProperty ],
      ( domain, seriesType, equationForm ) => {

        // F(...) =
        leftNode.string = `${EquationMarkup.getFunctionOfMarkup( domain )} ${EQUAL_TO}`;

        summationNode.left = leftNode.right + 2;
        summationNode.y = leftNode.y + 5; // lower summation a bit, determined empirically

        rightNode.string = EquationMarkup.getGeneralFormMarkup( domain, seriesType, equationForm );
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