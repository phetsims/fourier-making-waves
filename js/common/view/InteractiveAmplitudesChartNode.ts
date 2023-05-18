// Copyright 2020-2023, University of Colorado Boulder

/**
 * InteractiveAmplitudesChartNode is the base class for the Amplitudes charts in the 'Discrete' and 'Wave Game' screens,
 * where amplitudes can be interactively adjusted using a set of bar-like sliders. The x axis is harmonic order (1-N),
 * the y axis is amplitude. Amplitudes are displayed as an interactive bar chart, where each bar is a slider.
 * Amplitude can be adjusted using the slider, or by using a Keypad that opens when a NumberDisplay is pressed.
 *
 * This class is not used in the 'Wave Packet' screen, where the Amplitudes chart is not interactive, and uses
 * a much different underlying model.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import GridLineSet from '../../../../bamboo/js/GridLineSet.js';
import TickLabelSet from '../../../../bamboo/js/TickLabelSet.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import { Node, RichText, Text } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';
import FMWColors from '../FMWColors.js';
import FMWConstants from '../FMWConstants.js';
import FMWSymbols from '../FMWSymbols.js';
import InteractiveAmplitudesChart from '../model/InteractiveAmplitudesChart.js';
import AmplitudeKeypadDialog from './AmplitudeKeypadDialog.js';
import AmplitudeNumberDisplay from './AmplitudeNumberDisplay.js';
import AmplitudeSlider from './AmplitudeSlider.js';

// constants
const X_MARGIN = 0.5; // x-axis margins, in model coordinates
const Y_TICK_SPACING = 0.5; // spacing of y-axis tick marks, in model coordinates
const Y_TICK_LABEL_DECIMAL_PLACES = 1;

export default class InteractiveAmplitudesChartNode extends Node {

  /**
   * @param {InteractiveAmplitudesChart} amplitudesChart
   * @param {AmplitudeKeypadDialog} amplitudeKeypadDialog - keypad for editing amplitude values
   * @param {Object} [options]
   */
  constructor( amplitudesChart, amplitudeKeypadDialog, options ) {

    assert && assert( amplitudesChart instanceof InteractiveAmplitudesChart );
    assert && assert( amplitudeKeypadDialog instanceof AmplitudeKeypadDialog );

    options = merge( {

      // InteractiveAmplitudesChartNode options
      // {function} called when the user starts editing any amplitude value
      onEdit: _.noop,

      // AmplitudeSlider options
      amplitudeSliderOptions: null,

      // AmplitudeNumberDisplay options
      amplitudeNumberDisplayOptions: null,

      chartTransformOptions: {
        viewWidth: FMWConstants.CHART_RECTANGLE_SIZE.width,
        viewHeight: FMWConstants.CHART_RECTANGLE_SIZE.height
      },

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    assert && assert( !options.chartTransformOptions.modelXRange, 'InteractiveAmplitudesChartNode sets modelXRange' );
    assert && assert( !options.chartTransformOptions.modelYRange, 'InteractiveAmplitudesChartNode sets modelYRange' );

    // Fields of interest in amplitudesChart, to improve readability
    const fourierSeries = amplitudesChart.fourierSeries;
    const emphasizedHarmonics = amplitudesChart.emphasizedHarmonics;

    // the transform from model to view coordinates
    const chartTransform = new ChartTransform( merge( {
      modelXRange: new Range( 1 - X_MARGIN, fourierSeries.harmonics.length + X_MARGIN ),
      modelYRange: fourierSeries.amplitudeRange
    }, options.chartTransformOptions ) );

    const chartRectangle = new ChartRectangle( chartTransform );

    // x axis ---------------------------------------------------------

    const xAxisLabelText = new RichText( FMWSymbols.nStringProperty, {
      font: FMWConstants.AXIS_LABEL_FONT,
      left: chartRectangle.right + FMWConstants.X_AXIS_LABEL_SPACING,
      centerY: chartRectangle.centerY,
      maxWidth: FMWConstants.X_AXIS_LABEL_MAX_WIDTH,
      tandem: options.tandem.createTandem( 'xAxisLabelText' )
    } );

    // {AmplitudeSlider[]} Create a slider for each harmonic's amplitude
    const sliders = fourierSeries.harmonics.map( harmonic =>
      new AmplitudeSlider( harmonic, emphasizedHarmonics, merge( {
        startDrag: options.onEdit,
        trackHeight: options.chartTransformOptions.viewHeight,
        center: chartTransform.modelToViewXY( harmonic.order, 0 ),
        tandem: options.tandem.createTandem( `amplitude${harmonic.order}Slider` )
      }, options.amplitudeSliderOptions ) )
    );
    const slidersParent = new Node( {
      children: sliders
    } );

    // {AmplitudeNumberDisplay[]} Create a number display for each harmonic's amplitude
    const numberDisplays = fourierSeries.harmonics.map( harmonic =>
      new AmplitudeNumberDisplay( harmonic, emphasizedHarmonics, amplitudeKeypadDialog, merge( {
        press: options.onEdit,
        centerX: chartTransform.modelToViewX( harmonic.order ),
        bottom: chartRectangle.top - 10,
        tandem: options.tandem.createTandem( `amplitude${harmonic.order}NumberDisplay` )
      }, options.amplitudeNumberDisplayOptions ) )
    );
    const numberDisplaysParent = new Node( {
      children: numberDisplays
    } );

    // y axis ---------------------------------------------------------

    const yAxisLabelText = new RichText( FourierMakingWavesStrings.amplitudeStringProperty, {
      font: FMWConstants.AXIS_LABEL_FONT,
      rotation: -Math.PI / 2,
      maxWidth: 0.85 * chartRectangle.height,
      tandem: options.tandem.createTandem( 'yAxisLabelText' )
    } );
    yAxisLabelText.boundsProperty.link( bounds => {
      yAxisLabelText.right = -FMWConstants.Y_AXIS_LABEL_SPACING;
      yAxisLabelText.centerY = chartRectangle.centerY;
    } );

    const yGridLineSet = new GridLineSet( chartTransform, Orientation.VERTICAL, Y_TICK_SPACING, {
      stroke: FMWColors.amplitudesGridLinesStrokeProperty,
      lineWidth: 0.5
    } );

    const yLabelSet = new TickLabelSet( chartTransform, Orientation.VERTICAL, Y_TICK_SPACING, {
      edge: 'min',

      // Create tick labels. Using toFixedNumber removes trailing zeros.
      createLabel: value => new Text( Utils.toFixedNumber( value, Y_TICK_LABEL_DECIMAL_PLACES ), {
        font: FMWConstants.TICK_LABEL_FONT
      } )
    } );

    // ---------------------------------------------------------------

    // Group all of the non-interactive pieces, so that we can easily keep track of how many times
    // the user presses on the interactive pieces.
    const chartPiecesNode = new Node( {
      pickable: false,
      children: [
        chartRectangle,
        xAxisLabelText,
        yAxisLabelText, yGridLineSet, yLabelSet
      ]
    } );

    assert && assert( !options.children, 'InteractiveAmplitudesChartNode sets children' );
    options.children = [
      chartPiecesNode,
      slidersParent,
      numberDisplaysParent
    ];

    super( options );

    // pdom - traversal order
    this.pdomOrder = [ ...sliders, ...numberDisplays ];

    // @protected
    this.sliders = sliders; // {AmplitudeSlider[]}
    this.slidersParent = slidersParent; // {Node}
    this.numberDisplays = numberDisplays; // {AmplitudeNumberDisplay[]}

    // @public
    this.chartTransform = chartTransform; // {ChartTransform}
    this.chartRectangle = chartRectangle; // {ChartRectangle}
  }

  /**
   * @public
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

fourierMakingWaves.register( 'InteractiveAmplitudesChartNode', InteractiveAmplitudesChartNode );