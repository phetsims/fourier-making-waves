// Copyright 2020-2022, University of Colorado Boulder

/**
 * EquationMarkup is a set of utility functions for creating RichText markup, used to render equations that are
 * specific to this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import EquationForm from '../../discrete/model/EquationForm.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWSymbols from '../FMWSymbols.js';
import Domain from '../model/Domain.js';
import SeriesType from '../model/SeriesType.js';

// constants
const HIDDEN_STRING = ''; // string for EquationForm.HIDDEN

// To improve readability of markup creation. Each of these is a string that may also include markup, added by FMWSymbols.
const An = `${FMWSymbols.AStringProperty.value}<sub>${FMWSymbols.nStringProperty.value}</sub>`;
const F = FMWSymbols.FStringProperty.value;
const f = FMWSymbols.fStringProperty.value;
const k = FMWSymbols.kStringProperty.value;
const L = FMWSymbols.LStringProperty.value;
const lambda = FMWSymbols.lambdaStringProperty.value;
const MINUS = MathSymbols.MINUS;
const n = FMWSymbols.nStringProperty.value;
const omega = FMWSymbols.omegaStringProperty.value;
const pi = FMWSymbols.pi;
const T = FMWSymbols.TStringProperty.value;
const t = FMWSymbols.tStringProperty.value;
const x = FMWSymbols.xStringProperty.value;

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

    assert && assert( Domain.enumeration.includes( domain ) );
    assert && assert( SeriesType.enumeration.includes( seriesType ) );
    assert && assert( EquationForm.enumeration.includes( equationForm ) );
    assert && assert( typeof order === 'string' || typeof order === 'number' );
    assert && assert( typeof amplitude === 'string' || typeof amplitude === 'number' );

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
   * Gets the markup for 'F(...)', where the '...' depends on the Domain.
   * @param {Domain} domain
   * @returns {string}
   * @public
   */
  getFunctionOfMarkup( domain ) {
    const variables = ( domain === Domain.SPACE ) ? x : ( ( domain === Domain.TIME ) ? t : `${x},${t}` );
    return `${F}(${variables})`;
  },

  /**
   * Gets the markup used for the equation above the Components graph in the Wave Packet screen.
   * @param {Domain} domain
   * @param {SeriesType} seriesType
   * @returns {string}
   * @public
   */
  getComponentsEquationMarkup( domain, seriesType ) {
    assert && assert( domain === Domain.SPACE || domain === Domain.TIME );

    const domainSymbol = ( domain === Domain.SPACE ) ? FMWSymbols.xStringProperty.value : FMWSymbols.tStringProperty.value;
    const componentSymbol = ( domain === Domain.SPACE ) ? FMWSymbols.kStringProperty.value : FMWSymbols.omegaStringProperty.value;
    const seriesTypeString = ( seriesType === SeriesType.SIN ) ? FMWSymbols.sinStringProperty.value : FMWSymbols.cosStringProperty.value;
    return `${FMWSymbols.AStringProperty.value}<sub>${FMWSymbols.nStringProperty.value}</sub> ` +
           `${seriesTypeString}( ${componentSymbol}<sub>${FMWSymbols.nStringProperty.value}</sub>${domainSymbol} )`;
  }
};

/**
 * Gets the RichText markup for an equation in the space Domain.
 * @param {SeriesType} seriesType
 * @param {EquationForm} equationForm
 * @param {string|number} order - {string} for general form (e.g. 'n') or number for a specific harmonic
 * @param {string|number} amplitude - {string} for general form (e.g. 'An') or {number} for a specific amplitude
 * @returns {string}
 */
