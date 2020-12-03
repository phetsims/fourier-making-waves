// Copyright 2020, University of Colorado Boulder

/**
 * FMWConstants defines constants used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import Utils from '../../../dot/js/Utils.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import Text from '../../../scenery/js/nodes/Text.js';
import Color from '../../../scenery/js/util/Color.js';
import fourierMakingWaves from '../fourierMakingWaves.js';
import FMWColorProfile from './FMWColorProfile.js';

// constants
const PANEL_CORNER_RADIUS = 5;
const PANEL_X_MARGIN = 8;
const PANEL_Y_MARGIN = 5;

const FMWConstants = {

  // Model ===========================================================================================================

  // string length, in meters
  L: 1,

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

  VBOX_OPTIONS: {
    align: 'center',
    spacing: 7
  },

  // Fonts
  TITLE_FONT: new PhetFont( { size: 16, weight: 'bold' } ),
  CONTROL_FONT: new PhetFont( 14 ),
  AXIS_LABEL_FONT: new PhetFont( 12 ),
  TICK_LABEL_FONT: new PhetFont( 12 ),
  EQUATION_FONT: new PhetFont( 18 ),

  // Number of decimal places for amplitude sliders
  AMPLITUDE_SLIDER_DECIMAL_PLACES: 2,
  AMPLITUDE_SLIDER_SNAP_INTERVAL: 0.05,

  //TODO set dimensions based on available space
  CHART_WIDTH: 610,
  CHART_HEIGHT: 120,

  ZOOM_BUTTON_GROUP_SCALE: 0.75,

  AXIS_OPTIONS: {
    fill: Color.BLACK,
    stroke: null,
    tailWidth: 1
  },

  GRID_LINE_OPTIONS: {
    stroke: new Color( 0, 0, 0, 0.15 )
  },

  LABEL_SET_OPTIONS: {
    edge: 'min',
    createLabel: createTickLabel
  },

  TICK_MARK_OPTIONS: {
    edge: 'min',
    extent: 6
  },

  TICK_LABEL_DECIMAL_PLACES: 1
};

/**
 * Creates a numeric tick label for the graphs.
 * @param {number} value
 * @returns {Node}
 */
function createTickLabel( value ) {
  return new Text( Utils.toFixedNumber( value, FMWConstants.TICK_LABEL_DECIMAL_PLACES ), {
    font: FMWConstants.TICK_LABEL_FONT
  } );
}

fourierMakingWaves.register( 'FMWConstants', FMWConstants );
export default FMWConstants;