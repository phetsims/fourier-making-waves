// Copyright 2020, University of Colorado Boulder

/**
 * PresetFunctionLayoutBox is the 'Preset Function' section of the control panel in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import NumberPicker from '../../../../scenery-phet/js/NumberPicker.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import FourierMakingWavesConstants from '../../common/FourierMakingWavesConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import PresetFunction from '../model/PresetFunction.js';
import PresetFunctionComboBox from './PresetFunctionComboBox.js';

class PresetFunctionLayoutBox extends VBox {

  /**
   * @param {EnumerationProperty.<PresetFunction>} presetFunctionProperty
   * @param {NumberProperty} numberOfHarmonicsProperty
   * @param {Node} popupParent
   * @param {Object} [options]
   */
  constructor( presetFunctionProperty, numberOfHarmonicsProperty, popupParent, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( presetFunctionProperty, PresetFunction );
    assert && assert( numberOfHarmonicsProperty instanceof NumberProperty, 'invalid numberOfHarmonicsProperty' );
    assert && assert( popupParent instanceof Node, 'invalid popupParent' );

    options = merge( {}, FourierMakingWavesConstants.VBOX_OPTIONS, options );

    // Preset Function
    const titleText = new Text( fourierMakingWavesStrings.presetFunction, {
      font: FourierMakingWavesConstants.TITLE_FONT
    } );

    const presetFunctionComboBox = new PresetFunctionComboBox( presetFunctionProperty, popupParent );

    const harmonicsPicker = new NumberPicker( numberOfHarmonicsProperty, numberOfHarmonicsProperty.rangeProperty, {
      font: FourierMakingWavesConstants.CONTROL_FONT,
      cornerRadius: 3,
      color: 'black'
    } );

    const harmonicsText = new Text( fourierMakingWavesStrings.harmonics, {
      font: FourierMakingWavesConstants.CONTROL_FONT
    } );

    const harmonicsBox = new HBox( {
      spacing: 8,
      children: [ harmonicsPicker, harmonicsText ]
    } );

    assert && assert( !options.children, 'PresetFunctionLayoutBox sets children' );
    options.children = [ titleText, presetFunctionComboBox, harmonicsBox ];

    super( options );
  }
}

fourierMakingWaves.register( 'PresetFunctionLayoutBox', PresetFunctionLayoutBox );
export default PresetFunctionLayoutBox;