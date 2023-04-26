// Copyright 2021-2023, University of Colorado Boulder

/**
 * WavePacketSumChartNode is the view for the 'Sum' chart in the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import CanvasLinePlot from '../../../../bamboo/js/CanvasLinePlot.js';
import ChartCanvasNode from '../../../../bamboo/js/ChartCanvasNode.js';
import merge from '../../../../phet-core/js/merge.js';
import { Node } from '../../../../scenery/js/imports.js';
import FMWColors from '../../common/FMWColors.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import DomainChartNode from '../../common/view/DomainChartNode.js';
import TickLabelUtils from '../../common/view/TickLabelUtils.js';
import ZoomLevelProperty from '../../common/view/ZoomLevelProperty.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WavePacketSumChart from '../model/WavePacketSumChart.js';
import WidthIndicatorPlot from './WidthIndicatorPlot.js';

// constants
const X_TICK_LABEL_DECIMALS = 1;
const Y_TICK_LABEL_DECIMALS = 2;

export default class WavePacketSumChartNode extends DomainChartNode {

  /**
   * @param {WavePacketSumChart} sumChart
   * @param {Object} [options]
   */
  constructor( sumChart, options ) {

    assert && assert( sumChart instanceof WavePacketSumChart );
    assert && assert( options && options.tandem );

    // Fields of interest in sumChart, to improve readability
    const domainProperty = sumChart.domainProperty;
    const xAxisDescriptionProperty = sumChart.xAxisDescriptionProperty;
    const widthIndicatorWidthProperty = sumChart.widthIndicatorWidthProperty;
    const widthIndicatorPositionProperty = sumChart.widthIndicatorPositionProperty;
    const widthIndicatorsVisibleProperty = sumChart.widthIndicatorsVisibleProperty;
    const sumDataSetProperty = sumChart.sumDataSetProperty;
    const waveformEnvelopeDataSetProperty = sumChart.waveformEnvelopeDataSetProperty;
    const yAxisDescription = sumChart.yAxisDescription;

    options = merge( {

      // x-axis with dynamic scale and zoom buttons
      xZoomLevelProperty: new ZoomLevelProperty( xAxisDescriptionProperty, options.tandem.createTandem( 'xZoomLevelProperty' ) ),
      xTickLabelSetOptions: {
        createLabel: value => TickLabelUtils.createNumericTickLabel( value, X_TICK_LABEL_DECIMALS )
      },
      yTickLabelSetOptions: {
        createLabel: value => TickLabelUtils.createNumericTickLabel( value, Y_TICK_LABEL_DECIMALS )
      },

      // y axis with fixed scale
      chartTransformOptions: {
        modelYRange: yAxisDescription.range
      },
      yGridLineSpacing: yAxisDescription.gridLineSpacing,
      yTickMarkSpacing: yAxisDescription.tickMarkSpacing,
      yTickLabelSpacing: yAxisDescription.tickLabelSpacing
    }, options );

    super( sumChart, options );

    // NOTE: CanvasLinePlot dataSets are initialized to [] because the listeners to their data set Properties
    // also handle y-axis scaling.

    // Plots the sum
    const sumPlot = new CanvasLinePlot( this.chartTransform, [], {
      stroke: FMWColors.sumPlotStrokeProperty.value
    } );

    // Render sumPlot using Canvas. Remember! When sumPlot is updated, you must call update().
    // This ChartCanvasNode renders only sumPlot because it has its own clipArea requirements.
    const sumChartCanvasNode = new ChartCanvasNode( this.chartTransform, [ sumPlot ] );

    // CanvasLinePlot stroke does not support Property, so handle updates here.
    FMWColors.sumPlotStrokeProperty.lazyLink( stroke => {
      sumPlot.setStroke( stroke );
      sumChartCanvasNode.update();
    } );

    // Plots the waveform envelope of the sum.  There is no need to handle this plot's visibility, because its
    // data set will be empty when it's not a visible - a performance optimization in the model.  CanvasLinePlot
    // also does not support visibleProperty.
    const waveformEnvelopePlot = new CanvasLinePlot( this.chartTransform, [], {
      stroke: FMWColors.secondaryWaveformStrokeProperty.value,
      lineWidth: FMWConstants.SECONDARY_WAVEFORM_LINE_WIDTH
    } );

    // Render waveformEnvelopePlot using Canvas. Remember! When waveformEnvelopePlot is updated, you must call update().
    const waveformEnvelopeChartCanvasNode = new ChartCanvasNode( this.chartTransform, [ waveformEnvelopePlot ] );

    // CanvasLinePlot stroke does not support Property, so handle updates here.
    FMWColors.secondaryWaveformStrokeProperty.lazyLink( stroke => {
      waveformEnvelopePlot.setStroke( stroke );
      waveformEnvelopeChartCanvasNode.update();
    } );

    // Width indicator, labeled dimensional arrows
    const widthIndicatorPlot = new WidthIndicatorPlot( this.chartTransform, widthIndicatorWidthProperty,
      widthIndicatorPositionProperty, domainProperty, FMWSymbols.xStringProperty, FMWSymbols.tStringProperty, {
        visibleProperty: widthIndicatorsVisibleProperty
      } );

    // Clip these elements to the chartRectangle bounds.
    const clipNode = new Node( {
      children: [ waveformEnvelopeChartCanvasNode, sumChartCanvasNode, widthIndicatorPlot ]
    } );
    this.addChild( clipNode );

    // Update the sum plot.
    sumDataSetProperty.link( dataSet => {
      sumPlot.setDataSet( dataSet );
      sumChartCanvasNode.update();
    } );

    // Update the waveform envelope plot.
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