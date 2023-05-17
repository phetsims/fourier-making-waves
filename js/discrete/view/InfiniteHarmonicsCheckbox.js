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

  constructor( infiniteHarmonicsVisibleProperty, tandem ) {
    super( infiniteHarmonicsVisibleProperty, FourierMakingWavesStrings.infiniteHarmonicsStringProperty, tandem );
  }
}

fourierMakingWaves.register( 'InfiniteHarmonicsCheckbox', InfiniteHarmonicsCheckbox );