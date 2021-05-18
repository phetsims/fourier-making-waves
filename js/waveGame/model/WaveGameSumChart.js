// Copyright 2021, University of Colorado Boulder

//TODO This is a bit unclear. It's using SumChart.dataSetProperty for the answer, and adding guessDataSetProperty.
/**
 * WaveGameSumChart is the model for the 'Sum' chart in the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import AxisDescription from '../../common/model/AxisDescription.js';
import Domain from '../../common/model/Domain.js';
import SeriesType from '../../common/model/SeriesType.js';
import SumChart from '../../common/model/SumChart.js';
import TickLabelFormat from '../../common/model/TickLabelFormat.js';
import XAxisDescription from '../../common/model/XAxisDescription.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class WaveGameSumChart extends SumChart {

  /**
   * @param {FourierSeries} answerFourierSeries
   * @param {FourierSeries} guessFourierSeries
   * @param {Domain} domain
   * @param {SeriesType} seriesType
   * @param {number} t
   * @param {XAxisDescription} xAxisDescription
   * @param {AxisDescription[]} yAxisDescriptions
   * @param {Object} [options]
   */
  constructor( answerFourierSeries, guessFourierSeries, domain, seriesType, t,
               xAxisDescription, yAxisDescriptions, options ) {

    assert && assert( xAxisDescription instanceof XAxisDescription );
    assert && AssertUtils.assertArrayOf( yAxisDescriptions, AxisDescription );

    options = merge( {
      //TODO This causes the chart to auto scale to answerFourierSeries. Too clever?
      yAutoScaleProperty: new BooleanProperty( true )
    }, options );

    super(
      answerFourierSeries,

      // These aspects are static in the Wave Game screen, but dynamic in the superclass.
      new EnumerationProperty( Domain, domain ),
      new EnumerationProperty( SeriesType, seriesType ),
      new NumberProperty( t ),
      new Property( TickLabelFormat.NUMERIC ),

      // Sum chart has a static x-axis scale, with no zoom buttons.
      new Property( xAxisDescription, { validValues: [ xAxisDescription ] } ),

      // Sum chart has no y-axis zoom buttons, but the y-axis scales to fit the challenge.
      new Property( yAxisDescriptions[ 0 ], { validValues: yAxisDescriptions } ),
      options
    );

    // @public
    this.guessFourierSeries = guessFourierSeries;

    const createGuessDataSet = () => guessFourierSeries.createSumDataSet( xAxisDescription, domain, seriesType, t );

    // @public
    this.guessDataSetProperty = new Property( createGuessDataSet(), {
      isValidValue: array => Array.isArray( array ) && _.every( array, element => element instanceof Vector2 )
      //TODO tandem
    } );

    guessFourierSeries.amplitudesProperty.lazyLink( () => {
      this.guessDataSetProperty.value = createGuessDataSet();
    } );
  }
}

fourierMakingWaves.register( 'WaveGameSumChart', WaveGameSumChart );
export default WaveGameSumChart;