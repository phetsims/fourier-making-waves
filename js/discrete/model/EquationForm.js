// Copyright 2020, University of Colorado Boulder

/**
 * EquationForm enumeration the forms of the equations shown in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

const EquationForm = Enumeration.byKeys( [

  // appropriate for all Domain values
  'HIDDEN', // equations are not shown, and tick labels are numeric values
  'MODE',

  // specific to Domain.SPACE
  'WAVELENGTH',
  'WAVE_NUMBER',

  // specific to Domain.TIME
  'FREQUENCY',
  'PERIOD',
  'ANGULAR_FREQUENCY',

  // specific to Domain.SPACE_AND_TIME
  'WAVELENGTH_AND_PERIOD',
  'WAVE_NUMBER_AND_ANGULAR_FREQUENCY'
] );

fourierMakingWaves.register( 'EquationForm', EquationForm );
export default EquationForm;