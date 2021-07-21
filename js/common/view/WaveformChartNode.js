// Copyright 2020-2021, University of Colorado Boulder

/**
 * WaveformChartNode is the base class for charts that plot one or more 2D waveforms related to a Fourier series.
 * The x axis is either space or time, while the y axis is always amplitude.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import AxisLine from '../../../../bamboo/js/AxisLine.js';
import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import GridLineSet from '../../../../bamboo/js/GridLineSet.js';
import LabelSet from '../../../../bamboo/js/LabelSet.js';
import TickMarkSet from '../../../../bamboo/js/TickMarkSet.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PlusMinusZoomButtonGroup from '../../../../scenery-phet/js/PlusMinusZoomButtonGroup.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import FMWColors from '../FMWColors.js';
import FMWConstants from '../FMWConstants.js';
import FMWSymbols from '../FMWSymbols.js';
import Domain from '../model/Domain.js';
import WaveformChart from '../model/WaveformChart.js';
import TickLabelUtils from './TickLabelUtils.js';
import ZoomLevelProperty from './ZoomLevelProperty.js';

// constants
const X_TICK_LABEL_DECIMALS = 2; //TODO this should be an option, not hardcoded in a base class
const Y_TICK_LABEL_DECIMALS = 1; //TODO this should be an option, not hardcoded in a base class
const DEFAULT_EDGE = 'min';

class WaveformChartNode extends Node {

  /**
   * @param {WaveformChart} waveformChart
   * @param {Object} [options]
   */
  constructor( waveformChart, options ) {

    assert && assert( waveformChart instanceof WaveformChart );

    // Fields of interest in waveformChart, to improve readability
    const L = waveformChart.L;
    const T = waveformChart.T;
    const domainProperty = waveformChart.domainProperty;
    const xAxisTickLabelFormatProperty = waveformChart.xAxisTickLabelFormatProperty;
    const xAxisDescriptionProperty = waveformChart.xAxisDescriptionProperty;
    const yAxisDescriptionProperty = waveformChart.yAxisDescriptionProperty;
    const yAutoScaleProperty = waveformChart.yAutoScaleProperty;
    const yAxisAutoScaleRangeProperty = waveformChart.yAxisAutoScaleRangeProperty;
    assert && assert( ( !yAutoScaleProperty && !yAxisAutoScaleRangeProperty ) ||
                      ( yAutoScaleProperty && yAxisAutoScaleRangeProperty ),
      'yAutoScaleProperty and yAxisAutoScaleRangeProperty are both or neither' );

    options = merge( {

      chartTransformOptions: {
        modelXRange: xAxisDescriptionProperty.value.createAxisRange( domainProperty.value, L, T ),
        modelYRange: yAxisDescriptionProperty.value.range,
        viewWidth: FMWConstants.CHART_RECTANGLE_SIZE.width,
        viewHeight: FMWConstants.CHART_RECTANGLE_SIZE.height
      },

      chartRectangleOptions: {

        // Use the same color as the grid lines. If use a different color (e.g. 'black') then we'll see a black line
        // appearing and disappearing at the top of the chart when the y-axis range is auto scaling. This is because
        // sometimes a grid line will coincide with min/max of the range, and sometimes it won't.
        stroke: FMWColors.chartGridLinesStrokeProperty,
        fill: 'white'
      },

      gridLineOptions: {
        stroke: FMWColors.chartGridLinesStrokeProperty,
        lineWidth: 0.5
      },

      tickMarkOptions: {
        edge: DEFAULT_EDGE,
        extent: 6
      },

      axisLineOptions: {
        stroke: FMWColors.axisStrokeProperty,
        lineWidth: 1
      },

      xAxisLabelOptions: {
        font: FMWConstants.AXIS_LABEL_FONT,
        maxWidth: FMWConstants.X_AXIS_LABEL_MAX_WIDTH
      },

      yAxisLabelOptions: {
        font: FMWConstants.AXIS_LABEL_FONT,
        maxWidth: 0.85 * FMWConstants.CHART_RECTANGLE_SIZE.height,
        rotation: -Math.PI / 2
      },

      xLabelSetOptions: {
        edge: 'min',
        createLabel: value => TickLabelUtils.createTickLabelForDomain( value, X_TICK_LABEL_DECIMALS,
          xAxisTickLabelFormatProperty.value, domainProperty.value, L, T )
      },

      yLabelSetOptions: {
        edge: 'min',
        createLabel: value => TickLabelUtils.createNumericTickLabel( value, Y_TICK_LABEL_DECIMALS )
      },

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // the transform between model and view coordinate frames
    const chartTransform = new ChartTransform( options.chartTransformOptions );

    // the chart's background rectangle
    const chartRectangle = new ChartRectangle( chartTransform, options.chartRectangleOptions );

    // x axis, with tick labels that are specific to domain and format (numeric vs symbolic)
    const xAxis = new AxisLine( chartTransform, Orientation.HORIZONTAL, options.axisLineOptions );
    const xAxisLabel = new RichText( '', options.xAxisLabelOptions );
    const xGridLines = new GridLineSet( chartTransform, Orientation.HORIZONTAL,
      xAxisDescriptionProperty.value.gridLineSpacing, options.gridLineOptions );
    const xTickMarks = new TickMarkSet( chartTransform, Orientation.HORIZONTAL,
      xAxisDescriptionProperty.value.tickMarkSpacing, options.tickMarkOptions );
    const xTickLabels = new LabelSet( chartTransform, Orientation.HORIZONTAL,
      xAxisDescriptionProperty.value.tickLabelSpacing, options.xLabelSetOptions );
    Property.multilink( [ xAxisTickLabelFormatProperty, domainProperty ], () => xTickLabels.invalidateLabelSet() );

    // y axis
    const yAxis = new AxisLine( chartTransform, Orientation.VERTICAL, options.axisLineOptions );
    const yGridLines = new GridLineSet( chartTransform, Orientation.VERTICAL,
      yAxisDescriptionProperty.value.gridLineSpacing, options.gridLineOptions );
    const yTickMarks = new TickMarkSet( chartTransform, Orientation.VERTICAL,
      yAxisDescriptionProperty.value.tickMarkSpacing, options.tickMarkOptions );
    const yTickLabels = new LabelSet( chartTransform, Orientation.VERTICAL,
      yAxisDescriptionProperty.value.tickLabelSpacing, options.yLabelSetOptions );
    const yAxisLabel = new RichText( fourierMakingWavesStrings.amplitude, options.yAxisLabelOptions );

    // Optional zoom buttons
    let xZoomButtonGroup;
    if ( waveformChart.hasXZoom ) {
      const xZoomLevelProperty = new ZoomLevelProperty( waveformChart.xAxisDescriptionProperty );
      xZoomButtonGroup = new PlusMinusZoomButtonGroup( xZoomLevelProperty, {
        orientation: 'horizontal',
        scale: FMWConstants.ZOOM_BUTTON_GROUP_SCALE,
        touchAreaXDilation: 5,
        touchAreaYDilation: 10,
        left: chartRectangle.right + 6,
        bottom: chartRectangle.bottom,
        tandem: options.tandem.createTandem( 'xZoomButtonGroup' )
      } );
    }

    let yZoomButtonGroup;
    if ( waveformChart.hasYZoom ) {
      const yZoomLevelProperty = new ZoomLevelProperty( waveformChart.yAxisDescriptionProperty );
      yZoomButtonGroup = new PlusMinusZoomButtonGroup( yZoomLevelProperty, {
        orientation: 'vertical',
        scale: FMWConstants.ZOOM_BUTTON_GROUP_SCALE,
        touchAreaXDilation: 10,
        touchAreaYDilation: 5,
        right: chartRectangle.left - 31, // determined empirically
        top: chartRectangle.bottom,
        tandem: options.tandem.createTandem( 'yZoomButtonGroup' )
      } );
    }

    assert && assert( !options.children, 'AmplitudesChartNode sets children' );
    options.children = [
      xTickMarks, yTickMarks, // ticks behind chartRectangle, so we don't see how they extend into chart's interior
      chartRectangle,
      xAxis, xAxisLabel, xGridLines, xTickLabels,
      yAxis, yAxisLabel, yGridLines, yTickLabels
    ];
    xZoomButtonGroup && options.children.push( xZoomButtonGroup );
    yZoomButtonGroup && options.children.push( yZoomButtonGroup );

    super( options );

    // Position the x-axis label at the right of the chart, vertically centered at y=0.
    xAxisLabel.boundsProperty.link( bounds => {
      xAxisLabel.left = chartRectangle.right + FMWConstants.X_AXIS_LABEL_SPACING;
      xAxisLabel.centerY = chartTransform.modelToView( Orientation.VERTICAL, xAxis.value );
    } );

    // Position the y-axis label at the left of the chart, vertically centered at y=0.
    yAxisLabel.boundsProperty.link( bounds => {
      yAxisLabel.right = chartRectangle.left - FMWConstants.Y_AXIS_LABEL_SPACING;
      yAxisLabel.centerY = chartTransform.modelToView( Orientation.VERTICAL, xAxis.value /* yes, xAxis.value */ );
    } );

    // Update the x axis.
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

    // Update the y-axis.
    yAxisDescriptionProperty.link( yAxisDescription => {

      // Range is determined by yAxisDescription only if auto scale is disabled.
      if ( !yAutoScaleProperty || !yAutoScaleProperty.value ) {
        chartTransform.setModelYRange( yAxisDescription.range );
      }

      // Grid lines and tick marks are determined by AxisDescriptions regardless of whether auto scale is enabled.
      // This is because the model keeps AxisDescriptions in sync with yAxisAutoScaleRange.
      yGridLines.setSpacing( yAxisDescription.gridLineSpacing );
      yTickMarks.setSpacing( yAxisDescription.tickMarkSpacing );
      yTickLabels.setSpacing( yAxisDescription.tickLabelSpacing );
    } );

    // Set the x-axis label based on domain.
    const spaceLabel = StringUtils.fillIn( fourierMakingWavesStrings.symbolUnits, {
      symbol: FMWSymbols.x,
      units: fourierMakingWavesStrings.units.meters
    } );
    const timeLabel = StringUtils.fillIn( fourierMakingWavesStrings.symbolUnits, {
      symbol: FMWSymbols.t,
      units: fourierMakingWavesStrings.units.milliseconds
    } );
    domainProperty.link( domain => {
      xAxisLabel.text = ( domain === Domain.TIME ) ? timeLabel : spaceLabel;
      xAxisLabel.left = chartRectangle.right + FMWConstants.X_AXIS_LABEL_SPACING;
      xAxisLabel.centerY = chartRectangle.centerY;
    } );

    // @protected fields for use by subclasses
    this.xTickLabels = xTickLabels;
    this.yGridLines = yGridLines;
    this.yTickMarks = yTickMarks;
    this.yTickLabels = yTickLabels;
    this.yZoomButtonGroup = yZoomButtonGroup;

    // @public fields the are part of the public API
    this.chartRectangle = chartRectangle;
    this.chartTransform = chartTransform;

    // pdom - traversal order
    // See https://github.com/phetsims/fourier-making-waves/issues/53
    const pdomOrder = [];
    xZoomButtonGroup && pdomOrder.push( xZoomButtonGroup );
    yZoomButtonGroup && pdomOrder.push( yZoomButtonGroup );
    this.pdomOrder = pdomOrder;
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