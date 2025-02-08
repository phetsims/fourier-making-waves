// Copyright 2020-2025, University of Colorado Boulder

/**
 * DomainComboBox is the combo box for choosing a Domain in the 'Discrete' screen.
 * See also the Domain enumeration.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWDerivedStrings from '../FMWDerivedStrings.js';
import Domain from '../model/Domain.js';
import FMWComboBox, { FMWComboBoxChoice } from './FMWComboBox.js';

// This format is specific to FMWComboBox.
const CHOICES: FMWComboBoxChoice<Domain>[] = [
  {
    value: Domain.SPACE,
    stringProperty: FMWDerivedStrings.functionOfSpaceStringProperty,
    tandemName: 'spaceItem'
  },
  {
    value: Domain.TIME,
    stringProperty: FMWDerivedStrings.functionOfTimeStringProperty,
    tandemName: 'timeItem'
  },
  {
    value: Domain.SPACE_AND_TIME,
    stringProperty: FMWDerivedStrings.functionOfSpaceAndTimeStringProperty,
    tandemName: 'spaceAndTimeItem'
  }
];

export default class DomainComboBox extends FMWComboBox<Domain> {

  public constructor( domainProperty: Property<Domain>, popupParent: Node, tandem: Tandem ) {

    // Cherry-pick the choices that match the valid values for domainProperty
    const validValues = domainProperty.validValues!;
    assert && assert( validValues );
    const choices: FMWComboBoxChoice<Domain>[] = CHOICES.filter( choice => validValues.includes( choice.value ) );

    super( domainProperty, choices, popupParent, {
      isDisposable: false,
      textOptions: {
        maxWidth: 85 // determined empirically
      },
      tandem: tandem
    } );
  }
}

fourierMakingWaves.register( 'DomainComboBox', DomainComboBox );