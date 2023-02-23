// Copyright 2021-2023, University of Colorado Boulder

/**
 * WavePacketAmplitudesChartNode is the view for the 'Amplitudes of Fourier Components' chart in
 * the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import BarPlot from '../../../../bamboo/js/BarPlot.js';
import CanvasLinePlot from '../../../../bamboo/js/CanvasLinePlot.js';
import ChartCanvasNode from '../../../../bamboo/js/ChartCanvasNode.js';
import Range from '../../../../dot/js/Range.js';
import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import { Color, LinearGradient, Node } from '../../../../scenery/js/imports.js';
import FMWColors from '../../common/FMWColors.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import DomainChartNode from '../../common/view/DomainChartNode.js';
import TickLabelUtils from '../../common/view/TickLabelUtils.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WavePacketAmplitudesChart from '../model/WavePacketAmplitudesChart.js';
import GaussianAreaPlot from './GaussianAreaPlot.js';
import WidthIndicatorPlot from './WidthIndicatorPlot.js';

// constants
const X_TICK_LABEL_DECIMALS = 0;
const Y_TICK_LABEL_DECIMALS = 2;
const GRAY_RANGE = FMWColors.FOURIER_COMPONENT_GRAY_RANGE;

export default class WavePacketAmplitudesChartNode extends DomainChartNode {

  /**
   * @param {WavePacketAmplitudesChart} amplitudesChart
   * @param {Object} [options]
   */
  constructor( amplitudesChart, options ) {

    assert && assert( amplitudesChart instanceof WavePacketAmplitudesChart );

    // Fields of interest in amplitudesChart, to improve readability
    const domainProperty = amplitudesChart.domainProperty;
    const finiteComponentsDataSetProperty = amplitudesChart.finiteComponentsDataSetProperty;
    const infiniteComponentsDataSetProperty = amplitudesChart.infiniteComponentsDataSetProperty;
    const continuousWaveformDataSetProperty = amplitudesChart.continuousWaveformDataSetProperty;
    const continuousWaveformVisibleProperty = amplitudesChart.continuousWaveformVisibleProperty;
    const waveNumberRange = amplitudesChart.waveNumberRange;
    const widthIndicatorWidthProperty = amplitudesChart.widthIndicatorWidthProperty;
    const widthIndicatorPositionProperty = amplitudesChart.widthIndicatorPositionProperty;
    const widthIndicatorsVisibleProperty = amplitudesChart.widthIndicatorsVisibleProperty;
    const peakAmplitudeProperty = amplitudesChart.peakAmplitudeProperty;
    const yAxisDescriptionProperty = amplitudesChart.yAxisDescriptionProperty;

    options = merge( {

      // DomainChartNode options
      // Units for the x-axis labels are omitted by request, due to space constraints.
      // See https://github.com/phetsims/fourier-making-waves/issues/137.
      xSpaceLabelProperty: FMWSymbols.kStringProperty,
      xTimeLabelProperty: FMWSymbols.omegaStringProperty,

      // FMWChartNode options
      xTickMarkSpacing: Math.PI,
      xTickLabelSpacing: 2 * Math.PI,
      xTickLabelSetOptions: {
        createLabel: value => TickLabelUtils.createPiTickLabel( value, X_TICK_LABEL_DECIMALS )
      },
      yTickLabelSetOptions: {
        createLabel: value => TickLabelUtils.createNumericTickLabel( value, Y_TICK_LABEL_DECIMALS )
      }
    }, options );

    super( amplitudesChart, options );

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
    const infiniteComponentsPlot = new GaussianAreaPlot( this.chartTransform, [], {
      fill: new LinearGradient( 0, 0, this.chartRectangle.width, 0 )
        .addColorStop( 0, Color.grayColor( GRAY_RANGE.min ) )
        .addColorStop( 1, Color.grayColor( GRAY_RANGE.max ) )
    } );

    // Displays the continuous waveform
    const continuousWaveformPlot = new CanvasLinePlot( this.chartTransform, [], {
      stroke: FMWColors.secondaryWaveformStrokeProperty.value,
      lineWidth: FMWConstants.SECONDARY_WAVEFORM_LINE_WIDTH
    } );

    // Render the plots using Canvas.
    // Remember! When any of the associated plots is updated, you must call update().
    const chartCanvasNode = new ChartCanvasNode( this.chartTransform, [ continuousWaveformPlot ], {
      clipArea: Shape.bounds( this.chartRectangle.bounds )
    } );

    // CanvasLinePlot stroke does not support Property, so handle updates here.
    FMWColors.secondaryWaveformStrokeProperty.lazyLink( stroke => {
      continuousWaveformPlot.setStroke( stroke );
      chartCanvasNode.update();
    } );

    // Width indicator, labeled dimensional arrows
    const widthIndicatorPlot = new WidthIndicatorPlot( this.chartTransform, widthIndicatorWidthProperty,
      widthIndicatorPositionProperty, domainProperty, FMWSymbols.kStringProperty, FMWSymbols.omegaStringProperty, {
        visibleProperty: widthIndicatorsVisibleProperty
      } );

    // Clip these elements to the chartRectangle bounds.
    const clipNode = new Node( {
      clipArea: this.chartRectangle.getShape(),
      children: [ infiniteComponentsPlot, chartCanvasNode, finiteComponentsPlot, widthIndicatorPlot ]
    } );
    this.addChild( clipNode );

    // Update plots when their data sets change.
    finiteComponentsDataSetProperty.link( dataSet => finiteComponentsPlot.setDataSet( dataSet ) );
    infiniteComponentsDataSetProperty.link( dataSet => infiniteComponentsPlot.setDataSet( dataSet ) );

    // CanvasLinePlot does not support visibleProperty, so handle it here by clearing the data set when invisible.
    Multilink.multilink( [ continuousWaveformVisibleProperty, continuousWaveformDataSetProperty ],
      ( visible, dataSet ) => {
        continuousWaveformPlot.setDataSet( visible ? dataSet : FMWConstants.EMPTY_DATA_SET );
        chartCanvasNode.update();
      } );

    // Scale the y axis, with some padding above peakAmplitude.
    peakAmplitudeProperty.link( peakAmplitude =>
      this.chartTransform.setModelYRange( new Range( 0, 1.05 * peakAmplitude ) )
    );

    // Update the y-axis decorations.
    yAxisDescriptionProperty.link( yAxisDescription => {
      // NOTE: this.chartTransform.setModelYRange is handled via peakAmplitudeProperty listener, above.
      this.yGridLines.setSpacing( yAxisDescription.gridLineSpacing );
      this.yTickMarks.setSpacing( yAxisDescription.tickMarkSpacing );
      this.yTickLabels.setSpacing( yAxisDescription.tickLabelSpacing );
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

fourierMakingWaves.register( 'WavePacketAmplitudesChartNode', WavePacketAmplitudesChartNode );