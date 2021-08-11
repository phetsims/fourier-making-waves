// Copyright 2020-2021, University of Colorado Boulder

//TODO delete constants that are no longer used
/**
 * FMWConstants defines constants used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../dot/js/Dimension2.js';
import AssertUtils from '../../../phetcommon/js/AssertUtils.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import VBox from '../../../scenery/js/nodes/VBox.js';
import fourierMakingWaves from '../fourierMakingWaves.js';
import FMWColors from './FMWColors.js';
import FMWQueryParameters from './FMWQueryParameters.js';

// constants - view
const PANEL_CORNER_RADIUS = 5;
const CONTROL_FONT = new PhetFont( 12 );

const FMWConstants = {

  // Model ===========================================================================================================

  MAX_HARMONICS: 11,

  // Amplitude range is [-MAX_AMPLITUDE, MAX_AMPLITUDE] in the Discrete and Wave Game screens.
  // See https://github.com/phetsims/fourier-making-waves/issues/22
  MAX_AMPLITUDE: 1.5,

  // Number of points in the data set for the highest order (highest frequency) harmonic
  // This value was chosen empirically, such that the highest-order harmonic looks smooth at all zoom levels.
  // If you change this, visually examine the plots of the highest frequency harmonics in the Discrete screen and
  // the Wave Packet screen, and confirm that those plots look smooth - pay special attention to the peaks!
  MAX_POINTS_PER_DATA_SET: 1000,

  // Number of points awarded for each correct answer in the Wave Game screen
  POINTS_PER_CHALLENGE: 1,

  // Reaching this score results in a reward in the Wave Game screen
  REWARD_SCORE: FMWQueryParameters.rewardScore,

  // An empty data set, used so that we can rely on value comparison in Property, and not trigger notifications when
  // the value changes from one [] to another [].  This is a performance optimization.
  EMPTY_DATA_SET: Object.freeze( [] ),

  // View ============================================================================================================

  SCREEN_VIEW_X_MARGIN: 15,
  SCREEN_VIEW_Y_MARGIN: 15,
  SCREEN_VIEW_X_SPACING: 10,
  SCREEN_VIEW_Y_SPACING: 10,

  CONTROL_PANEL_WIDTH: 250,

  EXPAND_COLLAPSE_BUTTON_OPTIONS: {
    sideLength: 16
  },

  PANEL_CORNER_RADIUS: PANEL_CORNER_RADIUS,

  PANEL_OPTIONS: {
    cornerRadius: PANEL_CORNER_RADIUS,
    xMargin: 15,
    yMargin: 15,
    fill: FMWColors.panelFillProperty,
    stroke: FMWColors.panelStrokeProperty
  },

  CHECKBOX_OPTIONS: {
    boxWidth: 15
  },

  VBOX_OPTIONS: {
    align: 'left',
    spacing: 18
  },

  ERASER_BUTTON_OPTIONS: {
    scale: 0.85,
    touchAreaXDilation: 5,
    touchAreaYDilation: 5
  },

  // options for NumberControls in the Wave Packet screen
  WAVE_PACKET_NUMBER_CONTROL_OPTIONS: {

    // NumberControl options
    includeArrowButtons: false,
    layoutFunction: ( titleNode, numberDisplay, slider, leftArrowButton, rightArrowButton ) => new VBox( {
      spacing: 5,
      align: 'left',
      children: [ numberDisplay, slider ]
    } ),

    // NumberDisplay options
    numberDisplayOptions: {
      font: CONTROL_FONT,
      useRichText: true,
      align: 'left',
      minBackgroundWidth: 110,
      textOptions: {
        maxWidth: 175
      }
    },

    // Slider options
    sliderOptions: {
      trackSize: new Dimension2( 175, 3 ),
      thumbSize: new Dimension2( 12, 20 ),
      majorTickLength: 10,
      tickLabelSpacing: 4
    }
  },

  // Fonts
  TITLE_FONT: new PhetFont( { size: 14, weight: 'bold' } ),
  SUBTITLE_FONT: new PhetFont( { size: 12, weight: 'bold' } ),
  DIALOG_TITLE_FONT: new PhetFont( { size: 18, weight: 'bold' } ),
  CONTROL_FONT: CONTROL_FONT,
  MATH_CONTROL_FONT: new PhetFont( 13 ), // use a larger font for math symbols, see https://github.com/phetsims/fourier-making-waves/issues/99
  AXIS_LABEL_FONT: new PhetFont( 12 ),
  TICK_LABEL_FONT: new PhetFont( 12 ),
  EQUATION_FONT: new PhetFont( 18 ),
  TOOL_LABEL_FONT: new PhetFont( 16 ),

  // Number of decimal places for amplitude sliders
  AMPLITUDE_SLIDER_DECIMAL_PLACES: 2,
  AMPLITUDE_SLIDER_MOUSE_TOUCH_STEP: 0.05,

  // Charts
  CHART_RECTANGLE_SIZE: new Dimension2( 645, 123 ),
  X_CHART_RECTANGLES: 65, // x origin of ChartRectangles, so that they are all aligned
  CHART_TITLE_MAX_WIDTH: 150,
  ZOOM_BUTTON_GROUP_SCALE: 0.75,
  X_AXIS_LABEL_MAX_WIDTH: 38,
  X_AXIS_LABEL_SPACING: 6, // horizontal space between chart rectangle and x-axis label
  Y_AXIS_LABEL_SPACING: 36,  // horizontal space between chart rectangle and y-axis label
  AXIS_LINE_OPTIONS: {
    stroke: FMWColors.axisStrokeProperty,
    lineWidth: 1
  },
  GRID_LINE_OPTIONS: {
    stroke: FMWColors.chartGridLinesStrokeProperty,
    lineWidth: 0.5
  },
  TICK_MARK_OPTIONS: {
    edge: 'min',
    extent: 6
  }
};

// Verify some of the above constants
assert && AssertUtils.assertPositiveInteger( FMWConstants.MAX_HARMONICS );
assert && AssertUtils.assertPositiveNumber( FMWConstants.MAX_AMPLITUDE );

fourierMakingWaves.register( 'FMWConstants', FMWConstants );
export default FMWConstants;