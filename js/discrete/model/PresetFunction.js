// Copyright 2020, University of Colorado Boulder

/**
 * Preset functions for the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

const PresetFunction = Enumeration.byKeys( [
  'SINE_COSINE',
  'TRIANGLE',
  'SQUARE',
  'SAWTOOTH',
  'WAVE_PACKET',
  'CUSTOM'
] );

fourierMakingWaves.register( 'PresetFunction', PresetFunction );
export default PresetFunction;