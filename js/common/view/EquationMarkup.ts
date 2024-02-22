// Copyright 2020-2023, University of Colorado Boulder

//TODO https://github.com/phetsims/fourier-making-waves/issues/225 use StringProperty instead of StringProperty.value, return TReadOnlyProperty<string> instead of string
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
const An = `${FMWSymbols.AMarkupStringProperty.value}<sub>${FMWSymbols.nMarkupStringProperty.value}</sub>`;
const F = FMWSymbols.FMarkupStringProperty.value;
const f = FMWSymbols.fMarkupStringProperty.value;
const k = FMWSymbols.kMarkupStringProperty.value;
const L = FMWSymbols.LMarkupStringProperty.value;
const lambda = FMWSymbols.lambdaMarkupStringProperty.value;
const MINUS = MathSymbols.MINUS;
const n = FMWSymbols.nMarkupStringProperty.value;
const omega = FMWSymbols.omegaMarkupStringProperty.value;
const pi = FMWSymbols.piMarkup;
const T = FMWSymbols.TMarkupStringProperty.value;
const t = FMWSymbols.tMarkupStringProperty.value;
const x = FMWSymbols.xMarkupStringProperty.value;

// {string} for general form (e.g. 'n') or {number} for a specific harmonic
type Order = string | number;

// {string} for general form (e.g. 'An') or {number} for a specific amplitude
type Amplitude = string | number;

const EquationMarkup = {

  //TODO https://github.com/phetsims/fourier-making-waves/issues/225 2 usages
  /**
   * Gets the RichText markup for the general form that describes a Fourier series.
   */
  getGeneralFormMarkup( domain: Domain, seriesType: SeriesType, equationForm: EquationForm ): string {
    return EquationMarkup.getSpecificFormMarkup( domain, seriesType, equationForm, n, An );
  },

  //TODO https://github.com/phetsims/fourier-making-waves/issues/225 2 usages
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

  //TODO https://github.com/phetsims/fourier-making-waves/issues/225 3 usages
  /**
   * Gets the RichText markup for 'F(...)', where the '...' depends on the Domain.
   */
  getFunctionOfMarkup( domain: Domain ): string {
    const variables = ( domain === Domain.SPACE ) ? x : ( ( domain === Domain.TIME ) ? t : `${x},${t}` );
    return `${F}(${variables})`;
  },

  /**
   * Gets the RichText markup used for the equation above the Components graph in the Wave Packet screen.
   */
  getComponentsEquationMarkup( domain: Domain, seriesType: SeriesType ): string {
    assert && assert( domain === Domain.SPACE || domain === Domain.TIME, `unsupported domain: ${domain}` );

    const domainSymbol = ( domain === Domain.SPACE ) ? FMWSymbols.xMarkupStringProperty.value : FMWSymbols.tMarkupStringProperty.value;
    const componentSymbol = ( domain === Domain.SPACE ) ? FMWSymbols.kMarkupStringProperty.value : FMWSymbols.omegaMarkupStringProperty.value;
    const seriesTypeString = ( seriesType === SeriesType.SIN ) ? FMWSymbols.sinMarkupStringProperty.value : FMWSymbols.cosMarkupStringProperty.value;
    return `${FMWSymbols.AMarkupStringProperty.value}<sub>${FMWSymbols.nMarkupStringProperty.value}</sub> ` +
           `${seriesTypeString}( ${componentSymbol}<sub>${FMWSymbols.nMarkupStringProperty.value}</sub>${domainSymbol} )`;
  }
};

/**
 * Gets the RichText markup for an equation in the space Domain.
 */
function getSpaceMarkup( seriesType: SeriesType, equationForm: EquationForm, order: Order, amplitude: Amplitude ): string {

  const seriesTypeMarkup = seriesTypeToMarkup( seriesType );

  let markup;
  if ( equationForm === EquationForm.WAVELENGTH ) {
    markup = `${amplitude} ${seriesTypeMarkup}( 2${pi}${x} / ${lambda}<sub>${order}</sub> )`;
  }
  else if ( equationForm === EquationForm.SPATIAL_WAVE_NUMBER ) {
    markup = `${amplitude} ${seriesTypeMarkup}( ${k}<sub>${order}</sub>${x} )`;
  }
  else if ( equationForm === EquationForm.MODE ) {
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

  let markup;
  if ( equationForm === EquationForm.FREQUENCY ) {
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

  let markup;
  if ( equationForm === EquationForm.WAVELENGTH_AND_PERIOD ) {
    markup = `${amplitude} ${seriesTypeMarkup}( 2${pi}( ${x}/${lambda}<sub>${order}</sub> ${MINUS} ${t}/${T}<sub>${order}</sub> ) )`;
  }
  else if ( equationForm === EquationForm.SPATIAL_WAVE_NUMBER_AND_ANGULAR_WAVE_NUMBER ) {
    markup = `${amplitude} ${seriesTypeMarkup}( ${k}<sub>${order}</sub>${x} ${MINUS} ${omega}<sub>${order}</sub>${t} )`;
  }
  else if ( equationForm === EquationForm.MODE ) {
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
  return ( seriesType === SeriesType.SIN ) ? FMWSymbols.sinMarkupStringProperty.value : FMWSymbols.cosMarkupStringProperty.value;
}

fourierMakingWaves.register( 'EquationMarkup', EquationMarkup );
export default EquationMarkup;