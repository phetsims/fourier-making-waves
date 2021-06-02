// Copyright 2021, University of Colorado Boulder

/**
 * EnvelopeCheckbox is the checkbox that is used to show the waveform envelope. It's label is specific to the domain.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import FMWConstants from '../../common/FMWConstants.js';
import Domain from '../../common/model/Domain.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';

class EnvelopeCheckbox extends Checkbox {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Property.<boolean>} envelopeVisibleProperty
   * @param {Object} [options]
   */
  constructor( domainProperty, envelopeVisibleProperty, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertPropertyOf( envelopeVisibleProperty, 'boolean' );

    options = merge( {}, FMWConstants.CHECKBOX_OPTIONS, options );

    const textOptions = {
      font: FMWConstants.CONTROL_FONT
    };
    const xSpaceEnvelopeText = new Text( fourierMakingWavesStrings.xSpaceEnvelope, textOptions );
    const tSpaceEnvelopeText = new Text( fourierMakingWavesStrings.tSpaceEnvelope, textOptions );

    const content = new ToggleNode( domainProperty, [
      { value: Domain.SPACE, node: xSpaceEnvelopeText },
      { value: Domain.TIME, node: tSpaceEnvelopeText }
    ] );

    super( content, envelopeVisibleProperty, options );
  }
}

fourierMakingWaves.register( 'EnvelopeCheckbox', EnvelopeCheckbox );
export default EnvelopeCheckbox;