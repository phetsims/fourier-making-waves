// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketComponentsChartNode is the 'Components' chart on the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import TickLabelUtils from '../../common/view/TickLabelUtils.js';
import WaveformChartNode from '../../common/view/WaveformChartNode.js';
import ZoomLevelProperty from '../../common/view/ZoomLevelProperty.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import WavePacketComponentsChart from '../model/WavePacketComponentsChart.js';

// constants
const X_TICK_LABEL_DECIMALS = 1;
const Y_TICK_LABEL_DECIMALS = 2;

class WavePacketComponentsChartNode extends WaveformChartNode {

  /**
   * @param {WavePacketComponentsChart} componentsChart
   * @param {Object} [options]
   */
  constructor( componentsChart, options ) {

    assert && assert( componentsChart instanceof WavePacketComponentsChart );

    // Fields of interest in componentsChart, to improve readability
    const xAxisDescriptionProperty = componentsChart.xAxisDescriptionProperty;
    const componentSpacingProperty = componentsChart.wavePacket.componentSpacingProperty;

    options = merge( {
      xZoomLevelProperty: new ZoomLevelProperty( xAxisDescriptionProperty ),
      xLabelSetOptions: {
        createLabel: value => TickLabelUtils.createNumericTickLabel( value, X_TICK_LABEL_DECIMALS )
      },
      yLabelSetOptions: {
        createLabel: value => TickLabelUtils.createNumericTickLabel( value, Y_TICK_LABEL_DECIMALS )
      }
    }, options );

    super( componentsChart, options );

    // Message shown when we have an infinite number of components.
    const messageNode = new Text( fourierMakingWavesStrings.infiniteComponentsCannotBePlotted, {
      font: new PhetFont( 18 ),
      centerX: this.chartRectangle.centerX,
      bottom: this.chartRectangle.centerY - 5,
      maxWidth: 0.75 * this.chartRectangle.width
    } );
    this.addChild( messageNode );

    // Show the '...cannot be plotted' message when we have an infinite number of components.
    componentSpacingProperty.link( componentSpacing => {
      messageNode.visible = ( componentSpacing === 0 );
      //TODO other things to hide when messageNode is visible?
    } );

    //TODO add plots, observe componentsChart.dataSetsProperty to update plots
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

fourierMakingWaves.register( 'WavePacketComponentsChartNode', WavePacketComponentsChartNode );
export default WavePacketComponentsChartNode;