// Copyright 2021-2023, University of Colorado Boulder

/**
 * WavePacketLengthToolNode is the tool for measuring the length (wavelength or period) of a wave packet
 * in the 'Wave Packet' screen. Origin is at the tip of the caliper's left jaw.
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
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Domain from '../../common/model/Domain.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

type SelfOptions = EmptySelfOptions;

type WavePacketLengthToolNodeOptions = SelfOptions &
  PickRequired<WavePacketMeasurementToolNodeOptions, 'position' | 'dragBounds' | 'visibleProperty' | 'tandem'>;

export default class WavePacketLengthToolNode extends WavePacketMeasurementToolNode {

  public constructor( lengthProperty: TReadOnlyProperty<number>,
                      chartTransform: ChartTransform,
                      domainProperty: EnumerationProperty<Domain>,
                      providedOptions: WavePacketLengthToolNodeOptions ) {

    const options = optionize<WavePacketLengthToolNodeOptions, SelfOptions, WavePacketMeasurementToolNodeOptions>()( {

      // WavePacketMeasurementToolNodeOptions
      fill: FMWColors.wavePacketLengthToolFillProperty,
      spaceSymbolStringProperty: new DerivedProperty( [ FMWSymbols.lambdaSymbolProperty ],
        lambda => `${lambda}<sub>1</sub>` ),
      timeSymbolStringProperty: new DerivedProperty( [ FMWSymbols.TSymbolProperty ],
        T => `${T}<sub>1</sub>` )
    }, providedOptions );

    super( lengthProperty, chartTransform, domainProperty, options );
  }
}

fourierMakingWaves.register( 'WavePacketLengthToolNode', WavePacketLengthToolNode );