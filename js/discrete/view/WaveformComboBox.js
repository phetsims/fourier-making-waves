// Copyright 2020-2021, University of Colorado Boulder

/**
 * WaveformComboBox is the combo box for choosing a pre-defined waveform in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import Waveform from '../model/Waveform.js';
import FMWComboBox from '../../common/view/FMWComboBox.js';

class WaveformComboBox extends FMWComboBox {

  /**
   * @param {EnumerationProperty.<Waveform>} waveformProperty
   * @param {Node} popupParent
   * @param {Object} [options]
   */
  constructor( waveformProperty, popupParent, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( waveformProperty, Waveform );
    assert && assert( popupParent instanceof Node );

    options = merge( {

      // FMWComboBox options
      textOptions: {
        maxWidth: 100 // determined empirically
      }
    }, options );

    // {{value:*, string:string}[]} This format is specific to FMWComboBox.
    const choices = [
      { value: Waveform.SINUSOID, string: fourierMakingWavesStrings.sinusoid },
      { value: Waveform.TRIANGLE, string: fourierMakingWavesStrings.triangle },
      { value: Waveform.SQUARE, string: fourierMakingWavesStrings.square },
      { value: Waveform.SAWTOOTH, string: fourierMakingWavesStrings.sawtooth },
      { value: Waveform.WAVE_PACKET, string: fourierMakingWavesStrings.wavePacket },
      { value: Waveform.CUSTOM, string: fourierMakingWavesStrings.custom }
    ];

    super( choices, waveformProperty, popupParent, options );
  }
}

fourierMakingWaves.register( 'WaveformComboBox', WaveformComboBox );
export default WaveformComboBox;