function getSpaceMarkup( seriesType, equationForm, order, amplitude ) {
  assert && assert( SeriesType.enumeration.includes( seriesType ) );
  assert && assert( [ EquationForm.HIDDEN, EquationForm.WAVELENGTH, EquationForm.SPATIAL_WAVE_NUMBER, EquationForm.MODE ].includes( equationForm ),
    `unsupported equationForm: ${equationForm}` );
  assert && assert( typeof order === 'string' || typeof order === 'number' );
  assert && assert( typeof amplitude === 'string' || typeof amplitude === 'number' );

  const seriesTypeMarkup = seriesTypeToMarkup( seriesType );

  let markup;
  if ( equationForm === EquationForm.HIDDEN ) {
    markup = HIDDEN_STRING;
  }
  else if ( equationForm === EquationForm.WAVELENGTH ) {
    markup = `${amplitude} ${seriesTypeMarkup}( 2${pi}${x} / ${lambda}<sub>${order}</sub> )`;
  }
  else if ( equationForm === EquationForm.SPATIAL_WAVE_NUMBER ) {
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
 * Gets the RichText markup for an equation in the time Domain.
 * @param {SeriesType} seriesType
 * @param {EquationForm} equationForm
 * @param {string|number} order - {string} for general form (e.g. 'n') or number for a specific harmonic
 * @param {string|number} amplitude - {string} for general form (e.g. 'An') or {number} for a specific amplitude
 * @returns {string}
 */
function getTimeMarkup( seriesType, equationForm, order, amplitude ) {
  assert && assert( SeriesType.enumeration.includes( seriesType ) );
  assert && assert( [ EquationForm.HIDDEN, EquationForm.FREQUENCY, EquationForm.PERIOD, EquationForm.ANGULAR_WAVE_NUMBER, EquationForm.MODE ].includes( equationForm ),
    `unsupported equationForm: ${equationForm}` );
  assert && assert( typeof order === 'string' || typeof order === 'number' );
  assert && assert( typeof amplitude === 'string' || typeof amplitude === 'number' );

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
  else if ( equationForm === EquationForm.ANGULAR_WAVE_NUMBER ) {
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
 * Gets the RichText markup for an equation in the space & time Domain.
 * @param {SeriesType} seriesType
 * @param {EquationForm} equationForm
 * @param {string|number} order - {string} for general form (e.g. 'n') or number for a specific harmonic
 * @param {string|number} amplitude - {string} for general form (e.g. 'An') or {number} for a specific amplitude
 * @returns {string}
 */
function getSpaceAndTimeMarkup( seriesType, equationForm, order, amplitude ) {
  assert && assert( SeriesType.enumeration.includes( seriesType ) );
  assert && assert( [ EquationForm.HIDDEN, EquationForm.WAVELENGTH_AND_PERIOD,
      EquationForm.SPATIAL_WAVE_NUMBER_AND_ANGULAR_WAVE_NUMBER, EquationForm.MODE ].includes( equationForm ),
    `unsupported equationForm: ${equationForm}` );
  assert && assert( typeof order === 'string' || typeof order === 'number' );
  assert && assert( typeof amplitude === 'string' || typeof amplitude === 'number' );

  const seriesTypeMarkup = seriesTypeToMarkup( seriesType );

  let markup;
  if ( equationForm === EquationForm.HIDDEN ) {
    markup = HIDDEN_STRING;
  }
  else if ( equationForm === EquationForm.WAVELENGTH_AND_PERIOD ) {
    markup = `${amplitude} ${seriesTypeMarkup}( 2${pi}( ${x}/${lambda}<sub>${order}</sub> ${MINUS} ${t}/${T}<sub>${order}</sub> ) )`;
  }
  else if ( equationForm === EquationForm.SPATIAL_WAVE_NUMBER_AND_ANGULAR_WAVE_NUMBER ) {
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
  assert && assert( SeriesType.enumeration.includes( seriesType ) );
  return ( seriesType === SeriesType.SIN ) ? FMWSymbols.sinStringProperty.value : FMWSymbols.cosStringProperty.value;
}

fourierMakingWaves.register( 'EquationMarkup', EquationMarkup );
export default EquationMarkup;