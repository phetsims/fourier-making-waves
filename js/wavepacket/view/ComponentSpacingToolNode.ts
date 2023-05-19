// Copyright 2021-2023, University of Colorado Boulder

/**
 * ComponentSpacingToolNode is the tool for measuring component spacing in the 'Wave Packet' screen.
 * Origin is at the tip of the caliper's left jaw.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import FMWColors from '../../common/FMWColors.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WavePacketMeasurementToolNode, { WavePacketMeasurementToolNodeOptions } from './WavePacketMeasurementToolNode.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Domain from '../../common/model/Domain.js';

type SelfOptions = EmptySelfOptions;

type ComponentSpacingToolNodeOptions = SelfOptions &
  PickRequired<WavePacketMeasurementToolNodeOptions, 'position' | 'dragBounds' | 'visibleProperty' | 'tandem'>;

export default class ComponentSpacingToolNode extends WavePacketMeasurementToolNode {

  public constructor( componentSpacingProperty: TReadOnlyProperty<number>,
                      chartTransform: ChartTransform,
                      domainProperty: EnumerationProperty<Domain>,
                      providedOptions: ComponentSpacingToolNodeOptions ) {

    const options = optionize<ComponentSpacingToolNodeOptions, SelfOptions, WavePacketMeasurementToolNodeOptions>()( {

      // WavePacketMeasurementToolNodeOptions
      fill: FMWColors.componentSpacingToolFillProperty,
      spaceSymbolStringProperty: new DerivedProperty( [ FMWSymbols.kStringProperty ],
        k => `${k}<sub>1</sub>` ),
      timeSymbolStringProperty: new DerivedProperty( [ FMWSymbols.omegaStringProperty ],
        omega => `${omega}<sub>1</sub>` )
    }, providedOptions );

    super( componentSpacingProperty, chartTransform, domainProperty, options );
  }
}

fourierMakingWaves.register( 'ComponentSpacingToolNode', ComponentSpacingToolNode );