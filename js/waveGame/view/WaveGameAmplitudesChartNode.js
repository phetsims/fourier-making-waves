// Copyright 2021, University of Colorado Boulder

/**
 * WaveGameAmplitudesChartNode is the Amplitudes chart used in the Wave Game screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import EmphasizedHarmonics from '../../common/model/EmphasizedHarmonics.js';
import FourierSeries from '../../common/model/FourierSeries.js';
import AmplitudeKeypadDialog from '../../common/view/AmplitudeKeypadDialog.js';
import AmplitudesChartNode from '../../common/view/AmplitudesChartNode.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WaveGameChallenge from '../model/WaveGameChallenge.js';

class WaveGameAmplitudesChartNode extends AmplitudesChartNode {

  /**
   * @param {Property.<WaveGameChallenge>} challengeProperty
   * @param {EmphasizedHarmonics} emphasizedHarmonics
   * @param {AmplitudeKeypadDialog} amplitudeKeypadDialog - keypad for editing amplitude values
   * @param {Object} [options]
   */
  constructor( challengeProperty, emphasizedHarmonics, amplitudeKeypadDialog, options ) {

    assert && AssertUtils.assertPropertyOf( challengeProperty, WaveGameChallenge );
    assert && assert( emphasizedHarmonics instanceof EmphasizedHarmonics, 'invalid emphasizedHarmonics' );
    assert && assert( amplitudeKeypadDialog instanceof AmplitudeKeypadDialog, 'invalid amplitudeKeypadDialog' );

    const adapterFourierSeries = new FourierSeries();

    super( adapterFourierSeries, emphasizedHarmonics, amplitudeKeypadDialog, options );

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
    // This is simpler, but less efficient, than listening to each harmonic's amplitudeProperty.
    adapterFourierSeries.amplitudesProperty.link(
      amplitudes => challengeProperty.value.guessFourierSeries.setAmplitudes( amplitudes ) );
  }
}

fourierMakingWaves.register( 'WaveGameAmplitudesChartNode', WaveGameAmplitudesChartNode );
export default WaveGameAmplitudesChartNode;