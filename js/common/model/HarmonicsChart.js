// Copyright 2021, University of Colorado Boulder

/**
 * HarmonicsChart is the model base class model for the 'Harmonics' chart in the 'Discrete' and 'Wave Game' screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWConstants from '../FMWConstants.js';
import SeriesType from './SeriesType.js';
import WaveformChart from './WaveformChart.js';

class HarmonicsChart extends WaveformChart {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {EmphasizedHarmonics} emphasizedHarmonics
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<SeriesType>} seriesTypeProperty
   * @param {Property.<number>} tProperty
   * @param {Property.<TickLabelFormat>} xAxisTickLabelFormatProperty
   * @param {Property.<AxisDescription>} xAxisDescriptionProperty
   * @param {Property.<AxisDescription>} yAxisDescriptionProperty
   * @param {Object} [options]
   */
  constructor( fourierSeries, emphasizedHarmonics, domainProperty, seriesTypeProperty, tProperty,
               xAxisTickLabelFormatProperty, xAxisDescriptionProperty, yAxisDescriptionProperty,
               options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( seriesTypeProperty, SeriesType );
    assert && AssertUtils.assertPropertyOf( tProperty, 'number' );

    options = merge( {

      // HarmonicsChart options
      yAxisDescriptionIndex: 0
    }, options );

    assert && assert( !options.yAutoScaleProperty, 'y auto-scale is not currently supported' );

    super( fourierSeries.L, fourierSeries.T, domainProperty,
      xAxisTickLabelFormatProperty, xAxisDescriptionProperty, yAxisDescriptionProperty, options );

    // @public
    this.fourierSeries = fourierSeries;
    this.emphasizedHarmonics = emphasizedHarmonics;

    /**
     * Creates the data set for a harmonic using current arg values.
     * @param {Harmonic} harmonic
     * @returns {Vector2[]}
     */
    const createDataSet = harmonic => {

      // The number of points for each harmonic plot is a function of order, because higher-frequency harmonics require
      // more points to draw a smooth plot.
      const numberOfPoints = Math.ceil( FMWConstants.MAX_POINTS_PER_DATA_SET *
                                        harmonic.order / fourierSeries.harmonics.length );

      return harmonic.createDataSet( numberOfPoints, fourierSeries.L, fourierSeries.T,
        xAxisDescriptionProperty.value, domainProperty.value, seriesTypeProperty.value, tProperty.value );
    };

    // @public {Property.<Vector2[]>[]} a data set for each harmonic, indexed in harmonic order
    // A data set is updated when any of its dependencies changes.
    this.harmonicDataSetProperties = [];
    for ( let i = 0; i < fourierSeries.harmonics.length; i++ ) {

      const harmonic = fourierSeries.harmonics[ i ];

      // {Property.<Vector2[]>} the data set for this harmonic
      //TODO shouldn't this be a DerivedProperty, derived from the dependencies in the multilink below?
      const dataSetProperty = new Property( createDataSet( harmonic ), {
        isValidValue: array => Array.isArray( array ) && _.every( array, element => element instanceof Vector2 )
      } );
      this.harmonicDataSetProperties.push( dataSetProperty );

      // Update the harmonic's data set when dependencies change.
      Property.lazyMultilink(
        [ harmonic.amplitudeProperty, xAxisDescriptionProperty, domainProperty, seriesTypeProperty, tProperty ],
        () => {
          dataSetProperty.value = createDataSet( harmonic );
        } );
    }
  }

  /**
   * @public
   */
  reset() {
    this.harmonicDataSetProperties.forEach( dataSetProperty => dataSetProperty.reset() );
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