// Copyright 2020-2024, University of Colorado Boulder

/**
 * EquationMarkup is a set of utility functions for creating RichText markup, used to render equations that are
 * specific to this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import EquationForm from '../../discrete/model/EquationForm.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWSymbols from '../FMWSymbols.js';
import Domain from '../model/Domain.js';
import SeriesType from '../model/SeriesType.js';

// constants
const HIDDEN_STRING = ''; // string for EquationForm.HIDDEN

// Static strings
const MINUS = MathSymbols.MINUS;
const pi = FMWSymbols.piMarkup;

// Dynamic strings. NOTE! If you add a StringProperty here, you must also add it to STRING_PROPERTY_DEPENDENCIES.
const nProperty = FMWSymbols.nMarkupStringProperty;
const AnProperty = new DerivedStringProperty( [ FMWSymbols.AMarkupStringProperty, nProperty ], ( A, n ) => `${A}<sub>${n}</sub>` );
const FProperty = FMWSymbols.FMarkupStringProperty;
const fProperty = FMWSymbols.fMarkupStringProperty;
const kProperty = FMWSymbols.kMarkupStringProperty;
const LProperty = FMWSymbols.LMarkupStringProperty;
const lambdaProperty = FMWSymbols.lambdaMarkupStringProperty;
const omegaProperty = FMWSymbols.omegaMarkupStringProperty;
const TProperty = FMWSymbols.TMarkupStringProperty;
const tProperty = FMWSymbols.tMarkupStringProperty;
const xProperty = FMWSymbols.xMarkupStringProperty;
const sinProperty = FMWSymbols.sinMarkupStringProperty;
const cosProperty = FMWSymbols.cosMarkupStringProperty;

// {string} for general form (e.g. 'n') or {number} for a specific harmonic
type Order = string | number;

// {string} for general form (e.g. 'An') or {number} for a specific amplitude
type Amplitude = string | number;

const EquationMarkup = {

  // The set of all string Properties that are used by the functions herein. Trying to specify only the StringProperties
  // that are involved for a particular function, and a particular use that function, is complicated and not maintainable.
  // A simpler approach is to update when any of these StringProperties changes. So if you use one of the functions
  // herein, add these dependencies to your Multilink, DerivedProperty, etc.
  // See https://github.com/phetsims/fourier-making-waves/issues/225
  STRING_PROPERTY_DEPENDENCIES: [
    nProperty,
    AnProperty,
    FProperty,
    fProperty,
    kProperty,
    LProperty,
    lambdaProperty,
    omegaProperty,
    TProperty,
    tProperty,
    xProperty,
    sinProperty,
    cosProperty
  ],

  /**
   * Gets the RichText markup for the general form that describes a Fourier series.
   */
  getGeneralFormMarkup( domain: Domain, seriesType: SeriesType, equationForm: EquationForm ): string {
    return EquationMarkup.getSpecificFormMarkup( domain, seriesType, equationForm, nProperty.value, AnProperty.value );
  },

  /**
   * Gets the RichText markup for a specific form that describes a Fourier series.
   */
  getSpecificFormMarkup( domain: Domain, seriesType: SeriesType, equationForm: EquationForm, order: Order, amplitude: Amplitude ): string {
    let markup = '';
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
   * Gets the RichText markup for 'F(...)', where the '...' depends on the Domain.
   */
  getFunctionOfMarkup( domain: Domain ): string {

    const x = xProperty.value;
    const t = tProperty.value;
    const F = FProperty.value;

    const variables = ( domain === Domain.SPACE ) ? x : ( ( domain === Domain.TIME ) ? t : `${x},${t}` );
    return `${F}(${variables})`;
  },

  /**
   * Gets the RichText markup used for the equation above the Components graph in the Wave Packet screen.
   */
  getComponentsEquationMarkup( domain: Domain, seriesType: SeriesType ): string {
    assert && assert( domain === Domain.SPACE || domain === Domain.TIME, `unsupported domain: ${domain}` );

    const x = xProperty.value;
    const t = tProperty.value;
    const k = kProperty.value;
    const omega = omegaProperty.value;
    const sin = sinProperty.value;
    const cos = cosProperty.value;
    const An = AnProperty.value;
    const n = nProperty.value;

    const domainSymbol = ( domain === Domain.SPACE ) ? x : t;
    const componentSymbol = ( domain === Domain.SPACE ) ? k : omega;
    const seriesTypeString = ( seriesType === SeriesType.SIN ) ? sin : cos;
    return `${An} ${seriesTypeString}( ${componentSymbol}<sub>${n}</sub>${domainSymbol} )`;
  }
};

/**
 * Gets the RichText markup for an equation in the space Domain.
 */
