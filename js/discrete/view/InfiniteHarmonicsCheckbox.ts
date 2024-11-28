// Copyright 2020-2024, University of Colorado Boulder

/**
 * InfiniteHarmonicsCheckbox is the 'Infinite Harmonics' checkbox associated with the Sum chart on the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import SecondaryWaveformCheckbox from '../../common/view/SecondaryWaveformCheckbox.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';

export default class InfiniteHarmonicsCheckbox extends SecondaryWaveformCheckbox {

  public constructor( infiniteHarmonicsVisibleProperty: Property<boolean>, tandem: Tandem ) {
    super( infiniteHarmonicsVisibleProperty, FourierMakingWavesStrings.infiniteHarmonicsStringProperty, tandem );
  }
}

fourierMakingWaves.register( 'InfiniteHarmonicsCheckbox', InfiniteHarmonicsCheckbox );