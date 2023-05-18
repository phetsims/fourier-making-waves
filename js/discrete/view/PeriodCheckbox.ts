// Copyright 2021-2023, University of Colorado Boulder

/**
 * PeriodCheckbox is the checkbox that is used to show the period tool.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Text } from '../../../../scenery/js/imports.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Domain from '../../common/model/Domain.js';
import Property from '../../../../axon/js/Property.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';

export default class PeriodCheckbox extends Checkbox {

  public constructor( isSelectedProperty: Property<boolean>, domainProperty: EnumerationProperty<Domain>, tandem: Tandem ) {

    const periodText = new Text( FourierMakingWavesStrings.periodStringProperty, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 80, // determined empirically
      tandem: tandem.createTandem( 'periodText' )
    } );

    super( isSelectedProperty, periodText, combineOptions<CheckboxOptions>( {}, FMWConstants.CHECKBOX_OPTIONS, {
      enabledProperty: new DerivedProperty(
        [ domainProperty ],
        domain => ( domain === Domain.TIME || domain === Domain.SPACE_AND_TIME )
      ),
      tandem: tandem
    } ) );
  }
}

fourierMakingWaves.register( 'PeriodCheckbox', PeriodCheckbox );