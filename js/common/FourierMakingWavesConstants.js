// Copyright 2020, University of Colorado Boulder

/**
 * FourierMakingWavesConstants defines constants used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import fourierMakingWaves from '../fourierMakingWaves.js';
import FourierMakingWavesColorProfile from './FourierMakingWavesColorProfile.js';

// constants
const PANEL_CORNER_RADIUS = 5;
const PANEL_X_MARGIN = 8;
const PANEL_Y_MARGIN = 5;

const FourierMakingWavesConstants = {

  // View ============================================================================================================

  SCREEN_VIEW_X_MARGIN: 15,
  SCREEN_VIEW_Y_MARGIN: 15,
  SCREEN_VIEW_X_SPACING: 10,
  SCREEN_VIEW_Y_SPACING: 10,

  CONTROL_PANEL_WIDTH: 250,

  ACCORDION_BOX_OPTIONS: {
    titleAlignX: 'left',
    cornerRadius: PANEL_CORNER_RADIUS,
    contentXMargin: PANEL_X_MARGIN,
    contentYMargin: PANEL_Y_MARGIN,
    buttonXMargin: 10,
    buttonYMargin: 5,
    titleXSpacing: 10,
    fill: FourierMakingWavesColorProfile.panelFillProperty,
    stroke: FourierMakingWavesColorProfile.panelStrokeProperty
  },

  PANEL_OPTIONS: {
    cornerRadius: PANEL_CORNER_RADIUS,
    xMargin: PANEL_X_MARGIN,
    yMargin: PANEL_Y_MARGIN,
    fill: FourierMakingWavesColorProfile.panelFillProperty,
    stroke: FourierMakingWavesColorProfile.panelStrokeProperty
  },

  CHECKBOX_OPTIONS: {
    boxWidth: 15
  },

  COMBO_BOX_OPTIONS: {
    xMargin: 12,
    yMargin: 5
  },

  VBOX_OPTIONS: {
    align: 'center',
    spacing: 7
  },

  // Fonts
  TITLE_FONT: new PhetFont( { size: 16, weight: 'bold' } ),
  CONTROL_FONT: new PhetFont( 14 )
};

fourierMakingWaves.register( 'FourierMakingWavesConstants', FourierMakingWavesConstants );
export default FourierMakingWavesConstants;