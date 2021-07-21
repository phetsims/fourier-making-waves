// Copyright 2021, University of Colorado Boulder

/**
 * TickLabelUtils is a collection of utility functions for creating tick labels for charts.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWConstants from '../FMWConstants.js';
import FMWSymbols from '../FMWSymbols.js';

const TickLabelUtils = {

  /**
   * Creates a numeric tick label.
   * @param {number} value
   * @param {number} decimals
   * @param {Object} [options]
   * @returns {Node}
   * @public
   */
  createNumericTickLabel: ( value, decimals, options ) => {
    return new Text( Utils.toFixedNumber( value, decimals ), merge( {
      font: FMWConstants.TICK_LABEL_FONT
    }, options ) );
  },

  /**
   * Creates a symbolic tick label, by converting a value to a coefficient followed by a symbol.
   * @param {number} value
   * @param {string} symbol
   * @param {number} symbolValue
   * @param {number} coefficientDecimals
   * @param {Object} [options]
   * @returns {Node}
   * @public
   */
  createSymbolicTickLabel( value, symbol, symbolValue, coefficientDecimals, options ) {
    options = merge( {
      font: FMWConstants.TICK_LABEL_FONT,
      maxWidth: 20
    }, options );
    const coefficient = Utils.toFixedNumber( value / symbolValue, coefficientDecimals );
    const string = ( coefficient === 0 ) ? '0' :
                   ( coefficient === 1 ) ? `${symbol}` :
                   ( coefficient === -1 ) ? `-${symbol}` :
                   `${coefficient}${symbol}`;
    return new RichText( string, options );
  },

  /**
   * Creates a tick label for multiples of PI, by converting a value to a coefficient followed by the PI symbol.
   * @param {number} value
   * @param {number} coefficientDecimals
   * @param {Object} [options]
   * @returns {Node}
   * @public
   */
  createPiTickLabel: ( value, coefficientDecimals, options ) => {
    return TickLabelUtils.createSymbolicTickLabel( value, FMWSymbols.pi, Math.PI, coefficientDecimals, options );
  }
};

fourierMakingWaves.register( 'TickLabelUtils', TickLabelUtils );
export default TickLabelUtils;