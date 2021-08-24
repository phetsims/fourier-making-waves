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
   * @param {Object} [options]
   */
  constructor( answerSeries, guessSeries, domain, seriesType, t, xAxisDescription, options ) {

    assert && assert( xAxisDescription instanceof AxisDescription );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    super(
      // Superclass will render the sum for the challenge answer.
      answerSeries,

      // These aspects are constant in the Wave Game screen, but the superclass supports dynamic Properties.
      // We use validValues to constrain these Properties to a single value, effectively making them constants.
      new EnumerationProperty( Domain, domain, { validValues: [ domain ] } ),
      new EnumerationProperty( SeriesType, seriesType, { validValues: [ seriesType ] } ),
      new NumberProperty( t, { validValues: [ t ] } ),
      new Property( xAxisDescription, { validValues: [ xAxisDescription ] } ),

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