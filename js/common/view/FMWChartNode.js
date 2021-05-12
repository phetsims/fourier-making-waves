// Copyright 2021, University of Colorado Boulder

//TODO better name for this class
/**
 * FMWChartNode is the view base class for charts in the 'Discrete' and 'Wave Game' screens.
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
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import AxisDescription from '../../discrete/model/AxisDescription.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import FMWColorProfile from '../FMWColorProfile.js';
import FMWConstants from '../FMWConstants.js';
import FMWSymbols from '../FMWSymbols.js';
import Domain from '../model/Domain.js';
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

class FMWChartNode extends Node {

  /**
   * @param {number} L - the wavelength of the fundamental harmonic, in meters
   * @param {number} T - the period of the fundamental harmonic, in milliseconds
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Property.<TickLabelFormat>} xAxisTickLabelFormatProperty
   * @param {Property.<AxisDescription>} xAxisDescriptionProperty
   * @param {Object} [options]
   */
  constructor( L, T, domainProperty, xAxisTickLabelFormatProperty, xAxisDescriptionProperty, options ) {

    assert && AssertUtils.assertPositiveNumber( L );
    assert && AssertUtils.assertPositiveNumber( T );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && assert( xAxisTickLabelFormatProperty instanceof Property, 'invalid xAxisTickLabelFormatProperty' );
    assert && AssertUtils.assertPropertyOf( xAxisDescriptionProperty, AxisDescription );

    options = merge( {

      // {number} dimensions of the chart rectangle, in view coordinates
      viewWidth: 100,
      viewHeight: 100,

      xTickDecimalPlaces: 2,
      yTickDecimalPlaces: 1,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    const xAxisDescription = xAxisDescriptionProperty.value;
    const yAxisDescription = AxisDescription.DEFAULT_Y_AXIS_DESCRIPTION;

    // the transform between model and view coordinate frames
    const chartTransform = new ChartTransform( {
      viewWidth: options.viewWidth,
      viewHeight: options.viewHeight,
      modelXRange: AxisDescription.createXRange( xAxisDescription, domainProperty.value, L, T ),
      modelYRange: yAxisDescription.range
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

    // x axis ---------------------------------------------------------

    const xAxis = new AxisNode( chartTransform, Orientation.HORIZONTAL, AXIS_OPTIONS );
    const xGridLines = new GridLineSet( chartTransform, Orientation.HORIZONTAL, xAxisDescription.gridLineSpacing, GRID_LINE_OPTIONS );
    const xTickMarks = new TickMarkSet( chartTransform, Orientation.HORIZONTAL, xAxisDescription.tickMarkSpacing, TICK_MARK_OPTIONS );
    const xTickLabels = new XTickLabelSet( chartTransform, xAxisDescription.tickLabelSpacing, domainProperty,
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

    // y axis ---------------------------------------------------------

    const yAxis = new AxisNode( chartTransform, Orientation.VERTICAL, AXIS_OPTIONS );
    const yGridLines = new GridLineSet( chartTransform, Orientation.VERTICAL, yAxisDescription.gridLineSpacing, GRID_LINE_OPTIONS );
    const yTickMarks = new TickMarkSet( chartTransform, Orientation.VERTICAL, yAxisDescription.tickMarkSpacing, TICK_MARK_OPTIONS );
    const yTickLabels = new YTickLabelSet( chartTransform, yAxisDescription.tickLabelSpacing );
    const yAxisLabel = new RichText( fourierMakingWavesStrings.amplitude, {
      font: FMWConstants.AXIS_LABEL_FONT,
      rotation: -Math.PI / 2,
      right: chartRectangle.left - FMWConstants.Y_AXIS_LABEL_SPACING,
      centerY: chartRectangle.centerY,
      maxWidth: 0.85 * chartRectangle.height,
      tandem: options.tandem.createTandem( 'yAxisLabel' )
    } );

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

fourierMakingWaves.register( 'FMWChartNode', FMWChartNode );
export default FMWChartNode;