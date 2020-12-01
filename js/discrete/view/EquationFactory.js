// Copyright 2020, University of Colorado Boulder

/**
 * EquationFactory is a collection of factory methods that create Nodes that render equations.
 * These equations are specific to this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import SummationSymbolNode from './SummationSymbolNode.js';

const EquationFactory = {

  /**
   * Creates the equation for MathForm.WAVE_LENGTH for the Harmonics chart.
   * @param {Object} [options]
   * @public
   */
  createHarmonicWavelengthForm( options ) {

    options = merge( {
      font: FMWConstants.EQUATION_FONT
    }, options );

    // An sin( 2πx / λn )
    const string = `${FMWSymbols.CAPITAL_A}<sub>${FMWSymbols.SMALL_N}</sub> ` +
                   `sin( 2${FMWSymbols.PI}${FMWSymbols.SMALL_X} / ` +
                   `${FMWSymbols.SMALL_LAMBDA}<sub>${FMWSymbols.SMALL_N}</sub> )`;
    return new RichText( string, options );
  },

  /**
   * Creates the equation for MathForm.WAVE_LENGTH for the Sum chart.
   * @param {Range} range - range of the summation index
   * @param {Object} [options]
   * @public
   */
  createSumWavelengthForm( range, options ) {

    options = merge( {
      font: FMWConstants.EQUATION_FONT
    }, options );

    // F(x) = Σ An sin( 2πx / λn )
    const leftNode = new RichText( `${FMWSymbols.CAPITAL_F}(${FMWSymbols.SMALL_X}) ${MathSymbols.EQUAL_TO} `, {
      font: options.font
    } );
    const summationNode = new SummationSymbolNode( FMWSymbols.SMALL_N, range, {
      font: options.font,
      left: leftNode.right + 2,
      centerY: leftNode.centerY
    } );
    const rightNode = EquationFactory.createHarmonicWavelengthForm( {
      font: options.font,
      left: summationNode.right + 2,
      y: leftNode.y
    } );

    return new Node( {
      children: [ leftNode, summationNode, rightNode ]
    } );
  }
};

fourierMakingWaves.register( 'EquationFactory', EquationFactory );
export default EquationFactory;