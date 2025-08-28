// Copyright 2021-2024, University of Colorado Boulder

/**
 * WavePacketLengthToolNode is the tool for measuring the length (wavelength or period) of a wave packet
 * in the 'Wave Packet' screen. Origin is at the tip of the caliper's left jaw.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWColors from '../../common/FMWColors.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import Domain from '../../common/model/Domain.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WavePacketMeasurementToolNode, { WavePacketMeasurementToolNodeOptions } from './WavePacketMeasurementToolNode.js';

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
      spaceSymbolStringProperty: new DerivedStringProperty( [ FMWSymbols.lambdaMarkupStringProperty ],
        lambda => `${lambda}<sub>1</sub>`, {
          tandem: Tandem.OPT_OUT
        } ),
      timeSymbolStringProperty: new DerivedStringProperty( [ FMWSymbols.TMarkupStringProperty ],
        T => `${T}<sub>1</sub>`, {
          tandem: Tandem.OPT_OUT
        } )
    }, providedOptions );

    super( lengthProperty, chartTransform, domainProperty, options );
  }
}

fourierMakingWaves.register( 'WavePacketLengthToolNode', WavePacketLengthToolNode );