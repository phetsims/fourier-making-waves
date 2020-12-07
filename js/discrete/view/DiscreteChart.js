// Copyright 2020, University of Colorado Boulder

/**
 * DiscreteChart is the base class for the charts in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AxisNode from '../../../../bamboo/js/AxisNode.js';
import ChartModel from '../../../../bamboo/js/ChartModel.js';
import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import GridLineSet from '../../../../bamboo/js/GridLineSet.js';
import LabelSet from '../../../../bamboo/js/LabelSet.js';
import TickMarkSet from '../../../../bamboo/js/TickMarkSet.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import FourierSeries from '../../common/model/FourierSeries.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';

class DiscreteChart extends Node {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {Object} [options]
   */
  constructor( fourierSeries, options ) {

    assert && assert( fourierSeries instanceof FourierSeries, 'invalid fourierSeries' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    const L = FMWConstants.L;

    // bamboo chart model
    const chartModel = new ChartModel( FMWConstants.CHART_WIDTH, FMWConstants.CHART_HEIGHT, {
      modelXRange: new Range( -L / 2, L / 2 ),
      modelYRange: fourierSeries.amplitudeRange
    } );

    const chartRectangle = new ChartRectangle( chartModel, {
      fill: 'white',
      stroke: 'black'
    } );

    // x axis
    const xAxis = new AxisNode( chartModel, Orientation.HORIZONTAL, FMWConstants.AXIS_OPTIONS );
    const xGridLineSet = new GridLineSet( chartModel, Orientation.HORIZONTAL, L / 8, FMWConstants.GRID_LINE_OPTIONS );
    const xLabelSet = new LabelSet( chartModel, Orientation.HORIZONTAL, L / 2, FMWConstants.LABEL_SET_OPTIONS );
    const xTickMarkSet = new TickMarkSet( chartModel, Orientation.HORIZONTAL, L / 2, FMWConstants.TICK_MARK_OPTIONS );
    const xAxisLabel = new RichText( StringUtils.fillIn( fourierMakingWavesStrings.xMeters, {
      x: FMWSymbols.x
    } ), {
      font: FMWConstants.AXIS_LABEL_FONT,
      left: chartRectangle.right + 10,
      centerY: chartRectangle.centerY,
      maxWidth: 50 // determined empirically
    } );

    // y axis
    const yAxis = new AxisNode( chartModel, Orientation.VERTICAL, FMWConstants.AXIS_OPTIONS );
    const yGridLineSet = new GridLineSet( chartModel, Orientation.VERTICAL, 0.5, FMWConstants.GRID_LINE_OPTIONS );
    const yLabelSet = new LabelSet( chartModel, Orientation.VERTICAL, 0.5, FMWConstants.LABEL_SET_OPTIONS );
    const yTickMarkSet = new TickMarkSet( chartModel, Orientation.VERTICAL, 0.5, FMWConstants.TICK_MARK_OPTIONS );
    const yAxisLabel = new RichText( fourierMakingWavesStrings.amplitude, {
      font: FMWConstants.AXIS_LABEL_FONT,
      rotation: -Math.PI / 2,
      right: yLabelSet.left - 10,
      centerY: chartRectangle.centerY,
      maxWidth: 0.85 * chartRectangle.height
    } );

    // Parent for Nodes that must be clipped to the bounds of chartRectangle
    const clippedParent = new Node( {
      clipArea: chartRectangle.getShape(),
      children: [ xAxis, yAxis ]
    } );

    assert && assert( !options.children, 'AmplitudesChart sets children' );
    options.children = [
      xTickMarkSet, yTickMarkSet, // ticks behind chartRectangle, so we don't see how they extend into chart's interior
      chartRectangle,
      xAxisLabel, xGridLineSet, xLabelSet,
      yAxisLabel, yGridLineSet, yLabelSet,
      clippedParent
    ];

    super( options );

    // @protected for layout of decorations added by subclasses
    this.chartRectangle = chartRectangle;
    this.xLabelSet = xLabelSet;
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
   * Steps the chart.
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {
    //TODO
  }

  /**
   * @public
   */
  setXAxisLabel() {
    //TODO
  }

  /**
   * @public
   */
  setYAxisLabel() {
    //TODO
  }

  /**
   * @public
   */
  setXRange() {
    //TODO
  }

  /**
   * @public
   */
  setYRange() {
    //TODO
  }

  /**
   * @public
   */
  setXTickLabels() {
    //TODO
  }

  /**
   * @public
   */
  setYTickLabels() {
    //TODO
  }

  /**
   * @public
   */
  setXTickMarkSpacing() {
    //TODO
  }

  /**
   * @public
   */
  setYTickMarkSpacing() {
    //TODO
  }

  /**
   * @public
   */
  setXGridLineSpacing() {
    //TODO
  }

  /**
   * @public
   */
  setYGridLineSpacing() {
    //TODO
  }
}

fourierMakingWaves.register( 'DiscreteChart', DiscreteChart );
export default DiscreteChart;