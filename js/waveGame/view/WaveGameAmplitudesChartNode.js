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
import AmplitudesChartNode from '../../discrete/view/AmplitudesChartNode.js';
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

    // When the challenge changes, set the amplitudes to match the guess amplitudes (typically all zero).
    challengeProperty.link( challenge =>
      adapterFourierSeries.setAmplitudes( challenge.guessFourierSeries.amplitudesProperty.value ) );

    // When an amplitude is changed via the chart, update the corresponding amplitude in the challenge's guess.
    for ( let i = 0; i < adapterFourierSeries.harmonics.length; i++ ) {
      const harmonic = adapterFourierSeries.harmonics[ i ];
      const order = i + 1;
      harmonic.amplitudeProperty.link( amplitude => challengeProperty.value.setGuessAmplitude( order, amplitude ) );
    }
  }
}

fourierMakingWaves.register( 'WaveGameAmplitudesChartNode', WaveGameAmplitudesChartNode );
export default WaveGameAmplitudesChartNode;