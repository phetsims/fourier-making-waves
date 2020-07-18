// Copyright 2020, University of Colorado Boulder

/**
 * PresetFunctionComboBox is the combo box for choosing a preset function in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../sun/js/ComboBoxItem.js';
import FourierMakingWavesConstants from '../../common/FourierMakingWavesConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import MathForm from '../model/MathForm.js';

class MathFormComboBox extends ComboBox {

  /**
   * @param {EnumerationProperty.<MathForm>} mathFormProperty
   * @param {Node} popupParent
   * @param {Object} [options]
   */
  constructor( mathFormProperty, popupParent, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( mathFormProperty, MathForm );
    assert && assert( popupParent instanceof Node, 'invalid popupParent' );

    options = merge( {}, FourierMakingWavesConstants.COMBOX_BOX_OPTIONS, options );

    const textOptions = {
      font: FourierMakingWavesConstants.CONTROL_FONT
    };

    const items = [
      new ComboBoxItem( new Text( fourierMakingWavesStrings.hidden, textOptions ), MathForm.HIDDEN ),
      new ComboBoxItem( new Text( fourierMakingWavesStrings.wavelengthLambda, textOptions ), MathForm.WAVELENGTH ),
      new ComboBoxItem( new Text( fourierMakingWavesStrings.waveNumberK, textOptions ), MathForm.WAVE_NUMBER ),
      new ComboBoxItem( new Text( fourierMakingWavesStrings.modeN, textOptions ), MathForm.MODE )
    ];

    super( items, mathFormProperty, popupParent, options );
  }
}

fourierMakingWaves.register( 'MathFormComboBox', MathFormComboBox );
export default MathFormComboBox;