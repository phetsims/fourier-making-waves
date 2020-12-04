// Copyright 2020, University of Colorado Boulder

/**
 * PresetFunctionComboBox is the combo box for choosing a preset function in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import PresetFunction from '../model/PresetFunction.js';
import FMWComboBox from './FMWComboBox.js';

class PresetFunctionComboBox extends FMWComboBox {

  /**
   * @param {EnumerationProperty.<PresetFunction>} presetFunctionProperty
   * @param {Node} popupParent
   * @param {Object} [options]
   */
  constructor( presetFunctionProperty, popupParent, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( presetFunctionProperty, PresetFunction );
    assert && assert( popupParent instanceof Node, 'invalid popupParent' );

    options = merge( {
      textOptions: {
        maxWidth: 120 // determined empirically
      }
    }, options );

    // {{string:string, value:PresetFunction}[]}
    const choices = [
      { value: PresetFunction.SINE_COSINE, string: fourierMakingWavesStrings.sineCosine },
      { value: PresetFunction.TRIANGLE, string: fourierMakingWavesStrings.triangle },
      { value: PresetFunction.SQUARE, string: fourierMakingWavesStrings.square },
      { value: PresetFunction.SAWTOOTH, string: fourierMakingWavesStrings.sawtooth },
      { value: PresetFunction.WAVE_PACKET, string: fourierMakingWavesStrings.wavePacket },
      { value: PresetFunction.CUSTOM, string: fourierMakingWavesStrings.custom }
    ];

    super( choices, presetFunctionProperty, popupParent, options );
  }
}

fourierMakingWaves.register( 'PresetFunctionComboBox', PresetFunctionComboBox );
export default PresetFunctionComboBox;