// Copyright 2021-2023, University of Colorado Boulder

/**
 * WaveformEnvelopeCheckbox is the checkbox that is used to show the waveform envelope.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import SecondaryWaveformCheckbox from '../../common/view/SecondaryWaveformCheckbox.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class WaveformEnvelopeCheckbox extends SecondaryWaveformCheckbox {

  public constructor( waveformEnvelopeVisibleProperty: Property<boolean>, tandem: Tandem ) {
    super( waveformEnvelopeVisibleProperty, FourierMakingWavesStrings.waveformEnvelopeStringProperty, tandem );
  }
}

fourierMakingWaves.register( 'WaveformEnvelopeCheckbox', WaveformEnvelopeCheckbox );