function getSpaceMarkup( seriesType: SeriesType, equationForm: EquationForm, order: Order, amplitude: Amplitude ): string {

  const seriesTypeMarkup = seriesTypeToMarkup( seriesType );

  // Common to all 'space' equations
  const x = xProperty.value;

  let markup;
  if ( equationForm === EquationForm.WAVELENGTH ) {
    const lambda = lambdaProperty.value;
    markup = `${amplitude} ${seriesTypeMarkup}( 2${pi}${x} / ${lambda}<sub>${order}</sub> )`;
  }
  else if ( equationForm === EquationForm.SPATIAL_WAVE_NUMBER ) {
    const k = kProperty.value;
    markup = `${amplitude} ${seriesTypeMarkup}( ${k}<sub>${order}</sub>${x} )`;
  }
  else if ( equationForm === EquationForm.MODE ) {
    const L = LProperty.value;
    markup = `${amplitude} ${seriesTypeMarkup}( 2${pi}${order}${x} / ${L} )`;
  }
  else {

    // If equationForm is not appropriate for Domain.SPACE, then the sim is probably in an intermediate state
    // where the domain has been changed, but the equationForm has not been adjusted by DiscreteModel to be compatible
    // with the Domain. In that case, return the same markup as EquationForm.HIDDEN, which is appropriate for all
    // Domain values. See https://github.com/phetsims/fourier-making-waves/issues/238.
    markup = HIDDEN_STRING;
  }
  return markup;
}

/**
 * Gets the RichText markup for an equation in the time Domain.
 */
function getTimeMarkup( seriesType: SeriesType, equationForm: EquationForm, order: Order, amplitude: Amplitude ): string {

  const seriesTypeMarkup = seriesTypeToMarkup( seriesType );

  // Common to all 'time' equations
  const t = tProperty.value;

  let markup;
  if ( equationForm === EquationForm.FREQUENCY ) {
    const f = fProperty.value;
    markup = `${amplitude} ${seriesTypeMarkup}( 2${pi}${f}<sub>${order}</sub>${t} )`;
  }
  else if ( equationForm === EquationForm.PERIOD ) {
    const T = TProperty.value;
    markup = `${amplitude} ${seriesTypeMarkup}( 2${pi}${t} / ${T}<sub>${order}</sub> )`;
  }
  else if ( equationForm === EquationForm.ANGULAR_WAVE_NUMBER ) {
    const omega = omegaProperty.value;
    markup = `${amplitude} ${seriesTypeMarkup}( ${omega}<sub>${order}</sub>${t} )`;
  }
  else if ( equationForm === EquationForm.MODE ) {
    const T = TProperty.value;
    return `${amplitude} ${seriesTypeMarkup}( 2${pi}${order}${t} / ${T} )`;
  }
  else {

    // If equationForm is not appropriate for Domain.TIME, then the sim is probably in an intermediate state
    // where the domain has been changed, but the equationForm has not been adjusted by DiscreteModel to be compatible
    // with the Domain. In that case, return the same markup as EquationForm.HIDDEN, which is appropriate for all
    // Domain values. See https://github.com/phetsims/fourier-making-waves/issues/238.
    markup = HIDDEN_STRING;
  }
  return markup;
}

/**
 * Gets the RichText markup for an equation in the space & time Domain.
 */
function getSpaceAndTimeMarkup( seriesType: SeriesType, equationForm: EquationForm, order: Order, amplitude: Amplitude ): string {

  const seriesTypeMarkup = seriesTypeToMarkup( seriesType );

  // Common to all 'space & time' equations
  const x = xProperty.value;
  const t = tProperty.value;

  let markup;
  if ( equationForm === EquationForm.WAVELENGTH_AND_PERIOD ) {
    const lambda = lambdaProperty.value;
    const T = TProperty.value;
    markup = `${amplitude} ${seriesTypeMarkup}( 2${pi}( ${x}/${lambda}<sub>${order}</sub> ${MINUS} ${t}/${T}<sub>${order}</sub> ) )`;
  }
  else if ( equationForm === EquationForm.SPATIAL_WAVE_NUMBER_AND_ANGULAR_WAVE_NUMBER ) {
    const k = kProperty.value;
    const omega = omegaProperty.value;
    markup = `${amplitude} ${seriesTypeMarkup}( ${k}<sub>${order}</sub>${x} ${MINUS} ${omega}<sub>${order}</sub>${t} )`;
  }
  else if ( equationForm === EquationForm.MODE ) {
    const L = LProperty.value;
    const T = TProperty.value;
    markup = `${amplitude} ${seriesTypeMarkup}( 2${pi}${order}( ${x}/${L} ${MINUS} ${t}/${T} ) )`;
  }
  else {

    // If equationForm is not appropriate for Domain.SPACE_AND_TIME, then the sim is probably in an intermediate state
    // where the domain has been changed, but the equationForm has not been adjusted by DiscreteModel to be compatible
    // with the Domain. In that case, return the same markup as EquationForm.HIDDEN, which is appropriate for all
    // Domain values. See https://github.com/phetsims/fourier-making-waves/issues/238.
    markup = HIDDEN_STRING;
  }
  return markup;
}

/**
 * Converts a SeriesType to markup.
 */
function seriesTypeToMarkup( seriesType: SeriesType ): string {
  return ( seriesType === SeriesType.SIN ) ? sinProperty.value : cosProperty.value;
}

fourierMakingWaves.register( 'EquationMarkup', EquationMarkup );
export default EquationMarkup;