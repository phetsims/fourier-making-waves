// Copyright 2021, University of Colorado Boulder

/**
 * WaveGameAmplitudesChart is the model of the Amplitudes chart for the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import AmplitudesChart from '../../common/model/AmplitudesChart.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WaveGameChallenge from './WaveGameChallenge.js';

class WaveGameAmplitudesChart extends AmplitudesChart {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {EmphasizedHarmonics} emphasizedHarmonics
   * @param {Property.<WaveGameChallenge>} challengeProperty
   * @param {NumberProperty} numberOfAmplitudeControlsProperty
   * @param {Object} [options]
   */
  constructor( fourierSeries, emphasizedHarmonics, challengeProperty, numberOfAmplitudeControlsProperty, options ) {

    assert && AssertUtils.assertPropertyOf( challengeProperty, WaveGameChallenge );
    assert && assert( numberOfAmplitudeControlsProperty instanceof NumberProperty );

    super( fourierSeries, emphasizedHarmonics, options );

    // @public
    this.challengeProperty = challengeProperty;
    this.numberOfAmplitudeControlsProperty = numberOfAmplitudeControlsProperty;
  }
}

fourierMakingWaves.register( 'WaveGameAmplitudesChart', WaveGameAmplitudesChart );
export default WaveGameAmplitudesChart;