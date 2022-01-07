// Copyright 2020-2021, University of Colorado Boulder

/**
 * EquationForm enumerates the forms of the equations shown in the 'Discrete' screen.  These values are chosen
 * using EquationComboBox, and equations are displayed above the Harmonics and Sum charts.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationDeprecated from '../../../../phet-core/js/EnumerationDeprecated.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

const EquationForm = EnumerationDeprecated.byKeys( [

  // appropriate for all Domain values
  'HIDDEN', // equations are not shown, and tick labels are numeric values
  'MODE',

  // specific to Domain.SPACE
  'WAVELENGTH',
  'SPATIAL_WAVE_NUMBER',

  // specific to Domain.TIME
  'FREQUENCY',
  'PERIOD',
  'ANGULAR_WAVE_NUMBER',

  // specific to Domain.SPACE_AND_TIME
  'WAVELENGTH_AND_PERIOD',
  'SPATIAL_WAVE_NUMBER_AND_ANGULAR_WAVE_NUMBER'
] );

fourierMakingWaves.register( 'EquationForm', EquationForm );
export default EquationForm;