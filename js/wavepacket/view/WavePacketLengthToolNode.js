// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketLengthToolNode is the tool for measuring the length (wavelength or period) of a wave packet
 * in the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WavePacketMeasurementToolNode from './WavePacketMeasurementToolNode.js';

class WavePacketLengthToolNode extends WavePacketMeasurementToolNode {

  /**
   * @param {Property.<number>} lengthProperty
   * @param {ChartTransform} chartTransform
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Object} [options]
   */
  constructor( lengthProperty, chartTransform, domainProperty, options ) {

    options = merge( {
      calipersNodeOptions: {
        pathOptions: {
          fill: 'rgb( 0, 255, 0 )'
        }
      }
    }, options );

    const spaceSymbol = `${FMWSymbols.lambda}<sub>1</sub>`;
    const timeSymbol = `${FMWSymbols.T}<sub>1</sub>`;

    super( lengthProperty, chartTransform, domainProperty, spaceSymbol, timeSymbol, options );
  }
}

fourierMakingWaves.register( 'WavePacketLengthToolNode', WavePacketLengthToolNode );
export default WavePacketLengthToolNode;