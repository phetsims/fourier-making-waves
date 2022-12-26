// Copyright 2020-2022, University of Colorado Boulder

/**
 * EquationForm enumerates the forms of the equations shown in the 'Discrete' screen.  These values are chosen
 * using EquationComboBox, and equations are displayed above the Harmonics and Sum charts.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

export default class EquationForm extends EnumerationValue {

  // appropriate for all Domain values
  public static readonly HIDDEN = new EquationForm(); // equations are not shown, and tick labels are numeric values
  public static readonly MODE = new EquationForm();

  // specific to Domain.SPACE
  public static readonly WAVELENGTH = new EquationForm();
  public static readonly SPATIAL_WAVE_NUMBER = new EquationForm();

  // specific to Domain.TIME
  public static readonly FREQUENCY = new EquationForm();
  public static readonly PERIOD = new EquationForm();
  public static readonly ANGULAR_WAVE_NUMBER = new EquationForm();

  // specific to Domain.SPACE_AND_TIME
  public static readonly WAVELENGTH_AND_PERIOD = new EquationForm();
  public static readonly SPATIAL_WAVE_NUMBER_AND_ANGULAR_WAVE_NUMBER = new EquationForm();

  public static readonly enumeration = new Enumeration( EquationForm );
}

fourierMakingWaves.register( 'EquationForm', EquationForm );