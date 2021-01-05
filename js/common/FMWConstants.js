// Copyright 2020, University of Colorado Boulder

/**
 * FMWConstants defines constants used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import fourierMakingWaves from '../fourierMakingWaves.js';
import FMWColorProfile from './FMWColorProfile.js';

// constants - view
const PANEL_CORNER_RADIUS = 5;
const PANEL_X_MARGIN = 8;
const PANEL_Y_MARGIN = 5;

const FMWConstants = {

  // Model ===========================================================================================================

  // amplitude range is [-MAX_ABSOLUTE_AMPLITUDE, MAX_ABSOLUTE_AMPLITUDE]
  // see https://github.com/phetsims/fourier-making-waves/issues/22
  MAX_ABSOLUTE_AMPLITUDE: 1.5,

  // dt for the time control's step button, in seconds
  STEP_DT: 0.05,

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
    xMargin: PANEL_X_MARGIN,
    yMargin: PANEL_Y_MARGIN,
    fill: FMWColorProfile.panelFillProperty,
    stroke: FMWColorProfile.panelStrokeProperty
  },

  CHECKBOX_OPTIONS: {
    boxWidth: 15
  },

  // Options for classes named *LayoutBox
  LAYOUT_BOX_OPTIONS: {
    align: 'left',
    spacing: 15
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

  ZOOM_BUTTON_GROUP_SCALE: 0.75,

  X_AXIS_LABEL_SPACING: 10, // horizontal space between chart and x-axis label
  Y_AXIS_LABEL_SPACING: 10  // horizontal space between chart and y-axis label
};

fourierMakingWaves.register( 'FMWConstants', FMWConstants );
export default FMWConstants;