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

const FourierMakingWavesConstants = {

  // Model ===========================================================================================================

  NUMBER_OF_HARMONICS_RANGE: new Range( 1, 11 ),

  AMPLITUDE_RANGE: new Range( -1.27, 1.27 ),

  // View ============================================================================================================

  SCREEN_VIEW_X_MARGIN: 15,
  SCREEN_VIEW_Y_MARGIN: 15,
  SCREEN_VIEW_X_SPACING: 10,
  SCREEN_VIEW_Y_SPACING: 10,

  CONTROL_PANEL_WIDTH: 250,

  PANEL_OPTIONS: {
    cornerRadius: 5,
    xMargin: 8,
    yMargin: 6,
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

assert && assert( FourierMakingWavesConstants.NUMBER_OF_HARMONICS_RANGE.max === FourierMakingWavesColors.HARMONIC_COLORS.length,
  'expected one color for each harmonic' );

fourierMakingWaves.register( 'FourierMakingWavesConstants', FourierMakingWavesConstants );
export default FourierMakingWavesConstants;