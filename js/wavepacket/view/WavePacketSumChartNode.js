// Copyright 2021, University of Colorado Boulder

//TODO most of this is duplicated from WavePacketComponentsChartNode
/**
 * WavePacketSumChartNode is the 'Sum' chart on the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import fourierMakingWaves from '../../fourierMakingWaves.js';
import WavePacketSumChart from '../model/WavePacketSumChart.js';
import WaveformEnvelopeCheckbox from './WaveformEnvelopeCheckbox.js';
import WavePacketChartNode from './WavePacketChartNode.js';

class WavePacketSumChartNode extends WavePacketChartNode {

  /**
   * @param {WavePacketSumChart} sumChart
   * @param {Object} [options]
   */
  constructor( sumChart, options ) {

    assert && assert( sumChart instanceof WavePacketSumChart );

    super( sumChart, options );

    // Waveform Envelope checkbox
    const waveformEnvelopeCheckbox = new WaveformEnvelopeCheckbox( sumChart.envelopeVisibleProperty, {
      right: this.chartRectangle.right - 5,
      top: this.xTickLabels.bottom + 8,
      tandem: options.tandem.createTandem( 'waveformEnvelopeCheckbox' )
    } );
    this.addChild( waveformEnvelopeCheckbox );

    // pdom - append to the superclass traversal order
    this.pdomOrder = this.getPDOMOrder().concat( [ waveformEnvelopeCheckbox ] );
  }
}

fourierMakingWaves.register( 'WavePacketSumChartNode', WavePacketSumChartNode );
export default WavePacketSumChartNode;