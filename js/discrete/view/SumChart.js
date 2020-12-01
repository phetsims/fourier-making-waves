// Copyright 2020, University of Colorado Boulder

//TODO lots of duplication with HarmonicsChart, factor out a base class
/**
 * SumChart is the 'Sum' chart in the 'Discrete' screen. It renders 1 plot showing the sum of the harmonics in
 * the Fourier series.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
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
import ZoomButtonGroup from '../../../../scenery-phet/js/ZoomButtonGroup.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import FourierSeries from '../../common/model/FourierSeries.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import AutoScaleCheckbox from './AutoScaleCheckbox.js';
import EquationFactory from './EquationFactory.js';
import InfiniteHarmonicsCheckbox from './InfiniteHarmonicsCheckbox.js';

class SumChart extends Node {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {NumberProperty} xZoomLevelProperty
   * @param {NumberProperty} yZoomLevelProperty
   * @param {Property.<boolean>} autoScaleProperty
   * @param {Property.<boolean>} infiniteHarmonicsVisibleProperty
   * @param {Object} [options]
   */
  constructor( fourierSeries, xZoomLevelProperty, yZoomLevelProperty, autoScaleProperty, infiniteHarmonicsVisibleProperty, options ) {

    assert && assert( fourierSeries instanceof FourierSeries, 'invalid fourierSeries' );
    assert && assert( xZoomLevelProperty instanceof NumberProperty, 'invalid xZoomLevelProperty' );
    assert && assert( yZoomLevelProperty instanceof NumberProperty, 'invalid yZoomLevelProperty' );
    assert && AssertUtils.assertPropertyOf( autoScaleProperty, 'boolean' );
    assert && AssertUtils.assertPropertyOf( infiniteHarmonicsVisibleProperty, 'boolean' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    const L = FMWConstants.L;

    const chartModel = new ChartModel( FMWConstants.CHART_WIDTH, FMWConstants.CHART_HEIGHT, {
      modelXRange: new Range( -L / 2, L / 2 ),
      modelYRange: fourierSeries.amplitudeRange
    } );

    const chartRectangle = new ChartRectangle( chartModel, {
      fill: 'white',
      stroke: 'black'
    } );

    const xAxis = new AxisNode( chartModel, Orientation.HORIZONTAL, FMWConstants.AXIS_OPTIONS );
    const xGridLineSet = new GridLineSet( chartModel, Orientation.HORIZONTAL, L / 8, FMWConstants.GRID_LINE_OPTIONS );
    const xLabelSet = new LabelSet( chartModel, Orientation.HORIZONTAL, L / 2, FMWConstants.LABEL_SET_OPTIONS );
    const xTickMarkSet = new TickMarkSet( chartModel, Orientation.HORIZONTAL, L / 2, FMWConstants.TICK_MARK_OPTIONS );
    const xAxisLabel = new Text( StringUtils.fillIn( fourierMakingWavesStrings.xMeters, {
      x: FMWSymbols.SMALL_X
    } ), {
      font: FMWConstants.AXIS_LABEL_FONT,
      left: chartRectangle.right + 10,
      centerY: chartRectangle.centerY
    } );

    const yAxis = new AxisNode( chartModel, Orientation.VERTICAL, FMWConstants.AXIS_OPTIONS );
    const yGridLineSet = new GridLineSet( chartModel, Orientation.VERTICAL, 0.5, FMWConstants.GRID_LINE_OPTIONS );
    const yLabelSet = new LabelSet( chartModel, Orientation.VERTICAL, 0.5, FMWConstants.LABEL_SET_OPTIONS );
    const yTickMarkSet = new TickMarkSet( chartModel, Orientation.VERTICAL, 0.5, FMWConstants.TICK_MARK_OPTIONS );
    const yAxisLabel = new RichText( StringUtils.fillIn( fourierMakingWavesStrings.amplitudeSymbol, {
      symbol: FMWSymbols.CAPITAL_A
    } ), {
      font: FMWConstants.AXIS_LABEL_FONT,
      rotation: -Math.PI / 2,
      right: yLabelSet.left - 10,
      centerY: chartRectangle.centerY
    } );

    //TODO
    const equationNode = EquationFactory.createSumWavelengthForm( new Range( 1, fourierSeries.numberOfHarmonicsProperty.value ) );
    equationNode.localBoundsProperty.link( () => {
      equationNode.centerX = chartRectangle.centerX;
      equationNode.bottom = chartRectangle.top - 5;
    } );

    const xZoomButtonGroup = new ZoomButtonGroup( xZoomLevelProperty, {
      orientation: 'horizontal',
      scale: FMWConstants.ZOOM_BUTTON_GROUP_SCALE,
      left: chartRectangle.right + 5,
      bottom: chartRectangle.bottom
    } );

    const yZoomButtonGroup = new ZoomButtonGroup( yZoomLevelProperty, {
      orientation: 'vertical',
      scale: FMWConstants.ZOOM_BUTTON_GROUP_SCALE,
      left: chartRectangle.right + 5,
      top: chartRectangle.top
    } );

    const autoScaleCheckbox = new AutoScaleCheckbox( autoScaleProperty );
    const infiniteHarmonicsCheckbox = new InfiniteHarmonicsCheckbox( infiniteHarmonicsVisibleProperty );
    const checkboxesParent = new HBox( {
      spacing: 25,
      children: [ autoScaleCheckbox, infiniteHarmonicsCheckbox ],
      left: chartRectangle.left,
      top: xLabelSet.bottom + 5
    } );

    // Parent for Nodes that must be clipped to the bounds of chartRectangle
    const clippedParent = new Node( {
      clipArea: chartRectangle.getShape(),
      children: [ xAxis, yAxis ]
    } );

    assert && assert( !options.children, 'AmplitudesChart sets children' );
    options.children = [
      xTickMarkSet, yTickMarkSet,
      chartRectangle,
      xAxisLabel, xGridLineSet, xLabelSet,
      yAxisLabel, yGridLineSet, yLabelSet,
      clippedParent,
      equationNode,
      checkboxesParent,
      xZoomButtonGroup, yZoomButtonGroup
    ];

    super( options );
  }

  /**
   * Steps the chart.
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {
    //TODO
  }
}

fourierMakingWaves.register( 'SumChart', SumChart );
export default SumChart;