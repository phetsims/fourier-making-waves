// Copyright 2021, University of Colorado Boulder

//TODO better name for this class
//TODO x zoom, y zoom, and y auto-scale should be handled by this class
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
import LabelSet from '../../../../bamboo/js/LabelSet.js';
import TickMarkSet from '../../../../bamboo/js/TickMarkSet.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PlusMinusZoomButtonGroup from '../../../../scenery-phet/js/PlusMinusZoomButtonGroup.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWColorProfile from '../FMWColorProfile.js';
import FMWConstants from '../FMWConstants.js';
import FMWSymbols from '../FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import AxisDescription from '../../discrete/model/AxisDescription.js';
import Domain from '../model/Domain.js';
import TickLabelFormat from '../model/TickLabelFormat.js';

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

const TICK_LABEL_OPTIONS = {
  edge: 'min'
};

const TICK_LABEL_DECIMAL_PLACES = 2;

class FMWChartNode extends Node {

  /**
   * @param {number} L - the wavelength of the fundamental harmonic, in meters
   * @param {number} T - the period of the fundamental harmonic, in milliseconds
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Property.<number>} xZoomLevelProperty
   * @param {Property.<AxisDescription>} xAxisDescriptionProperty
   * @param {Property.<TickLabelFormat>} xAxisTickLabelFormatProperty
   * @param {Object} [options]
   */
  constructor( L, T, domainProperty, xZoomLevelProperty, xAxisDescriptionProperty, xAxisTickLabelFormatProperty, options ) {

    assert && AssertUtils.assertPositiveNumber( L );
    assert && AssertUtils.assertPositiveNumber( T );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertPropertyOf( xZoomLevelProperty, 'number' );
    assert && AssertUtils.assertPropertyOf( xAxisDescriptionProperty, AxisDescription );
    assert && assert( xAxisTickLabelFormatProperty instanceof Property, 'invalid xAxisTickLabelFormatProperty' );

    options = merge( {

      // {number} dimensions of the chart rectangle, in view coordinates
      viewWidth: 100,
      viewHeight: 100,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    const xAxisDescription = xAxisDescriptionProperty.value;
    const yAxisDescription = AxisDescription.Y_AXIS_DESCRIPTIONS[ AxisDescription.Y_DEFAULT_ZOOM_LEVEL ];

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
    const xTickLabels = new LabelSet( chartTransform, Orientation.HORIZONTAL, xAxisDescription.tickLabelSpacing, merge( {
      createLabel: value => createTickLabel( value, domainProperty.value, xAxisTickLabelFormatProperty.value, L, T )
    }, TICK_LABEL_OPTIONS ) );
    const xAxisLabel = new RichText( '', {
      font: FMWConstants.AXIS_LABEL_FONT,
      maxWidth: 30, // determined empirically
      tandem: options.tandem.createTandem( 'xAxisLabel' )
    } );

    // Zoom buttons for the x-axis range
    const xZoomButtonGroup = new PlusMinusZoomButtonGroup( xZoomLevelProperty, {
      orientation: 'horizontal',
      scale: FMWConstants.ZOOM_BUTTON_GROUP_SCALE,
      touchAreaXDilation: 5,
      touchAreaYDilation: 10,
      left: chartRectangle.right + 6,
      bottom: chartRectangle.bottom,
      tandem: options.tandem.createTandem( 'xZoomButtonGroup' )
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

    // unlink is not needed
    xAxisTickLabelFormatProperty.link( () => xTickLabels.invalidateLabelSet() );

    // y axis ---------------------------------------------------------

    const yAxis = new AxisNode( chartTransform, Orientation.VERTICAL, AXIS_OPTIONS );
    const yGridLines = new GridLineSet( chartTransform, Orientation.VERTICAL, yAxisDescription.gridLineSpacing, GRID_LINE_OPTIONS );
    const yTickMarks = new TickMarkSet( chartTransform, Orientation.VERTICAL, yAxisDescription.tickMarkSpacing, TICK_MARK_OPTIONS );
    const yTickLabels = new LabelSet( chartTransform, Orientation.VERTICAL, yAxisDescription.tickLabelSpacing, merge( {
      createLabel: createNumericTickLabel
    }, TICK_LABEL_OPTIONS ) );
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
      xAxisLabel, xGridLines, xTickLabels, xZoomButtonGroup,
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

/**
 * Creates a tick label of the correct form (numeric or symbolic) depending on EquationForm.
 * @param {number} value
 * @param {Domain} domain
 * @param {TickLabelFormat} tickLabelFormat
 * @param {number} L - the wavelength of the fundamental harmonic, in meters
 * @param {number} T - the period of the fundamental harmonic, in milliseconds
 * @returns {Node}
 */
function createTickLabel( value, domain, tickLabelFormat, L, T ) {
  if ( tickLabelFormat === TickLabelFormat.NUMERIC ) {
    return createNumericTickLabel( value );
  }
  else {
    return createSymbolicTickLabel( value, domain, L, T );
  }
}

/**
 * Creates a numeric tick label for the chart.
 * @param {number} value
 * @returns {Node}
 */
function createNumericTickLabel( value ) {

  // Truncate trailing zeros
  return new Text( Utils.toFixedNumber( value, TICK_LABEL_DECIMAL_PLACES ), {
    font: FMWConstants.TICK_LABEL_FONT
  } );
}

/**
 * Creates a symbolic tick label for the chart.
 * @param {number} value
 * @param {Domain} domain
 * @param {number} L - the wavelength of the fundamental harmonic, in meters
 * @param {number} T - the period of the fundamental harmonic, in milliseconds
 * @returns {Node}
 */
function createSymbolicTickLabel( value, domain, L, T ) {

  const constantSymbol = ( domain === Domain.TIME ) ? FMWSymbols.T : FMWSymbols.L;
  let text;
  if ( value === 0 ) {
    text = '0';
  }
  else {

    // Convert the coefficient to a fraction
    const constantValue = ( domain === Domain.TIME ) ? T : L;
    const coefficient = value / constantValue;
    const fraction = Fraction.fromDecimal( coefficient );

    // Pieces of the fraction that we need to create the RichText markup, with trailing zeros truncated
    const sign = Math.sign( value );
    const numerator = Math.abs( Utils.toFixedNumber( fraction.numerator, TICK_LABEL_DECIMAL_PLACES ) );
    const denominator = Math.abs( Utils.toFixedNumber( fraction.denominator, TICK_LABEL_DECIMAL_PLACES ) );

    text = '';
    if ( sign === -1 ) {
      text += MathSymbols.UNARY_MINUS;
    }
    if ( numerator !== 1 ) {
      text += numerator;
    }
    text += constantSymbol;
    if ( denominator !== 1 ) {
      text += `/${denominator}`;
    }
  }

  return new RichText( text, {
    font: FMWConstants.TICK_LABEL_FONT,
    maxWidth: 35 // determined empirically
  } );
}

fourierMakingWaves.register( 'FMWChartNode', FMWChartNode );
export default FMWChartNode;