// Copyright 2021, University of Colorado Boulder

/**
 * XTickLabelSet implements the x-axis tick labels for the Harmonics and Sum charts.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import LabelSet from '../../../../bamboo/js/LabelSet.js';
import Utils from '../../../../dot/js/Utils.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import merge from '../../../../phet-core/js/merge.js';
import FMWConstants from '../FMWConstants.js';
import FMWSymbols from '../FMWSymbols.js';
import Domain from '../model/Domain.js';
import TickLabelFormat from '../model/TickLabelFormat.js';

class XTickLabelSet extends LabelSet {

  /**
   * @param {ChartTransform} chartTransform
   * @param {number} spacing
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Property.<TickLabelFormat>} xAxisTickLabelFormatProperty
   * @param {number} L - the wavelength of the fundamental harmonic, in meters
   * @param {number} T - the period of the fundamental harmonic, in milliseconds
   * @param {Object} [options]
   */
  constructor( chartTransform, spacing, domainProperty, xAxisTickLabelFormatProperty, L, T, options ) {

    assert && assert( chartTransform instanceof ChartTransform );
    assert && AssertUtils.assertPositiveNumber( spacing );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertPropertyOf( xAxisTickLabelFormatProperty, TickLabelFormat );
    assert && AssertUtils.assertPositiveNumber( L );
    assert && AssertUtils.assertPositiveNumber( T );

    options = merge( {

      // XTickLabelSet options
      decimalPlaces: 2,

      // LabelSet options
      edge: 'min'
    }, options );

    // This is called whenever invalidateLabelSet is called, and calling invalidateLabelSet is our responsibility.
    // Note that we need to use xAxisTickLabelFormatProperty and domainProperty here so that we have the current values.
    assert && assert( !options.createLabel, 'XTickLabelSet sets createLabel' );
    options.createLabel = value =>
      createTickLabel( value, options.decimalPlaces, xAxisTickLabelFormatProperty.value, domainProperty.value, L, T );

    super( chartTransform, Orientation.HORIZONTAL, spacing, options );

    // dispose is not needed
    Property.multilink( [ xAxisTickLabelFormatProperty, domainProperty ], () => this.invalidateLabelSet() );
  }
}

/**
 * Creates a tick label of the correct form (numeric or symbolic).
 * @param {number} value
 * @param {number} decimalPlaces
 * @param {TickLabelFormat} tickLabelFormat
 * @param {Domain} domain
 * @param {number} L - the wavelength of the fundamental harmonic, in meters
 * @param {number} T - the period of the fundamental harmonic, in milliseconds
 * @returns {Node}
 */
function createTickLabel( value, decimalPlaces, tickLabelFormat, domain, L, T ) {
  if ( tickLabelFormat === TickLabelFormat.NUMERIC ) {
    return createNumericTickLabel( value, decimalPlaces );
  }
  else {
    return createSymbolicTickLabel( value, decimalPlaces, domain, L, T );
  }
}

/**
 * Creates a numeric tick label for the chart.
 * @param {number} value
 * @param {number} decimalPlaces
 * @returns {Node}
 */
function createNumericTickLabel( value, decimalPlaces ) {

  // Truncate trailing zeros
  return new Text( Utils.toFixedNumber( value, decimalPlaces ), {
    font: FMWConstants.TICK_LABEL_FONT
  } );
}

/**
 * Creates a symbolic tick label for the chart.
 * @param {number} value
 * @param {number} decimalPlaces
 * @param {Domain} domain
 * @param {number} L - the wavelength of the fundamental harmonic, in meters
 * @param {number} T - the period of the fundamental harmonic, in milliseconds
 * @returns {Node}
 */
function createSymbolicTickLabel( value, decimalPlaces, domain, L, T ) {

  const constantSymbol = ( domain === Domain.TIME ) ? FMWSymbols.T : FMWSymbols.L;
  let text;
  if ( value === 0 ) {
    text = '0';
  }
  else {

    // Convert the coefficient to a fraction
    const constantValue = ( domain === Domain.TIME ) ? T : L;
    const coefficient = value / constantValue;
    const fraction = Fraction.fromDecimal( coefficient );

    // Pieces of the fraction that we need to create the RichText markup, with trailing zeros truncated
    const sign = Math.sign( value );
    const numerator = Math.abs( Utils.toFixedNumber( fraction.numerator, decimalPlaces ) );
    const denominator = Math.abs( Utils.toFixedNumber( fraction.denominator, decimalPlaces ) );

    text = '';
    if ( sign === -1 ) {
      text += MathSymbols.UNARY_MINUS;
    }
    if ( numerator !== 1 ) {
      text += numerator;
    }
    text += constantSymbol;
    if ( denominator !== 1 ) {
      text += `/${denominator}`;
    }
  }

  return new RichText( text, {
    font: FMWConstants.TICK_LABEL_FONT,
    maxWidth: 35 // determined empirically
  } );
}

fourierMakingWaves.register( 'XTickLabelSet', XTickLabelSet );
export default XTickLabelSet;