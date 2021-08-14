// Copyright 2020-2021, University of Colorado Boulder

/**
 * InfiniteHarmonicsCheckbox is the 'Infinite Harmonics' checkbox associated with the Sum chart on the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import SecondaryWaveformCheckbox from '../../common/view/SecondaryWaveformCheckbox.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';

class InfiniteHarmonicsCheckbox extends SecondaryWaveformCheckbox {

  /**
   * @param {Property.<boolean>} infiniteHarmonicsVisibleProperty
   * @param {Object} [options]
   */
  constructor( infiniteHarmonicsVisibleProperty, options ) {
    super( fourierMakingWavesStrings.infiniteHarmonics, infiniteHarmonicsVisibleProperty, options );
  }
}

fourierMakingWaves.register( 'InfiniteHarmonicsCheckbox', InfiniteHarmonicsCheckbox );
export default InfiniteHarmonicsCheckbox;