// Copyright 2021, University of Colorado Boulder

//TODO use this class or delete it
//TODO move some of FMWConstants into this file, if they aren't used elsewhere.
/**
 * FWMChartNode is the base class for most of the charts in this simulation.
 * It's main responsibility is assembling all of the bamboo components that are needed.
 * Subclasses are responsible for customizing those components.
 *
 * All of these charts have x and y axes, grid lines, tick marks, and tick labels.
 * Optional features include zoom buttons for each axis.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AxisLine from '../../../../bamboo/js/AxisLine.js';
import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import GridLineSet from '../../../../bamboo/js/GridLineSet.js';
import LabelSet from '../../../../bamboo/js/LabelSet.js';
import TickMarkSet from '../../../../bamboo/js/TickMarkSet.js';
import merge from '../../../../phet-core/js/merge.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import PlusMinusZoomButtonGroup from '../../../../scenery-phet/js/PlusMinusZoomButtonGroup.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWColors from '../FMWColors.js';
import FMWConstants from '../FMWConstants.js';
import FMWSymbols from '../FMWSymbols.js';

// constants
const DEFAULT_EDGE = 'min';

class FWMChartNode extends Node {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // x axis
      xAxisLabel: FMWSymbols.x,
      xGridLineSpacing: 1,
      xTickMarkSpacing: 1,
      xTickLabelSpacing: 1,
      xZoomLevelProperty: null, // {NumberProperty|null} adds optional zoom buttons

      // y axis
      yAxisLabel: FMWSymbols.y,
      yGridLineSpacing: 1,
      yTickMarkSpacing: 1,
      yTickLabelSpacing: 1,
      yZoomLevelProperty: null, // {NumberProperty|null} adds optional zoom buttons

      chartTransformOptions: {},

      chartRectangleOptions: {

        // Use the same color as the grid lines. If use a different color (e.g. 'black') then we'll see a black line
        // appearing and disappearing at the top of the chart when the y-axis range is auto scaling. This is because
        // sometimes a grid line will coincide with min/max of the range, and sometimes it won't.
        stroke: FMWColors.chartGridLinesStrokeProperty,
        fill: 'white'
      },

      axisLabelOptions: {
        font: FMWConstants.AXIS_LABEL_FONT,
        maxWidth: FMWConstants.X_AXIS_LABEL_MAX_WIDTH
      },

      axisLineOptions: {
        stroke: FMWColors.axisStrokeProperty,
        lineWidth: 1
      },

      gridLineOptions: {
        stroke: FMWColors.chartGridLinesStrokeProperty,
        lineWidth: 0.5
      },

      tickMarkOptions: {
        edge: DEFAULT_EDGE,
        extent: 6
      },

      xLabelSetOptions: {
        edge: DEFAULT_EDGE
      },

      yLabelSetOptions: {
        edge: DEFAULT_EDGE
      },

      // phet-io options
      tandem: Tandem.REQUIRED

    }, options );

    // the transform between model and view coordinate frames
    const chartTransform = new ChartTransform( options.chartTransformOptions );

    // The chart's background rectangle
    const chartRectangle = new ChartRectangle( chartTransform, options.chartRectangleOptions );

    // x axis
    const xAxis = new AxisLine( chartTransform, Orientation.HORIZONTAL, options.axisLineOptions );
    const xAxisLabel = new RichText( options.xAxisLabel, options.axisLabelOptions );
    const xGridLines = new GridLineSet( chartTransform, Orientation.HORIZONTAL, options.xGridLineSpacing, options.gridLineOptions );
    const xTickMarks = new TickMarkSet( chartTransform, Orientation.HORIZONTAL, options.xTickMarkSpacing, options.tickMarkOptions );
    const xTickLabels = new LabelSet( chartTransform, Orientation.HORIZONTAL, options.xTickLabelSpacing, options.xLabelSetOptions );

    // y axis
    const yAxis = new AxisLine( chartTransform, Orientation.VERTICAL, options.axisLineOptions );
    const yAxisLabel = new RichText( options.yAxisLabel, options.axisLabelOptions );
    const yGridLines = new GridLineSet( chartTransform, Orientation.VERTICAL, options.yGridLineSpacing, options.gridLineOptions );
    const yTickMarks = new TickMarkSet( chartTransform, Orientation.VERTICAL, options.yTickMarkSpacing, options.tickMarkOptions );
    const yTickLabels = new LabelSet( chartTransform, Orientation.VERTICAL, options.yTickLabelSpacing, options.xLabelSetOptions );

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
        bottom: chartRectangle.bottom
      } );
    }

    let yZoomButtonGroup;
    if ( options.yZoomLevelProperty ) {
      yZoomButtonGroup = new PlusMinusZoomButtonGroup( options.yZoomLevelProperty, {
        orientation: 'vertical',
        scale: FMWConstants.ZOOM_BUTTON_GROUP_SCALE,
        touchAreaXDilation: 10,
        touchAreaYDilation: 5,

        // left-bottom corner of chartRectangle
        right: chartRectangle.left - 31,
        top: chartRectangle.bottom
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
    yZoomButtonGroup && options.children.push( yZoomButtonGroup );

    super( options );

    // @protected fields for use by subclasses
    //TODO

    // @public fields the are part of the public API
    //TODO
  }
}

fourierMakingWaves.register( 'FWMChartNode', FWMChartNode );
export default FWMChartNode;