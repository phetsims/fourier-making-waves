// Copyright 2020, University of Colorado Boulder

/**
 * EquationMarkup is a set of utility functions for creating markup used to render equations that describe a
 * Fourier series.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import Domain from '../model/Domain.js';
import MathForm from '../model/MathForm.js';
import SeriesType from '../model/SeriesType.js';

// constants
const HIDDEN_STRING = ''; // string for MathForm.HIDDEN

// To improve readability of markup creation. Each of these is a string than may also include markup.
const A = FMWSymbols.A;
const F = FMWSymbols.F;
const f = FMWSymbols.f;
const k = FMWSymbols.k;
const L = FMWSymbols.L;
const lambda = FMWSymbols.lambda;
const MINUS = MathSymbols.MINUS;
const n = FMWSymbols.n;
const omega = FMWSymbols.omega;
const pi = FMWSymbols.pi;
const T = FMWSymbols.T;
const t = FMWSymbols.t;
const x = FMWSymbols.x;
const An = `${A}<sub>${n}</sub>`;

const EquationMarkup = {

  /**
   * Gets the RichText markup for the general form that describes a Fourier series.
   * @param {Domain} domain
   * @param {SeriesType} seriesType
   * @param {MathForm} mathForm
   * @returns {string}
   * @public
   */
  getGeneralFormMarkup( domain, seriesType, mathForm ) {
    return EquationMarkup.getSpecificFormMarkup( domain, seriesType, mathForm, n, An );
  },

  /**
   * Gets the RichText markup for a specific form that describes a Fourier series.
   * @param {Domain} domain
   * @param {SeriesType} seriesType
   * @param {MathForm} mathForm
   * @param {string|number} order - {string} for general form (e.g. 'n') or {number} for a specific harmonic
   * @param {string|number} amplitude - {string} for general form (e.g. 'An') or {number} for a specific amplitude
   * @returns {string}
   * @public
   */
  getSpecificFormMarkup( domain, seriesType, mathForm, order, amplitude ) {

    assert && assert( Domain.includes( domain ), `invalid domain: ${domain}` );
    assert && assert( SeriesType.includes( seriesType ), `invalid seriesType: ${seriesType}` );
    assert && assert( MathForm.includes( mathForm ), `invalid mathForm: ${mathForm}` );
    assert && assert( typeof order === 'string' || typeof order === 'number', `invalid order: ${order}` );
    assert && assert( typeof amplitude === 'string' || typeof amplitude === 'number', `invalid amplitude: ${amplitude}` );

    let markup;
    if ( domain === Domain.SPACE ) {
      markup = getSpaceMarkup( seriesType, mathForm, order, amplitude );
    }
    else if ( domain === Domain.TIME ) {
      markup = getTimeMarkup( seriesType, mathForm, order, amplitude );
    }
    else if ( domain === Domain.SPACE_AND_TIME ) {
      markup = getSpaceAndTimeMarkup( seriesType, mathForm, order, amplitude );
    }
    else {
      assert && assert( false, `unsupported domain: ${domain}` );
    }
    return markup;
  },

  /**
   * Gets the markup for 'F(...)', where the '...' depends on the domain.
   * @param {Domain} domain
   * @returns {string}
   * @public
   */
  getFunctionOfMarkup( domain ) {
    const variables = ( domain === Domain.SPACE ) ? x : ( ( domain === Domain.TIME ) ? t : `${x},${t}` );
    return `${F}(${variables})`;
  }
};

/**
 * Gets the RichText markup for an equation in the space domain.
 * @param {SeriesType} seriesType
 * @param {MathForm} mathForm
 * @param {string|number} order - {string} for general form (e.g. 'n') or number for a specific harmonic
 * @param {string|number} amplitude - {string} for general form (e.g. 'An') or {number} for a specific amplitude
 * @returns {string}
 */
function getSpaceMarkup( seriesType, mathForm, order, amplitude ) {
  assert && assert( SeriesType.includes( seriesType ), `invalid seriesType: ${seriesType}` );
  assert && assert( [ MathForm.HIDDEN, MathForm.WAVELENGTH, MathForm.WAVE_NUMBER, MathForm.MODE ].includes( mathForm ),
    `unsupported mathForm: ${mathForm}` );
  assert && assert( typeof order === 'string' || typeof order === 'number', `invalid order: ${order}` );
  assert && assert( typeof amplitude === 'string' || typeof amplitude === 'number', `invalid amplitude: ${amplitude}` );

  const seriesTypeMarkup = seriesTypeToMarkup( seriesType );

  let markup;
  if ( mathForm === MathForm.HIDDEN ) {
    markup = HIDDEN_STRING;
  }
  else if ( mathForm === MathForm.WAVELENGTH ) {
    markup = `${amplitude} ${seriesTypeMarkup}( 2${pi}${x} / ${lambda}<sub>${order}</sub> )`;
  }
  else if ( mathForm === MathForm.WAVE_NUMBER ) {
    markup = `${amplitude} ${seriesTypeMarkup}( ${k}<sub>${order}</sub>${x} )`;
  }
  else if ( mathForm === MathForm.MODE ) {
    markup = `${amplitude} ${seriesTypeMarkup}( 2${pi}${order}${x} / ${L} )`;
  }
  else {
    assert && assert( false, `unsupported mathForm: ${mathForm}` );
  }
  return markup;
}

