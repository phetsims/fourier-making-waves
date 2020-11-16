// Copyright 2020, University of Colorado Boulder

/**
 * FourierMakingWavesColorProfile defines the colors for this simulation.
 * Default colors are required. Colors for other profiles are optional.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ColorProfile from '../../../scenery-phet/js/ColorProfile.js';
import Color from '../../../scenery/js/util/Color.js';
import fourierMakingWaves from '../fourierMakingWaves.js';

const FourierMakingWavesColorProfile = new ColorProfile( [ 'default' ], {

  // Background color that is currently shared by all screens in this sim.
  screenBackgroundColor: {
    default: new Color( 236, 255, 255 )
  }
} );

fourierMakingWaves.register( 'FourierMakingWavesColorProfile', FourierMakingWavesColorProfile );
export default FourierMakingWavesColorProfile;