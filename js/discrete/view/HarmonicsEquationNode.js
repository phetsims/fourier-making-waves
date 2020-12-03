// Copyright 2020, University of Colorado Boulder

/**
 * HarmonicsEquationNode is the equation that appears above the 'Harmonics' chart in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import Domain from '../model/Domain.js';
import MathForm from '../model/MathForm.js';

// constants
const HIDDEN_STRING = ''; // string for MathForm.HIDDEN

// To improve readability of markup creation. Each of these is a string than may also include markup.
const A = FMWSymbols.CAPITAL_A;
const f = FMWSymbols.SMALL_F;
const k = FMWSymbols.SMALL_K;
const lambda = FMWSymbols.SMALL_LAMBDA;
const L = FMWSymbols.CAPITAL_L;
const MINUS = MathSymbols.MINUS;
const n = FMWSymbols.SMALL_N;
const omega = FMWSymbols.SMALL_OMEGA;
const PI = FMWSymbols.PI;
const t = FMWSymbols.SMALL_T;
const T = FMWSymbols.CAPITAL_T;
const x = FMWSymbols.SMALL_X;
const An = `${A}<sub>${n}</sub>`;

class HarmonicsEquationNode extends Node {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<MathForm>} mathFormProperty
   * @param {Object} [options]
   */
  constructor( domainProperty, mathFormProperty, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertEnumerationPropertyOf( mathFormProperty, MathForm );

    options = options || {};

    const richText = new RichText( HIDDEN_STRING );

    assert && assert( !options.children, 'HarmonicsEquationNode sets children' );
    options.children = [ richText ];

    super( options );

    // unmultilink is not needed.
    Property.multilink(
      [ domainProperty, mathFormProperty ],
      ( domain, mathForm ) => {
        richText.text = HarmonicsEquationNode.getRichTextMarkup( domain, mathForm );
      }
    );
  }

  /**
   * Gets the RichText markup for an equation, based on domain and math form.
   * @param {Domain} domain
   * @param {MathForm} mathForm
   * @returns {string}
   * @public
   */
  static getRichTextMarkup( domain, mathForm ) {

    assert && assert( Domain.includes( domain ), `invalid domain: ${domain}` );
    assert && assert( MathForm.includes( mathForm ), `invalid mathForm: ${mathForm}` );

    let markup;
    if ( domain === Domain.SPACE ) {
      markup = getSpaceMarkup( mathForm );
    }
    else if ( domain === Domain.TIME ) {
      markup = getTimeMarkup( mathForm );
    }
    else if ( domain === Domain.SPACE_AND_TIME ) {
      markup = getSpaceAndTimeMarkup( mathForm );
    }
    else {
      assert && assert( false, `unsupported domain: ${domain}` );
    }
    return markup;
  }
}

/**
 * Gets the RichText markup for an equation in the space domain.
 * @param {MathForm} mathForm
 * @returns {string}
 */
function getSpaceMarkup( mathForm ) {
  assert && assert( [ MathForm.HIDDEN, MathForm.WAVELENGTH, MathForm.WAVE_NUMBER, MathForm.MODE ].includes( mathForm ),
    `unsupported mathForm: ${mathForm}` );

  let markup;
  if ( mathForm === MathForm.HIDDEN ) {
    markup = HIDDEN_STRING;
  }
  else if ( mathForm === MathForm.WAVELENGTH ) {
    markup = `${An} sin( 2${PI}${x} / ${lambda}<sub>${n}</sub> )`;
  }
  else if ( mathForm === MathForm.WAVE_NUMBER ) {
    markup = `${An} sin( ${k}<sub>${n}</sub>${x} )`;
  }
  else if ( mathForm === MathForm.MODE ) {
    markup = `${An} sin( 2${PI}${n}${x} / ${L} )`;
  }
  else {
    assert && assert( false, `unsupported mathForm: ${mathForm}` );
  }
  return markup;
}

/**
 * Gets the RichText markup for an equation in the time domain.
 * @param {MathForm} mathForm
 * @returns {string}
 */
function getTimeMarkup( mathForm ) {
  assert && assert( [ MathForm.HIDDEN, MathForm.FREQUENCY, MathForm.PERIOD, MathForm.ANGULAR_FREQUENCY, MathForm.MODE ].includes( mathForm ),
    `unsupported mathForm: ${mathForm}` );

  let markup;
  if ( mathForm === MathForm.HIDDEN ) {
    markup = HIDDEN_STRING;
  }
  else if ( mathForm === MathForm.FREQUENCY ) {
    markup = `${An} sin( 2${PI}${f}<sub>${n}</sub>${t} )`;
  }
  else if ( mathForm === MathForm.PERIOD ) {
    markup = `${An} sin( 2${PI}${t} / ${T}<sub>${n}</sub> )`;
  }
  else if ( mathForm === MathForm.ANGULAR_FREQUENCY ) {
    markup = `${An} sin( ${omega}<sub>${n}</sub>${t} )`;
  }
  else if ( mathForm === MathForm.MODE ) {
    return `${An} sin( 2${PI}${n}${t} / ${T} )`;
  }
  else {
    assert && assert( false, `unsupported mathForm: ${mathForm}` );
  }
  return markup;
}

/**
 * Gets the RichText markup for an equation in the space & time domain.
 * @param {MathForm} mathForm
 * @returns {string}
 */
function getSpaceAndTimeMarkup( mathForm ) {
  assert && assert( [ MathForm.HIDDEN, MathForm.WAVELENGTH_AND_PERIOD, MathForm.WAVE_NUMBER_AND_ANGULAR_FREQUENCY, MathForm.MODE ].includes( mathForm ),
    `unsupported mathForm: ${mathForm}` );

  let markup;
  if ( mathForm === MathForm.HIDDEN ) {
    markup = HIDDEN_STRING;
  }
  else if ( mathForm === MathForm.WAVELENGTH_AND_PERIOD ) {
    markup = `${An} sin( 2${PI}( ${x}/${lambda}<sub>${n}</sub> ${MINUS} ${t}/${T}<sub>${n}</sub> ) )`;
  }
  else if ( mathForm === MathForm.WAVE_NUMBER_AND_ANGULAR_FREQUENCY ) {
    markup = `${An} sin( ${k}<sub>${n}</sub>${x} ${MINUS} ${omega}<sub>${n}</sub>${t} )`;
  }
  else if ( mathForm === MathForm.MODE ) {
    markup = `${An} sin( 2${PI}${n}( ${x}/${L} ${MINUS} ${t}/${T} ) )`;
  }
  else {
    assert && assert( false, `unsupported mathForm: ${mathForm}` );
  }
  return markup;
}


fourierMakingWaves.register( 'HarmonicsEquationNode', HarmonicsEquationNode );
export default HarmonicsEquationNode;