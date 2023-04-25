// Copyright 2021-2023, University of Colorado Boulder

/**
 * InteractiveAmplitudesChart is the model base class model for the 'Amplitudes' chart in the 'Discrete' and
 * 'Wave Game' screens, where amplitudes can be interactively adjusted using a set of bar-like sliders.
 *
 * This class is not used in the 'Wave Packet' screen, where the Amplitudes chart is not interactive, and uses
 * a much different underlying model.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierSeries from './FourierSeries.js';
import EmphasizedHarmonics from './EmphasizedHarmonics.js';

export default class InteractiveAmplitudesChart {

  public readonly fourierSeries: FourierSeries;
  public readonly emphasizedHarmonics: EmphasizedHarmonics;

  // whether this chart is expanded
  public readonly chartExpandedProperty: Property<boolean>;

  protected constructor( fourierSeries: FourierSeries, emphasizedHarmonics: EmphasizedHarmonics, tandem: Tandem ) {

    this.fourierSeries = fourierSeries;
    this.emphasizedHarmonics = emphasizedHarmonics;

    this.chartExpandedProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'chartExpandedProperty' )
    } );
  }

  public reset(): void {
    this.chartExpandedProperty.reset();
  }
}

fourierMakingWaves.register( 'InteractiveAmplitudesChart', InteractiveAmplitudesChart );