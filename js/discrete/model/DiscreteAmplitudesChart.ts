// Copyright 2021-2023, University of Colorado Boulder

/**
 * DiscreteAmplitudesChart is the 'Amplitudes' chart on the 'Discrete' screen.
 * It adds no additional functionality to the superclass, and is provided for symmetry of the class hierarchy,
 * so that each screen has its own subclass.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import InteractiveAmplitudesChart from '../../common/model/InteractiveAmplitudesChart.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

export default class DiscreteAmplitudesChart extends InteractiveAmplitudesChart {

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