// Copyright 2021-2023, University of Colorado Boulder

/**
 * ComponentSpacingToolNode is the tool for measuring component spacing in the 'Wave Packet' screen.
 * Origin is at the tip of the caliper's left jaw.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import FMWColors from '../../common/FMWColors.js';
import FMWDerivedStrings from '../../common/FMWDerivedStrings.js';
import Domain from '../../common/model/Domain.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WavePacketMeasurementToolNode, { WavePacketMeasurementToolNodeOptions } from './WavePacketMeasurementToolNode.js';

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
      spaceSymbolStringProperty: FMWDerivedStrings.k1StringProperty,
      timeSymbolStringProperty: FMWDerivedStrings.omega1StringProperty
    }, providedOptions );

    super( componentSpacingProperty, chartTransform, domainProperty, options );
  }
}

fourierMakingWaves.register( 'ComponentSpacingToolNode', ComponentSpacingToolNode );