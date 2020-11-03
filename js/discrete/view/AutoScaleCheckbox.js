// Copyright 2020, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import FourierMakingWavesConstants from '../../common/FourierMakingWavesConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';

class AutoScaleCheckbox extends Checkbox {

  /**
   * @param {Property.<boolean>} autoScaleProperty
   * @param {Object} [options]
   */
  constructor( autoScaleProperty, options ) {

    options = merge( {}, FourierMakingWavesConstants.CHECKBOX_OPTIONS, options );

    const labelNode = new Text( fourierMakingWavesStrings.autoScale, {
      font: FourierMakingWavesConstants.CONTROL_FONT,
      maxWidth: 200 // determined empirically
    } );

    super( labelNode, autoScaleProperty, options );
  }
}

fourierMakingWaves.register( 'AutoScaleCheckbox', AutoScaleCheckbox );
export default AutoScaleCheckbox;