// Copyright 2020, University of Colorado Boulder

/**
 * MathFormLayoutBox is the 'Math Form' section of the control panel in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import FourierMakingWavesConstants from '../../common/FourierMakingWavesConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import MathForm from '../model/MathForm.js';
import MathFormComboBox from './MathFormComboBox.js';

class MathFormLayoutBox extends VBox {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {EnumerationProperty.<>} mathFormProperty
   * @param {Property.<boolean>} mathFormExpandedSumProperty
   * @param {Node} popupParent
   * @param {Object} [options]
   */
  constructor( fourierSeries, mathFormProperty, mathFormExpandedSumProperty, popupParent, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( mathFormProperty, MathForm );
    assert && assert( popupParent instanceof Node, 'invalid popupParent' );

    options = merge( {}, FourierMakingWavesConstants.VBOX_OPTIONS, options );

    const titleText = new Text( fourierMakingWavesStrings.mathForm, {
      font: FourierMakingWavesConstants.TITLE_FONT
    } );

    // Math Form combo box
    const mathFormComboBox = new MathFormComboBox( mathFormProperty, popupParent );

    // Expand Sum checkbox
    const expandSumText = new Text( fourierMakingWavesStrings.expandSum, {
      font: FourierMakingWavesConstants.CONTROL_FONT
    } );
    const expandSumCheckbox = new Checkbox( expandSumText, mathFormExpandedSumProperty, FourierMakingWavesConstants.CHECKBOX_OPTIONS );

    const sumNode = new RichText( '', {
      font: FourierMakingWavesConstants.CONTROL_FONT,
      maxWidth: 200 // determined empirically
    } );

    assert && assert( !options.children, 'MeasurementToolsLayoutBox sets children' );
    options.children = [ titleText, mathFormComboBox, expandSumCheckbox, sumNode ];

    super( options );

    // unlink is not necessary
    mathFormProperty.link( mathForm => {
      expandSumCheckbox.enabled = ( mathForm !== MathForm.HIDDEN );
    } );

    // unmultilink is not necessary
    const dependencies = [ mathFormProperty, fourierSeries.numberOfHarmonicsProperty ];
    fourierSeries.harmonics.forEach( harmonic => dependencies.push( harmonic.amplitudeProperty ) );
    Property.multilink(
      dependencies,
      () => {
        sumNode.text = getExpandedSum( mathFormProperty.value, fourierSeries );
      } );

    // unmultilink is not necessary
    Property.multilink(
      [ mathFormProperty, mathFormExpandedSumProperty ],
      ( mathForm, mathFormExpandedSum ) => {
        sumNode.visible = ( ( mathForm !== MathForm.HIDDEN ) && mathFormExpandedSum );
      } );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

function getExpandedSum( mathForm, fourierSeries ) {
  let sumText = '';
  if ( mathForm !== MathForm.HIDDEN ) {

    const numberOfHarmonics = fourierSeries.numberOfHarmonicsProperty.value;

    sumText = `${FMWSymbols.CAPITAL_F}(${FMWSymbols.SMALL_X}) ${MathSymbols.EQUAL_TO} `;
    for ( let i = 0; i < numberOfHarmonics; i++ ) {

      if ( i > 0 && i < numberOfHarmonics ) {
        sumText = sumText + ' ' + MathSymbols.PLUS;
      }

      if ( ( i + 1 ) % 2 === 0 ) {
        sumText += '<br>';
      }
      else {
        sumText += ' ';
      }

      const harmonic = fourierSeries.harmonics[ i ];
      const amplitude = Utils.toFixedNumber( harmonic.amplitudeProperty.value, FourierMakingWavesConstants.AMPLITUDE_DECIMAL_PLACES );
      const sineTerm = getSineTerm( mathForm, harmonic.order );
      sumText += `${amplitude} sin( ${sineTerm} )`;
    }
  }
  return sumText;
}

function getSineTerm( mathForm, order ) {
  if ( mathForm === MathForm.WAVELENGTH ) {
    return `2${FMWSymbols.PI}${FMWSymbols.SMALL_X} / ${FMWSymbols.SMALL_LAMBDA}<sub>${order}</sub>`;
  }
  else   if ( mathForm === MathForm.WAVE_NUMBER ) {
    return `${FMWSymbols.SMALL_K}<sub>${order}</sub>${FMWSymbols.SMALL_X}`;
  }
  else if ( mathForm === MathForm.MODE ) {
    return `2${FMWSymbols.PI}${order}${FMWSymbols.SMALL_X} / ${FMWSymbols.CAPITAL_L}`;
  }
  else {
    throw new Error( `unsupported mathForm: ${mathForm}` );
  }
}

fourierMakingWaves.register( 'MathFormLayoutBox', MathFormLayoutBox );
export default MathFormLayoutBox;