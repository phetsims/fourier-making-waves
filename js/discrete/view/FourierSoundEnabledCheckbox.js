// Copyright 2021-2023, University of Colorado Boulder

/**
 * FourierSoundEnabledCheckbox is the checkbox for turning the Fourier series sound on/off.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import { Path } from '../../../../scenery/js/imports.js';
import musicSolidShape from '../../../../sherpa/js/fontawesome-5/musicSolidShape.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

export default class FourierSoundEnabledCheckbox extends Checkbox {

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

    super( soundEnabledProperty, icon, options );
  }
}

fourierMakingWaves.register( 'FourierSoundEnabledCheckbox', FourierSoundEnabledCheckbox );