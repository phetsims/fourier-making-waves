// Copyright 2021, University of Colorado Boulder

/**
 * WaveGameAmplitudesChart is the model of the Amplitudes chart for the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import AmplitudesChart from '../../common/model/AmplitudesChart.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class WaveGameAmplitudesChart extends AmplitudesChart {

  /**
   * @param {FourierSeries} answerSeries
   * @param {FourierSeries} guessSeries
   * @param {EmphasizedHarmonics} emphasizedHarmonics
   * @param {NumberProperty} numberOfAmplitudeControlsProperty
   * @param {Object} [options]
   */
  constructor( answerSeries, guessSeries, emphasizedHarmonics, numberOfAmplitudeControlsProperty, options ) {

    assert && assert( numberOfAmplitudeControlsProperty instanceof NumberProperty );

    super( guessSeries, emphasizedHarmonics, options );

    // @public
    this.answerSeries = answerSeries;
    this.numberOfAmplitudeControlsProperty = numberOfAmplitudeControlsProperty;
  }
}

fourierMakingWaves.register( 'WaveGameAmplitudesChart', WaveGameAmplitudesChart );
export default WaveGameAmplitudesChart;