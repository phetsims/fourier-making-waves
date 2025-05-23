// Copyright 2021-2024, University of Colorado Boulder

/**
 * ContinuousWaveformCheckbox is the checkbox that is used to show the wave packet's waveform.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import SecondaryWaveformCheckbox from '../../common/view/SecondaryWaveformCheckbox.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';

export default class ContinuousWaveformCheckbox extends SecondaryWaveformCheckbox {

  public constructor( continuousWaveformVisibleProperty: Property<boolean>, tandem: Tandem ) {
    super( continuousWaveformVisibleProperty, FourierMakingWavesStrings.continuousWaveformStringProperty, tandem );
  }
}

fourierMakingWaves.register( 'ContinuousWaveformCheckbox', ContinuousWaveformCheckbox );