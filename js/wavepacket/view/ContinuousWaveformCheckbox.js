// Copyright 2021-2022, University of Colorado Boulder

/**
 * ContinuousWaveformCheckbox is the checkbox that is used to show the wave packet's waveform.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import SecondaryWaveformCheckbox from '../../common/view/SecondaryWaveformCheckbox.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';

class ContinuousWaveformCheckbox extends SecondaryWaveformCheckbox {

  /**
   * @param {Property.<boolean>} continuousWaveformVisibleProperty
   * @param {Object} [options]
   */
  constructor( continuousWaveformVisibleProperty, options ) {
    super( continuousWaveformVisibleProperty, fourierMakingWavesStrings.continuousWaveform, options );
  }
}

fourierMakingWaves.register( 'ContinuousWaveformCheckbox', ContinuousWaveformCheckbox );
export default ContinuousWaveformCheckbox;