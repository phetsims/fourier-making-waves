// Copyright 2021-2023, University of Colorado Boulder

/**
 * FourierSoundEnabledCheckbox is the checkbox for turning the Fourier series sound on/off.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Path } from '../../../../scenery/js/imports.js';
import musicSolidShape from '../../../../sherpa/js/fontawesome-5/musicSolidShape.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';

export default class FourierSoundEnabledCheckbox extends Checkbox {

  public constructor( soundEnabledProperty: Property<boolean>, tandem: Tandem ) {

    // Font Awesome music-note icon
    const icon = new Path( musicSolidShape, {
      scale: 0.028,
      fill: 'black'
    } );

    super( soundEnabledProperty, icon, combineOptions<CheckboxOptions>( {}, FMWConstants.CHECKBOX_OPTIONS, {
      tandem: tandem
    } ) );
  }
}

fourierMakingWaves.register( 'FourierSoundEnabledCheckbox', FourierSoundEnabledCheckbox );