// Copyright 2021, University of Colorado Boulder

//TODO delete this eventually
/**
 * XTickLabelSet implements the x-axis tick labels for the Harmonics and Sum charts.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import LabelSet from '../../../../bamboo/js/LabelSet.js';
import merge from '../../../../phet-core/js/merge.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWSymbols from '../FMWSymbols.js';
import Domain from '../model/Domain.js';
import TickLabelFormat from '../model/TickLabelFormat.js';
import TickLabelUtils from './TickLabelUtils.js';

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
    return TickLabelUtils.createNumericTickLabel( value, decimalPlaces );
  }
  else {
    const symbol = ( domain === Domain.TIME ) ? FMWSymbols.T : FMWSymbols.L;
    const symbolValue = ( domain === Domain.TIME ) ? T : L;
    return TickLabelUtils.createSymbolicTickLabel( value, symbol, symbolValue, decimalPlaces );
  }
}

fourierMakingWaves.register( 'XTickLabelSet', XTickLabelSet );
export default XTickLabelSet;