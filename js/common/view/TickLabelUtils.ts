// Copyright 2021-2022, University of Colorado Boulder

/**
 * TickLabelUtils is a collection of utility functions for creating tick labels for charts.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import { RichText, Text } from '../../../../scenery/js/imports.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWConstants from '../FMWConstants.js';
import FMWSymbols from '../FMWSymbols.js';
import Domain from '../model/Domain.js';
import TickLabelFormat from '../model/TickLabelFormat.js';

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

    // Using toFixedNumber removes trailing zeros.
    return new Text( Utils.toFixedNumber( value, decimals ), merge( {
      font: FMWConstants.TICK_LABEL_FONT
    }, options ) );
  },

  /**
   * Creates a symbolic tick label, by converting a value to a symbol and a fraction.
   * @param {number} value
   * @param {string | TReadOnlyProperty.<string>} symbol
   * @param {number} symbolValue
   * @param {number} coefficientDecimals
   * @param {Object} [options]
   * @returns {Node}
   * @public
   */
  createSymbolicTickLabel( value, symbol, symbolValue, coefficientDecimals, options ) {

    options = merge( {
      font: FMWConstants.TICK_LABEL_FONT,
      maxWidth: 25
    }, options );

    let richTextArgument;
    if ( value === 0 ) {
      richTextArgument = '0';
    }
    else {

      // Convert the coefficient to a fraction
      const coefficient = Utils.toFixedNumber( value / symbolValue, coefficientDecimals );
      const fraction = Fraction.fromDecimal( coefficient );

      // Pieces of the fraction that we need to create the RichText markup, with trailing zeros truncated
      const sign = Math.sign( value );
      const numerator = Math.abs( Utils.toFixedNumber( fraction.numerator, 0 ) );
      const denominator = Math.abs( Utils.toFixedNumber( fraction.denominator, 0 ) );

      const symbolStringProperty = ( typeof symbol === 'string' ) ? new StringProperty( symbol ) : symbol;

      richTextArgument = new DerivedProperty( [ symbolStringProperty ], symbol => {
        let text = '';
        if ( sign === -1 ) {
          text += MathSymbols.UNARY_MINUS;
        }
        if ( numerator !== 1 ) {
          text += numerator;
        }
        text += symbol;
        if ( denominator !== 1 ) {
          text += `/${denominator}`;
        }
        return text;
      } );
    }

    return new RichText( richTextArgument, options );
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
  },

  /**
   * Creates a tick label for a specific Domain, in the correct format (numeric or symbolic).
   * @param {number} value
   * @param {number} decimalPlaces
   * @param {TickLabelFormat} tickLabelFormat
   * @param {Domain} domain
   * @param {number} L - the wavelength of the fundamental harmonic, in meters
   * @param {number} T - the period of the fundamental harmonic, in milliseconds
   * @returns {Node}
   * @public
   */
  createTickLabelForDomain: ( value, decimalPlaces, tickLabelFormat, domain, L, T ) => {
    if ( tickLabelFormat === TickLabelFormat.NUMERIC ) {
      return TickLabelUtils.createNumericTickLabel( value, decimalPlaces );
    }
    else {
      const symbolStringProperty = ( domain === Domain.TIME ) ? FMWSymbols.TStringProperty : FMWSymbols.LStringProperty;
      const symbolValue = ( domain === Domain.TIME ) ? T : L;
      return TickLabelUtils.createSymbolicTickLabel( value, symbolStringProperty, symbolValue, decimalPlaces );
    }
  }
};

fourierMakingWaves.register( 'TickLabelUtils', TickLabelUtils );
export default TickLabelUtils;