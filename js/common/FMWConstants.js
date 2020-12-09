// Copyright 2020, University of Colorado Boulder

/**
 * FMWConstants defines constants used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import Color from '../../../scenery/js/util/Color.js';
import fourierMakingWaves from '../fourierMakingWaves.js';
import FMWColorProfile from './FMWColorProfile.js';

// constants - model
const FUNDAMENTAL_FREQUENCY = 440; // Hz
const SPEED_OF_SOUND = 343.2; // meters/second
const FUNDAMENTAL_WAVELENGTH = SPEED_OF_SOUND / FUNDAMENTAL_FREQUENCY; // meters

// constants - view
const PANEL_CORNER_RADIUS = 5;
const PANEL_X_MARGIN = 8;
const PANEL_Y_MARGIN = 5;

const FMWConstants = {

  // Model ===========================================================================================================

  // string length, in meters
  L: 1,

  // The amplitude range is [-4/pi, 4/pi] because of the factor of 4/pi in the Fourier series of a square wave.
  // For n=1, the amplitude is 4/pi. See https://mathworld.wolfram.com/FourierSeriesSquareWave.html and
  // https://github.com/phetsims/fourier-making-waves/issues/11
  MAX_ABSOLUTE_AMPLITUDE: 1.5,

  FUNDAMENTAL_FREQUENCY: FUNDAMENTAL_FREQUENCY,
  FUNDAMENTAL_WAVELENGTH: FUNDAMENTAL_WAVELENGTH,
  T: 1000 / FUNDAMENTAL_FREQUENCY, // period of the fundamental, in milliseconds

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
    spacing: 10
  },

  // Fonts
  TITLE_FONT: new PhetFont( { size: 14, weight: 'bold' } ),
  CONTROL_FONT: new PhetFont( 12 ),
  AXIS_LABEL_FONT: new PhetFont( 12 ),
  TICK_LABEL_FONT: new PhetFont( 12 ),
  EQUATION_FONT: new PhetFont( 18 ),

  // Number of decimal places for amplitude sliders
  AMPLITUDE_SLIDER_DECIMAL_PLACES: 2,
  AMPLITUDE_SLIDER_SNAP_INTERVAL: 0.05,

  ZOOM_BUTTON_GROUP_SCALE: 0.75,

  AXIS_OPTIONS: {
    fill: Color.BLACK,
    stroke: null,
    tailWidth: 1
  },

  GRID_LINE_OPTIONS: {
    stroke: new Color( 0, 0, 0, 0.15 )
  },

  TICK_MARK_OPTIONS: {
    edge: 'min',
    extent: 6
  },

  TICK_LABEL_DECIMAL_PLACES: 2
};

fourierMakingWaves.register( 'FMWConstants', FMWConstants );
export default FMWConstants;