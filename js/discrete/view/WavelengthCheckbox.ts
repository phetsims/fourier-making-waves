// Copyright 2021-2023, University of Colorado Boulder

/**
 * WavelengthCheckbox is the checkbox that is used to show the wavelength tool.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import { Text } from '../../../../scenery/js/imports.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';

export default class WavelengthCheckbox extends Checkbox {

  /**
   * @param {Property.<boolean>} isSelectedProperty
   * @param {Object} [options]
   */
  constructor( isSelectedProperty, options ) {

    assert && AssertUtils.assertPropertyOf( isSelectedProperty, 'boolean' );

    options = merge( {}, FMWConstants.CHECKBOX_OPTIONS, {
      tandem: Tandem.REQUIRED
    }, options );

    const wavelengthText = new Text( FourierMakingWavesStrings.wavelengthStringProperty, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 80, // determined empirically
      tandem: options.tandem.createTandem( 'wavelengthText' )
    } );

    super( isSelectedProperty, wavelengthText, options );
  }
}

fourierMakingWaves.register( 'WavelengthCheckbox', WavelengthCheckbox );