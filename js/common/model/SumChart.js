// Copyright 2021, University of Colorado Boulder

/**
 * SumChart is the model base class for the 'Sum' chart in the 'Discrete' and 'Wave Game' screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Range from '../../../../dot/js/Range.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import AxisDescription from './AxisDescription.js';
import Domain from './Domain.js';
import FourierSeries from './FourierSeries.js';
import SeriesType from './SeriesType.js';
import WaveformChart from './WaveformChart.js';

class SumChart extends WaveformChart {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<SeriesType>} seriesTypeProperty
   * @param {Property.<number>} tProperty
   * @param {Property.<AxisDescription>} xAxisDescriptionProperty
   * @param {Property.<AxisDescription>} yAxisDescriptionProperty
   * @param {Object} [options]
   */
  constructor( fourierSeries, domainProperty, seriesTypeProperty, tProperty,
               xAxisDescriptionProperty, yAxisDescriptionProperty, options ) {

    assert && assert( fourierSeries instanceof FourierSeries );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertEnumerationPropertyOf( seriesTypeProperty, SeriesType );
    assert && AssertUtils.assertPropertyOf( tProperty, 'number' );
    assert && AssertUtils.assertPropertyOf( xAxisDescriptionProperty, AxisDescription );
    assert && AssertUtils.assertPropertyOf( yAxisDescriptionProperty, AxisDescription );
    assert && assert( yAxisDescriptionProperty.validValues );

    super( fourierSeries.L, fourierSeries.T, domainProperty, xAxisDescriptionProperty, yAxisDescriptionProperty, options );

    // {DerivedProperty.<Vector2[]>} The data set for the sum. Points are ordered by increasing x value.
    const sumDataSetProperty = new DerivedProperty(
      [ fourierSeries.amplitudesProperty, xAxisDescriptionProperty, domainProperty, seriesTypeProperty, tProperty ],
      ( amplitudes, xAxisDescription, domain, seriesType, t ) =>
        fourierSeries.createSumDataSet( xAxisDescription, domain, seriesType, t )
    );

    // @public {null|DerivedProperty.<Range>} range of the y axis, fitted to the sum's peak amplitude
    this.yAxisRangeProperty = new DerivedProperty(
      [ sumDataSetProperty ],
      sumDataSet => {

        const peakAmplitude = _.maxBy( sumDataSet, point => point.y ).y;

        // no smaller than the max amplitude of one harmonic, with a bit of padding added at top and bottom
        const maxY = Math.max( fourierSeries.amplitudeRange.max, peakAmplitude * 1.05 );
        return new Range( -maxY, maxY );
      } );

    // When the y-axis range changes, choose the best-fit for y-axis description.
    this.yAxisRangeProperty.link( yAxisRange => {
      const yAxisDescriptions = yAxisDescriptionProperty.validValues;
      yAxisDescriptionProperty.value = AxisDescription.getAxisDescriptionForRange( yAxisRange, yAxisDescriptions );
    } );

    // @public
    this.fourierSeries = fourierSeries;
    this.sumDataSetProperty = sumDataSetProperty;
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