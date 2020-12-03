// Copyright 2020, University of Colorado Boulder

/**
 * EquationMarkup is a set of utility functions for creating markup used to render equations.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import Domain from '../model/Domain.js';
import MathForm from '../model/MathForm.js';

// constants
const HIDDEN_STRING = ''; // string for MathForm.HIDDEN

// To improve readability of markup creation. Each of these is a string than may also include markup.
const f = FMWSymbols.SMALL_F;
const k = FMWSymbols.SMALL_K;
const lambda = FMWSymbols.SMALL_LAMBDA;
const L = FMWSymbols.CAPITAL_L;
const MINUS = MathSymbols.MINUS;
const omega = FMWSymbols.SMALL_OMEGA;
const PI = FMWSymbols.PI;
const t = FMWSymbols.SMALL_T;
const T = FMWSymbols.CAPITAL_T;
const x = FMWSymbols.SMALL_X;

const EquationMarkup = {

  /**
   * Gets the RichText markup for an equation.
   * @param {Domain} domain
   * @param {MathForm} mathForm
   * @param {string|number} order - {string} for general form (e.g. 'n') or {number} for a specific harmonic
   * @param {string|number} amplitude - {string} for general form (e.g. 'An') or {number} for a specific amplitude
   * @returns {string}
   * @public
   */
  getRichTextMarkup( domain, mathForm, order, amplitude ) {

    assert && assert( Domain.includes( domain ), `invalid domain: ${domain}` );
    assert && assert( MathForm.includes( mathForm ), `invalid mathForm: ${mathForm}` );
    assert && assert( typeof order === 'string' || typeof order === 'number', `invalid order: ${order}` );
    assert && assert( typeof amplitude === 'string' || typeof amplitude === 'number', `invalid amplitude: ${amplitude}` );

    let markup;
    if ( domain === Domain.SPACE ) {
      markup = getSpaceMarkup( mathForm, order, amplitude );
    }
    else if ( domain === Domain.TIME ) {
      markup = getTimeMarkup( mathForm, order, amplitude );
    }
    else if ( domain === Domain.SPACE_AND_TIME ) {
      markup = getSpaceAndTimeMarkup( mathForm, order, amplitude );
    }
    else {
      assert && assert( false, `unsupported domain: ${domain}` );
    }
    return markup;
  }
};

/**
 * Gets the RichText markup for an equation in the space domain.
 * @param {MathForm} mathForm
 * @param {string|number} order - {string} for general form (e.g. 'n') or number for a specific harmonic
 * @param {string|number} amplitude - {string} for general form (e.g. 'An') or {number} for a specific amplitude
 * @returns {string}
 */
function getSpaceMarkup( mathForm, order, amplitude ) {
  assert && assert( [ MathForm.HIDDEN, MathForm.WAVELENGTH, MathForm.WAVE_NUMBER, MathForm.MODE ].includes( mathForm ),
    `unsupported mathForm: ${mathForm}` );
  assert && assert( typeof order === 'string' || typeof order === 'number', `invalid order: ${order}` );
  assert && assert( typeof amplitude === 'string' || typeof amplitude === 'number', `invalid amplitude: ${amplitude}` );

  let markup;
  if ( mathForm === MathForm.HIDDEN ) {
    markup = HIDDEN_STRING;
  }
  else if ( mathForm === MathForm.WAVELENGTH ) {
    markup = `${amplitude} sin( 2${PI}${x} / ${lambda}<sub>${order}</sub> )`;
  }
  else if ( mathForm === MathForm.WAVE_NUMBER ) {
    markup = `${amplitude} sin( ${k}<sub>${order}</sub>${x} )`;
  }
  else if ( mathForm === MathForm.MODE ) {
    markup = `${amplitude} sin( 2${PI}${order}${x} / ${L} )`;
  }
  else {
    assert && assert( false, `unsupported mathForm: ${mathForm}` );
  }
  return markup;
}

