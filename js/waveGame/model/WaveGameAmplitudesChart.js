// Copyright 2021, University of Colorado Boulder

/**
 * WaveGameAmplitudesChart is the model of the Amplitudes chart for the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import AmplitudesChart from '../../common/model/AmplitudesChart.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WaveGameChallenge from './WaveGameChallenge.js';

class WaveGameAmplitudesChart extends AmplitudesChart {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {EmphasizedHarmonics} emphasizedHarmonics
   * @param {Property.<WaveGameChallenge>} challengeProperty
   * @param {Object} [options]
   */
  constructor( fourierSeries, emphasizedHarmonics, challengeProperty, options ) {
    assert && AssertUtils.assertPropertyOf( challengeProperty, WaveGameChallenge );

    super( fourierSeries, emphasizedHarmonics, options );

    // @public
    this.challengeProperty = challengeProperty;
  }
}

fourierMakingWaves.register( 'WaveGameAmplitudesChart', WaveGameAmplitudesChart );
export default WaveGameAmplitudesChart;