// Copyright 2021-2023, University of Colorado Boulder

/**
 * DiscreteAmplitudesChart is the 'Amplitudes' chart on the 'Discrete' screen.
 * It adds no additional functionality to the superclass, and is provided for symmetry of the class hierarchy,
 * so that each screen has its own subclass.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import InteractiveAmplitudesChart from '../../common/model/InteractiveAmplitudesChart.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierSeries from '../../common/model/FourierSeries.js';
import EmphasizedHarmonics from '../../common/model/EmphasizedHarmonics.js';

export default class DiscreteAmplitudesChart extends InteractiveAmplitudesChart {

  public constructor( fourierSeries: FourierSeries, emphasizedHarmonics: EmphasizedHarmonics, tandem: Tandem ) {
    super( fourierSeries, emphasizedHarmonics, tandem );
  }
}

fourierMakingWaves.register( 'DiscreteAmplitudesChart', DiscreteAmplitudesChart );