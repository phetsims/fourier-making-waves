// Copyright 2020-2023, University of Colorado Boulder

/**
 * WavelengthCalipersNode is the tool used to measure a harmonic's wavelength in the 'space' and 'space & time' Domains.
 * Origin is at the tip of the caliper's left jaw.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Domain from '../../common/model/Domain.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import DiscreteModel from '../model/DiscreteModel.js';
import DiscreteCalipersNode, { DiscreteCalipersNodeOptions } from './DiscreteCalipersNode.js';

type SelfOptions = EmptySelfOptions;

type WavelengthCalipersNodeOptions = SelfOptions & PickRequired<DiscreteCalipersNodeOptions, 'position' | 'dragBounds' | 'tandem'>;

export default class WavelengthCalipersNode extends DiscreteCalipersNode {

  public constructor( model: DiscreteModel, chartTransform: ChartTransform, providedOptions: WavelengthCalipersNodeOptions ) {

    const options = optionize<WavelengthCalipersNodeOptions, SelfOptions, DiscreteCalipersNodeOptions>()( {

      // DiscreteCalipersNode options
      debugName: 'wavelengthCalipers'
    }, providedOptions );

    super(
      model.wavelengthTool,
      model.fourierSeries.harmonics,
      model.harmonicsChart.emphasizedHarmonics,
      chartTransform,
      model.domainProperty,
      [ Domain.SPACE, Domain.SPACE_AND_TIME ], // relevant Domains
      harmonic => harmonic.wavelength, // gets the quantity of Harmonic that is being measured
      options
    );
  }
}

fourierMakingWaves.register( 'WavelengthCalipersNode', WavelengthCalipersNode );