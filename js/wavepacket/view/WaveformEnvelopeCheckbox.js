// Copyright 2021-2023, University of Colorado Boulder

/**
 * WaveformEnvelopeCheckbox is the checkbox that is used to show the waveform envelope.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import SecondaryWaveformCheckbox from '../../common/view/SecondaryWaveformCheckbox.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';

export default class WaveformEnvelopeCheckbox extends SecondaryWaveformCheckbox {

  /**
   * @param {Property.<boolean>} waveformEnvelopeVisibleProperty
   * @param {Object} [options]
   */
  constructor( waveformEnvelopeVisibleProperty, options ) {
    super( waveformEnvelopeVisibleProperty, FourierMakingWavesStrings.waveformEnvelopeStringProperty, options );
  }
}

fourierMakingWaves.register( 'WaveformEnvelopeCheckbox', WaveformEnvelopeCheckbox );