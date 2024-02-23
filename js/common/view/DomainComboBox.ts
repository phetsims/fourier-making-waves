// Copyright 2020-2024, University of Colorado Boulder

/**
 * DomainComboBox is the combo box for choosing a Domain in the 'Discrete' screen.
 * See also the Domain enumeration.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Node } from '../../../../scenery/js/imports.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import Domain from '../model/Domain.js';
import FMWComboBox, { FMWComboBoxChoice } from './FMWComboBox.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWDerivedStrings from '../FMWDerivedStrings.js';

// This format is specific to FMWComboBox.
const CHOICES: FMWComboBoxChoice<Domain>[] = [
  {
    value: Domain.SPACE,
    stringProperty: FMWDerivedStrings.functionOfSpaceStringProperty,
    tandemName: `space${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
  },
  {
    value: Domain.TIME,
    stringProperty: FMWDerivedStrings.functionOfTimeStringProperty,
    tandemName: `time${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
  },
  {
    value: Domain.SPACE_AND_TIME,
    stringProperty: FMWDerivedStrings.functionOfSpaceAndTimeStringProperty,
    tandemName: `spaceAndTime${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
  }
];

export default class DomainComboBox extends FMWComboBox<Domain> {

  public constructor( domainProperty: Property<Domain>, popupParent: Node, tandem: Tandem ) {

    // Cherry-pick the choices that match the valid values for domainProperty
    const validValues = domainProperty.validValues!;
    assert && assert( validValues );
    const choices: FMWComboBoxChoice<Domain>[] = CHOICES.filter( choice => validValues.includes( choice.value ) );

    super( domainProperty, choices, popupParent, {
      textOptions: {
        maxWidth: 85 // determined empirically
      },
      isDisposable: false,
      tandem: tandem
    } );
  }
}

fourierMakingWaves.register( 'DomainComboBox', DomainComboBox );