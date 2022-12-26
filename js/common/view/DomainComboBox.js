// Copyright 2020-2022, University of Colorado Boulder

/**
 * DomainComboBox is the combo box for choosing a Domain in the 'Discrete' screen.
 * See also the Domain enumeration.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import { Node } from '../../../../scenery/js/imports.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';
import FMWSymbols from '../FMWSymbols.js';
import Domain from '../model/Domain.js';
import FMWComboBox from './FMWComboBox.js';

// This format is specific to FMWComboBox.
const CHOICES = [
  {
    value: Domain.SPACE,
    stringProperty: new PatternStringProperty( FourierMakingWavesStrings.spaceSymbolStringProperty, {
      symbol: FMWSymbols.xStringProperty
    } ),
    tandemName: `spaceItem${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
  },
  {
    value: Domain.TIME,
    stringProperty: new PatternStringProperty( FourierMakingWavesStrings.timeSymbolStringProperty, {
      symbol: FMWSymbols.tStringProperty
    } ),
    tandemName: `time${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
  },
  {
    value: Domain.SPACE_AND_TIME,
    stringProperty: new PatternStringProperty( FourierMakingWavesStrings.spaceAndTimeSymbolsStringProperty, {
      spaceSymbol: FMWSymbols.xStringProperty,
      timeSymbol: FMWSymbols.tStringProperty
    } ),
    tandemName: `spaceAndTime${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
  }
];
assert && assert( _.every( CHOICES, choice => Domain.enumeration.includes( choice.value ) ) );
assert && assert( _.every( CHOICES, choice => choice.tandemName ) );

class DomainComboBox extends FMWComboBox {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Node} popupParent
   * @param {Object} [options]
   */
  constructor( domainProperty, popupParent, options ) {

    assert && assert( domainProperty instanceof EnumerationProperty );
    assert && assert( domainProperty.validValues );
    assert && assert( popupParent instanceof Node );

    options = merge( {

      // FMWComboBox options
      textOptions: {
        maxWidth: 100 // determined empirically
      }
    }, options );

    // Cherry-pick the choices that match the valid values for domainProperty
    const choices = domainProperty.validValues.map(
      value => _.find( CHOICES, choice => choice.value === value )
    );

    super( domainProperty, choices, popupParent, options );
  }
}

fourierMakingWaves.register( 'DomainComboBox', DomainComboBox );
export default DomainComboBox;