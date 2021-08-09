// Copyright 2021, University of Colorado Boulder

//TODO move visibility optimizations into model?
/**
 * WavePacketAmplitudesChartNode is the 'Amplitudes' chart on the 'Wave Packet' screen.
 * This is optimized to update only the plots that are visible.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BarPlot from '../../../../bamboo/js/BarPlot.js';
import CanvasLinePlot from '../../../../bamboo/js/CanvasLinePlot.js';
import ChartCanvasNode from '../../../../bamboo/js/ChartCanvasNode.js';
import Range from '../../../../dot/js/Range.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Color from '../../../../scenery/js/util/Color.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import FMWColors from '../../common/FMWColors.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import Domain from '../../common/model/Domain.js';
import FMWChartNode from '../../common/view/FMWChartNode.js';
import TickLabelUtils from '../../common/view/TickLabelUtils.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import WavePacketAmplitudesChart from '../model/WavePacketAmplitudesChart.js';
import AreaPlot from './AreaPlot.js';
import WidthIndicatorPlot from './WidthIndicatorPlot.js';

// constants
const X_TICK_LABEL_DECIMALS = 0;
const Y_TICK_LABEL_DECIMALS = 2;
const GRAY_RANGE = FMWColors.FOURIER_COMPONENT_GRAY_RANGE;

class WavePacketAmplitudesChartNode extends FMWChartNode {

  /**
   * @param {WavePacketAmplitudesChart} amplitudesChart
   * @param {Object} [options]
   */
  constructor( amplitudesChart, options ) {

    assert && assert( amplitudesChart instanceof WavePacketAmplitudesChart );

    // Fields of interest in amplitudesChart, to improve readability
    const domainProperty = amplitudesChart.domainProperty;
    const amplitudesDataSetProperty = amplitudesChart.amplitudesDataSetProperty;
    const continuousWaveformDataSetProperty = amplitudesChart.continuousWaveformDataSetProperty;
    const continuousWaveformVisibleProperty = amplitudesChart.continuousWaveformVisibleProperty;
    const waveNumberRange = amplitudesChart.wavePacket.waveNumberRange;
    const componentSpacingProperty = amplitudesChart.wavePacket.componentSpacingProperty;
    const widthIndicatorWidthProperty = amplitudesChart.widthIndicatorWidthProperty;
    const widthIndicatorPositionProperty = amplitudesChart.widthIndicatorPositionProperty;
    const widthIndicatorsVisibleProperty = amplitudesChart.widthIndicatorsVisibleProperty;
    const maxAmplitudeProperty = amplitudesChart.maxAmplitudeProperty;

    options = merge( {
      xTickMarkSpacing: Math.PI,
      xTickLabelSpacing: 2 * Math.PI,
      xLabelSetOptions: {
        createLabel: value => TickLabelUtils.createPiTickLabel( value, X_TICK_LABEL_DECIMALS )
      },
      yLabelSetOptions: {
        createLabel: value => TickLabelUtils.createNumericTickLabel( value, Y_TICK_LABEL_DECIMALS )
      }
    }, options );

    super( options );

    // No x-axis grid lines for this chart.
    this.xGridLines.visible = false;

    // NOTE: Data sets for plots are initialized to [] because the listeners for their data sets handle y-axis scaling.

    // Displays a finite number of Fourier components as vertical bars
    const finiteComponentsPlot = new BarPlot( this.chartTransform, [], {
      barWidth: 5,

      // Assign a grayscale color to each bar in the BarPlot.
      pointToPaintableFields: point => {
        let rgb = GRAY_RANGE.min + GRAY_RANGE.getLength() * point.x / waveNumberRange.max;
        rgb = GRAY_RANGE.constrainValue( rgb );
        return { fill: Color.grayColor( rgb ) };
      }
    } );

    // Displays an infinite number of components. This uses the same data set as continuousWaveformPlot, but fills
    // the area under that curve with the same grayscale gradient that is used to color the bars.
    const infiniteComponentsPlot = new AreaPlot( this.chartTransform, [], {
      fill: new LinearGradient( 0, 0, this.chartRectangle.width, 0 )
        .addColorStop( 0, Color.grayColor( GRAY_RANGE.min ) )
        .addColorStop( 1, Color.grayColor( GRAY_RANGE.max ) )
    } );

    // Displays the continuous waveform
    const continuousWaveformPlot = new CanvasLinePlot( this.chartTransform, [], {
      lineWidth: 4,
      visibleProperty: continuousWaveformVisibleProperty
    } );

    // Render the plots using Canvas.
    // Remember! When any of the associated plots is updated, you must call update().
    const chartCanvasNode = new ChartCanvasNode( this.chartTransform, [ continuousWaveformPlot ], {
      clipArea: Shape.bounds( this.chartRectangle.bounds )
    } );

    // CanvasLinePlot stroke does not support Property, so handle it here.
    FMWColors.continuousWaveformStrokeProperty.link( stroke => {
      continuousWaveformPlot.setStroke( stroke );
      chartCanvasNode.update();
    } );

    // CanvasLinePlot does not support visibleProperty, so handle it here by clearing the data set when invisible.
    continuousWaveformVisibleProperty.link( visible => {
      continuousWaveformPlot.setDataSet( visible ? continuousWaveformDataSetProperty.value : [] );
      chartCanvasNode.update();
    } );

    // Width indicator, labeled dimensional arrows
    const widthIndicatorPlot = new WidthIndicatorPlot( this.chartTransform, widthIndicatorWidthProperty,
      widthIndicatorPositionProperty, domainProperty, FMWSymbols.k, FMWSymbols.omega, {
        visibleProperty: widthIndicatorsVisibleProperty
      } );

    // Clip these elements to the chartRectangle bounds.
    const clipNode = new Node( {
      clipArea: this.chartRectangle.getShape(),
      children: [ infiniteComponentsPlot, chartCanvasNode, finiteComponentsPlot, widthIndicatorPlot ]
    } );
    this.addChild( clipNode );

    // Adjust the x-axis label to match the domain.
    domainProperty.link( domain => {

      // Update the label. Note that units are on a separate line so that this label takes up less horizontal space.
      this.xAxisLabel.text = StringUtils.fillIn( fourierMakingWavesStrings.symbolBreakUnits, {
        symbol: ( domain === Domain.SPACE ) ? FMWSymbols.k : FMWSymbols.omega,
        units: ( domain === Domain.SPACE ) ?
               fourierMakingWavesStrings.units.radiansPerMeter :
               fourierMakingWavesStrings.units.radiansPerMillisecond
      } );
    } );

    // Display the Fourier components, where x = wave number, y = amplitude.
    // Performance optimization: Update only if the plot is visible.
    amplitudesDataSetProperty.link( amplitudesDataSet => {
      if ( finiteComponentsPlot.visible ) {
        finiteComponentsPlot.setDataSet( amplitudesDataSet );
      }
    } );

    // Update plots that rely on continuous waveform data set.
    // Performance optimization: Update only the visible plots.
    continuousWaveformDataSetProperty.link( dataSet => {

      if ( continuousWaveformVisibleProperty.value ) {
        continuousWaveformPlot.setDataSet( dataSet );
        chartCanvasNode.update();
      }

      if ( infiniteComponentsPlot.visible ) {
        infiniteComponentsPlot.setDataSet( dataSet );
      }
    } );

    // Scale the y axis.
    maxAmplitudeProperty.link( maxAmplitude => this.scaleYAxis( maxAmplitude ) );

    // When we have infinite components, hide finiteComponentsPlot and show infiniteComponentsPlot.
    componentSpacingProperty.link( componentSpacing => {
      const isInfinite = ( componentSpacing === 0 );
      finiteComponentsPlot.visible = !isInfinite;
      infiniteComponentsPlot.visible = isInfinite;
    } );

    // Performance optimization: Update data set when a plot becomes visible, clear data set when it becomes invisible.
    finiteComponentsPlot.visibleProperty.link(
      visible => finiteComponentsPlot.setDataSet( visible ? amplitudesDataSetProperty.value : [] ) );
    infiniteComponentsPlot.visibleProperty.link(
      visible => infiniteComponentsPlot.setDataSet( visible ? continuousWaveformDataSetProperty.value : [] ) );
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
   * Scales the y axis.
   * @param {number} maxAmplitude
   * @public
   * @override TODO
   */
  scaleYAxis( maxAmplitude ) {
    assert && assert( typeof maxAmplitude === 'number' && maxAmplitude > 0 );

    // Extend the y-axis range, so there's some space above maxAmplitude.
    this.chartTransform.setModelYRange( new Range( 0, 1.05 * maxAmplitude ) );

    // Adjust ticks and gridlines.
    // This logic and values were taken from D2CAmplitudesChart.java, in the Java version.
    //TODO use AxisDescription and amplitudesChart.yAxisDescriptionProperty
    let tickLabelSpacing;
    let tickMarkSpacing;
    if ( maxAmplitude > 1 ) {
      tickLabelSpacing = 1.0;
      tickMarkSpacing = 0.5;
    }
    else if ( maxAmplitude > 0.5 ) {
      tickLabelSpacing = 0.2;
      tickMarkSpacing = 0.1;
    }
    else if ( maxAmplitude > 0.2 ) {
      tickLabelSpacing = 0.1;
      tickMarkSpacing = 0.05;
    }
    else if ( maxAmplitude > 0.05 ) {
      tickLabelSpacing = 0.05;
      tickMarkSpacing = 0.01;
    }
    else if ( maxAmplitude > 0.02 ) {
      tickLabelSpacing = 0.01;
      tickMarkSpacing = 0.005;
    }
    else {
      tickLabelSpacing = 0.005;
      tickMarkSpacing = 0.001;
    }
    assert && assert( tickLabelSpacing > 0 );
    assert && assert( tickMarkSpacing > 0 );

    this.yGridLines.setSpacing( tickLabelSpacing );
    this.yTickLabels.setSpacing( tickLabelSpacing );
    this.yTickMarks.setSpacing( tickMarkSpacing );
  }
}

fourierMakingWaves.register( 'WavePacketAmplitudesChartNode', WavePacketAmplitudesChartNode );
export default WavePacketAmplitudesChartNode;