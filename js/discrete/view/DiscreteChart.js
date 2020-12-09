// Copyright 2020, University of Colorado Boulder

/**
 * DiscreteChart is the base class for the charts in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import AxisNode from '../../../../bamboo/js/AxisNode.js';
import ChartModel from '../../../../bamboo/js/ChartModel.js';
import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
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
import ZoomButtonGroup from '../../../../scenery-phet/js/ZoomButtonGroup.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import FourierSeries from '../../common/model/FourierSeries.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import Domain from '../model/Domain.js';
import MathForm from '../model/MathForm.js';
import ZoomDescription from '../model/ZoomDescription.js';

// constants
const AXIS_OPTIONS = {
  fill: Color.BLACK,
  stroke: null,
  tailWidth: 1
};

const GRID_LINE_OPTIONS = {
  stroke: new Color( 0, 0, 0, 0.15 )
};

const TICK_MARK_OPTIONS = {
  edge: 'min',
  extent: 6
};

const TICK_LABEL_OPTIONS = {
  edge: 'min'
};

const TICK_LABEL_DECIMAL_PLACES = 2;

class DiscreteChart extends Node {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<MathForm>} mathFormProperty
   * @param {NumberProperty} xZoomLevelProperty
   * @param {Property.<ZoomDescription>} xZoomDescriptionProperty
   * @param {Object} [options]
   */
  constructor( fourierSeries, domainProperty, mathFormProperty, xZoomLevelProperty, xZoomDescriptionProperty, options ) {

    assert && assert( fourierSeries instanceof FourierSeries, 'invalid fourierSeries' );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertEnumerationPropertyOf( mathFormProperty, MathForm );
    assert && assert( xZoomLevelProperty instanceof NumberProperty, 'invalid xZoomLevelProperty' );
    assert && AssertUtils.assertPropertyOf( xZoomDescriptionProperty, ZoomDescription );

    options = merge( {

      // {number} dimensions of the chart rectangle, in view coordinates
      viewWidth: 100,
      viewHeight: 100,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    const xZoomDescription = xZoomDescriptionProperty.value;
    const yZoomDescription = ZoomDescription.Y_ZOOM_DESCRIPTIONS[ ZoomDescription.Y_DEFAULT_ZOOM_LEVEL ];

    // bamboo chart model
    const chartModel = new ChartModel( options.viewWidth, options.viewHeight, {
      modelXRange: new Range( -xZoomDescription.max, xZoomDescription.max ),
      modelYRange: new Range( -yZoomDescription.max, yZoomDescription.max )
    } );

    // The chart's background rectangle
    const chartRectangle = new ChartRectangle( chartModel, {
      fill: 'white',
      stroke: 'black',
      tandem: options.tandem.createTandem( 'chartRectangle' )
    } );

    // x axis
    const xAxis = new AxisNode( chartModel, Orientation.HORIZONTAL, AXIS_OPTIONS );
    const xGridLines = new GridLineSet( chartModel, Orientation.HORIZONTAL, xZoomDescription.gridLineSpacing, GRID_LINE_OPTIONS );
    const xTickMarks = new TickMarkSet( chartModel, Orientation.HORIZONTAL, xZoomDescription.tickMarkSpacing, TICK_MARK_OPTIONS );
    const xTickLabels = new LabelSet( chartModel, Orientation.HORIZONTAL, xZoomDescription.tickLabelSpacing, merge( {
      createLabel: value => createTickLabel( value, domainProperty.value, mathFormProperty.value )
    }, TICK_LABEL_OPTIONS ) );
    const xAxisLabel = new RichText( '', {
      font: FMWConstants.AXIS_LABEL_FONT,
      maxWidth: 35, // determined empirically
      tandem: options.tandem.createTandem( 'xAxisLabel' )
    } );

    // Zoom buttons for the x-axis range
    const xZoomButtonGroup = new ZoomButtonGroup( xZoomLevelProperty, {
      orientation: 'horizontal',
      scale: FMWConstants.ZOOM_BUTTON_GROUP_SCALE,
      left: chartRectangle.right + 6,
      bottom: chartRectangle.bottom,
      tandem: options.tandem.createTandem( 'xZoomButtonGroup' )
    } );

    // Set the x-axis label based on domain.
    const spaceLabel = StringUtils.fillIn( fourierMakingWavesStrings.xMeters, { x: FMWSymbols.x } );
    const timeLabel = StringUtils.fillIn( fourierMakingWavesStrings.tMilliseconds, { t: FMWSymbols.t } );
    domainProperty.link( domain => {
      xAxisLabel.text = ( domain === Domain.TIME ) ? timeLabel : spaceLabel;
      xAxisLabel.left = chartRectangle.right + 6;
      xAxisLabel.centerY = chartRectangle.centerY;
    } );

    // unmultilink is not needed
    Property.multilink(
      [ xZoomDescriptionProperty, domainProperty ],
      ( xZoomDescription, domain ) => {
        const value = ( domain === Domain.TIME ) ? FMWConstants.T : FMWConstants.L;
        chartModel.setModelXRange( new Range( -xZoomDescription.max * value, xZoomDescription.max * value ) );
        xGridLines.setSpacing( xZoomDescription.gridLineSpacing * value );
        xTickMarks.setSpacing( xZoomDescription.tickMarkSpacing * value );
        xTickLabels.setSpacing( xZoomDescription.tickLabelSpacing * value );
        xTickLabels.invalidateLabelSet();
      } );

    // unlink is not needed
    mathFormProperty.link( mathForm => xTickLabels.invalidateLabelSet() );

    // y axis
    const yAxis = new AxisNode( chartModel, Orientation.VERTICAL, AXIS_OPTIONS );
    const yGridLines = new GridLineSet( chartModel, Orientation.VERTICAL, yZoomDescription.gridLineSpacing, GRID_LINE_OPTIONS );
    const yTickMarks = new TickMarkSet( chartModel, Orientation.VERTICAL, yZoomDescription.tickMarkSpacing, TICK_MARK_OPTIONS );
    const yTickLabels = new LabelSet( chartModel, Orientation.VERTICAL, yZoomDescription.tickLabelSpacing, merge( {
      createLabel: createNumericTickLabel
    }, TICK_LABEL_OPTIONS ) );
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
      xAxisLabel, xGridLines, xTickLabels, xZoomButtonGroup,
      yAxisLabel, yGridLines, yTickLabels,
      clippedParent
    ];

    super( options );

    // @protected for layout of decorations added by subclasses
    this.chartRectangle = chartRectangle;

    // @protected for setting range and spacing by subclasses
    this.chartModel = chartModel;
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

function createTickLabel( value, domain, mathForm ) {
  if ( mathForm === MathForm.HIDDEN ) {
    return createNumericTickLabel( value );
  }
  else {
    return createSymbolicTickLabel( value, domain );
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
 * @returns {Node}
 */
function createSymbolicTickLabel( value, domain ) {

  const constantSymbol = ( domain === Domain.TIME ) ? FMWSymbols.T : FMWSymbols.L;
  let text;
  if ( value === 0 ) {
    text = `0${constantSymbol}`;
  }
  else {

    // Convert the coefficient to a fraction
    const constantValue = ( domain === Domain.TIME ) ? FMWConstants.T : FMWConstants.L;
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

fourierMakingWaves.register( 'DiscreteChart', DiscreteChart );
export default DiscreteChart;