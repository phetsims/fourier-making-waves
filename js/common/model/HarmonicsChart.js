// Copyright 2021, University of Colorado Boulder

/**
 * HarmonicsChart is the model base class model for the 'Harmonics' chart in the 'Discrete' and 'Wave Game' screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWConstants from '../FMWConstants.js';
import AxisDescription from './AxisDescription.js';
import Domain from './Domain.js';
import EmphasizedHarmonics from './EmphasizedHarmonics.js';
import FourierSeries from './FourierSeries.js';
import SeriesType from './SeriesType.js';
import WaveformChart from './WaveformChart.js';

class HarmonicsChart extends WaveformChart {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {EmphasizedHarmonics} emphasizedHarmonics
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<SeriesType>} seriesTypeProperty
   * @param {Property.<number>} tProperty
   * @param {Property.<AxisDescription>} xAxisDescriptionProperty
   * @param {Property.<AxisDescription>} yAxisDescriptionProperty
   * @param {Object} [options]
   */
  constructor( fourierSeries, emphasizedHarmonics, domainProperty, seriesTypeProperty, tProperty,
               xAxisDescriptionProperty, yAxisDescriptionProperty, options ) {

    assert && assert( fourierSeries instanceof FourierSeries );
    assert && assert( emphasizedHarmonics instanceof EmphasizedHarmonics );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertEnumerationPropertyOf( seriesTypeProperty, SeriesType );
    assert && AssertUtils.assertPropertyOf( tProperty, 'number' );
    assert && AssertUtils.assertPropertyOf( xAxisDescriptionProperty, AxisDescription );
    assert && AssertUtils.assertPropertyOf( yAxisDescriptionProperty, AxisDescription );

    options = merge( {

      // HarmonicsChart options
      yAxisDescriptionIndex: 0
    }, options );

    super( fourierSeries.L, fourierSeries.T, domainProperty, xAxisDescriptionProperty, yAxisDescriptionProperty, options );

    // @public
    this.fourierSeries = fourierSeries;
    this.emphasizedHarmonics = emphasizedHarmonics;

    // @public {DerivedProperty.<Vector2[]>[]} a data set for each harmonic, indexed in harmonic order.
    // Points are ordered by increasing x value.
    this.harmonicDataSetProperties = [];
    for ( let i = 0; i < fourierSeries.harmonics.length; i++ ) {

      const harmonic = fourierSeries.harmonics[ i ];

      // The number of points for each harmonic plot is a function of order, because higher-frequency harmonics require
      // more points to draw a smooth plot.
      const numberOfPoints = Math.ceil( FMWConstants.MAX_POINTS_PER_DATA_SET *
                                        harmonic.order / fourierSeries.harmonics.length );

      // {Property.<Vector2[]>} the data set for this harmonic
      const dataSetProperty = new DerivedProperty(
        [ harmonic.amplitudeProperty, xAxisDescriptionProperty, domainProperty, seriesTypeProperty, tProperty ],
        ( amplitude, xAxisDescription, domain, seriesType, t ) => {
          return harmonic.createDataSet( numberOfPoints, fourierSeries.L, fourierSeries.T, xAxisDescription,
            domain, seriesType, t );
        } );
      this.harmonicDataSetProperties.push( dataSetProperty );
    }
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