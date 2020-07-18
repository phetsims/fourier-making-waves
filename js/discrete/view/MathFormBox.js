// Copyright 2020, University of Colorado Boulder

/**
 * MathFormBox is the 'Math Form' section of the control panel in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import FourierMakingWavesConstants from '../../common/FourierMakingWavesConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import MathForm from '../model/MathForm.js';
import MathFormComboBox from './MathFormComboBox.js';

class MathFormBox extends VBox {

  /**
   * @param {EnumerationProperty.<>} mathFormProperty
   * @param {Node} popupParent
   * @param {Object} [options]
   */
  constructor( mathFormProperty, popupParent, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( mathFormProperty, MathForm );
    assert && assert( popupParent instanceof Node, 'invalid popupParent' );

    options = merge( {}, FourierMakingWavesConstants.VBOX_OPTIONS, options );

    // Math Form
    const titleNode = new Text( fourierMakingWavesStrings.mathForm, {
      font: FourierMakingWavesConstants.TITLE_FONT
    } );

    const mathFormComboBox = new MathFormComboBox( mathFormProperty, popupParent );

    assert && assert( !options.children, 'MeasurementToolsBox sets children' );
    options.children = [ titleNode, mathFormComboBox ];

    super( options );
  }
}

fourierMakingWaves.register( 'MathFormBox', MathFormBox );
export default MathFormBox;