// Copyright 2021, University of Colorado Boulder

/**
 * SumChart is the model base class for the 'Sum' chart in the 'Discrete' and 'Wave Game' screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Range from '../../../../dot/js/Range.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import DiscreteAxisDescriptions from '../../discrete/model/DiscreteAxisDescriptions.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import AxisDescription from './AxisDescription.js';
import Domain from './Domain.js';
import DomainChart from './DomainChart.js';
import FourierSeries from './FourierSeries.js';
import SeriesType from './SeriesType.js';

class SumChart extends DomainChart {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<SeriesType>} seriesTypeProperty
   * @param {Property.<number>} tProperty
   * @param {Property.<AxisDescription>} xAxisDescriptionProperty
   * @param {Object} [options]
   */
  constructor( fourierSeries, domainProperty, seriesTypeProperty, tProperty,
               xAxisDescriptionProperty, options ) {

    assert && assert( fourierSeries instanceof FourierSeries );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertEnumerationPropertyOf( seriesTypeProperty, SeriesType );
    assert && AssertUtils.assertPropertyOf( tProperty, 'number' );
    assert && AssertUtils.assertPropertyOf( xAxisDescriptionProperty, AxisDescription );

    super( domainProperty, xAxisDescriptionProperty, fourierSeries.L, fourierSeries.T, options );

    // @public (read-only)
    this.fourierSeries = fourierSeries;

    // @public {DerivedProperty.<Vector2[]>} The data set for the sum. Points are ordered by increasing x value.
    this.sumDataSetProperty = new DerivedProperty(
      [ fourierSeries.amplitudesProperty, xAxisDescriptionProperty, domainProperty, seriesTypeProperty, tProperty ],
      ( amplitudes, xAxisDescription, domain, seriesType, t ) =>
        fourierSeries.createSumDataSet( xAxisDescription, domain, seriesType, t )
    );

    //REVIEW: When could this be null?
    // @public {null|DerivedProperty.<Range>} range of the y axis, fitted to the sum's peak amplitude
    this.yAxisRangeProperty = new DerivedProperty(
      [ this.sumDataSetProperty ],
      sumDataSet => {

        const peakAmplitude = _.maxBy( sumDataSet, point => point.y ).y;

        // no smaller than the max amplitude of one harmonic, with a bit of padding added at top and bottom
        const maxY = Math.max( fourierSeries.amplitudeRange.max, peakAmplitude * 1.05 );
        return new Range( -maxY, maxY );
      } );

    // @public {DerivedProperty.<AxisDescription>} y-axis description that is the best-fit for yAxisRangeProperty
    this.yAxisDescriptionProperty = new DerivedProperty(
      [ this.yAxisRangeProperty ],
      yAxisRange => AxisDescription.getBestFit( yAxisRange, DiscreteAxisDescriptions.Y_AXIS_DESCRIPTIONS ), {
        validValues: DiscreteAxisDescriptions.Y_AXIS_DESCRIPTIONS
      } );
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