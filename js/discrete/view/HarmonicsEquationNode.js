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
        richText.text = getRichTextMarkup( domain, mathForm );
      }
    );
  }
}

/**
 * Gets the RichText markup for an equation, based on domain and math form.
 * @param {Domain} domain
 * @param {MathForm} mathForm
 * @returns {string}
 */
function getRichTextMarkup( domain, mathForm ) {

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

    // An sin( 2pix / ln)
    markup = `${FMWSymbols.CAPITAL_A}<sub>${FMWSymbols.SMALL_N}</sub> ` +
             `sin( 2${FMWSymbols.PI}${FMWSymbols.SMALL_X} / ` +
             `${FMWSymbols.SMALL_LAMBDA}<sub>${FMWSymbols.SMALL_N}</sub> )`;
  }
  else if ( mathForm === MathForm.WAVE_NUMBER ) {

    // An sin( knx)
    markup = `${FMWSymbols.CAPITAL_A}<sub>${FMWSymbols.SMALL_N}</sub> ` +
             `sin( ${FMWSymbols.SMALL_K}<sub>${FMWSymbols.SMALL_N}</sub>${FMWSymbols.SMALL_X} )`;
  }
  else if ( mathForm === MathForm.MODE ) {

    // An sin( 2pinx / L )
    markup = `${FMWSymbols.CAPITAL_A}<sub>${FMWSymbols.SMALL_N}</sub> ` +
             `sin( 2${FMWSymbols.PI}${FMWSymbols.SMALL_N}${FMWSymbols.SMALL_X} / ${FMWSymbols.CAPITAL_L} )`;
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
    markup = `${FMWSymbols.CAPITAL_A}<sub>${FMWSymbols.SMALL_N}</sub> ` +
             `sin( 2${FMWSymbols.PI}${FMWSymbols.SMALL_F}<sub>${FMWSymbols.SMALL_N}</sub>${FMWSymbols.SMALL_T} )`;
  }
  else if ( mathForm === MathForm.PERIOD ) {
    markup = `${FMWSymbols.CAPITAL_A}<sub>${FMWSymbols.SMALL_N}</sub> ` +
             `sin( 2${FMWSymbols.PI}${FMWSymbols.SMALL_T} / ${FMWSymbols.CAPITAL_T}<sub>${FMWSymbols.SMALL_N}</sub> )`;
  }
  else if ( mathForm === MathForm.ANGULAR_FREQUENCY ) {
    markup = `${FMWSymbols.CAPITAL_A}<sub>${FMWSymbols.SMALL_N}</sub> ` +
             `sin( ${FMWSymbols.SMALL_OMEGA}<sub>${FMWSymbols.SMALL_N}</sub>${FMWSymbols.SMALL_T} )`;
  }
  else if ( mathForm === MathForm.MODE ) {
    return '?'; //TODO
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
    markup = `${FMWSymbols.CAPITAL_A}<sub>${FMWSymbols.SMALL_N}</sub> ` +
             `sin( 2${FMWSymbols.PI}( ${FMWSymbols.SMALL_X}/${FMWSymbols.SMALL_LAMBDA}<sub>${FMWSymbols.SMALL_N}</sub> ` +
             `${MathSymbols.MINUS} ${FMWSymbols.SMALL_T}/${FMWSymbols.CAPITAL_T}<sub>${FMWSymbols.SMALL_N}</sub> ) )`;
  }
  else if ( mathForm === MathForm.WAVE_NUMBER_AND_ANGULAR_FREQUENCY ) {
    markup = `${FMWSymbols.CAPITAL_A}<sub>${FMWSymbols.SMALL_N}</sub> ` +
           `sin( ${FMWSymbols.SMALL_K}<sub>${FMWSymbols.SMALL_N}</sub>${FMWSymbols.SMALL_X} ` +
           `${MathSymbols.MINUS} ${FMWSymbols.SMALL_OMEGA}<sub>${FMWSymbols.SMALL_N}</sub>${FMWSymbols.SMALL_T} )`;
  }
  else if ( mathForm === MathForm.MODE ) {
    markup = `${FMWSymbols.CAPITAL_A}<sub>${FMWSymbols.SMALL_N}</sub> ` +
             `sin( 2${FMWSymbols.PI}${FMWSymbols.SMALL_N}( ` +
             `${FMWSymbols.SMALL_X}/${FMWSymbols.CAPITAL_L} ${MathSymbols.MINUS} ${FMWSymbols.SMALL_T}/${FMWSymbols.CAPITAL_T} ) )`;
  }
  else {
    assert && assert( false, `unsupported mathForm: ${mathForm}` );
  }
  return markup;
}


fourierMakingWaves.register( 'HarmonicsEquationNode', HarmonicsEquationNode );
export default HarmonicsEquationNode;