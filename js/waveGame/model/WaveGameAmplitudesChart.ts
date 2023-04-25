// Copyright 2021-2023, University of Colorado Boulder

/**
 * WaveGameAmplitudesChart is the model of the Amplitudes chart for the 'Wave Game' screen.
 * It adds a Fourier series for the game challenge answer.
 * The Fourier series provided by the base class is treated as the user's guess.
 * It also adds the ability to control the number of amplitude controls (sliders and NumberDisplays)
 * that are shown on the Amplitudes chart.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import InteractiveAmplitudesChart from '../../common/model/InteractiveAmplitudesChart.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierSeries from '../../common/model/FourierSeries.js';
import EmphasizedHarmonics from '../../common/model/EmphasizedHarmonics.js';

export default class WaveGameAmplitudesChart extends InteractiveAmplitudesChart {

  public readonly answerSeries: FourierSeries;
  public readonly guessSeries: FourierSeries; // same as this.fourierSeries, provided for clarity
  public readonly numberOfAmplitudeControlsProperty: NumberProperty;

  public constructor( answerSeries: FourierSeries, guessSeries: FourierSeries, emphasizedHarmonics: EmphasizedHarmonics,
                      numberOfAmplitudeControlsProperty: NumberProperty, tandem: Tandem ) {

    super( guessSeries, emphasizedHarmonics, tandem );

    this.answerSeries = answerSeries;
    this.guessSeries = guessSeries; // same as this.fourierSeries, provided for clarity
    this.numberOfAmplitudeControlsProperty = numberOfAmplitudeControlsProperty;
  }
}

fourierMakingWaves.register( 'WaveGameAmplitudesChart', WaveGameAmplitudesChart );