// Copyright 2021, University of Colorado Boulder

/**
 * WaveformEnvelopeCheckbox is the checkbox that is used to show the waveform envelope.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';

class WaveformEnvelopeCheckbox extends Checkbox {

  /**
   * @param {Property.<boolean>} waveformEnvelopeVisibleProperty
   * @param {Object} [options]
   */
  constructor( waveformEnvelopeVisibleProperty, options ) {

    assert && AssertUtils.assertPropertyOf( waveformEnvelopeVisibleProperty, 'boolean' );

    options = merge( {}, FMWConstants.CHECKBOX_OPTIONS, options );

    const envelopeText = new Text( fourierMakingWavesStrings.waveformEnvelope, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 200
    } );

    super( envelopeText, waveformEnvelopeVisibleProperty, options );
  }
}

fourierMakingWaves.register( 'WaveformEnvelopeCheckbox', WaveformEnvelopeCheckbox );
export default WaveformEnvelopeCheckbox;