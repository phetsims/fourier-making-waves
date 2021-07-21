// Copyright 2021, University of Colorado Boulder

/**
 * DiscreteAmplitudesChart is the 'Amplitudes' chart on the 'Discrete' screen.
 * It adds no additional functionality to the superclass, and is provided for symmetry of the class hierarchy,
 * so that each screen has its own subclass.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AmplitudesChart from '../../common/model/AmplitudesChart.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class DiscreteAmplitudesChart extends AmplitudesChart {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {EmphasizedHarmonics} emphasizedHarmonics
   * @param {Object} [options]
   */
  constructor( fourierSeries, emphasizedHarmonics, options ) {

    super( fourierSeries, emphasizedHarmonics, options );
  }
}

fourierMakingWaves.register( 'DiscreteAmplitudesChart', DiscreteAmplitudesChart );
export default DiscreteAmplitudesChart;