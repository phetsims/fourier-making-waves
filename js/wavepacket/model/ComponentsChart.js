// Copyright 2021, University of Colorado Boulder

/**
 * ComponentsChart is the 'Components' chart on the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import fourierMakingWaves from '../../fourierMakingWaves.js';
import WavePacketChart from './WavePacketChart.js';

class ComponentsChart extends WavePacketChart {

  /**
   * @param {WavePacket} wavePacket
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Property.<XAxisDescription>} xAxisDescriptionProperty
   * @param {Object} [options]
   */
  constructor( wavePacket, domainProperty, xAxisDescriptionProperty, options ) {

    super( wavePacket, domainProperty, xAxisDescriptionProperty, options );
  }
}

fourierMakingWaves.register( 'ComponentsChart', ComponentsChart );
export default ComponentsChart;