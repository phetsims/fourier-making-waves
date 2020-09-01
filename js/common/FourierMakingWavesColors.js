// Copyright 2020, University of Colorado Boulder

/**
 * FourierMakingWavesColors defines colors used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import Color from '../../../scenery/js/util/Color.js';
import fourierMakingWaves from '../fourierMakingWaves.js';

const FourierMakingWavesColors = {

  SCREEN_VIEW_BACKGROUND: new Property( 'rgb( 177, 202, 217 )' ),

  PANEL_FILL: 'white',
  PANEL_STROKE: 'black',
  SEPARATOR_STROKE: 'rgb( 200, 200, 200 )',

  HARMONIC_COLORS: [
    new Color( 255, 0, 0 ),
    new Color( 255, 128, 0 ),
    new Color( 255, 255, 0 ),
    new Color( 0, 255, 0 ),
    new Color( 0, 201, 87 ),
    new Color( 100, 149, 237 ),
    new Color( 0, 0, 255 ),
    new Color( 0, 0, 128 ),
    new Color( 145, 33, 158 ),
    new Color( 186, 85, 211 ),
    new Color( 255, 105, 180 )
  ]
};

fourierMakingWaves.register( 'FourierMakingWavesColors', FourierMakingWavesColors );
export default FourierMakingWavesColors;