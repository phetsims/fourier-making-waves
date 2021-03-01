// Copyright 2020, University of Colorado Boulder

/**
 * FMWColorProfile defines the colors for this simulation.
 * Default colors are required. Colors for other profiles are optional.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ColorProfile from '../../../scenery-phet/js/ColorProfile.js';
import PhetColorScheme from '../../../scenery-phet/js/PhetColorScheme.js';
import Color from '../../../scenery/js/util/Color.js';
import fourierMakingWaves from '../fourierMakingWaves.js';

const FMWColorProfile = new ColorProfile( [ 'default' ], {

  // Background color that is currently shared by all screens in this sim.
  screenBackgroundColor: {
    default: new Color( 236, 255, 255 )
  },

  // Fill for all Panels
  panelFill: {
    default: Color.grayColor( 245 )
  },

  // Stroke for all Panels
  panelStroke: {
    default: Color.grayColor( 160 )
  },

  // Stroke for horizontal separators in Panels
  separatorStroke: {
    default: Color.grayColor( 200 )
  },

  // Colors for each harmonics. Name format is `harmonic${order}Color` to facilitate lookup by order.
  harmonic1Color: {
    default: new Color( 255, 0, 0 )
  },

  harmonic2Color: {
    default: new Color( 255, 128, 0 )
  },

  harmonic3Color: {
    default: new Color( 255, 255, 0 )
  },

  harmonic4Color: {
    default: new Color( 0, 255, 0 )
  },

  harmonic5Color: {
    default: new Color( 0, 201, 87 )
  },

  harmonic6Color: {
    default: new Color( 100, 149, 237 )
  },

  harmonic7Color: {
    default: new Color( 0, 0, 255 )
  },

  harmonic8Color: {
    default: new Color( 0, 0, 128 )
  },

  harmonic9Color: {
    default: new Color( 145, 33, 158 )
  },

  harmonic10Color: {
    default: new Color( 186, 85, 211 )
  },

  harmonic11Color: {
    default: new Color( 255, 105, 180 )
  },

  amplitudeGridLinesStroke: {
    default: Color.BLACK
  },

  chartGridLinesStroke: {
    default: Color.grayColor( 200 )
  },

  axisStroke: {
    default: Color.grayColor( 170 )
  },

  levelSelectionButtonFill: {
    default: new Color( 243, 177, 175 )
  },

  scoreBoardFill: {
    default: new Color( 243, 177, 175 )
  },

  nextButtonFill: {
    default: PhetColorScheme.BUTTON_YELLOW
  }
} );

/**
 * Gets the color Property for a harmonic.
 * @param {number} order - order of the harmonic
 * @returns {Property.<Color>}
 */
FMWColorProfile.getHarmonicColorProperty = order => {
  const propertyName = `harmonic${order}ColorProperty`;
  assert && assert( FMWColorProfile.hasOwnProperty( propertyName ), `invalid order: ${order}` );
  return FMWColorProfile[ propertyName ];
};

fourierMakingWaves.register( 'FMWColorProfile', FMWColorProfile );
export default FMWColorProfile;