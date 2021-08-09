// Copyright 2021, University of Colorado Boulder

/**
 * WaveformChart is the base class for charts that plot one or more 2D waveforms related to a Fourier series.
 * The x axis is either space or time, while the y axis is always amplitude.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import AxisDescription from './AxisDescription.js';
import Domain from './Domain.js';
import TickLabelFormat from './TickLabelFormat.js';

class WaveformChart {

  /**
   * @param {number} L - wavelength of the fundamental harmonic, in meters
   * @param {number} T - period of the fundamental harmonic, in milliseconds
   * @param {EnumerationProperty.<Domain>} domainProperty - domain of the x axis
   * @param {Property.<TickLabelFormat>} xAxisTickLabelFormatProperty - format of the x-axis tick labels
   * @param {Property.<AxisDescription>} xAxisDescriptionProperty - describes the x axis
   * @param {Property.<AxisDescription>} yAxisDescriptionProperty - describes the y axis
   * @param {Object} [options]
   */
  constructor( L, T, domainProperty,
               xAxisTickLabelFormatProperty, xAxisDescriptionProperty, yAxisDescriptionProperty, options ) {

    assert && AssertUtils.assertPositiveNumber( L );
    assert && AssertUtils.assertPositiveNumber( T );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertPropertyOf( xAxisTickLabelFormatProperty, TickLabelFormat );
    assert && AssertUtils.assertPropertyOf( xAxisDescriptionProperty, AxisDescription );
    assert && assert( xAxisDescriptionProperty.validValues,
      'xAxisDescriptionProperty should have been instantiated with validValues option' );
    assert && AssertUtils.assertPropertyOf( yAxisDescriptionProperty, AxisDescription );
    assert && assert( yAxisDescriptionProperty.validValues,
      'yAxisDescriptionProperty should have been instantiated with validValues option' );

    options = merge( {
      yAutoScaleProperty: null // {null|Property.<boolean>}
    }, options );

    // @public (read-only) params
    this.L = L;
    this.T = T;
    this.domainProperty = domainProperty;
    this.xAxisTickLabelFormatProperty = xAxisTickLabelFormatProperty;
    this.xAxisDescriptionProperty = xAxisDescriptionProperty;
    this.yAxisDescriptionProperty = yAxisDescriptionProperty;

    // @public (read-only) options
    this.yAutoScaleProperty = options.yAutoScaleProperty;

    // @public whether this chart is visible
    this.chartVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'chartVisibleProperty' )
    } );
  }

  /**
   * @public
   */
  reset() {
    this.chartVisibleProperty.reset();
  }
}

fourierMakingWaves.register( 'WaveformChart', WaveformChart );
export default WaveformChart;