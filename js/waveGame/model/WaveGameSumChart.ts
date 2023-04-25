// Copyright 2021-2023, University of Colorado Boulder

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
import Tandem from '../../../../tandem/js/Tandem.js';
import AxisDescription from '../../common/model/AxisDescription.js';
import SumChart from '../../common/model/SumChart.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import Domain from '../../common/model/Domain.js';
import SeriesType from '../../common/model/SeriesType.js';
import FourierSeries from '../../common/model/FourierSeries.js';

export default class WaveGameSumChart extends SumChart {

  public readonly guessSeries: FourierSeries;

  // Data set that displays the waveform for the user's guess. Points are ordered by increasing x value.
  public readonly guessDataSetProperty: Property<Vector2[]>;

  public constructor( answerSeries: FourierSeries, guessSeries: FourierSeries, domain: Domain, seriesType: SeriesType,
                      t: number, xAxisDescription: AxisDescription, tandem: Tandem ) {

    super(
      // Superclass will render the sum for the challenge answer.
      answerSeries,

      // These aspects are constant in the Wave Game screen, but the superclass supports dynamic Properties.
      // We use validValues to constrain these Properties to a single value, effectively making them constants.
      new EnumerationProperty( domain, { validValues: [ domain ] } ),
      new EnumerationProperty( seriesType, { validValues: [ seriesType ] } ),
      new NumberProperty( t, { validValues: [ t ] } ),
      new Property( xAxisDescription, { validValues: [ xAxisDescription ] } ),
      tandem
    );

    this.guessSeries = guessSeries;

    // {Property.<Vector2[]>}
    const createGuessDataSet = () => guessSeries.createSumDataSet( xAxisDescription, domain, seriesType, t );

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