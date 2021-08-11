// Copyright 2021, University of Colorado Boulder

/**
 * FourierSoundEnabledCheckbox is the checkbox for turning the Fourier series sound on/off.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Path from '../../../../scenery/js/nodes/Path.js';
import musicSolidShape from '../../../../sherpa/js/fontawesome-5/musicSolidShape.js';
import FMWCheckbox from '../../common/view/FMWCheckbox.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class FourierSoundEnabledCheckbox extends FMWCheckbox {

  /**
   * @param {Property.<boolean>} soundEnabledProperty
   * @param {Object} [options]
   */
  constructor( soundEnabledProperty, options ) {

    // Font Awesome music-note icon
    const icon = new Path( musicSolidShape, {
      scale: 0.028,
      fill: 'black'
    } );

    super( icon, soundEnabledProperty, options );
  }
}

fourierMakingWaves.register( 'FourierSoundEnabledCheckbox', FourierSoundEnabledCheckbox );
export default FourierSoundEnabledCheckbox;