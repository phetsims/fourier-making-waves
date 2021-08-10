// Copyright 2021, University of Colorado Boulder

/**
 * ComponentSpacingToolNode is the tool for measuring component spacing in the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WavePacketMeasurementToolNode from './WavePacketMeasurementToolNode.js';

class ComponentSpacingToolNode extends WavePacketMeasurementToolNode {

  /**
   * @param {Property.<number>} componentSpacingProperty
   * @param {ChartTransform} chartTransform
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Object} [options]
   */
  constructor( componentSpacingProperty, chartTransform, domainProperty, options ) {

    options = merge( {
      calipersNodeOptions: {
        pathOptions: {
          fill: 'yellow'
        }
      }
    }, options );

    const spaceSymbol = `${FMWSymbols.k}<sub>1</sub>`;
    const timeSymbol = `${FMWSymbols.omega}<sub>1</sub>`;

    super( componentSpacingProperty, chartTransform, domainProperty, spaceSymbol, timeSymbol, options );
  }
}

fourierMakingWaves.register( 'ComponentSpacingToolNode', ComponentSpacingToolNode );
export default ComponentSpacingToolNode;