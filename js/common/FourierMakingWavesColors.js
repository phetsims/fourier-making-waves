// Copyright 2020, University of Colorado Boulder

/**
 * FourierMakingWavesColors defines colors used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import AssertUtils from '../../../phetcommon/js/AssertUtils.js';
import Color from '../../../scenery/js/util/Color.js';
import Tandem from '../../../tandem/js/Tandem.js';
import fourierMakingWaves from '../fourierMakingWaves.js';

// Global tandem for colors
const COLORS_TANDEM = Tandem.GLOBAL.createTandem( 'view' ).createTandem( 'colors' );

const FourierMakingWavesColors = {

  SCREEN_VIEW_BACKGROUND: new Property( new Color( 236, 255, 255 ) ),

  PANEL_FILL: 'white',
  PANEL_STROKE: 'black',
  SEPARATOR_STROKE: new Color( 200, 200, 200 ),

  HARMONIC_COLOR_PROPERTIES: [
    createHarmonicColorProperty( 1, new Color( 255, 0, 0 ) ),
    createHarmonicColorProperty( 2, new Color( 255, 128, 0 ) ),
    createHarmonicColorProperty( 3, new Color( 255, 255, 0 ) ),
    createHarmonicColorProperty( 4, new Color( 0, 255, 0 ) ),
    createHarmonicColorProperty( 5, new Color( 0, 201, 87 ) ),
    createHarmonicColorProperty( 6, new Color( 100, 149, 237 ) ),
    createHarmonicColorProperty( 7, new Color( 0, 0, 255 ) ),
    createHarmonicColorProperty( 8, new Color( 0, 0, 128 ) ),
    createHarmonicColorProperty( 9, new Color( 145, 33, 158 ) ),
    createHarmonicColorProperty( 10, new Color( 186, 85, 211 ) ),
    createHarmonicColorProperty( 11, new Color( 255, 105, 180 ) )
  ]
};

/**
 * Creates the color Property for a harmonic.
 * @param {number} order - order of the harmonic
 * @param {Color} color
 * @returns {Property.<Color>}
 */
function createHarmonicColorProperty( order, color ) {

  assert && AssertUtils.assertPositiveInteger( order );
  assert && assert( color instanceof Color, 'invalid color' ); // because ColorIO only supports Color

  return new Property( color, {
    phetioType: Property.PropertyIO( Color.ColorIO ),
    tandem: COLORS_TANDEM.createTandem( `harmonicColor${order}Property` )
  } );
}

/**
 * Gets the color for a harmonic.
 * @param {number} order - order of the harmonic
 * @returns {Property.<Color>}
 */
FourierMakingWavesColors.getHarmonicColor = order => {
  assert && assert( order >= 1 && order <= FourierMakingWavesColors.HARMONIC_COLOR_PROPERTIES.length, `invalid order: ${order}` );
  return FourierMakingWavesColors.HARMONIC_COLOR_PROPERTIES[ order - 1 ];
};

fourierMakingWaves.register( 'FourierMakingWavesColors', FourierMakingWavesColors );
export default FourierMakingWavesColors;