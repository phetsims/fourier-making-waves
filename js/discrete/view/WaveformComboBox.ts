// Copyright 2020-2023, University of Colorado Boulder

/**
 * WaveformComboBox is the combo box for choosing a pre-defined waveform in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Node } from '../../../../scenery/js/imports.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import FMWComboBox, { FMWComboBoxChoice } from '../../common/view/FMWComboBox.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';
import Waveform from '../model/Waveform.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';

// This format is specific to FMWComboBox.
const CHOICES: FMWComboBoxChoice<Waveform>[] = [
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

export default class WaveformComboBox extends FMWComboBox<Waveform> {

  public constructor( waveformProperty: Property<Waveform>, popupParent: Node, tandem: Tandem ) {
    super( waveformProperty, CHOICES, popupParent, {
      textOptions: {
        maxWidth: 100 // determined empirically
      },
      tandem: tandem
    } );
  }
}

fourierMakingWaves.register( 'WaveformComboBox', WaveformComboBox );