/**
 * Gets the RichText markup for an equation in the time domain.
 * @param {SeriesType} seriesType
 * @param {MathForm} mathForm
 * @param {string|number} order - {string} for general form (e.g. 'n') or number for a specific harmonic
 * @param {string|number} amplitude - {string} for general form (e.g. 'An') or {number} for a specific amplitude
 * @returns {string}
 */
function getTimeMarkup( seriesType, mathForm, order, amplitude ) {
  assert && assert( SeriesType.includes( seriesType ), `invalid seriesType: ${seriesType}` );
  assert && assert( [ MathForm.HIDDEN, MathForm.FREQUENCY, MathForm.PERIOD, MathForm.ANGULAR_FREQUENCY, MathForm.MODE ].includes( mathForm ),
    `unsupported mathForm: ${mathForm}` );
  assert && assert( typeof order === 'string' || typeof order === 'number', `invalid order: ${order}` );
  assert && assert( typeof amplitude === 'string' || typeof amplitude === 'number', `invalid amplitude: ${amplitude}` );

  const seriesTypeMarkup = seriesTypeToMarkup( seriesType );

  let markup;
  if ( mathForm === MathForm.HIDDEN ) {
    markup = HIDDEN_STRING;
  }
  else if ( mathForm === MathForm.FREQUENCY ) {
    markup = `${amplitude} ${seriesTypeMarkup}( 2${pi}${f}<sub>${order}</sub>${t} )`;
  }
  else if ( mathForm === MathForm.PERIOD ) {
    markup = `${amplitude} ${seriesTypeMarkup}( 2${pi}${t} / ${T}<sub>${order}</sub> )`;
  }
  else if ( mathForm === MathForm.ANGULAR_FREQUENCY ) {
    markup = `${amplitude} ${seriesTypeMarkup}( ${omega}<sub>${order}</sub>${t} )`;
  }
  else if ( mathForm === MathForm.MODE ) {
    return `${amplitude} ${seriesTypeMarkup}( 2${pi}${order}${t} / ${T} )`;
  }
  else {
    assert && assert( false, `unsupported mathForm: ${mathForm}` );
  }
  return markup;
}

/**
 * Gets the RichText markup for an equation in the space & time domain.
 * @param {SeriesType} seriesType
 * @param {MathForm} mathForm
 * @param {string|number} order - {string} for general form (e.g. 'n') or number for a specific harmonic
 * @param {string|number} amplitude - {string} for general form (e.g. 'An') or {number} for a specific amplitude
 * @returns {string}
 */
function getSpaceAndTimeMarkup( seriesType, mathForm, order, amplitude ) {
  assert && assert( SeriesType.includes( seriesType ), `invalid seriesType: ${seriesType}` );
  assert && assert( [ MathForm.HIDDEN, MathForm.WAVELENGTH_AND_PERIOD, MathForm.WAVE_NUMBER_AND_ANGULAR_FREQUENCY, MathForm.MODE ].includes( mathForm ),
    `unsupported mathForm: ${mathForm}` );
  assert && assert( typeof order === 'string' || typeof order === 'number', `invalid order: ${order}` );
  assert && assert( typeof amplitude === 'string' || typeof amplitude === 'number', `invalid amplitude: ${amplitude}` );

  const seriesTypeMarkup = seriesTypeToMarkup( seriesType );

  let markup;
  if ( mathForm === MathForm.HIDDEN ) {
    markup = HIDDEN_STRING;
  }
  else if ( mathForm === MathForm.WAVELENGTH_AND_PERIOD ) {
    markup = `${amplitude} ${seriesTypeMarkup}( 2${pi}( ${x}/${lambda}<sub>${order}</sub> ${MINUS} ${t}/${T}<sub>${order}</sub> ) )`;
  }
  else if ( mathForm === MathForm.WAVE_NUMBER_AND_ANGULAR_FREQUENCY ) {
    markup = `${amplitude} ${seriesTypeMarkup}( ${k}<sub>${order}</sub>${x} ${MINUS} ${omega}<sub>${order}</sub>${t} )`;
  }
  else if ( mathForm === MathForm.MODE ) {
    markup = `${amplitude} ${seriesTypeMarkup}( 2${pi}${order}( ${x}/${L} ${MINUS} ${t}/${T} ) )`;
  }
  else {
    assert && assert( false, `unsupported mathForm: ${mathForm}` );
  }
  return markup;
}

/**
 * Converts a SeriesType to markup.
 * @param {SeriesType} seriesType
 * @returns {string}
 */
function seriesTypeToMarkup( seriesType ) {
  assert && assert( SeriesType.includes( seriesType ), `invalid seriesType: ${seriesType}` );
  return ( seriesType === SeriesType.SINE ) ? 'sin' : 'cos';
}

fourierMakingWaves.register( 'EquationMarkup', EquationMarkup );
export default EquationMarkup;