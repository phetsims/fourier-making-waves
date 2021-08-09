// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketSumChartNode is the 'Sum' chart on the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import CanvasLinePlot from '../../../../bamboo/js/CanvasLinePlot.js';
import ChartCanvasNode from '../../../../bamboo/js/ChartCanvasNode.js';
import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import FMWColors from '../../common/FMWColors.js';
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
    const sumDataSetProperty = sumChart.sumDataSetProperty;
    const waveformEnvelopeDataSetProperty = sumChart.waveformEnvelopeDataSetProperty;

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

    // NOTE: CanvasLinePlot dataSets are initialized to [] because the listeners to their data set Properties
    // also handle y-axis scaling.

    // Plots the sum
    const sumPlot = new CanvasLinePlot( this.chartTransform, [], {
      stroke: 'black'
    } );

    // Render sumPlot using Canvas. Remember! When sumPlot is updated, you must call update().
    // This ChartCanvasNode renders only sumPlot because it has its own clipArea requirements.
    const sumChartCanvasNode = new ChartCanvasNode( this.chartTransform, [ sumPlot ] );

    // Plots the waveform envelope of the sum.  There is no need to handle this plot's visibility, because its
    // data set will be empty when it's not a visible - a performance optimization in the model.  CanvasLinePlot
    // also does not support visibleProperty.
    const waveformEnvelopePlot = new CanvasLinePlot( this.chartTransform, [], {
      lineWidth: 4
    } );

    // Render waveformEnvelopePlot using Canvas. Remember! When waveformEnvelopePlot is updated, you must call update().
    const waveformEnvelopeChartCanvasNode = new ChartCanvasNode( this.chartTransform, [ waveformEnvelopePlot ] );

    // CanvasLinePlot stroke does not support Property, so handle it here.
    FMWColors.waveformEnvelopeStrokeProperty.link( stroke => {
      waveformEnvelopePlot.setStroke( stroke );
      waveformEnvelopeChartCanvasNode.update();
    } );

    // Width indicator, labeled dimensional arrows
    const widthIndicatorPlot = new WidthIndicatorPlot( this.chartTransform, widthIndicatorWidthProperty,
      widthIndicatorPositionProperty, domainProperty, FMWSymbols.x, FMWSymbols.t, {
        visibleProperty: widthIndicatorsVisibleProperty
      } );

    // Clip these elements to the chartRectangle bounds.
    const clipNode = new Node( {
      clipArea: this.chartRectangle.getShape(),
      children: [ waveformEnvelopeChartCanvasNode, sumChartCanvasNode, widthIndicatorPlot ]
    } );
    this.addChild( clipNode );

    // Update the sum data set.
    sumDataSetProperty.link( dataSet => {

      // Update the plot's data set.
      sumPlot.setDataSet( dataSet );

      if ( dataSet.length > 0 ) {

        // Scale the y axis.
        const maxAmplitude = _.maxBy( dataSet, point => point.y ).y;
        this.scaleYAxis( maxAmplitude );

        // Clip to the range [-maxAmplitude,maxAmplitude], to trim rendering anomalies that occur when zoomed out.
        // See https://github.com/phetsims/fourier-making-waves/issues/121
        sumChartCanvasNode.clipArea = this.computeClipAreaForAmplitudeRange( -maxAmplitude, maxAmplitude );
      }

      // Redraw plots.
      sumChartCanvasNode.update();
    } );

    // Update the waveform envelope.
    waveformEnvelopeDataSetProperty.link( dataSet => {
      waveformEnvelopePlot.setDataSet( dataSet );
      waveformEnvelopeChartCanvasNode.update();
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