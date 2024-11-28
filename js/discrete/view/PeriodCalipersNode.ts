// Copyright 2020-2024, University of Colorado Boulder

/**
 * PeriodCalipersNode is the tool used to measure a harmonic's period in the time Domain on the 'Discrete' screen.
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

type PeriodCalipersNodeOptions = SelfOptions & PickRequired<DiscreteCalipersNodeOptions, 'position' | 'dragBounds' | 'tandem'>;

export default class PeriodCalipersNode extends DiscreteCalipersNode {

  public constructor( model: DiscreteModel, chartTransform: ChartTransform, providedOptions: PeriodCalipersNodeOptions ) {

    const options = optionize<PeriodCalipersNodeOptions, SelfOptions, DiscreteCalipersNodeOptions>()( {

      // DiscreteCalipersNodeOptions
      debugName: 'periodCalipers'
    }, providedOptions );

    super(
      model.periodTool,
      model.fourierSeries.harmonics,
      model.harmonicsChart.emphasizedHarmonics,
      chartTransform,
      model.domainProperty,
      [ Domain.TIME ], // relevant Domains
      harmonic => harmonic.period, // gets the quantity of Harmonic that is being measured
      options
    );
  }
}

fourierMakingWaves.register( 'PeriodCalipersNode', PeriodCalipersNode );