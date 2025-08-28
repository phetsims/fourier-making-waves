// Copyright 2021-2025, University of Colorado Boulder

/**
 * TickLabelUtils is a collection of utility functions for creating tick labels for charts.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText, { RichTextOptions } from '../../../../scenery/js/nodes/RichText.js';
import Text, { TextOptions } from '../../../../scenery/js/nodes/Text.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWConstants from '../FMWConstants.js';
import FMWSymbols from '../FMWSymbols.js';
import Domain from '../model/Domain.js';
import TickLabelFormat from '../model/TickLabelFormat.js';

const TickLabelUtils = {

  /**
   * Creates a numeric tick label.
   */
  createNumericTickLabel( value: number, decimals: number, providedOptions?: TextOptions ): Node {

    // Using toFixedNumber removes trailing zeros.
    return new Text( Utils.toFixedNumber( value, decimals ), combineOptions<TextOptions>( {
      font: FMWConstants.TICK_LABEL_FONT
    }, providedOptions ) );
  },

  /**
   * Creates a tick label for multiples of PI, by converting a value to a coefficient followed by the PI symbol.
   */
  createPiTickLabel( value: number, coefficientDecimals: number, options?: RichTextOptions ): Node {
    return createSymbolicTickLabel( value, FMWSymbols.piMarkup, Math.PI, coefficientDecimals, options );
  },

  /**
   * Creates a tick label for a specific Domain, in the correct format (numeric or symbolic).
   * @param value
   * @param decimalPlaces
   * @param tickLabelFormat
   * @param domain
   * @param L - the wavelength of the fundamental harmonic, in meters
   * @param T - the period of the fundamental harmonic, in milliseconds
   */
  createTickLabelForDomain( value: number, decimalPlaces: number, tickLabelFormat: TickLabelFormat, domain: Domain,
                            L: number, T: number ): Node {
    if ( tickLabelFormat === TickLabelFormat.NUMERIC ) {
      return TickLabelUtils.createNumericTickLabel( value, decimalPlaces );
    }
    else {
      const symbolStringProperty = ( domain === Domain.TIME ) ? FMWSymbols.TMarkupStringProperty : FMWSymbols.LMarkupStringProperty;
      const symbolValue = ( domain === Domain.TIME ) ? T : L;
      return createSymbolicTickLabel( value, symbolStringProperty, symbolValue, decimalPlaces );
    }
  }
};

/**
 * Creates a symbolic tick label, by converting a value to a symbol and a fraction.
 */
function createSymbolicTickLabel( value: number, symbol: string | TReadOnlyProperty<string>, symbolValue: number,
  coefficientDecimals: number, providedOptions?: RichTextOptions ): Node {

  const options = combineOptions<RichTextOptions>( {
    font: FMWConstants.TICK_LABEL_FONT,
    maxWidth: 25
  }, providedOptions );

  if ( value === 0 ) {
    return new RichText( '0', options );
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

    // Not instrumented for PhET-iO.
    const richStringProperty = new DerivedStringProperty( [ symbolStringProperty ], symbol => {
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

    const richText = new RichText( richStringProperty, options );

    // When richText is disposed, also dispose the DerivedStringProperty that was created above.
    richText.disposeEmitter.addListener( () => richStringProperty.dispose() );

    return richText;
  }
}

fourierMakingWaves.register( 'TickLabelUtils', TickLabelUtils );
export default TickLabelUtils;