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
import Domain from '../../common/model/Domain.js';
import EquationForm from '../model/EquationForm.js';
import SeriesType from '../../common/model/SeriesType.js';

// constants
const HIDDEN_STRING = ''; // string for EquationForm.HIDDEN

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
   * @param {EquationForm} equationForm
   * @returns {string}
   * @public
   */
  getGeneralFormMarkup( domain, seriesType, equationForm ) {
    return EquationMarkup.getSpecificFormMarkup( domain, seriesType, equationForm, n, An );
  },

  /**
   * Gets the RichText markup for a specific form that describes a Fourier series.
   * @param {Domain} domain
   * @param {SeriesType} seriesType
   * @param {EquationForm} equationForm
   * @param {string|number} order - {string} for general form (e.g. 'n') or {number} for a specific harmonic
   * @param {string|number} amplitude - {string} for general form (e.g. 'An') or {number} for a specific amplitude
   * @returns {string}
   * @public
   */
  getSpecificFormMarkup( domain, seriesType, equationForm, order, amplitude ) {

    assert && assert( Domain.includes( domain ), `invalid domain: ${domain}` );
    assert && assert( SeriesType.includes( seriesType ), `invalid seriesType: ${seriesType}` );
    assert && assert( EquationForm.includes( equationForm ), `invalid equationForm: ${equationForm}` );
    assert && assert( typeof order === 'string' || typeof order === 'number', `invalid order: ${order}` );
    assert && assert( typeof amplitude === 'string' || typeof amplitude === 'number', `invalid amplitude: ${amplitude}` );

    let markup;
    if ( domain === Domain.SPACE ) {
      markup = getSpaceMarkup( seriesType, equationForm, order, amplitude );
    }
    else if ( domain === Domain.TIME ) {
      markup = getTimeMarkup( seriesType, equationForm, order, amplitude );
    }
    else if ( domain === Domain.SPACE_AND_TIME ) {
      markup = getSpaceAndTimeMarkup( seriesType, equationForm, order, amplitude );
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
 * @param {EquationForm} equationForm
 * @param {string|number} order - {string} for general form (e.g. 'n') or number for a specific harmonic
 * @param {string|number} amplitude - {string} for general form (e.g. 'An') or {number} for a specific amplitude
 * @returns {string}
 */
function getSpaceMarkup( seriesType, equationForm, order, amplitude ) {
  assert && assert( SeriesType.includes( seriesType ), `invalid seriesType: ${seriesType}` );
  assert && assert( [ EquationForm.HIDDEN, EquationForm.WAVELENGTH, EquationForm.WAVE_NUMBER, EquationForm.MODE ].includes( equationForm ),
    `unsupported equationForm: ${equationForm}` );
  assert && assert( typeof order === 'string' || typeof order === 'number', `invalid order: ${order}` );
  assert && assert( typeof amplitude === 'string' || typeof amplitude === 'number', `invalid amplitude: ${amplitude}` );

  const seriesTypeMarkup = seriesTypeToMarkup( seriesType );

  let markup;
  if ( equationForm === EquationForm.HIDDEN ) {
    markup = HIDDEN_STRING;
  }
  else if ( equationForm === EquationForm.WAVELENGTH ) {
    markup = `${amplitude} ${seriesTypeMarkup}( 2${pi}${x} / ${lambda}<sub>${order}</sub> )`;
  }
  else if ( equationForm === EquationForm.WAVE_NUMBER ) {
    markup = `${amplitude} ${seriesTypeMarkup}( ${k}<sub>${order}</sub>${x} )`;
  }
  else if ( equationForm === EquationForm.MODE ) {
    markup = `${amplitude} ${seriesTypeMarkup}( 2${pi}${order}${x} / ${L} )`;
  }
  else {
    assert && assert( false, `unsupported equationForm: ${equationForm}` );
  }
  return markup;
}

/**
 * Gets the RichText markup for an equation in the time domain.
 * @param {SeriesType} seriesType
 * @param {EquationForm} equationForm
 * @param {string|number} order - {string} for general form (e.g. 'n') or number for a specific harmonic
 * @param {string|number} amplitude - {string} for general form (e.g. 'An') or {number} for a specific amplitude
 * @returns {string}
 */
function getTimeMarkup( seriesType, equationForm, order, amplitude ) {
  assert && assert( SeriesType.includes( seriesType ), `invalid seriesType: ${seriesType}` );
  assert && assert( [ EquationForm.HIDDEN, EquationForm.FREQUENCY, EquationForm.PERIOD, EquationForm.ANGULAR_FREQUENCY, EquationForm.MODE ].includes( equationForm ),
    `unsupported equationForm: ${equationForm}` );
  assert && assert( typeof order === 'string' || typeof order === 'number', `invalid order: ${order}` );
  assert && assert( typeof amplitude === 'string' || typeof amplitude === 'number', `invalid amplitude: ${amplitude}` );

  const seriesTypeMarkup = seriesTypeToMarkup( seriesType );

  let markup;
  if ( equationForm === EquationForm.HIDDEN ) {
    markup = HIDDEN_STRING;
  }
  else if ( equationForm === EquationForm.FREQUENCY ) {
    markup = `${amplitude} ${seriesTypeMarkup}( 2${pi}${f}<sub>${order}</sub>${t} )`;
  }
  else if ( equationForm === EquationForm.PERIOD ) {
    markup = `${amplitude} ${seriesTypeMarkup}( 2${pi}${t} / ${T}<sub>${order}</sub> )`;
  }
  else if ( equationForm === EquationForm.ANGULAR_FREQUENCY ) {
    markup = `${amplitude} ${seriesTypeMarkup}( ${omega}<sub>${order}</sub>${t} )`;
  }
  else if ( equationForm === EquationForm.MODE ) {
    return `${amplitude} ${seriesTypeMarkup}( 2${pi}${order}${t} / ${T} )`;
  }
  else {
    assert && assert( false, `unsupported equationForm: ${equationForm}` );
  }
  return markup;
}

/**
 * Gets the RichText markup for an equation in the space & time domain.
 * @param {SeriesType} seriesType
 * @param {EquationForm} equationForm
 * @param {string|number} order - {string} for general form (e.g. 'n') or number for a specific harmonic
 * @param {string|number} amplitude - {string} for general form (e.g. 'An') or {number} for a specific amplitude
 * @returns {string}
 */
function getSpaceAndTimeMarkup( seriesType, equationForm, order, amplitude ) {
  assert && assert( SeriesType.includes( seriesType ), `invalid seriesType: ${seriesType}` );
  assert && assert( [ EquationForm.HIDDEN, EquationForm.WAVELENGTH_AND_PERIOD, EquationForm.WAVE_NUMBER_AND_ANGULAR_FREQUENCY, EquationForm.MODE ].includes( equationForm ),
    `unsupported equationForm: ${equationForm}` );
  assert && assert( typeof order === 'string' || typeof order === 'number', `invalid order: ${order}` );
  assert && assert( typeof amplitude === 'string' || typeof amplitude === 'number', `invalid amplitude: ${amplitude}` );

  const seriesTypeMarkup = seriesTypeToMarkup( seriesType );

  let markup;
  if ( equationForm === EquationForm.HIDDEN ) {
    markup = HIDDEN_STRING;
  }
  else if ( equationForm === EquationForm.WAVELENGTH_AND_PERIOD ) {
    markup = `${amplitude} ${seriesTypeMarkup}( 2${pi}( ${x}/${lambda}<sub>${order}</sub> ${MINUS} ${t}/${T}<sub>${order}</sub> ) )`;
  }
  else if ( equationForm === EquationForm.WAVE_NUMBER_AND_ANGULAR_FREQUENCY ) {
    markup = `${amplitude} ${seriesTypeMarkup}( ${k}<sub>${order}</sub>${x} ${MINUS} ${omega}<sub>${order}</sub>${t} )`;
  }
  else if ( equationForm === EquationForm.MODE ) {
    markup = `${amplitude} ${seriesTypeMarkup}( 2${pi}${order}( ${x}/${L} ${MINUS} ${t}/${T} ) )`;
  }
  else {
    assert && assert( false, `unsupported equationForm: ${equationForm}` );
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
  return ( seriesType === SeriesType.SINE ) ? FMWSymbols.sin : FMWSymbols.cos;
}

fourierMakingWaves.register( 'EquationMarkup', EquationMarkup );
export default EquationMarkup;