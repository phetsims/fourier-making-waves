// Copyright 2020, University of Colorado Boulder

/**
 * MathFormBox is the 'Math Form' section of the control panel in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import FourierMakingWavesConstants from '../../common/FourierMakingWavesConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import MathForm from '../model/MathForm.js';
import MathFormComboBox from './MathFormComboBox.js';

// constants
const EXPANDED_SUM_TERM = '{{amplitude}} sin(2\u03c0{{harmonic}}x / L )';

class MathFormBox extends VBox {

  /**
   * @param {EnumerationProperty.<>} mathFormProperty
   * @param {Property.<boolean>} sumExpandedProperty
   * @param {Node} popupParent
   * @param {Object} [options]
   */
  constructor( mathFormProperty, sumExpandedProperty, popupParent, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( mathFormProperty, MathForm );
    assert && assert( popupParent instanceof Node, 'invalid popupParent' );

    options = merge( {}, FourierMakingWavesConstants.VBOX_OPTIONS, options );

    // Math Form
    const titleText = new Text( fourierMakingWavesStrings.mathForm, {
      font: FourierMakingWavesConstants.TITLE_FONT
    } );

    const mathFormComboBox = new MathFormComboBox( mathFormProperty, popupParent );

    const expandSumText = new Text( fourierMakingWavesStrings.expandSum, {
      font: FourierMakingWavesConstants.CONTROL_FONT
    } );
    const expandSumCheckbox = new Checkbox( expandSumText, sumExpandedProperty, FourierMakingWavesConstants.CHECKBOX_OPTIONS );

    const sumNode = new RichText( '', {
      font: FourierMakingWavesConstants.CONTROL_FONT,
      maxWidth: 200 // determined empirically
    } );

    assert && assert( !options.children, 'MeasurementToolsBox sets children' );
    options.children = [ titleText, mathFormComboBox, expandSumCheckbox, sumNode ];

    super( options );

    // unlink is not necessary
    sumExpandedProperty.link( sumExpanded => {
      sumNode.visible = sumExpanded;
    } );

    //TODO update sumNode as amplitudes of harmonics change
    let sumText = `F(x) ${MathSymbols.EQUAL_TO} `;
    const maxHarmonics = FourierMakingWavesConstants.NUMBER_OF_HARMONICS_RANGE.max;
    for ( let i = 0; i < maxHarmonics; i++ ) {
      if ( i > 0 && i < maxHarmonics ) {
        sumText = sumText + ' ' + MathSymbols.PLUS;
      }
      if ( ( i + 1 ) % 2 === 0 ) {
        sumText += '<br>';
      }
      sumText += StringUtils.fillIn( EXPANDED_SUM_TERM, {
        amplitude: 0, //TODO
        harmonic: i + 1
      } );
    }
    sumNode.text = sumText;
  }
}

fourierMakingWaves.register( 'MathFormBox', MathFormBox );
export default MathFormBox;