// Copyright 2021, University of Colorado Boulder

/**
 * ContinuousSumEquationNode is the equation that appears above the 'Sum' chart in the 'Continuous' screen.
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
import fourierMakingWaves from '../../fourierMakingWaves.js';
import ComponentsEquationNode from './ComponentsEquationNode.js';
import EquationMarkup from '../../discrete/view/EquationMarkup.js';
import SumSymbolNode from '../../discrete/view/SumSymbolNode.js';

// To improve readability of markup creation. Each of these is a string than may also include markup.
const EQUAL_TO = MathSymbols.EQUAL_TO;
const n = FMWSymbols.n;

class ContinuousSumEquationNode extends Node {

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

      // ContinuousSumEquationNode options
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

    componentSpacingProperty.link( componentSpacing => {
      sumSymbolNode.integrationProperty.value = ( componentSpacing === 0 );
    } );

    // Everything to the right of the summation symbol, same as the equation above the Components chart.
    const rightNode = new ComponentsEquationNode( domainProperty, seriesTypeProperty, componentSpacingProperty );

    assert && assert( !options.children, 'ContinuousSumEquationNode sets children' );
    options.children = [ leftNode, sumSymbolNode, rightNode ];

    super( options );

    // Update the left side of the equation to match the domain.
    // unlink is not needed.
    domainProperty.link( domain => {
      leftNode.text = `${EquationMarkup.getFunctionOfMarkup( domain )} ${EQUAL_TO}`; // F(...) =
    } );

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

fourierMakingWaves.register( 'ContinuousSumEquationNode', ContinuousSumEquationNode );
export default ContinuousSumEquationNode;