// Copyright 2021, University of Colorado Boulder

//TODO change this to display the sums for more than 1 FourierSeries?
/**
 * SumChart is the model base class for the 'Sum' chart.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
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
   * @param {AxisDescription[]} yAxisDescriptions
   * @param {Object} [options]
   */
  constructor( fourierSeries, domainProperty, seriesTypeProperty, tProperty,
               xAxisTickLabelFormatProperty, xAxisDescriptionProperty, yAxisDescriptions, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( seriesTypeProperty, SeriesType );
    assert && AssertUtils.assertPropertyOf( tProperty, 'number' );

    options = merge( {
      yAutoScale: false,
      yAxisDescriptionIndex: 0,
      tandem: Tandem.REQUIRED
    }, options );

    // whether the Sum chart's y-axis automatically scales to fit its data set
    const yAutoScaleProperty = new BooleanProperty( options.yAutoScale, {
      tandem: options.tandem.createTandem( 'yAutoScaleProperty' )
    } );

    /**
     * Creates the sum data set using current arg values.
     * @returns {Vector2[]}
     */
    const createDataSet = () => {
      return fourierSeries.createSumDataSet( xAxisDescriptionProperty.value,
        domainProperty.value, seriesTypeProperty.value, tProperty.value );
    };

    // {Property.<Vector2[]>} the data set for the sum
    const dataSetProperty = new Property( createDataSet(), {
      isValidValue: array => Array.isArray( array ) && _.every( array, element => element instanceof Vector2 )
      //TODO tandem
    } );

    //TODO performance: determine this while creating the sum data set
    // {DerivedProperty.<number>} the peak amplitude of the sum waveform
    const peakAmplitudeProperty = new DerivedProperty(
      [ dataSetProperty ],
      dataSet => _.maxBy( dataSet, point => point.y ).y
    );

    //TODO derive this value only while auto scale is enabled?
    // {DerivedProperty.<Range>} auto-scale range of the y axis, fitted to the sum's max amplitude
    const yAxisAutoScaleRangeProperty = new DerivedProperty(
      [ peakAmplitudeProperty ],
      peakAmplitude => {

        // no smaller than range of amplitude, with a bit of padding added at top and bottom
        const maxY = Math.max( peakAmplitude * 1.05, fourierSeries.amplitudeRange.max );
        return new Range( -maxY, maxY );
      }, {
        //TODO tandem
      } );

    // The initial y-axis description depends on whether auto scale is initially enabled.
    const initialYAxisDescription = yAutoScaleProperty.value ?
                                    AxisDescription.getAxisDescriptionForRange( yAxisAutoScaleRangeProperty.value, yAxisDescriptions ) :
                                    yAxisDescriptions[ options.yAxisDescriptionIndex ];

    // {Property.<AxisDescription>} describes the properties of the y axis. dispose is not needed
    const yAxisDescriptionProperty = new Property( initialYAxisDescription, {
      validValues: yAxisDescriptions
    } );

    // When auto scale is enabled, link this listener to yAxisAutoScaleRangeProperty, and adjust the y-axis so
    // that's it's appropriate for the auto-scale range.
    const updateYAxisDescription = yAxisAutoScaleRange => {
      assert && assert( yAutoScaleProperty.value, 'should not be called when yAutoScale is disabled' );
      yAxisDescriptionProperty.value = AxisDescription.getAxisDescriptionForRange( yAxisAutoScaleRange, yAxisDescriptions );
    };
    yAutoScaleProperty.link( yAutoScale => {
      if ( yAutoScale ) {
        yAxisAutoScaleRangeProperty.link( updateYAxisDescription );
      }
      else {
        if ( yAxisAutoScaleRangeProperty.hasListener( updateYAxisDescription ) ) {
          yAxisAutoScaleRangeProperty.unlink( updateYAxisDescription );
        }
      }
    } );

    // Update the sum when dependencies change. unmultilink is not needed.
    Property.lazyMultilink(
      [ fourierSeries.amplitudesProperty, xAxisDescriptionProperty, domainProperty, seriesTypeProperty, tProperty ],
      () => { dataSetProperty.value = createDataSet(); }
    );

    super( fourierSeries, domainProperty,
      xAxisTickLabelFormatProperty, xAxisDescriptionProperty, yAxisDescriptionProperty, options );

    // @public
    this.yAutoScaleProperty = yAutoScaleProperty;
    this.dataSetProperty = dataSetProperty;
    this.yAxisAutoScaleRangeProperty = yAxisAutoScaleRangeProperty;
    this.yAxisDescriptionProperty = yAxisDescriptionProperty;
  }

  /**
   * @public
   */
  reset() {
    this.yAutoScaleProperty.reset();
    this.dataSetProperty.reset();
    this.yAxisDescriptionProperty.reset();
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