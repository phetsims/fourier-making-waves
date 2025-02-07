// Copyright 2021-2024, University of Colorado Boulder

/**
 * PeriodCheckbox is the checkbox that is used to show the period tool.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import Domain from '../../common/model/Domain.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';

export default class PeriodCheckbox extends Checkbox {

  public constructor( isSelectedProperty: Property<boolean>, domainProperty: EnumerationProperty<Domain>, tandem: Tandem ) {

    const periodText = new Text( FourierMakingWavesStrings.periodStringProperty, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 60 // determined empirically
    } );

    super( isSelectedProperty, periodText, combineOptions<CheckboxOptions>( {}, FMWConstants.CHECKBOX_OPTIONS, {
      isDisposable: false,
      enabledProperty: new DerivedProperty(
        [ domainProperty ],
        domain => ( domain === Domain.TIME || domain === Domain.SPACE_AND_TIME )
      ),
      tandem: tandem
    } ) );
  }
}

fourierMakingWaves.register( 'PeriodCheckbox', PeriodCheckbox );