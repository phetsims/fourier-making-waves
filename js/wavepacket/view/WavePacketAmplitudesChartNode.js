// Copyright 2021, University of Colorado Boulder

//TODO move visibility optimizations into model?
/**
 * WavePacketAmplitudesChartNode is the 'Amplitudes' chart on the 'Wave Packet' screen.
 * This is optimized to update only the plots that are visible.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BarPlot from '../../../../bamboo/js/BarPlot.js';
import LinePlot from '../../../../bamboo/js/LinePlot.js';
import Range from '../../../../dot/js/Range.js';
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

    // Displays each Fourier component amplitude as a vertical bar
    const amplitudesPlot = new BarPlot( this.chartTransform, [], {
      barWidth: 5,

      // Assign a grayscale color to each bar in the BarPlot.
      pointToPaintableFields: point => {
        let rgb = GRAY_RANGE.min + GRAY_RANGE.getLength() * point.x / waveNumberRange.max;
        rgb = GRAY_RANGE.constrainValue( rgb );
        return { fill: Color.grayColor( rgb ) };
      }
    } );

    //TODO use CanvasLinePlot
    // Displays the continuous waveform
    const continuousWaveformPlot = new LinePlot( this.chartTransform, [], {
      stroke: FMWColors.continuousWaveformStrokeProperty,
      lineWidth: 4,
      visibleProperty: continuousWaveformVisibleProperty
    } );

    // Displays an infinite number of components. This uses the same data set as continuousWaveformPlot, but fills
    // the area under that curve with the same grayscale gradient that is used to color the bars.
    const infiniteComponentsPlot = new AreaPlot( this.chartTransform, [], {
      fill: new LinearGradient( 0, 0, this.chartRectangle.width, 0 )
        .addColorStop( 0, Color.grayColor( GRAY_RANGE.min ) )
        .addColorStop( 1, Color.grayColor( GRAY_RANGE.max ) )
    } );

    // Width indicator, labeled dimensional arrows
    const widthIndicatorPlot = new WidthIndicatorPlot( this.chartTransform, widthIndicatorWidthProperty,
      widthIndicatorPositionProperty, domainProperty, FMWSymbols.k, FMWSymbols.omega, {
        visibleProperty: widthIndicatorsVisibleProperty
      } );

    // Clip these elements to the chartRectangle bounds.
    const clipNode = new Node( {
      clipArea: this.chartRectangle.getShape(),
      children: [ infiniteComponentsPlot, continuousWaveformPlot, amplitudesPlot, widthIndicatorPlot ]
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
      if ( amplitudesPlot.visible ) {
        amplitudesPlot.setDataSet( amplitudesDataSet );
      }
    } );

    // Update plots that rely on continuous waveform data set, and scale the y axis to fit.
    // Performance optimization: Update only the visible plots.
    continuousWaveformDataSetProperty.link( dataSet => {

      // Update visible plots.
      if ( continuousWaveformPlot.visible ) {
        continuousWaveformPlot.setDataSet( dataSet );
      }
      if ( infiniteComponentsPlot.visible ) {
        infiniteComponentsPlot.setDataSet( dataSet );
      }

      // Scale the axis relative to the continuous waveform, because maxY may be smaller component amplitudes.
      this.scaleYAxis( dataSet );
    } );

    // When we have infinite components, hide amplitudesPlot and show infiniteComponentsPlot.
    componentSpacingProperty.link( componentSpacing => {
      const isInfinite = ( componentSpacing === 0 );
      amplitudesPlot.visible = !isInfinite;
      infiniteComponentsPlot.visible = isInfinite;
    } );

    // Performance optimization: Update data set when a plot becomes visible, clear data set when it becomes invisible.
    amplitudesPlot.visibleProperty.link(
      visible => amplitudesPlot.setDataSet( visible ? amplitudesDataSetProperty.value : [] ) );
    continuousWaveformPlot.visibleProperty.link(
      visible => continuousWaveformPlot.setDataSet( visible ? continuousWaveformDataSetProperty.value : [] ) );
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
   * Scales the y axis to fit the data set.
   * @param {Vector2[]} dataSet
   * @private
   */
  scaleYAxis( dataSet ) {
    assert && assert( dataSet.length > 0 );

    // Extend the range, so there's some space above maxY.
    const maxY = _.maxBy( dataSet, point => point.y ).y;
    this.chartTransform.setModelYRange( new Range( 0, 1.05 * maxY ) );

    // Adjust ticks and gridlines.
    // This logic and values were taken from D2CAmplitudesChart.java, in the Java version.
    //TODO should this use AxisDescription, and amplitudesChart.yAxisDescriptionProperty, like other charts?
    let tickLabelSpacing;
    let tickMarkSpacing;
    if ( maxY > 1 ) {
      tickLabelSpacing = 1.0;
      tickMarkSpacing = 0.5;
    }
    else if ( maxY > 0.5 ) {
      tickLabelSpacing = 0.2;
      tickMarkSpacing = 0.1;
    }
    else if ( maxY > 0.2 ) {
      tickLabelSpacing = 0.1;
      tickMarkSpacing = 0.05;
    }
    else if ( maxY > 0.05 ) {
      tickLabelSpacing = 0.05;
      tickMarkSpacing = 0.01;
    }
    else if ( maxY > 0.02 ) {
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