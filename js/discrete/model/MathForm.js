// Copyright 2020, University of Colorado Boulder

/**
 * Math forms for the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

const MathForm = Enumeration.byKeys( [
  'HIDDEN',
  'WAVELENGTH',
  'WAVE_NUMBER',
  'MODE'
] );

fourierMakingWaves.register( 'MathForm', MathForm );
export default MathForm;