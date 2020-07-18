// Copyright 2020, University of Colorado Boulder

/**
 * FourierMakingWavesConstants defines constants used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import fourierMakingWaves from '../fourierMakingWaves.js';
import FourierMakingWavesColors from './FourierMakingWavesColors.js';

// constants
const CONTROLS_ALIGNMENT = 'center';

const FourierMakingWavesConstants = {

  // Model ===========================================================================================================

  MAX_HARMONICS: 11,

  // View ============================================================================================================

  SCREEN_VIEW_X_MARGIN: 15,
  SCREEN_VIEW_Y_MARGIN: 15,

  PANEL_OPTIONS: {
    fixedWidth: 250,
    align: CONTROLS_ALIGNMENT,
    cornerRadius: 5,
    xMargin: 8,
    yMargin: 6,
    fill: FourierMakingWavesColors.PANEL_FILL,
    stroke: FourierMakingWavesColors.PANEL_STROKE
  },

  COMBOX_BOX_OPTIONS: {
    xMargin: 12,
    yMargin: 5
  },

  VBOX_OPTIONS: {
    align: CONTROLS_ALIGNMENT,
    spacing: 7
  },

  // Fonts
  TITLE_FONT: new PhetFont( { size: 16, weight: 'bold' } ),
  CONTROL_FONT: new PhetFont( 14 )
};

fourierMakingWaves.register( 'FourierMakingWavesConstants', FourierMakingWavesConstants );
export default FourierMakingWavesConstants;