// Copyright 2020, University of Colorado Boulder

/**
 * FourierMakingWavesConstants defines constants used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import Range from '../../../dot/js/Range.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import fourierMakingWaves from '../fourierMakingWaves.js';
import FourierMakingWavesColors from './FourierMakingWavesColors.js';

// constants
const MAX_NUMBER_OF_HARMONICS = 11;
const PANEL_CORNER_RADIUS = 5;
const PANEL_X_MARGIN = 8;
const PANEL_Y_MARGIN = 5;

const FourierMakingWavesConstants = {

  // Model ===========================================================================================================

  MAX_NUMBER_OF_HARMONICS: MAX_NUMBER_OF_HARMONICS,

  NUMBER_OF_HARMONICS_RANGE: new Range( 1, MAX_NUMBER_OF_HARMONICS ),

  AMPLITUDE_RANGE: new Range( -1.27, 1.27 ),

  FUNDAMENTAL_FREQUENCY: 440, // Hz

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
    fill: FourierMakingWavesColors.PANEL_FILL,
    stroke: FourierMakingWavesColors.PANEL_STROKE
  },

  PANEL_OPTIONS: {
    cornerRadius: PANEL_CORNER_RADIUS,
    xMargin: PANEL_X_MARGIN,
    yMargin: PANEL_Y_MARGIN,
    fill: FourierMakingWavesColors.PANEL_FILL,
    stroke: FourierMakingWavesColors.PANEL_STROKE
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

assert && assert( FourierMakingWavesConstants.NUMBER_OF_HARMONICS_RANGE.max === FourierMakingWavesColors.HARMONIC_COLOR_PROPERTIES.length,
  'a color is required for each harmonic' );

fourierMakingWaves.register( 'FourierMakingWavesConstants', FourierMakingWavesConstants );
export default FourierMakingWavesConstants;