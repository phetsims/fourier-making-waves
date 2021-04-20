// Copyright 2021, University of Colorado Boulder

//TODO This is a bit unclear. It's using SumChart.sumDataSetProperty for the answer, and adding guessDataSetProperty.
/**
 * WaveGameSumChart is the model for the 'Sum' chart in the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import Domain from '../../common/model/Domain.js';
import SeriesType from '../../common/model/SeriesType.js';
import SumChart from '../../common/model/SumChart.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

// constants
const DOMAIN = Domain.SPACE;
const SERIES_TYPE = SeriesType.SINE;
const t = 0; // lowercase t (for time) to distinguish from uppercase T (for period)

class WaveGameSumChart extends SumChart {

  /**
   * @param {FourierSeries} answerFourierSeries
   * @param {FourierSeries} guessFourierSeries
   * @param {NumberProperty} xZoomLevelProperty
   * @param {Property.<AxisDescription>} xAxisDescriptionProperty
   * @param {Object} [options]
   */
  constructor( answerFourierSeries, guessFourierSeries, xZoomLevelProperty, xAxisDescriptionProperty, options ) {

    options = merge( {
      autoScale: true //TODO This causes the chart to auto scale to answerFourierSeries. Too clever?
    }, options );

    super(
      answerFourierSeries,
      new EnumerationProperty( Domain, DOMAIN ), //TODO eliminate?
      new EnumerationProperty( SeriesType, SERIES_TYPE ), //TODO eliminate?
      new NumberProperty( t ), //TODO eliminate?
      xZoomLevelProperty,
      xAxisDescriptionProperty,
      options
    );

    const createGuessDataSet = () => {
      return guessFourierSeries.createSumDataSet( xAxisDescriptionProperty.value, DOMAIN, SERIES_TYPE, t );
    };

    // @public
    this.guessDataSetProperty = new Property( createGuessDataSet(), {
      isValidValue: array => Array.isArray( array ) && _.every( array, element => element instanceof Vector2 )
      //TODO tandem
    } );

    guessFourierSeries.amplitudesProperty.lazyLink( () => {
      this.guessDataSetProperty.value =
        guessFourierSeries.createSumDataSet( xAxisDescriptionProperty.value, DOMAIN, SERIES_TYPE, t );
    } );
  }
}

fourierMakingWaves.register( 'WaveGameSumChart', WaveGameSumChart );
export default WaveGameSumChart;