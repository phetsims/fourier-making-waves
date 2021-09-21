// Copyright 2021, University of Colorado Boulder

/**
 * HarmonicsChart is the model base class model for the 'Harmonics' chart in the 'Discrete' and 'Wave Game' screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import DiscreteAxisDescriptions from '../../discrete/model/DiscreteAxisDescriptions.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWConstants from '../FMWConstants.js';
import AxisDescription from './AxisDescription.js';
import Domain from './Domain.js';
import DomainChart from './DomainChart.js';
import EmphasizedHarmonics from './EmphasizedHarmonics.js';
import FourierSeries from './FourierSeries.js';
import SeriesType from './SeriesType.js';

class HarmonicsChart extends DomainChart {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {EmphasizedHarmonics} emphasizedHarmonics
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<SeriesType>} seriesTypeProperty
   * @param {Property.<number>} tProperty
   * @param {Property.<AxisDescription>} xAxisDescriptionProperty
   * @param {Object} [options]
   */
  constructor( fourierSeries, emphasizedHarmonics, domainProperty, seriesTypeProperty, tProperty,
               xAxisDescriptionProperty, options ) {

    assert && assert( fourierSeries instanceof FourierSeries );
    assert && assert( emphasizedHarmonics instanceof EmphasizedHarmonics );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertEnumerationPropertyOf( seriesTypeProperty, SeriesType );
    assert && AssertUtils.assertPropertyOf( tProperty, 'number' );
    assert && AssertUtils.assertPropertyOf( xAxisDescriptionProperty, AxisDescription );

    super( domainProperty, xAxisDescriptionProperty, fourierSeries.L, fourierSeries.T, options );

    // @public (read-only)
    this.fourierSeries = fourierSeries;
    this.emphasizedHarmonics = emphasizedHarmonics;

    // @public (read-only) {AxisDescription} fixed y-axis
    this.yAxisDescription = DiscreteAxisDescriptions.DEFAULT_Y_AXIS_DESCRIPTION;

    // @public {DerivedProperty.<Vector2[]>[]} a data set for each harmonic, indexed in harmonic order.
    // Points are ordered by increasing x value.
    this.harmonicDataSetProperties = fourierSeries.harmonics.map( harmonic => {

      // The number of points for each harmonic plot is a function of order, because higher-frequency harmonics require
      // more points to draw a smooth plot.
      const numberOfPoints = Math.ceil( FMWConstants.MAX_POINTS_PER_DATA_SET *
                                        harmonic.order / fourierSeries.harmonics.length );

      // {Property.<Vector2[]>} the data set for this harmonic
      return new DerivedProperty(
        [ harmonic.amplitudeProperty, xAxisDescriptionProperty, domainProperty, seriesTypeProperty, tProperty ],
        ( amplitude, xAxisDescription, domain, seriesType, t ) => {
          return harmonic.createDataSet( numberOfPoints, fourierSeries.L, fourierSeries.T, xAxisDescription,
            domain, seriesType, t );
        } );
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

fourierMakingWaves.register( 'HarmonicsChart', HarmonicsChart );
export default HarmonicsChart;