// Copyright 2021, University of Colorado Boulder

/**
 * FourierSoundEnabledCheckbox is the checkbox for turning the Fourier series sound on/off.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import musicSolidShape from '../../../../sherpa/js/fontawesome-5/musicSolidShape.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class FourierSoundEnabledCheckbox extends Checkbox {

  /**
   * @param {Property.<boolean>} soundEnabledProperty
   * @param {Object} [options]
   */
  constructor( soundEnabledProperty, options ) {

    options = merge( {}, FMWConstants.CHECKBOX_OPTIONS, options );

    // Font Awesome music-note icon
    const icon = new Path( musicSolidShape, {
      scale: 0.028,
      fill: 'black'
    } );

    super( icon, soundEnabledProperty, options );

    // pointer areas
    this.touchArea = this.localBounds.dilated( FMWConstants.CHECKBOX_TOUCH_AREA_DILATION );
    this.mouseArea = this.localBounds.dilated( FMWConstants.CHECKBOX_MOUSE_AREA_DILATION );
  }
}

fourierMakingWaves.register( 'FourierSoundEnabledCheckbox', FourierSoundEnabledCheckbox );
export default FourierSoundEnabledCheckbox;