/**
 * Gets the RichText markup for an equation in the time domain.
 * @param {MathForm} mathForm
 * @param {string|number} order - {string} for general form (e.g. 'n') or number for a specific harmonic
 * @param {string|number} amplitude - {string} for general form (e.g. 'An') or {number} for a specific amplitude
 * @returns {string}
 */
function getTimeMarkup( mathForm, order, amplitude ) {
  assert && assert( [ MathForm.HIDDEN, MathForm.FREQUENCY, MathForm.PERIOD, MathForm.ANGULAR_FREQUENCY, MathForm.MODE ].includes( mathForm ),
    `unsupported mathForm: ${mathForm}` );
  assert && assert( typeof order === 'string' || typeof order === 'number', `invalid order: ${order}` );
  assert && assert( typeof amplitude === 'string' || typeof amplitude === 'number', `invalid amplitude: ${amplitude}` );

  let markup;
  if ( mathForm === MathForm.HIDDEN ) {
    markup = HIDDEN_STRING;
  }
  else if ( mathForm === MathForm.FREQUENCY ) {
    markup = `${amplitude} sin( 2${PI}${f}<sub>${order}</sub>${t} )`;
  }
  else if ( mathForm === MathForm.PERIOD ) {
    markup = `${amplitude} sin( 2${PI}${t} / ${T}<sub>${order}</sub> )`;
  }
  else if ( mathForm === MathForm.ANGULAR_FREQUENCY ) {
    markup = `${amplitude} sin( ${omega}<sub>${order}</sub>${t} )`;
  }
  else if ( mathForm === MathForm.MODE ) {
    return `${amplitude} sin( 2${PI}${order}${t} / ${T} )`;
  }
  else {
    assert && assert( false, `unsupported mathForm: ${mathForm}` );
  }
  return markup;
}

/**
 * Gets the RichText markup for an equation in the space & time domain.
 * @param {MathForm} mathForm
 * @param {string|number} order - {string} for general form (e.g. 'n') or number for a specific harmonic
 * @param {string|number} amplitude - {string} for general form (e.g. 'An') or {number} for a specific amplitude
 * @returns {string}
 */
function getSpaceAndTimeMarkup( mathForm, order, amplitude ) {
  assert && assert( [ MathForm.HIDDEN, MathForm.WAVELENGTH_AND_PERIOD, MathForm.WAVE_NUMBER_AND_ANGULAR_FREQUENCY, MathForm.MODE ].includes( mathForm ),
    `unsupported mathForm: ${mathForm}` );
  assert && assert( typeof order === 'string' || typeof order === 'number', `invalid order: ${order}` );
  assert && assert( typeof amplitude === 'string' || typeof amplitude === 'number', `invalid amplitude: ${amplitude}` );

  let markup;
  if ( mathForm === MathForm.HIDDEN ) {
    markup = HIDDEN_STRING;
  }
  else if ( mathForm === MathForm.WAVELENGTH_AND_PERIOD ) {
    markup = `${amplitude} sin( 2${PI}( ${x}/${lambda}<sub>${order}</sub> ${MINUS} ${t}/${T}<sub>${order}</sub> ) )`;
  }
  else if ( mathForm === MathForm.WAVE_NUMBER_AND_ANGULAR_FREQUENCY ) {
    markup = `${amplitude} sin( ${k}<sub>${order}</sub>${x} ${MINUS} ${omega}<sub>${order}</sub>${t} )`;
  }
  else if ( mathForm === MathForm.MODE ) {
    markup = `${amplitude} sin( 2${PI}${order}( ${x}/${L} ${MINUS} ${t}/${T} ) )`;
  }
  else {
    assert && assert( false, `unsupported mathForm: ${mathForm}` );
  }
  return markup;
}

fourierMakingWaves.register( 'EquationMarkup', EquationMarkup );
export default EquationMarkup;