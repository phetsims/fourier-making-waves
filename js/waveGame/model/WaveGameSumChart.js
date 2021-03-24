// Copyright 2021, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import SumChart from '../../discrete/model/SumChart.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class WaveGameSumChart extends SumChart {

  /**
   * @param {FourierSeries} guessFourierSeries
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<SeriesType>} seriesTypeProperty
   * @param {Property.<number>} tProperty
   * @param {Property.<number>} xZoomLevelProperty
   * @param {Property.<AxisDescription>} xAxisDescriptionProperty
   * @param {Object} [options]
   */
  constructor( guessFourierSeries, domainProperty, seriesTypeProperty, tProperty, xZoomLevelProperty,
               xAxisDescriptionProperty, options ) {

    super( guessFourierSeries, domainProperty, seriesTypeProperty, tProperty, xZoomLevelProperty,
      xAxisDescriptionProperty, options );

    //TODO compute sum for answerFourierSeries
    //TODO scale y-axis to sum for answerFourierSeries (by toggling auto-scale on & off?)
  }
}

fourierMakingWaves.register( 'WaveGameSumChart', WaveGameSumChart );
export default WaveGameSumChart;