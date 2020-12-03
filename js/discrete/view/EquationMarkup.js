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
import WaveType from '../model/WaveType.js';

// constants
const HIDDEN_STRING = ''; // string for MathForm.HIDDEN

// To improve readability of markup creation. Each of these is a string than may also include markup.
const f = FMWSymbols.f;
const k = FMWSymbols.k;
const L = FMWSymbols.L;
const lambda = FMWSymbols.lambda;
const MINUS = MathSymbols.MINUS;
const omega = FMWSymbols.omega;
const pi = FMWSymbols.pi;
const T = FMWSymbols.T;
const t = FMWSymbols.t;
const x = FMWSymbols.x;

const EquationMarkup = {

  /**
   * Gets the RichText markup for an equation.
   * @param {Domain} domain
   * @param {WaveType} waveType
   * @param {MathForm} mathForm
   * @param {string|number} order - {string} for general form (e.g. 'n') or {number} for a specific harmonic
   * @param {string|number} amplitude - {string} for general form (e.g. 'An') or {number} for a specific amplitude
   * @returns {string}
   * @public
   */
  getRichTextMarkup( domain, waveType, mathForm, order, amplitude ) {

    assert && assert( Domain.includes( domain ), `invalid domain: ${domain}` );
    assert && assert( WaveType.includes( waveType ), `invalid waveType: ${waveType}` );
    assert && assert( MathForm.includes( mathForm ), `invalid mathForm: ${mathForm}` );
    assert && assert( typeof order === 'string' || typeof order === 'number', `invalid order: ${order}` );
    assert && assert( typeof amplitude === 'string' || typeof amplitude === 'number', `invalid amplitude: ${amplitude}` );

    let markup;
    if ( domain === Domain.SPACE ) {
      markup = getSpaceMarkup( waveType, mathForm, order, amplitude );
    }
    else if ( domain === Domain.TIME ) {
      markup = getTimeMarkup( waveType, mathForm, order, amplitude );
    }
    else if ( domain === Domain.SPACE_AND_TIME ) {
      markup = getSpaceAndTimeMarkup( waveType, mathForm, order, amplitude );
    }
    else {
      assert && assert( false, `unsupported domain: ${domain}` );
    }
    return markup;
  }
};

/**
 * Gets the RichText markup for an equation in the space domain.
 * @param {WaveType} waveType
 * @param {MathForm} mathForm
 * @param {string|number} order - {string} for general form (e.g. 'n') or number for a specific harmonic
 * @param {string|number} amplitude - {string} for general form (e.g. 'An') or {number} for a specific amplitude
 * @returns {string}
 */
function getSpaceMarkup( waveType, mathForm, order, amplitude ) {
  assert && assert( WaveType.includes( waveType ), `invalid waveType: ${waveType}` );
  assert && assert( [ MathForm.HIDDEN, MathForm.WAVELENGTH, MathForm.WAVE_NUMBER, MathForm.MODE ].includes( mathForm ),
    `unsupported mathForm: ${mathForm}` );
  assert && assert( typeof order === 'string' || typeof order === 'number', `invalid order: ${order}` );
  assert && assert( typeof amplitude === 'string' || typeof amplitude === 'number', `invalid amplitude: ${amplitude}` );

  const waveTypeMarkup = waveTypeToMarkup( waveType );

  let markup;
  if ( mathForm === MathForm.HIDDEN ) {
    markup = HIDDEN_STRING;
  }
  else if ( mathForm === MathForm.WAVELENGTH ) {
    markup = `${amplitude} ${waveTypeMarkup}( 2${pi}${x} / ${lambda}<sub>${order}</sub> )`;
  }
  else if ( mathForm === MathForm.WAVE_NUMBER ) {
    markup = `${amplitude} ${waveTypeMarkup}( ${k}<sub>${order}</sub>${x} )`;
  }
  else if ( mathForm === MathForm.MODE ) {
    markup = `${amplitude} ${waveTypeMarkup}( 2${pi}${order}${x} / ${L} )`;
  }
  else {
    assert && assert( false, `unsupported mathForm: ${mathForm}` );
  }
  return markup;
}

/**
 * Gets the RichText markup for an equation in the time domain.
 * @param {WaveType} waveType
 * @param {MathForm} mathForm
 * @param {string|number} order - {string} for general form (e.g. 'n') or number for a specific harmonic
 * @param {string|number} amplitude - {string} for general form (e.g. 'An') or {number} for a specific amplitude
 * @returns {string}
 */
