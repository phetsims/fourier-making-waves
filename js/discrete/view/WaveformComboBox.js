// Copyright 2020-2021, University of Colorado Boulder

/**
 * WaveformComboBox is the combo box for choosing a pre-defined waveform in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import { Node } from '../../../../scenery/js/imports.js';
import FMWComboBox from '../../common/view/FMWComboBox.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import Waveform from '../model/Waveform.js';

// This format is specific to FMWComboBox.
const CHOICES = [
  { value: Waveform.SINUSOID, string: fourierMakingWavesStrings.sinusoid, tandemName: 'sinusoidItem' },
  { value: Waveform.TRIANGLE, string: fourierMakingWavesStrings.triangle, tandemName: 'triangleItem' },
  { value: Waveform.SQUARE, string: fourierMakingWavesStrings.square, tandemName: 'squareItem' },
  { value: Waveform.SAWTOOTH, string: fourierMakingWavesStrings.sawtooth, tandemName: 'sawtoothItem' },
  { value: Waveform.WAVE_PACKET, string: fourierMakingWavesStrings.wavePacket, tandemName: 'wavePacketItem' },
  { value: Waveform.CUSTOM, string: fourierMakingWavesStrings.custom, tandemName: 'customItem' }
];

class WaveformComboBox extends FMWComboBox {

  /**
   * @param {Property.<Waveform>} waveformProperty
   * @param {Node} popupParent
   * @param {Object} [options]
   */
  constructor( waveformProperty, popupParent, options ) {

    assert && AssertUtils.assertPropertyOf( waveformProperty, Waveform );
    assert && assert( popupParent instanceof Node );

    options = merge( {

      // FMWComboBox options
      textOptions: {
        maxWidth: 100 // determined empirically
      }
    }, options );

    super( waveformProperty, CHOICES, popupParent, options );
  }
}

fourierMakingWaves.register( 'WaveformComboBox', WaveformComboBox );
export default WaveformComboBox;