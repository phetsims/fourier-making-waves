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
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import FourierSeries from '../../common/model/FourierSeries.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import Domain from '../model/Domain.js';

const DEFAULT_SPACING = 1;

class DiscreteChart extends Node {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Object} [options]
   */
  constructor( fourierSeries, domainProperty, options ) {

    assert && assert( fourierSeries instanceof FourierSeries, 'invalid fourierSeries' );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );

    options = merge( {

      // {number} dimensions of the chart rectangle, in view coordinates
      viewWidth: 100,
      viewHeight: 100,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    const L = FMWConstants.L;

    // bamboo chart model
    const chartModel = new ChartModel( options.viewWidth, options.viewHeight, {
      modelXRange: new Range( -L / 2, L / 2 ),
      modelYRange: fourierSeries.amplitudeRange
    } );

    // The chart's background rectangle
    const chartRectangle = new ChartRectangle( chartModel, {
      fill: 'white',
      stroke: 'black',
      tandem: options.tandem.createTandem( 'chartRectangle' )
    } );

    //TODO revisit default spacings
    // x axis
    const xAxis = new AxisNode( chartModel, Orientation.HORIZONTAL, FMWConstants.AXIS_OPTIONS );
    const xGridLines = new GridLineSet( chartModel, Orientation.HORIZONTAL, DEFAULT_SPACING, FMWConstants.GRID_LINE_OPTIONS );
    const xTickMarks = new TickMarkSet( chartModel, Orientation.HORIZONTAL, DEFAULT_SPACING, FMWConstants.TICK_MARK_OPTIONS );
    const xTickLabels = new LabelSet( chartModel, Orientation.HORIZONTAL, DEFAULT_SPACING, FMWConstants.LABEL_SET_OPTIONS );
    const xAxisLabel = new RichText( '', {
      font: FMWConstants.AXIS_LABEL_FONT,
      maxWidth: 50, // determined empirically
      tandem: options.tandem.createTandem( 'xAxisLabel' )
    } );

    // Set the x-axis label based on domain.
    const spaceLabel = StringUtils.fillIn( fourierMakingWavesStrings.xMeters, { x: FMWSymbols.x } );
    const timeLabel = StringUtils.fillIn( fourierMakingWavesStrings.tMilliseconds, { t: FMWSymbols.t } );
    domainProperty.link( domain => {
      xAxisLabel.text = ( domain === Domain.SPACE || domain === Domain.SPACE_AND_TIME ) ? spaceLabel : timeLabel;
      xAxisLabel.left = chartRectangle.right + 10;
      xAxisLabel.centerY = chartRectangle.centerY;
    } );

    //TODO revisit default spacings
    // y axis
    const yAxis = new AxisNode( chartModel, Orientation.VERTICAL, FMWConstants.AXIS_OPTIONS );
    const yGridLines = new GridLineSet( chartModel, Orientation.VERTICAL, 0.5, FMWConstants.GRID_LINE_OPTIONS );
    const yTickMarks = new TickMarkSet( chartModel, Orientation.VERTICAL, 0.5, FMWConstants.TICK_MARK_OPTIONS );
    const yTickLabels = new LabelSet( chartModel, Orientation.VERTICAL, 0.5, FMWConstants.LABEL_SET_OPTIONS );
    const yAxisLabel = new RichText( fourierMakingWavesStrings.amplitude, {
      font: FMWConstants.AXIS_LABEL_FONT,
      rotation: -Math.PI / 2,
      right: yTickLabels.left - 10,
      centerY: chartRectangle.centerY,
      maxWidth: 0.85 * chartRectangle.height,
      tandem: options.tandem.createTandem( 'yAxisLabel' )
    } );

    // Parent for Nodes that must be clipped to the bounds of chartRectangle
    const clippedParent = new Node( {
      clipArea: chartRectangle.getShape(),
      children: [ xAxis, yAxis ]
    } );

    assert && assert( !options.children, 'AmplitudesChart sets children' );
    options.children = [
      xTickMarks, yTickMarks, // ticks behind chartRectangle, so we don't see how they extend into chart's interior
      chartRectangle,
      xAxisLabel, xGridLines, xTickLabels,
      yAxisLabel, yGridLines, yTickLabels,
      clippedParent
    ];

    super( options );

    // @protected for layout of decorations added by subclasses
    this.chartRectangle = chartRectangle;
    this.xTickLabels = xTickLabels;

    // @private
    this.chartModel = chartModel;
    this.xGridLines = xGridLines;
    this.xTickMarks = xTickMarks;
    this.xTickLabels = xTickLabels;
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
   * @param {Range} range
   * @public
   */
  setXRange( range ) {
    this.chartModel.setModelXRange( range );
  }

  /**
   * @public
   */
  setYRange() {
    //TODO
  }

  /**
   * @param {number} spacing
   * @public
   */
  setXGridLineSpacing( spacing ) {
    this.xGridLines.setSpacing( spacing );
  }

  /**
   * @public
   */
  setYGridLineSpacing() {
    //TODO
  }

  /**
   * @param {number} spacing
   * @public
   */
  setXTickMarkSpacing( spacing ) {
    this.xTickMarks.setSpacing( spacing );
  }

  /**
   * @public
   */
  setYTickMarkSpacing() {
    //TODO
  }

  /**
   * @param {number} spacing
   * @public
   */
  setXTickLabelSpacing( spacing ) {
    this.xTickLabels.setSpacing( spacing );
  }

  /**
   * @public
   */
  setYTickLabelSpacing() {
    //TODO
  }
}

fourierMakingWaves.register( 'DiscreteChart', DiscreteChart );
export default DiscreteChart;