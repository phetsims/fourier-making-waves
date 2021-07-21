// Copyright 2021, University of Colorado Boulder

//TODO factor out duplication with WavePacketComponentsChartNode
/**
 * WavePacketSumChartNode is the 'Sum' chart on the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import TickLabelUtils from '../../common/view/TickLabelUtils.js';
import WaveformChartNode from '../../common/view/WaveformChartNode.js';
import ZoomLevelProperty from '../../common/view/ZoomLevelProperty.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WavePacketSumChart from '../model/WavePacketSumChart.js';
import WaveformEnvelopeCheckbox from './WaveformEnvelopeCheckbox.js';

// constants
const X_TICK_LABEL_DECIMALS = 1;
const Y_TICK_LABEL_DECIMALS = 2;

class WavePacketSumChartNode extends WaveformChartNode {

  /**
   * @param {WavePacketSumChart} sumChart
   * @param {Object} [options]
   */
  constructor( sumChart, options ) {

    assert && assert( sumChart instanceof WavePacketSumChart );

    // Fields of interest in sumChart, to improve readability
    const xAxisDescriptionProperty = sumChart.xAxisDescriptionProperty;
    const envelopeVisibleProperty = sumChart.envelopeVisibleProperty;

    options = merge( {
      xZoomLevelProperty: new ZoomLevelProperty( xAxisDescriptionProperty ),
      xLabelSetOptions: {
        createLabel: value => TickLabelUtils.createNumericTickLabel( value, X_TICK_LABEL_DECIMALS )
      },
      yLabelSetOptions: {
        createLabel: value => TickLabelUtils.createNumericTickLabel( value, Y_TICK_LABEL_DECIMALS )
      }
    }, options );

    super( sumChart, options );

    // Waveform Envelope checkbox
    const waveformEnvelopeCheckbox = new WaveformEnvelopeCheckbox( envelopeVisibleProperty, {
      right: this.chartRectangle.right - 5,
      top: this.xTickLabels.bottom + 8,
      tandem: options.tandem.createTandem( 'waveformEnvelopeCheckbox' )
    } );
    this.addChild( waveformEnvelopeCheckbox );

    // pdom - append to the superclass traversal order
    this.pdomOrder = this.getPDOMOrder().concat( [ waveformEnvelopeCheckbox ] );

    //TODO add plots, observe sumChart.dataSetsProperty to update plots
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

fourierMakingWaves.register( 'WavePacketSumChartNode', WavePacketSumChartNode );
export default WavePacketSumChartNode;