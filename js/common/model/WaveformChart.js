// Copyright 2021, University of Colorado Boulder

/**
 * WaveformChart is the base class for charts that plot one or more 2D waveforms related to a Fourier series.
 * The x axis is either space or time, while the y axis is always amplitude.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWConstants from '../FMWConstants.js';
import AxisDescription from './AxisDescription.js';
import Domain from './Domain.js';
import TickLabelFormat from './TickLabelFormat.js';
import XAxisDescription from './XAxisDescription.js';

class WaveformChart {

  /**
   * @param {number} L - wavelength of the fundamental harmonic, in meters
   * @param {number} T - period of the fundamental harmonic, in milliseconds
   * @param {EnumerationProperty.<Domain>} domainProperty - domain of the x axis
   * @param {Property.<TickLabelFormat>} xAxisTickLabelFormatProperty - format of the x-axis tick labels
   * @param {Property.<XAxisDescription>} xAxisDescriptionProperty - describes the x axis
   * @param {Property.<AxisDescription>} yAxisDescriptionProperty - describes the y axis
   * @param {Object} [options]
   */
  constructor( L, T, domainProperty,
               xAxisTickLabelFormatProperty, xAxisDescriptionProperty, yAxisDescriptionProperty, options ) {

    assert && AssertUtils.assertPositiveNumber( L );
    assert && AssertUtils.assertPositiveNumber( T );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertPropertyOf( xAxisTickLabelFormatProperty, TickLabelFormat );
    assert && AssertUtils.assertPropertyOf( xAxisDescriptionProperty, XAxisDescription );
    assert && assert( xAxisDescriptionProperty.validValues,
      'xAxisDescriptionProperty should have been instantiated with validValues option' );
    assert && AssertUtils.assertPropertyOf( yAxisDescriptionProperty, AxisDescription );
    assert && assert( yAxisDescriptionProperty.validValues,
      'yAxisDescriptionProperty should have been instantiated with validValues option' );

    options = merge( {
      hasXZoom: false, // Does this chart have zoom buttons for the x axis?
      hasYZoom: false,  // Does this chart have zoom buttons for the y axis?
      yAutoScaleProperty: null, // {null|Property.<boolean>}
      peakAmplitudeProperty: null, // {null|Property.<number>}
      yAutoScaleMin: FMWConstants.MAX_AMPLITUDE
    }, options );

    assert && assert( ( !options.yAutoScaleProperty && !options.peakAmplitudeProperty ) ||
                      ( options.yAutoScaleProperty && options.peakAmplitudeProperty ),
      'yAutoScaleProperty and peakAmplitudeProperty are both or neither' );

    // @public (read-only) params
    this.L = L;
    this.T = T;
    this.domainProperty = domainProperty;
    this.xAxisTickLabelFormatProperty = xAxisTickLabelFormatProperty;
    this.xAxisDescriptionProperty = xAxisDescriptionProperty;
    this.yAxisDescriptionProperty = yAxisDescriptionProperty;

    // @public (read-only) options
    this.hasXZoom = options.hasXZoom;
    this.hasYZoom = options.hasYZoom;
    this.yAutoScaleProperty = options.yAutoScaleProperty;

    // @public {null|DerivedProperty.<Range>} auto-scale range of the y axis, fitted to the sum's peak amplitude
    this.yAxisAutoScaleRangeProperty = null;
    if ( this.yAutoScaleProperty && options.peakAmplitudeProperty ) {

      this.yAxisAutoScaleRangeProperty = new DerivedProperty(
        [ options.peakAmplitudeProperty ],
        peakAmplitude => {

          // no smaller than yAutoScaleMin, with a bit of padding added at top and bottom
          const maxY = Math.max( options.yAutoScaleMin, peakAmplitude * 1.05 );
          return new Range( -maxY, maxY );
        } );

      // When auto scale is enabled, link this listener to yAxisAutoScaleRangeProperty, and adjust the y-axis so
      // that's it's appropriate for the auto-scale range.
      const updateYAxisDescription = yAxisAutoScaleRange => {
        assert && assert( this.yAutoScaleProperty.value, 'should not be called when yAutoScale is disabled' );
        const yAxisDescriptions = yAxisDescriptionProperty.validValues;
        yAxisDescriptionProperty.value = AxisDescription.getAxisDescriptionForRange( yAxisAutoScaleRange, yAxisDescriptions );
      };
      this.yAutoScaleProperty.link( yAutoScale => {
        if ( yAutoScale ) {
          this.yAxisAutoScaleRangeProperty.link( updateYAxisDescription );
        }
        else {
          if ( this.yAxisAutoScaleRangeProperty.hasListener( updateYAxisDescription ) ) {
            this.yAxisAutoScaleRangeProperty.unlink( updateYAxisDescription );
          }
        }
      } );
    }
  }
}

fourierMakingWaves.register( 'WaveformChart', WaveformChart );
export default WaveformChart;