// Copyright 2021, University of Colorado Boulder

/**
 * WaveformEnvelopeCheckbox is the checkbox that is used to show the waveform envelope.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import SecondaryWaveformCheckbox from '../../common/view/SecondaryWaveformCheckbox.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';

class WaveformEnvelopeCheckbox extends SecondaryWaveformCheckbox {

  /**
   * @param {Property.<boolean>} waveformEnvelopeVisibleProperty
   * @param {Object} [options]
   */
  constructor( waveformEnvelopeVisibleProperty, options ) {
    super( fourierMakingWavesStrings.waveformEnvelope, waveformEnvelopeVisibleProperty, options );
  }
}

fourierMakingWaves.register( 'WaveformEnvelopeCheckbox', WaveformEnvelopeCheckbox );
export default WaveformEnvelopeCheckbox;