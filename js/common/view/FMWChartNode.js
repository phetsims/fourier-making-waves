// Copyright 2021, University of Colorado Boulder

/**
 * FMWChartNode is the base class for all of the charts in this simulation, with the exception of the Amplitudes
 * chart in the Discrete and Wave Game screens. It's main responsibility is assembling all of the bamboo components
 * that are needed. Subclasses are responsible for customizing those components.
 *
 * All of these charts have x and y axes, grid lines, tick marks, and tick labels.
 * Zoom buttons for the x-axis are optional.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AxisLine from '../../../../bamboo/js/AxisLine.js';
import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import GridLineSet from '../../../../bamboo/js/GridLineSet.js';
import TickLabelSet from '../../../../bamboo/js/TickLabelSet.js';
import TickMarkSet from '../../../../bamboo/js/TickMarkSet.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import PlusMinusZoomButtonGroup from '../../../../scenery-phet/js/PlusMinusZoomButtonGroup.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import FMWColors from '../FMWColors.js';
import FMWConstants from '../FMWConstants.js';
import FMWSymbols from '../FMWSymbols.js';

// constants
const DEFAULT_EDGE = 'min';

class FMWChartNode extends Node {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // x axis
      xAxisString: FMWSymbols.x,
      xGridLineSpacing: 1,
      xTickMarkSpacing: 1,
      xTickLabelSpacing: 1,
      xZoomLevelProperty: null, // {NumberProperty|null} adds optional zoom buttons

      // y axis
      yAxisString: fourierMakingWavesStrings.amplitude,
      yGridLineSpacing: 1,
      yTickMarkSpacing: 1,
      yTickLabelSpacing: 1,

      // ChartTransform options
      chartTransformOptions: {
        modelXRange: new Range( 0, 1 ),
        modelYRange: new Range( 0, 1 ),
        viewWidth: FMWConstants.CHART_RECTANGLE_SIZE.width,
        viewHeight: FMWConstants.CHART_RECTANGLE_SIZE.height
      },

      // ChartRectangle options
      chartRectangleOptions: {

        // Use the same color as the grid lines. If use a different color (e.g. 'black') then we'll occasionally
        // see a black line appearing and disappearing at the top of the chart as the y-axis range changes.
        // This is because sometimes a grid line will coincide with min/max of the range, and sometimes it won't.
        stroke: FMWColors.chartGridLinesStrokeProperty,
        fill: 'white'
      },

      // RichText options for the x-axis label
      xAxisLabelOptions: {
        font: FMWConstants.AXIS_LABEL_FONT,
        maxWidth: FMWConstants.X_AXIS_LABEL_MAX_WIDTH
      },

      // RichText options for the x-axis label
      yAxisLabelOptions: {
        font: FMWConstants.AXIS_LABEL_FONT,
        maxWidth: 0.85 * FMWConstants.CHART_RECTANGLE_SIZE.height,
        rotation: -Math.PI / 2
      },

      // AxisLine options for both axes
      axisLineOptions: {
        stroke: FMWColors.axisStrokeProperty,
        lineWidth: 1
      },

      // GridLineSet options for both axes
      gridLineOptions: {
        stroke: FMWColors.chartGridLinesStrokeProperty,
        lineWidth: 0.5
      },

      // TickMarkSet options for both axes
      tickMarkOptions: {
        edge: DEFAULT_EDGE,
        extent: 6
      },

      // LabelSet options for the x-axis tick labels
      xLabelSetOptions: {
        edge: DEFAULT_EDGE
      },

      // LabelSet options for the x-axis tick labels
      yLabelSetOptions: {
        edge: DEFAULT_EDGE
      },

      // phet-io options
      tandem: Tandem.REQUIRED

    }, options );

    // the transform between model and view coordinate frames
    const chartTransform = new ChartTransform( options.chartTransformOptions );

    // the chart's background rectangle
    const chartRectangle = new ChartRectangle( chartTransform, options.chartRectangleOptions );

    // x axis
    const xAxis = new AxisLine( chartTransform, Orientation.HORIZONTAL, options.axisLineOptions );
    const xAxisLabel = new RichText( options.xAxisString, options.xAxisLabelOptions );
    const xGridLines = new GridLineSet( chartTransform, Orientation.HORIZONTAL, options.xGridLineSpacing, options.gridLineOptions );
    const xTickMarks = new TickMarkSet( chartTransform, Orientation.HORIZONTAL, options.xTickMarkSpacing, options.tickMarkOptions );
    const xTickLabels = new TickLabelSet( chartTransform, Orientation.HORIZONTAL, options.xTickLabelSpacing, options.xLabelSetOptions );

    // y axis
    const yAxis = new AxisLine( chartTransform, Orientation.VERTICAL, options.axisLineOptions );
    const yAxisLabel = new RichText( options.yAxisString, options.yAxisLabelOptions );
    const yGridLines = new GridLineSet( chartTransform, Orientation.VERTICAL, options.yGridLineSpacing, options.gridLineOptions );
    const yTickMarks = new TickMarkSet( chartTransform, Orientation.VERTICAL, options.yTickMarkSpacing, options.tickMarkOptions );
    const yTickLabels = new TickLabelSet( chartTransform, Orientation.VERTICAL, options.yTickLabelSpacing, options.yLabelSetOptions );

    // Optional zoom buttons
    let xZoomButtonGroup;
    if ( options.xZoomLevelProperty ) {
      xZoomButtonGroup = new PlusMinusZoomButtonGroup( options.xZoomLevelProperty, {
        orientation: 'horizontal',
        scale: FMWConstants.ZOOM_BUTTON_GROUP_SCALE,
        touchAreaXDilation: 5,
        touchAreaYDilation: 10,

        // right-bottom corner of chartRectangle
        left: chartRectangle.right + 6,
        bottom: chartRectangle.bottom,

        tandem: options.tandem.createTandem( 'xZoomButtonGroup' )
      } );
    }

    assert && assert( !options.children );
    options.children = [
      xTickMarks, yTickMarks, // ticks behind chartRectangle, so we don't see how they extend into chart's interior
      chartRectangle,
      xAxis, xAxisLabel, xGridLines, xTickLabels,
      yAxis, yAxisLabel, yGridLines, yTickLabels
    ];
    xZoomButtonGroup && options.children.push( xZoomButtonGroup );

    super( options );

    // Position the x-axis label at the right of the chart. The y position depends on the y range. If the y range
    // is non-negative, then the y-axis label is aligned with the bottom of the chart. Otherwise it's vertically
    // centered on the chart.
    xAxisLabel.boundsProperty.link( bounds => {
      xAxisLabel.left = chartRectangle.right + FMWConstants.X_AXIS_LABEL_SPACING;
      if ( chartTransform.modelYRange.min >= 0 ) {
        xAxisLabel.bottom = chartRectangle.bottom;
      }
      else {
        xAxisLabel.centerY = chartRectangle.centerY;
      }
    } );

    // Position the y-axis label at the left of the chart, vertically centered on chartRectangle.
    yAxisLabel.boundsProperty.link( bounds => {
      yAxisLabel.right = chartRectangle.left - FMWConstants.Y_AXIS_LABEL_SPACING;
      yAxisLabel.centerY = chartRectangle.centerY;
    } );

    // pdom - traversal order
    // See https://github.com/phetsims/fourier-making-waves/issues/53
    const pdomOrder = [];
    xZoomButtonGroup && pdomOrder.push( xZoomButtonGroup );
    this.pdomOrder = pdomOrder;

    // @protected x-axis fields, for use by subclasses
    this.xAxis = xAxis;
    this.xAxisLabel = xAxisLabel;
    this.xGridLines = xGridLines;
    this.xTickMarks = xTickMarks;
    this.xTickLabels = xTickLabels;
    this.xZoomButtonGroup = xZoomButtonGroup;

    // @protected y-axis fields, for use by subclasses
    this.yAxis = yAxis;
    this.yAxisLabel = yAxisLabel;
    this.yGridLines = yGridLines;
    this.yTickMarks = yTickMarks;
    this.yTickLabels = yTickLabels;

    // @public
    this.chartTransform = chartTransform;
    this.chartRectangle = chartRectangle;
  }

  /**
   * Computes the clipArea that will trim any data that is outside of a given amplitude range.
   * This is used to trim anomalies that occur when the x-axis is zoomed way out.
   * See https://github.com/phetsims/fourier-making-waves/issues/121
   * @param {number} minAmplitude
   * @param {number} maxAmplitude
   * @returns {Shape}
   * @public
   */
  computeClipAreaForAmplitudeRange( minAmplitude, maxAmplitude ) {

    assert && assert( typeof minAmplitude === 'number' );
    assert && assert( typeof maxAmplitude === 'number' );
    assert && assert( minAmplitude < maxAmplitude );

    const chartRectangleBounds = this.chartRectangle.bounds;
    const x1 = chartRectangleBounds.left;
    const x2 = chartRectangleBounds.right;
    const rangeHeight = this.chartTransform.modelToViewY( minAmplitude ) - this.chartTransform.modelToViewY( maxAmplitude );
    const yTrim = Math.max( 0, ( chartRectangleBounds.height - rangeHeight ) / 2 );
    const y1 = chartRectangleBounds.top + yTrim;
    const y2 = chartRectangleBounds.bottom - yTrim;
    return Shape.bounds( new Bounds2( x1, y1, x2, y2 ) );
  }
}

fourierMakingWaves.register( 'FMWChartNode', FMWChartNode );
export default FMWChartNode;