// Copyright 2021-2023, University of Colorado Boulder

/**
 * ComponentSpacingToolNode is the tool for measuring component spacing in the 'Wave Packet' screen.
 * Origin is at the tip of the caliper's left jaw.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import FMWColors from '../../common/FMWColors.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WavePacketMeasurementToolNode from './WavePacketMeasurementToolNode.js';

export default class ComponentSpacingToolNode extends WavePacketMeasurementToolNode {

  /**
   * @param {Property.<number>} componentSpacingProperty
   * @param {ChartTransform} chartTransform
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Object} [options]
   */
  constructor( componentSpacingProperty, chartTransform, domainProperty, options ) {

    options = merge( {
      fill: FMWColors.componentSpacingToolFillProperty,
      spaceSymbolStringProperty: new DerivedProperty( [ FMWSymbols.kStringProperty ],
        k => `${k}<sub>1</sub>` ),
      timeSymbolStringProperty: new DerivedProperty( [ FMWSymbols.omegaStringProperty ],
        omega => `${omega}<sub>1</sub>` )
    }, options );

    super( componentSpacingProperty, chartTransform, domainProperty, options );
  }
}

fourierMakingWaves.register( 'ComponentSpacingToolNode', ComponentSpacingToolNode );