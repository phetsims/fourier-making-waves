// Copyright 2021, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import FourierSeries from '../../common/model/FourierSeries.js';
import Domain from '../../discrete/model/Domain.js';
import SeriesType from '../../discrete/model/SeriesType.js';
import SumChart from '../../discrete/model/SumChart.js'; //TODO discrete
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WaveGameChallenge from './WaveGameChallenge.js';

class WaveGameSumChart extends SumChart {

  /**
   * @param {Property.<WaveGameChallenge>} challengeProperty
   * @param {Property.<number>} xZoomLevelProperty
   * @param {Property.<AxisDescription>} xAxisDescriptionProperty
   * @param {Object} [options]
   */
  constructor( challengeProperty, xZoomLevelProperty, xAxisDescriptionProperty, options ) {

    assert && AssertUtils.assertPropertyOf( challengeProperty, WaveGameChallenge );

    //TODO duplicated elsewhere
    // These aspects of the Harmonics chart do not change in the Wave Game screen.
    const domainProperty = new EnumerationProperty( Domain, Domain.SPACE );
    const seriesTypeProperty = new EnumerationProperty( SeriesType, SeriesType.SINE );
    const tProperty = new NumberProperty( 0 );

    const adapterFourierSeries = new FourierSeries();

    super( adapterFourierSeries, domainProperty, seriesTypeProperty, tProperty,
      xZoomLevelProperty, xAxisDescriptionProperty, options );

    //TODO copied from WaveGameHarmonicsChart
    // When the challenge changes, set the amplitudes to match the guess amplitudes.  When a challenge is created
    // the guess amplitudes will be zero. But if we use the "solve" debug feature, the guess amplitudes will be
    // filled in with the correct amplitudes, and we want that to be reflected in the Amplitudes chart.
    const guessAmplitudesListener = amplitudes => adapterFourierSeries.setAmplitudes( amplitudes );
    challengeProperty.link( ( challenge, previousChallenge ) => {
      if ( previousChallenge ) {
        previousChallenge.guessFourierSeries.amplitudesProperty.unlink( guessAmplitudesListener );
      }
      challenge.guessFourierSeries.amplitudesProperty.link( guessAmplitudesListener );
    } );

    //TODO copied from WaveGameHarmonicsChart
    // When an amplitude is changed via the chart, update the corresponding amplitude in the challenge's guess.
    // unlink is not needed.
    for ( let i = 0; i < adapterFourierSeries.harmonics.length; i++ ) {
      const order = i + 1;
      adapterFourierSeries.harmonics[ i ].amplitudeProperty.link( amplitude => {
        challengeProperty.value.guessFourierSeries.harmonics[ order - 1 ].amplitudeProperty.value = amplitude;
      } );
    }

    // @public (read-only)
    this.challengeProperty = challengeProperty;
    this.adapterFourierSeries = adapterFourierSeries;
  }
}

fourierMakingWaves.register( 'WaveGameSumChart', WaveGameSumChart );
export default WaveGameSumChart;