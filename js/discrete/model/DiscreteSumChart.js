// Copyright 2021, University of Colorado Boulder

/**
 * DiscreteSumChart is the model for the 'Sum' chart in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import SumChart from '../../common/model/SumChart.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class DiscreteSumChart extends SumChart {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<SeriesType>} seriesTypeProperty
   * @param {Property.<number>} tProperty
   * @param {Property.<number>} xZoomLevelProperty
   * @param {Property.<AxisDescription>} xAxisDescriptionProperty
   * @param {Object} [options]
   */
  constructor( fourierSeries, domainProperty, seriesTypeProperty, tProperty, xZoomLevelProperty,
               xAxisDescriptionProperty, options ) {
    super( fourierSeries, domainProperty, seriesTypeProperty, tProperty, xZoomLevelProperty,
      xAxisDescriptionProperty, options );
  }
}

fourierMakingWaves.register( 'DiscreteSumChart', DiscreteSumChart );
export default DiscreteSumChart;