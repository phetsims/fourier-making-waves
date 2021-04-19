// Copyright 2021, University of Colorado Boulder

/**
 * WaveGameSumChart is the model for the 'Sum' chart in the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Domain from '../../common/model/Domain.js';
import SeriesType from '../../common/model/SeriesType.js';
import SumChart from '../../common/model/SumChart.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class WaveGameSumChart extends SumChart {

  /**
   * @param {FourierSeries} guessFourierSeries
   * @param {NumberProperty} xZoomLevelProperty
   * @param {Property.<AxisDescription>} xAxisDescriptionProperty
   * @param {Object} [options]
   */
  constructor( guessFourierSeries, xZoomLevelProperty, xAxisDescriptionProperty, options ) {

    super(
      guessFourierSeries,
      new EnumerationProperty( Domain, Domain.SPACE ), //TODO eliminate?
      new EnumerationProperty( SeriesType, SeriesType.SINE ), //TODO eliminate?
      new NumberProperty( 0 ), //TODO eliminate?
      xZoomLevelProperty,
      xAxisDescriptionProperty,
      options
    );

    //TODO compute sum for answerFourierSeries
    //TODO scale y-axis to sum for answerFourierSeries (by toggling auto-scale on & off?)
  }
}

fourierMakingWaves.register( 'WaveGameSumChart', WaveGameSumChart );
export default WaveGameSumChart;