function getTimeMarkup( waveType, mathForm, order, amplitude ) {
  assert && assert( WaveType.includes( waveType ), `invalid waveType: ${waveType}` );
  assert && assert( [ MathForm.HIDDEN, MathForm.FREQUENCY, MathForm.PERIOD, MathForm.ANGULAR_FREQUENCY, MathForm.MODE ].includes( mathForm ),
    `unsupported mathForm: ${mathForm}` );
  assert && assert( typeof order === 'string' || typeof order === 'number', `invalid order: ${order}` );
  assert && assert( typeof amplitude === 'string' || typeof amplitude === 'number', `invalid amplitude: ${amplitude}` );

  const waveTypeMarkup = waveTypeToMarkup( waveType );

  let markup;
  if ( mathForm === MathForm.HIDDEN ) {
    markup = HIDDEN_STRING;
  }
  else if ( mathForm === MathForm.FREQUENCY ) {
    markup = `${amplitude} ${waveTypeMarkup}( 2${pi}${f}<sub>${order}</sub>${t} )`;
  }
  else if ( mathForm === MathForm.PERIOD ) {
    markup = `${amplitude} ${waveTypeMarkup}( 2${pi}${t} / ${T}<sub>${order}</sub> )`;
  }
  else if ( mathForm === MathForm.ANGULAR_FREQUENCY ) {
    markup = `${amplitude} ${waveTypeMarkup}( ${omega}<sub>${order}</sub>${t} )`;
  }
  else if ( mathForm === MathForm.MODE ) {
    return `${amplitude} ${waveTypeMarkup}( 2${pi}${order}${t} / ${T} )`;
  }
  else {
    assert && assert( false, `unsupported mathForm: ${mathForm}` );
  }
  return markup;
}

/**
 * Gets the RichText markup for an equation in the space & time domain.
 * @param {WaveType} waveType
 * @param {MathForm} mathForm
 * @param {string|number} order - {string} for general form (e.g. 'n') or number for a specific harmonic
 * @param {string|number} amplitude - {string} for general form (e.g. 'An') or {number} for a specific amplitude
 * @returns {string}
 */
function getSpaceAndTimeMarkup( waveType, mathForm, order, amplitude ) {
  assert && assert( WaveType.includes( waveType ), `invalid waveType: ${waveType}` );
  assert && assert( [ MathForm.HIDDEN, MathForm.WAVELENGTH_AND_PERIOD, MathForm.WAVE_NUMBER_AND_ANGULAR_FREQUENCY, MathForm.MODE ].includes( mathForm ),
    `unsupported mathForm: ${mathForm}` );
  assert && assert( typeof order === 'string' || typeof order === 'number', `invalid order: ${order}` );
  assert && assert( typeof amplitude === 'string' || typeof amplitude === 'number', `invalid amplitude: ${amplitude}` );

  const waveTypeMarkup = waveTypeToMarkup( waveType );

  let markup;
  if ( mathForm === MathForm.HIDDEN ) {
    markup = HIDDEN_STRING;
  }
  else if ( mathForm === MathForm.WAVELENGTH_AND_PERIOD ) {
    markup = `${amplitude} ${waveTypeMarkup}( 2${pi}( ${x}/${lambda}<sub>${order}</sub> ${MINUS} ${t}/${T}<sub>${order}</sub> ) )`;
  }
  else if ( mathForm === MathForm.WAVE_NUMBER_AND_ANGULAR_FREQUENCY ) {
    markup = `${amplitude} ${waveTypeMarkup}( ${k}<sub>${order}</sub>${x} ${MINUS} ${omega}<sub>${order}</sub>${t} )`;
  }
  else if ( mathForm === MathForm.MODE ) {
    markup = `${amplitude} ${waveTypeMarkup}( 2${pi}${order}( ${x}/${L} ${MINUS} ${t}/${T} ) )`;
  }
  else {
    assert && assert( false, `unsupported mathForm: ${mathForm}` );
  }
  return markup;
}

/**
 * Converts a WaveType to markup.
 * @param {WaveType} waveType
 * @returns {string}
 */
function waveTypeToMarkup( waveType ) {
  assert && assert( WaveType.includes( waveType ), `invalid waveType: ${waveType}` );
  return ( waveType === WaveType.SINE ) ? 'sin' : 'cos';
}

fourierMakingWaves.register( 'EquationMarkup', EquationMarkup );
export default EquationMarkup;