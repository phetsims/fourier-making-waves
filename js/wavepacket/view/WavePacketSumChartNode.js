// Copyright 2021, University of Colorado Boulder

//TODO move visibility optimizations into model?
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
    const finiteSumDataSetProperty = sumChart.finiteSumDataSetProperty;
    const infiniteSumDataSetProperty = sumChart.infiniteSumDataSetProperty;
    const infiniteWaveformEnvelopeDataSetProperty = sumChart.infiniteWaveformEnvelopeDataSetProperty;
    const waveformEnvelopeVisibleProperty = sumChart.waveformEnvelopeVisibleProperty;

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

    // NOTE: CanvasLinePlot dataSets are initialized to [] because the listeners to their data set Properties
    // also handle y-axis scaling.

    // Plots the sum of a finite number of components
    const finiteSumPlot = new CanvasLinePlot( this.chartTransform, [], {
      stroke: 'black'
    } );

    // Plots the sum of an infinite number of components
    const infiniteSumPlot = new CanvasLinePlot( this.chartTransform, [], {
      stroke: 'black'
    } );

    // Plots the envelope of the sum waveform for an infinite number of components
    const infiniteWaveformEnvelopePlot = new CanvasLinePlot( this.chartTransform, [], {
      lineWidth: 4
    } );

    // Render the plots using Canvas.
    // Remember! When any of the associated plots is updated, you must call chartCanvasNode.update().
    const chartCanvasNode = new ChartCanvasNode( this.chartTransform,
      [ infiniteWaveformEnvelopePlot, finiteSumPlot, infiniteSumPlot ] );

    // CanvasLinePlot stroke does not support Property, so handle it here.
    FMWColors.waveformEnvelopeStrokeProperty.link( stroke => {
      infiniteWaveformEnvelopePlot.setStroke( stroke );
      chartCanvasNode.update();
    } );

    // CanvasLinePlot does not support visibleProperty, so handle it here by clearing the data set when invisible.
    waveformEnvelopeVisibleProperty.link( visible => {
      infiniteWaveformEnvelopePlot.setDataSet( visible ? infiniteWaveformEnvelopeDataSetProperty.value : [] );
      chartCanvasNode.update();
    } );

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

    // @private
    this.chartCanvasNode = chartCanvasNode;

    // Update the sum data set. Exactly one of these will have a populated data set.
    finiteSumDataSetProperty.link( ( newDataSet, oldDataSet ) => this.updatePlot( finiteSumPlot, newDataSet, oldDataSet ) );
    infiniteSumDataSetProperty.link( ( newDataSet, oldDataSet ) => this.updatePlot( infiniteSumPlot, newDataSet, oldDataSet ) );

    // Display the envelope of the sum waveform.
    // Performance optimization: Update only if the plot is visible.
    infiniteWaveformEnvelopeDataSetProperty.link( dataSet => {
      if ( waveformEnvelopeVisibleProperty.value ) {
        infiniteWaveformEnvelopePlot.setDataSet( dataSet );
        chartCanvasNode.update();
      }
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

  /**
   * Updates a plot.
   * @param {CanvasLinePlot} plot
   * @param {Vector2[]} newDataSet
   * @param {Vector2[]} oldDataSet
   * @private
   */
  updatePlot( plot, newDataSet, oldDataSet ) {

    // Update the plot's data set.
    plot.setDataSet( newDataSet );

    // Scale the y axis to fit the new data set.
    // See https://github.com/phetsims/fourier-making-waves/issues/117 for decisions about ticks and grid lines.
    if ( newDataSet.length > 0 ) {
      const maxAmplitude = _.maxBy( newDataSet, point => point.y ).y;
      const maxY = 1.1 * maxAmplitude; // add a bit of padding
      this.chartTransform.setModelYRange( new Range( -maxY, maxY ) );
      this.yGridLines.setSpacing( maxAmplitude );
      this.yTickMarks.setSpacing( maxAmplitude );
      this.yTickLabels.setSpacing( maxAmplitude );
    }

    // Redraw plots if necessary.
    if ( newDataSet.length > 0 || !oldDataSet || oldDataSet.length > 0 ) {
      this.chartCanvasNode.update();
    }
  }
}

fourierMakingWaves.register( 'WavePacketSumChartNode', WavePacketSumChartNode );
export default WavePacketSumChartNode;