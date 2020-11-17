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
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import PresetFunction from '../model/PresetFunction.js';

class PresetFunctionComboBox extends ComboBox {

  /**
   * @param {EnumerationProperty.<PresetFunction>} presetFunctionProperty
   * @param {Node} popupParent
   * @param {Object} [options]
   */
  constructor( presetFunctionProperty, popupParent, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( presetFunctionProperty, PresetFunction );
    assert && assert( popupParent instanceof Node, 'invalid popupParent' );

    options = merge( {}, FMWConstants.COMBO_BOX_OPTIONS, options );

    const textOptions = {
      font: FMWConstants.CONTROL_FONT
    };

    const items = [
      new ComboBoxItem( new Text( fourierMakingWavesStrings.sineCosine, textOptions ), PresetFunction.SINE_COSINE ),
      new ComboBoxItem( new Text( fourierMakingWavesStrings.triangle, textOptions ), PresetFunction.TRIANGLE ),
      new ComboBoxItem( new Text( fourierMakingWavesStrings.square, textOptions ), PresetFunction.SQUARE ),
      new ComboBoxItem( new Text( fourierMakingWavesStrings.sawtooth, textOptions ), PresetFunction.SAWTOOTH ),
      new ComboBoxItem( new Text( fourierMakingWavesStrings.wavePacket, textOptions ), PresetFunction.WAVE_PACKET ),
      new ComboBoxItem( new Text( fourierMakingWavesStrings.custom, textOptions ), PresetFunction.CUSTOM )
    ];

    super( items, presetFunctionProperty, popupParent, options );
  }
}

fourierMakingWaves.register( 'PresetFunctionComboBox', PresetFunctionComboBox );
export default PresetFunctionComboBox;