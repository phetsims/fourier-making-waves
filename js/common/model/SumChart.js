// Copyright 2021, University of Colorado Boulder

//TODO change this to display the sums for more than 1 FourierSeries?
/**
 * SumChart is the model base class for the 'Sum' chart.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import AxisDescription from './AxisDescription.js';
import SeriesType from './SeriesType.js';
import WaveformChart from './WaveformChart.js';

class SumChart extends WaveformChart {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<SeriesType>} seriesTypeProperty
   * @param {Property.<number>} tProperty
   * @param {Property.<TickLabelFormat>} xAxisTickLabelFormatProperty
   * @param {Property.<XAxisDescription>} xAxisDescriptionProperty
   * @param {Property.<AxisDescription>} yAxisDescriptionProperty
   * @param {Object} [options]
   */
  constructor( fourierSeries, domainProperty, seriesTypeProperty, tProperty,
               xAxisTickLabelFormatProperty, xAxisDescriptionProperty, yAxisDescriptionProperty,
               options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( seriesTypeProperty, SeriesType );
    assert && AssertUtils.assertPropertyOf( tProperty, 'number' );
    assert && assert( yAxisDescriptionProperty.validValues,
      'yAxisDescriptionProperty should have been instantiated with validValues option' );

    options = merge( {
      yAutoScaleProperty: null, // {null|Property.<boolean>}
      tandem: Tandem.REQUIRED
    }, options );

    super( fourierSeries.L, fourierSeries.T, domainProperty,
      xAxisTickLabelFormatProperty, xAxisDescriptionProperty, yAxisDescriptionProperty, options );

    /**
     * Creates the sum data set using current arg values.
     * @returns {Vector2[]}
     */
    const createSumDataSet = () => {
      return fourierSeries.createSumDataSet( xAxisDescriptionProperty.value,
        domainProperty.value, seriesTypeProperty.value, tProperty.value );
    };

    // {Property.<Vector2[]>} the data set for the sum
    const dataSetProperty = new Property( createSumDataSet(), {
      isValidValue: array => Array.isArray( array ) && _.every( array, element => element instanceof Vector2 )
    } );

    // Update the sum when dependencies change. unmultilink is not needed.
    Property.lazyMultilink(
      [ fourierSeries.amplitudesProperty, xAxisDescriptionProperty, domainProperty, seriesTypeProperty, tProperty ],
      () => { dataSetProperty.value = createSumDataSet(); }
    );

    // {DerivedProperty.<number>} the peak amplitude of the sum waveform
    const peakAmplitudeProperty = new DerivedProperty(
      [ dataSetProperty ],
      dataSet => _.maxBy( dataSet, point => point.y ).y
    );

    // @public {null|DerivedProperty.<Range>} auto-scale range of the y axis, fitted to the peak amplitude
    this.yAxisAutoScaleRangeProperty = new DerivedProperty(
      [ peakAmplitudeProperty ],
      peakAmplitude => {

        // no smaller than the max amplitude of one harmonic, with a bit of padding added at top and bottom
        const maxY = Math.max( fourierSeries.amplitudeRange.max, peakAmplitude * 1.05 );
        return new Range( -maxY, maxY );
      } );

    const yAutoScaleProperty = options.yAutoScaleProperty;
    if ( yAutoScaleProperty ) {

      // When auto scale is enabled, link this listener to yAxisAutoScaleRangeProperty, and adjust the y-axis so
      // that's it's appropriate for the auto-scale range.
      const updateYAxisDescription = yAxisAutoScaleRange => {
        assert && assert( yAutoScaleProperty.value, 'should not be called when yAutoScale is disabled' );
        const yAxisDescriptions = yAxisDescriptionProperty.validValues;
        yAxisDescriptionProperty.value = AxisDescription.getAxisDescriptionForRange( yAxisAutoScaleRange, yAxisDescriptions );
      };

      yAutoScaleProperty.link( yAutoScale => {
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

    // @public
    this.fourierSeries = fourierSeries;
    this.dataSetProperty = dataSetProperty;

    // @private
    this.resetSumChart = () => {
      yAutoScaleProperty.reset();
      this.dataSetProperty.reset();
    };
  }

  /**
   * @public
   */
  reset() {
    this.resetSumChart();
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }
}

fourierMakingWaves.register( 'SumChart', SumChart );
export default SumChart;