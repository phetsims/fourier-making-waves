// Copyright 2021, University of Colorado Boulder

/**
 * WaveGameHarmonicsChart is the model for the 'Harmonics' chart in the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import FourierSeries from '../../common/model/FourierSeries.js';
import HarmonicsChart from '../../discrete/model/HarmonicsChart.js'; //TODO discrete
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WaveGameChallenge from './WaveGameChallenge.js';

class WaveGameHarmonicsChart extends HarmonicsChart {

  /**
   * @param {Property.<WaveGameChallenge>} challengeProperty
   *  @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<SeriesType>} seriesTypeProperty
   * @param {Property.<number>} tProperty
   * @param {Object} [options]
   */
  constructor( challengeProperty, domainProperty, seriesTypeProperty, tProperty, options ) {

    assert && AssertUtils.assertPropertyOf( challengeProperty, WaveGameChallenge );

    const adapterFourierSeries = new FourierSeries();

    super( adapterFourierSeries, domainProperty, seriesTypeProperty, tProperty, options );

    //TODO duplicated elsewhere
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

    //TODO duplicated elsewhere
    // When an amplitude is changed via the chart, update the corresponding amplitude in the challenge's guess.
    // unlink is not needed.
    for ( let i = 0; i < adapterFourierSeries.harmonics.length; i++ ) {
      const order = i + 1;
      adapterFourierSeries.harmonics[ i ].amplitudeProperty.link( amplitude => {
        challengeProperty.value.guessFourierSeries.harmonics[ order - 1 ].amplitudeProperty.value = amplitude;
      } );
    }

    // @public (read-only)
    this.adapterFourierSeries = adapterFourierSeries;
  }
}

fourierMakingWaves.register( 'WaveGameHarmonicsChart', WaveGameHarmonicsChart );
export default WaveGameHarmonicsChart;