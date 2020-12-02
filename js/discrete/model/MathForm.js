// Copyright 2020, University of Colorado Boulder

/**
 * Math forms for the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

const MathForm = Enumeration.byKeys( [

  // no math form is shown
  'HIDDEN',

  // for function of space
  'SPACE_WAVELENGTH',
  'SPACE_WAVE_NUMBER',
  'SPACE_MODE',

  // for function of time
  'TIME_FREQUENCY',
  'TIME_PERIOD',
  'TIME_ANGULAR_FREQUENCY',
  'TIME_MODE',

  // for function of space & time
  'SPACE_AND_TIME_WAVELENGTH_AND_PERIOD',
  'SPACE_AND_TIME_WAVE_NUMBER_AND_ANGULAR_FREQUENCY',
  'SPACE_AND_TIME_MODE'
] );

fourierMakingWaves.register( 'MathForm', MathForm );
export default MathForm;