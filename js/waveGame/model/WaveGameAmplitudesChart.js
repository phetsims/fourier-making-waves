// Copyright 2021, University of Colorado Boulder

/**
 * WaveGameAmplitudesChart is the model of the Amplitudes chart for the 'Wave Game' screen.
 * It add a Fourier series for the game challenge answer.
 * The Fourier series provided by the base class is treated as the user's guess.
 * It also adds the ability to control the number of amplitude controls (sliders and NumberDisplays)
 * that are shown on the Amplitudes chart.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import InteractiveAmplitudesChart from '../../common/model/InteractiveAmplitudesChart.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

export default class WaveGameAmplitudesChart extends InteractiveAmplitudesChart {

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
    this.guessSeries = guessSeries; // same as this.fourierSeries, provided for clarity
    this.numberOfAmplitudeControlsProperty = numberOfAmplitudeControlsProperty;
  }
}

fourierMakingWaves.register( 'WaveGameAmplitudesChart', WaveGameAmplitudesChart );