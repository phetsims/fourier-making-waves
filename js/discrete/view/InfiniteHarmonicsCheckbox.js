// Copyright 2020, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';

class InfiniteHarmonicsCheckbox extends Checkbox {

  /**
   * @param {Property.<boolean>} infiniteHarmonicsProperty
   * @param {Object} [options]
   */
  constructor( infiniteHarmonicsProperty, options ) {

    options = merge( {}, FMWConstants.CHECKBOX_OPTIONS, options );

    const labelNode = new Text( fourierMakingWavesStrings.infiniteHarmonics, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 200 // determined empirically
    } );

    super( labelNode, infiniteHarmonicsProperty, options );
  }
}

fourierMakingWaves.register( 'InfiniteHarmonicsCheckbox', InfiniteHarmonicsCheckbox );
export default InfiniteHarmonicsCheckbox;