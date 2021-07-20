// Copyright 2021, University of Colorado Boulder

//TODO some things in common with WavePacketChartNode
/**
 * WavePacketAmplitudesChartNode is the 'Amplitudes' chart on the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AxisLine from '../../../../bamboo/js/AxisLine.js';
import BarPlot from '../../../../bamboo/js/BarPlot.js';
import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import GridLineSet from '../../../../bamboo/js/GridLineSet.js';
import LabelSet from '../../../../bamboo/js/LabelSet.js';
import TickMarkSet from '../../../../bamboo/js/TickMarkSet.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWColors from '../../common/FMWColors.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import Domain from '../../common/model/Domain.js';
import YTickLabelSet from '../../common/view/YTickLabelSet.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import WavePacketAmplitudesChart from '../model/WavePacketAmplitudesChart.js';
import ContinuousWaveformCheckbox from './ContinuousWaveformCheckbox.js';

class WavePacketAmplitudesChartNode extends Node {

  /**
   * @param {WavePacketAmplitudesChart} amplitudesChart
   * @param {Object} [options]
   */
  constructor( amplitudesChart, options ) {

    assert && assert( amplitudesChart instanceof WavePacketAmplitudesChart );

    options = merge( {

      // ChartTransform options
      transformOptions: {
        modelXRange: new Range( 0, 1 ),
        modelYRange: new Range( 0, 1 ),
        viewWidth: 100,
        viewHeight: 100
      },

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // Fields of interest in amplitudesChart, to improve readability
    const domainProperty = amplitudesChart.domainProperty;
    const continuousWaveformVisibleProperty = amplitudesChart.continuousWaveformVisibleProperty;
    const barPlotDataSetProperty = amplitudesChart.barPlotDataSetProperty;

    // the transform from model to view coordinates
    const chartTransform = new ChartTransform( options.transformOptions );

    const chartRectangle = new ChartRectangle( chartTransform, {
      stroke: FMWColors.chartGridLinesStrokeProperty,
      fill: 'white',
      tandem: options.tandem.createTandem( 'chartRectangle' )
    } );

    // x axis ---------------------------------------------------------

    const xAxis = new AxisLine( chartTransform, Orientation.HORIZONTAL, FMWConstants.AXIS_LINE_OPTIONS );

    const xAxisLabel = new RichText( '', {
      font: FMWConstants.AXIS_LABEL_FONT,
      maxWidth: FMWConstants.X_AXIS_LABEL_MAX_WIDTH,
      tandem: options.tandem.createTandem( 'xAxisLabel' )
    } );

    const xTickMarks = new TickMarkSet( chartTransform, Orientation.HORIZONTAL, Math.PI, FMWConstants.TICK_MARK_OPTIONS );

    const xTickLabels = new LabelSet( chartTransform, Orientation.HORIZONTAL, 2 * Math.PI, {
      createLabel: createXTickLabel,
      edge: 'min'
    } );

    // y axis ---------------------------------------------------------

    const yAxis = new AxisLine( chartTransform, Orientation.VERTICAL, FMWConstants.AXIS_LINE_OPTIONS );

    const yAxisLabel = new RichText( fourierMakingWavesStrings.amplitude, {
      font: FMWConstants.AXIS_LABEL_FONT,
      rotation: -Math.PI / 2,
      right: chartRectangle.left - FMWConstants.Y_AXIS_LABEL_SPACING,
      centerY: chartRectangle.centerY,
      maxWidth: 0.85 * chartRectangle.height,
      tandem: options.tandem.createTandem( 'yAxisLabel' )
    } );

    const yGridLines = new GridLineSet( chartTransform, Orientation.VERTICAL, 1, FMWConstants.GRID_LINE_OPTIONS );

    const yTickMarks = new TickMarkSet( chartTransform, Orientation.VERTICAL, Math.PI, FMWConstants.TICK_MARK_OPTIONS );

    const yTickLabels = new YTickLabelSet( chartTransform, 2 * Math.PI, {
      decimalPlaces: 3
    } );

    // Plots -------------------------------------------------------------------------

    //TODO how to assign a different color to each bar, or use a gradient for the BarPlot?
    const barPlot = new BarPlot( chartTransform, [], {
      barWidth: 5
    } );

    // Addition UI components ---------------------------------------------------------

    const continuousWaveformCheckbox = new ContinuousWaveformCheckbox( continuousWaveformVisibleProperty, {
      right: chartRectangle.right - 5,
      top: xTickLabels.bottom + 8,
      tandem: options.tandem.createTandem( 'continuousWaveformCheckbox' )
    } );

    const chartClip = new Node( {
      clipArea: chartRectangle.getShape(),
      children: [ barPlot ]
    } );

    assert && assert( !options.children );
    options.children = [
      xTickMarks, // ticks behind chartRectangle, so we don't see how they extend into chart's interior
      chartRectangle,
      xAxis, xAxisLabel, xTickLabels,
      yAxis, yAxisLabel, yGridLines, yTickMarks, yTickLabels,
      chartClip,
      continuousWaveformCheckbox
    ];

    super( options );

    // Adjust the x-axis label to match the domain.
    // unlink is not needed.
    domainProperty.link( domain => {

      // Update the label. Note that units are on a separate line so that this label takes up less horizontal space.
      xAxisLabel.text = StringUtils.fillIn( fourierMakingWavesStrings.symbolBreakUnits, {
        symbol: ( domain === Domain.SPACE ) ? FMWSymbols.k : FMWSymbols.omega,
        units: ( domain === Domain.SPACE ) ?
               fourierMakingWavesStrings.units.radiansPerMeter :
               fourierMakingWavesStrings.units.radiansPerMillisecond
      } );

      // position at lower right corner of chart, because x axis corresponds to bottom of chart
      xAxisLabel.left = chartRectangle.right + FMWConstants.X_AXIS_LABEL_SPACING;
      xAxisLabel.bottom = chartRectangle.bottom;
    } );

    barPlotDataSetProperty.link( dataSet => {

      // Update the bar plot.
      barPlot.setDataSet( dataSet );

      // Autoscale the y axis.
      if ( dataSet.length > 0 ) {

        // Extend the range, so there's some space above maxY.
        const maxY = amplitudesChart.getBarPlotMaxY();
        chartTransform.setModelYRange( new Range( 0, 1.05 * maxY ) );

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

        yGridLines.setSpacing( tickLabelSpacing );
        yTickLabels.setSpacing( tickLabelSpacing );
        yTickMarks.setSpacing( tickMarkSpacing );
      }
    } );

    // @public for layout
    this.chartRectangle = chartRectangle;

    // pdom - traversal order
    this.pdomOrder = [
      continuousWaveformCheckbox
    ];
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

/**
 * Creates the label for an x-axis tick mark.
 * @param {number} value
 * @returns {Node}
 */
function createXTickLabel( value ) {
  const coefficient = Utils.toFixedNumber( value / Math.PI, 0 );
  const string = ( coefficient === 0 ) ? '0' : `${coefficient}${FMWSymbols.pi}`;
  return new RichText( string, {
    font: FMWConstants.TICK_LABEL_FONT,
    maxWidth: 20
  } );
}

fourierMakingWaves.register( 'WavePacketAmplitudesChartNode', WavePacketAmplitudesChartNode );
export default WavePacketAmplitudesChartNode;