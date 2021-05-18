// Copyright 2021, University of Colorado Boulder

//TODO change this to display the sums for more than 1 FourierSeries?
/**
 * SumChart is the model base class for the 'Sum' chart.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
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
               xAxisTickLabelFormatProperty, xAxisDescriptionProperty, yAxisDescriptionProperty, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( seriesTypeProperty, SeriesType );
    assert && AssertUtils.assertPropertyOf( tProperty, 'number' );
    assert && assert( yAxisDescriptionProperty.validValues,
      'yAxisDescriptionProperty should have been instantiated with validValues option' );

    options = merge( {
      yAutoScaleMin: fourierSeries.amplitudeRange.max,
      tandem: Tandem.REQUIRED
    }, options );

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

    if ( options.yAutoScaleProperty ) {

      // {DerivedProperty.<number>} the peak amplitude of the sum waveform
      const peakAmplitudeProperty = new DerivedProperty(
        [ dataSetProperty ],
        dataSet => _.maxBy( dataSet, point => point.y ).y
      );

      assert && assert( !options.peakAmplitudeProperty );
      options.peakAmplitudeProperty = peakAmplitudeProperty;
    }

    super( fourierSeries.L, fourierSeries.T, domainProperty,
      xAxisTickLabelFormatProperty, xAxisDescriptionProperty, yAxisDescriptionProperty, options );

    // Update the sum when dependencies change. unmultilink is not needed.
    Property.lazyMultilink(
      [ fourierSeries.amplitudesProperty, xAxisDescriptionProperty, domainProperty, seriesTypeProperty, tProperty ],
      () => { dataSetProperty.value = createDataSet(); }
    );

    // @public
    this.fourierSeries = fourierSeries;
    this.dataSetProperty = dataSetProperty;

    // @private
    this.resetSumChart = () => {
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