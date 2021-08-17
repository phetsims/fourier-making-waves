// Copyright 2021, University of Colorado Boulder

/**
 * WaveGameSumChart is the model for the 'Sum' chart in the 'Wave Game' screen. Computing the sum for the
 * challenge answer is delegated to SumChartNode, which is capable of summing one Fourier series.
 * This class is responsible for summing the challenge guess, the amplitudes entered by the user.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import AxisDescription from '../../common/model/AxisDescription.js';
import Domain from '../../common/model/Domain.js';
import SeriesType from '../../common/model/SeriesType.js';
import SumChart from '../../common/model/SumChart.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class WaveGameSumChart extends SumChart {

  /**
   * @param {FourierSeries} answerSeries
   * @param {FourierSeries} guessSeries
   * @param {Domain} domain
   * @param {SeriesType} seriesType
   * @param {number} t
   * @param {AxisDescription} xAxisDescription
   * @param {AxisDescription[]} yAxisDescriptions
   * @param {Object} [options]
   */
  constructor( answerSeries, guessSeries, domain, seriesType, t,
               xAxisDescription, yAxisDescriptions, options ) {

    assert && assert( xAxisDescription instanceof AxisDescription );
    assert && AssertUtils.assertArrayOf( yAxisDescriptions, AxisDescription );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    super(
      // Superclass will render the sum for the challenge answer.
      answerSeries,

      // These aspects are static in the Wave Game screen, but dynamic in the superclass.
      new EnumerationProperty( Domain, domain ),
      new EnumerationProperty( SeriesType, seriesType ),
      new NumberProperty( t ),

      // Sum chart has a static x-axis scale, with no zoom buttons.
      new Property( xAxisDescription, { validValues: [ xAxisDescription ] } ),

      // Sum chart has no y-axis zoom buttons, but the y-axis scales to fit the challenge.
      new Property( yAxisDescriptions[ 0 ], { validValues: yAxisDescriptions } ),
      options
    );

    // @public (read-only)
    this.guessSeries = guessSeries;

    const createGuessDataSet = () => guessSeries.createSumDataSet( xAxisDescription, domain, seriesType, t );

    // @public Data set that displays the waveform for the user's guess. Points are ordered by increasing x value.
    this.guessDataSetProperty = new Property( createGuessDataSet(), {
      isValidValue: array => Array.isArray( array ) && _.every( array, element => element instanceof Vector2 )
    } );

    // When the guess amplitudes change, update the corresponding data set for the sum.
    guessSeries.amplitudesProperty.lazyLink( () => {
      this.guessDataSetProperty.value = createGuessDataSet();
    } );
  }
}

fourierMakingWaves.register( 'WaveGameSumChart', WaveGameSumChart );
export default WaveGameSumChart;