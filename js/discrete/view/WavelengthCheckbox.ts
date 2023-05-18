// Copyright 2021-2023, University of Colorado Boulder

/**
 * WavelengthCheckbox is the checkbox that is used to show the wavelength tool.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Text } from '../../../../scenery/js/imports.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';
import Property from '../../../../axon/js/Property.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Domain from '../../common/model/Domain.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

export default class WavelengthCheckbox extends Checkbox {

  public constructor( isSelectedProperty: Property<boolean>, domainProperty: EnumerationProperty<Domain>, tandem: Tandem ) {

    const wavelengthText = new Text( FourierMakingWavesStrings.wavelengthStringProperty, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 80, // determined empirically
      tandem: tandem.createTandem( 'wavelengthText' )
    } );

    super( isSelectedProperty, wavelengthText, combineOptions<CheckboxOptions>( {}, FMWConstants.CHECKBOX_OPTIONS, {
      enabledProperty: new DerivedProperty( [ domainProperty ],
        domain => ( domain === Domain.SPACE || domain === Domain.SPACE_AND_TIME )
      ),
      tandem: tandem
    } ) );
  }
}

fourierMakingWaves.register( 'WavelengthCheckbox', WavelengthCheckbox );