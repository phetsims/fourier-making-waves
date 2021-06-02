// Copyright 2021, University of Colorado Boulder

/**
 * EnvelopeCheckbox is the checkbox that is used to show the waveform envelope.
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

class EnvelopeCheckbox extends Checkbox {

  /**
   * @param {Property.<boolean>} envelopeVisibleProperty
   * @param {Object} [options]
   */
  constructor( envelopeVisibleProperty, options ) {

    assert && AssertUtils.assertPropertyOf( envelopeVisibleProperty, 'boolean' );

    options = merge( {}, FMWConstants.CHECKBOX_OPTIONS, options );

    const envelopeText = new Text( fourierMakingWavesStrings.envelope, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 200
    } );

    super( envelopeText, envelopeVisibleProperty, options );
  }
}

fourierMakingWaves.register( 'EnvelopeCheckbox', EnvelopeCheckbox );
export default EnvelopeCheckbox;