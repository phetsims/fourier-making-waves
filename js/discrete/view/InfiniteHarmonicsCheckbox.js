// Copyright 2020-2023, University of Colorado Boulder

/**
 * InfiniteHarmonicsCheckbox is the 'Infinite Harmonics' checkbox associated with the Sum chart on the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import SecondaryWaveformCheckbox from '../../common/view/SecondaryWaveformCheckbox.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';

export default class InfiniteHarmonicsCheckbox extends SecondaryWaveformCheckbox {

  /**
   * @param {Property.<boolean>} infiniteHarmonicsVisibleProperty
   * @param {Object} [options]
   */
  constructor( infiniteHarmonicsVisibleProperty, options ) {
    super( infiniteHarmonicsVisibleProperty, FourierMakingWavesStrings.infiniteHarmonicsStringProperty, options );
  }
}

fourierMakingWaves.register( 'InfiniteHarmonicsCheckbox', InfiniteHarmonicsCheckbox );