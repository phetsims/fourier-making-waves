// Copyright 2020, University of Colorado Boulder

/**
 * FourierMakingWavesColors defines colors used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import fourierMakingWaves from '../fourierMakingWaves.js';

const FourierMakingWavesColors = {

  SCREEN_VIEW_BACKGROUND: new Property( 'rgb( 177, 202, 217 )' ),

  PANEL_FILL: 'white',
  PANEL_STROKE: 'black',
  SEPARATOR_STROKE: 'rgb( 200, 200, 200 )'
};

fourierMakingWaves.register( 'FourierMakingWavesColors', FourierMakingWavesColors );
export default FourierMakingWavesColors;