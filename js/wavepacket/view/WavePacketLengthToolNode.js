// Copyright 2021-2023, University of Colorado Boulder

/**
 * WavePacketLengthToolNode is the tool for measuring the length (wavelength or period) of a wave packet
 * in the 'Wave Packet' screen. Origin is at the tip of the caliper's left jaw.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import FMWColors from '../../common/FMWColors.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WavePacketMeasurementToolNode from './WavePacketMeasurementToolNode.js';

export default class WavePacketLengthToolNode extends WavePacketMeasurementToolNode {

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
          fill: FMWColors.wavePacketLengthToolFillProperty
        }
      }
    }, options );

    const spaceSymbolStringProperty = new DerivedProperty( [ FMWSymbols.lambdaStringProperty ],
      lambda => `${lambda}<sub>1</sub>` );

    const timeSymbolStringProperty = new DerivedProperty( [ FMWSymbols.TStringProperty ],
      T => `${T}<sub>1</sub>` );

    super( lengthProperty, chartTransform, domainProperty, spaceSymbolStringProperty, timeSymbolStringProperty, options );
  }
}

fourierMakingWaves.register( 'WavePacketLengthToolNode', WavePacketLengthToolNode );