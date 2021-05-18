// Copyright 2021, University of Colorado Boulder

/**
 * WaveformChartNode is the base class for charts that plot one or more 2D waveforms related to a Fourier series.
 * The x axis is either space or time, while the y axis is always amplitude.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import AxisNode from '../../../../bamboo/js/AxisNode.js';
import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import GridLineSet from '../../../../bamboo/js/GridLineSet.js';
import TickMarkSet from '../../../../bamboo/js/TickMarkSet.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import FMWColorProfile from '../FMWColorProfile.js';
import FMWConstants from '../FMWConstants.js';
import FMWSymbols from '../FMWSymbols.js';
import Domain from '../model/Domain.js';
import WaveformChart from '../model/WaveformChart.js';
import XTickLabelSet from './XTickLabelSet.js';
import YTickLabelSet from './YTickLabelSet.js';

// constants
const AXIS_OPTIONS = {
  fill: FMWColorProfile.axisStrokeProperty,
  stroke: null,
  tailWidth: 1
};

const GRID_LINE_OPTIONS = {
  stroke: FMWColorProfile.chartGridLinesStrokeProperty,
  lineWidth: 0.5
};

const TICK_MARK_OPTIONS = {
  edge: 'min',
  extent: 6
};

class WaveformChartNode extends Node {

  /**
   * @param {WaveformChart} waveformChart
   * @param {Object} [options]
   */
  constructor( waveformChart, options ) {

    assert && assert( waveformChart instanceof WaveformChart );

    const L = waveformChart.fourierSeries.L;
    const T = waveformChart.fourierSeries.T;
    const domainProperty = waveformChart.domainProperty;
    const xAxisTickLabelFormatProperty = waveformChart.xAxisTickLabelFormatProperty;
    const xAxisDescriptionProperty = waveformChart.xAxisDescriptionProperty;
    const yAxisDescriptionProperty = waveformChart.yAxisDescriptionProperty;

    options = merge( {

      // {number} dimensions of the chart rectangle, in view coordinates
      viewWidth: 100,
      viewHeight: 100,

      xTickDecimalPlaces: 2,
      yTickDecimalPlaces: 1,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // the transform between model and view coordinate frames
    const chartTransform = new ChartTransform( {
      viewWidth: options.viewWidth,
      viewHeight: options.viewHeight,
      modelXRange: xAxisDescriptionProperty.value.createAxisRange( domainProperty.value, L, T ),
      modelYRange: yAxisDescriptionProperty.value.range
    } );

    // The chart's background rectangle
    const chartRectangle = new ChartRectangle( chartTransform, {

      // Use the same color as the grid lines. If use a different color (e.g. 'black') then we'll see a black line
      // appearing and disappearing at the top of the chart when the y-axis range is auto scaling. This is because
      // sometimes a grid line will coincide with min/max of the range, and sometimes it won't.
      stroke: FMWColorProfile.chartGridLinesStrokeProperty,
      fill: 'white',
      tandem: options.tandem.createTandem( 'chartRectangle' )
    } );

    // x axis (space or time) ---------------------------------------------------------

    const xAxis = new AxisNode( chartTransform, Orientation.HORIZONTAL, AXIS_OPTIONS );
    const xGridLines = new GridLineSet( chartTransform, Orientation.HORIZONTAL, xAxisDescriptionProperty.value.gridLineSpacing, GRID_LINE_OPTIONS );
    const xTickMarks = new TickMarkSet( chartTransform, Orientation.HORIZONTAL, xAxisDescriptionProperty.value.tickMarkSpacing, TICK_MARK_OPTIONS );
    const xTickLabels = new XTickLabelSet( chartTransform, xAxisDescriptionProperty.value.tickLabelSpacing, domainProperty,
      xAxisTickLabelFormatProperty, L, T );
    const xAxisLabel = new RichText( '', {
      font: FMWConstants.AXIS_LABEL_FONT,
      maxWidth: 30, // determined empirically
      tandem: options.tandem.createTandem( 'xAxisLabel' )
    } );

    // Set the x-axis label based on domain.
    const spaceLabel = StringUtils.fillIn( fourierMakingWavesStrings.xMeters, { x: FMWSymbols.x } );
    const timeLabel = StringUtils.fillIn( fourierMakingWavesStrings.tMilliseconds, { t: FMWSymbols.t } );
    domainProperty.link( domain => {
      xAxisLabel.text = ( domain === Domain.TIME ) ? timeLabel : spaceLabel;
      xAxisLabel.left = chartRectangle.right + FMWConstants.X_AXIS_LABEL_SPACING;
      xAxisLabel.centerY = chartRectangle.centerY;
    } );

    // unmultilink is not needed.
    Property.multilink(
      [ xAxisDescriptionProperty, domainProperty ],
      ( xAxisDescription, domain ) => {
        const value = ( domain === Domain.TIME ) ? T : L;
        const xMin = value * xAxisDescription.range.min;
        const xMax = value * xAxisDescription.range.max;
        chartTransform.setModelXRange( new Range( xMin, xMax ) );
        xGridLines.setSpacing( xAxisDescription.gridLineSpacing * value );
        xTickMarks.setSpacing( xAxisDescription.tickMarkSpacing * value );
        xTickLabels.setSpacing( xAxisDescription.tickLabelSpacing * value );
        xTickLabels.invalidateLabelSet();
      } );

    // y axis (amplitude ) ---------------------------------------------------------

    const yAxis = new AxisNode( chartTransform, Orientation.VERTICAL, AXIS_OPTIONS );
    const yGridLines = new GridLineSet( chartTransform, Orientation.VERTICAL, yAxisDescriptionProperty.value.gridLineSpacing, GRID_LINE_OPTIONS );
    const yTickMarks = new TickMarkSet( chartTransform, Orientation.VERTICAL, yAxisDescriptionProperty.value.tickMarkSpacing, TICK_MARK_OPTIONS );
    const yTickLabels = new YTickLabelSet( chartTransform, yAxisDescriptionProperty.value.tickLabelSpacing );
    const yAxisLabel = new RichText( fourierMakingWavesStrings.amplitude, {
      font: FMWConstants.AXIS_LABEL_FONT,
      rotation: -Math.PI / 2,
      right: chartRectangle.left - FMWConstants.Y_AXIS_LABEL_SPACING,
      centerY: chartRectangle.centerY,
      maxWidth: 0.85 * chartRectangle.height,
      tandem: options.tandem.createTandem( 'yAxisLabel' )
    } );

    //TODO observe yAxisDescriptionProperty

    // ---------------------------------------------------------------

    // Parent for Nodes that must be clipped to the bounds of chartRectangle
    const clippedParent = new Node( {
      clipArea: chartRectangle.getShape(),
      children: [ xAxis, yAxis ]
    } );

    assert && assert( !options.children, 'AmplitudesChartNode sets children' );
    options.children = [
      xTickMarks, yTickMarks, // ticks behind chartRectangle, so we don't see how they extend into chart's interior
      chartRectangle,
      xAxisLabel, xGridLines, xTickLabels,
      yAxisLabel, yGridLines, yTickLabels,
      clippedParent
    ];

    super( options );

    // @public for use by subclasses and clients
    this.chartRectangle = chartRectangle;
    this.chartTransform = chartTransform;

    // @protected for layout of decorations added by subclasses
    this.yAxisLabel = yAxisLabel;

    // @protected for setting range and spacing by subclasses
    this.xTickLabels = xTickLabels;
    this.yGridLines = yGridLines;
    this.yTickMarks = yTickMarks;
    this.yTickLabels = yTickLabels;
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

fourierMakingWaves.register( 'WaveformChartNode', WaveformChartNode );
export default WaveformChartNode;