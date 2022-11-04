// Copyright 2020-2022, University of Colorado Boulder

/**
 * WaveformComboBox is the combo box for choosing a pre-defined waveform in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import { Node } from '../../../../scenery/js/imports.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import FMWComboBox from '../../common/view/FMWComboBox.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';
import Waveform from '../model/Waveform.js';

// This format is specific to FMWComboBox.
const CHOICES = [
  {
    value: Waveform.SINUSOID,
    stringProperty: FourierMakingWavesStrings.sinusoidStringProperty,
    tandemName: `sinusoid${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
  },
  {
    value: Waveform.TRIANGLE,
    stringProperty: FourierMakingWavesStrings.triangleStringProperty,
    tandemName: `triangle${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
  },
  {
    value: Waveform.SQUARE,
    stringProperty: FourierMakingWavesStrings.squareStringProperty,
    tandemName: `square${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
  },
  {
    value: Waveform.SAWTOOTH,
    stringProperty: FourierMakingWavesStrings.sawtoothStringProperty,
    tandemName: `sawtooth${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
  },
  {
    value: Waveform.WAVE_PACKET,
    stringProperty: FourierMakingWavesStrings.wavePacketStringProperty,
    tandemName: `wavePacket${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
  },
  {
    value: Waveform.CUSTOM,
    stringProperty: FourierMakingWavesStrings.customStringProperty,
    tandemName: `custom${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
  }
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