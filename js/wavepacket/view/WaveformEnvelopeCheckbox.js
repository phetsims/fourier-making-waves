// Copyright 2021, University of Colorado Boulder

/**
 * WaveformEnvelopeCheckbox is the checkbox that is used to show the waveform envelope.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWCheckbox from '../../common/view/FMWCheckbox.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';

class WaveformEnvelopeCheckbox extends FMWCheckbox {

  /**
   * @param {Property.<boolean>} waveformEnvelopeVisibleProperty
   * @param {Object} [options]
   */
  constructor( waveformEnvelopeVisibleProperty, options ) {

    assert && AssertUtils.assertPropertyOf( waveformEnvelopeVisibleProperty, 'boolean' );

    options = merge( {
      tandem: Tandem.REQUIRED
    }, options );

    const waveformEnvelopeText = new Text( fourierMakingWavesStrings.waveformEnvelope, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 200,
      tandem: options.tandem.createTandem( 'waveformEnvelopeText' )
    } );

    super( waveformEnvelopeText, waveformEnvelopeVisibleProperty, options );
  }
}

fourierMakingWaves.register( 'WaveformEnvelopeCheckbox', WaveformEnvelopeCheckbox );
export default WaveformEnvelopeCheckbox;