// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketSumChartNode is the 'Sum' chart on the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import CanvasLinePlot from '../../../../bamboo/js/CanvasLinePlot.js';
import ChartCanvasNode from '../../../../bamboo/js/ChartCanvasNode.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import TickLabelUtils from '../../common/view/TickLabelUtils.js';
import WaveformChartNode from '../../common/view/WaveformChartNode.js';
import ZoomLevelProperty from '../../common/view/ZoomLevelProperty.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WavePacketSumChart from '../model/WavePacketSumChart.js';
import WidthIndicatorPlot from './WidthIndicatorPlot.js';

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
    const domainProperty = sumChart.domainProperty;
    const xAxisDescriptionProperty = sumChart.xAxisDescriptionProperty;
    const widthIndicatorWidthProperty = sumChart.widthIndicatorWidthProperty;
    const widthIndicatorPositionProperty = sumChart.widthIndicatorPositionProperty;
    const widthIndicatorsVisibleProperty = sumChart.widthIndicatorsVisibleProperty;

    options = merge( {
      xZoomLevelProperty: new ZoomLevelProperty( xAxisDescriptionProperty ),
      xLabelSetOptions: {
        createLabel: value => TickLabelUtils.createNumericTickLabel( value, X_TICK_LABEL_DECIMALS )
      },
      yLabelSetOptions: {
        createLabel: value => TickLabelUtils.createNumericTickLabel( value, Y_TICK_LABEL_DECIMALS )
      },
      visibleProperty: sumChart.chartVisibleProperty
    }, options );

    super( sumChart, options );

    // Plots the sum of a finite number of components
    const sumPlot = new CanvasLinePlot( this.chartTransform, [], {
      stroke: 'black'
    } );

    //TODO add waveformEnvelopePlot

    // Render the plots using Canvas.
    const chartCanvasNode = new ChartCanvasNode( this.chartTransform, [ sumPlot ] );

    // Width indicator, labeled dimensional arrows
    const widthIndicatorPlot = new WidthIndicatorPlot( this.chartTransform, widthIndicatorWidthProperty,
      widthIndicatorPositionProperty, domainProperty, FMWSymbols.x, FMWSymbols.t, {
        visibleProperty: widthIndicatorsVisibleProperty
      } );

    // Clip these elements to the chartRectangle bounds.
    const clipNode = new Node( {
      clipArea: this.chartRectangle.getShape(),
      children: [ chartCanvasNode, widthIndicatorPlot ]
    } );
    this.addChild( clipNode );

    sumChart.sumDataSetProperty.link( sumDataSet => {

      sumPlot.setDataSet( sumDataSet );
      if ( sumDataSet.length > 0 ) {

        // Autoscale the y axis.
        // See https://github.com/phetsims/fourier-making-waves/issues/117 for decisions about ticks and grid lines.
        const maxAmplitude = _.maxBy( sumDataSet, point => point.y ).y;
        const maxY = 1.1 * maxAmplitude; // add a bit of padding
        this.chartTransform.setModelYRange( new Range( -maxY, maxY ) );
        this.yGridLines.setSpacing( maxAmplitude );
        this.yTickMarks.setSpacing( maxAmplitude );
        this.yTickLabels.setSpacing( maxAmplitude );
      }

      // Redraw the plots.
      chartCanvasNode.update();
    } );
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