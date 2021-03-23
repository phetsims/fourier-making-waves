// Copyright 2021, University of Colorado Boulder

/**
 * WaveGameHarmonicsChart is the model for the 'Harmonics' chart in the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import FourierSeries from '../../common/model/FourierSeries.js';
import Domain from '../../discrete/model/Domain.js'; //TODO discrete
import HarmonicsChart from '../../discrete/model/HarmonicsChart.js'; //TODO discrete
import SeriesType from '../../discrete/model/SeriesType.js'; //TODO discrete
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WaveGameChallenge from './WaveGameChallenge.js';

class WaveGameHarmonicsChart extends HarmonicsChart {

  /**
   * @param {Property.<WaveGameChallenge>} challengeProperty
   * @param {Object} [options]
   */
  constructor( challengeProperty, options ) {

    assert && AssertUtils.assertPropertyOf( challengeProperty, WaveGameChallenge );

    // These aspects of the Harmonics chart do not change in the Wave Game screen.
    const domainProperty = new EnumerationProperty( Domain, Domain.SPACE );
    const seriesTypeProperty = new EnumerationProperty( SeriesType, SeriesType.SINE );
    const tProperty = new NumberProperty( 0 );

    const adapterFourierSeries = new FourierSeries();

    super( adapterFourierSeries, domainProperty, seriesTypeProperty, tProperty, options );

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