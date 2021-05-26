// Copyright 2020, University of Colorado Boulder

/**
 * FMWConstants defines constants used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AssertUtils from '../../../phetcommon/js/AssertUtils.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import fourierMakingWaves from '../fourierMakingWaves.js';
import FMWColorProfile from './FMWColorProfile.js';
import FMWQueryParameters from './FMWQueryParameters.js';

// constants - view
const PANEL_CORNER_RADIUS = 5;

const FMWConstants = {

  // Model ===========================================================================================================

  MAX_HARMONICS: 11,

  // Amplitude range is [-MAX_AMPLITUDE, MAX_AMPLITUDE], see https://github.com/phetsims/fourier-making-waves/issues/22
  MAX_AMPLITUDE: 1.5,

  //TODO add some verification for this value, since it depends on MAX_HARMONICS and XZoomDescriptions?
  // Number of points in the data set for the highest order (highest frequency) harmonic
  // The number of points for each harmonic plot is a function of order, because higher-frequency harmonics require
  // more points to draw a smooth plot. This value was chosen empirically, such that the highest-order harmonic looks
  // smooth when the Harmonics chart is fully zoomed out.
  MAX_POINTS_PER_DATA_SET: 2000,

  // Number of points awarded for each correct answer in the Wave Game
  POINTS_PER_CHALLENGE: 1,

  // Reaching this score results in a reward in the Wave Game
  REWARD_SCORE: FMWQueryParameters.rewardScore,

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
    xMargin: 8,
    yMargin: 5,
    fill: FMWColorProfile.panelFillProperty,
    stroke: FMWColorProfile.panelStrokeProperty
  },

  CHECKBOX_OPTIONS: {
    boxWidth: 15
  },

  VBOX_OPTIONS: {
    align: 'left',
    spacing: 18
  },

  // Fonts
  TITLE_FONT: new PhetFont( { size: 14, weight: 'bold' } ),
  DIALOG_TITLE_FONT: new PhetFont( { size: 18, weight: 'bold' } ),
  CONTROL_FONT: new PhetFont( 12 ),
  AXIS_LABEL_FONT: new PhetFont( 12 ),
  TICK_LABEL_FONT: new PhetFont( 12 ),
  EQUATION_FONT: new PhetFont( 14 ),
  TOOL_LABEL_FONT: new PhetFont( 16 ),

  // Number of decimal places for amplitude sliders
  AMPLITUDE_SLIDER_DECIMAL_PLACES: 2,
  AMPLITUDE_SLIDER_SNAP_INTERVAL: 0.05,

  // Charts
  ZOOM_BUTTON_GROUP_SCALE: 0.75,
  X_AXIS_LABEL_SPACING: 10, // horizontal space between chart rectangle and x-axis label
  Y_AXIS_LABEL_SPACING: 36  // horizontal space between chart rectangle and y-axis label
};

// Verify some of the above constants
assert && AssertUtils.assertPositiveInteger( FMWConstants.MAX_HARMONICS );
assert && AssertUtils.assertPositiveNumber( FMWConstants.MAX_AMPLITUDE );

fourierMakingWaves.register( 'FMWConstants', FMWConstants );
export default FMWConstants;