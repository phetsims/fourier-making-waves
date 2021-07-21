// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketComponentsChartNode is the 'Components' chart on the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import WavePacketComponentsChart from '../model/WavePacketComponentsChart.js';
import WavePacketChartNode from './WavePacketChartNode.js';

class WavePacketComponentsChartNode extends WavePacketChartNode {

  /**
   * @param {WavePacketComponentsChart} componentsChart
   * @param {Object} [options]
   */
  constructor( componentsChart, options ) {

    assert && assert( componentsChart instanceof WavePacketComponentsChart );

    super( componentsChart, options );

    // Message shown when we have an infinite number of components.
    const messageNode = new Text( fourierMakingWavesStrings.infiniteComponentsCannotBePlotted, {
      font: new PhetFont( 18 ),
      centerX: this.chartRectangle.centerX,
      bottom: this.chartRectangle.centerY - 5,
      maxWidth: 0.75 * this.chartRectangle.width
    } );
    this.addChild( messageNode );

    // Show the 'cannot plot' message when we have zero spacing between components, and therefore and infinite
    // number of components.
    // unlink is not needed
    componentsChart.wavePacket.k1Property.link( k1 => {
      messageNode.visible = ( k1 === 0 );
      //TODO other things to hide when messageNode is visible?
    } );
  }
}

fourierMakingWaves.register( 'WavePacketComponentsChartNode', WavePacketComponentsChartNode );
export default WavePacketComponentsChartNode;