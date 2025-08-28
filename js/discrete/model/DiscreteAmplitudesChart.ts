// Copyright 2021-2024, University of Colorado Boulder

/**
 * DiscreteAmplitudesChart is the 'Amplitudes' chart on the 'Discrete' screen.
 * It adds no additional functionality to the superclass, and is provided for symmetry of the class hierarchy,
 * so that each screen has its own subclass.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import EmphasizedHarmonics from '../../common/model/EmphasizedHarmonics.js';
import InteractiveAmplitudesChart from '../../common/model/InteractiveAmplitudesChart.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import DiscreteFourierSeries from './DiscreteFourierSeries.js';

export default class DiscreteAmplitudesChart extends InteractiveAmplitudesChart {

  public readonly numberOfHarmonicsProperty: TReadOnlyProperty<number>;

  public constructor( fourierSeries: DiscreteFourierSeries, emphasizedHarmonics: EmphasizedHarmonics, tandem: Tandem ) {
    super( fourierSeries, emphasizedHarmonics, tandem );
    this.numberOfHarmonicsProperty = fourierSeries.numberOfHarmonicsProperty;
  }
}

fourierMakingWaves.register( 'DiscreteAmplitudesChart', DiscreteAmplitudesChart );