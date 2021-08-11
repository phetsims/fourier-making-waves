// Copyright 2020-2021, University of Colorado Boulder

/**
 * DomainComboBox is the combo box for choosing a domain in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import FMWSymbols from '../FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import Domain from '../model/Domain.js';
import FMWComboBox from './FMWComboBox.js';

// {{value:*, string:string}[]} This format is specific to FMWComboBox.
const CHOICES = [
  {
    value: Domain.SPACE,
    string: StringUtils.fillIn( fourierMakingWavesStrings.spaceSymbol, {
      symbol: FMWSymbols.x
    } )
  },
  {
    value: Domain.TIME,
    string: StringUtils.fillIn( fourierMakingWavesStrings.timeSymbol, {
      symbol: FMWSymbols.t
    } )
  },
  {
    value: Domain.SPACE_AND_TIME,
    string: StringUtils.fillIn( fourierMakingWavesStrings.spaceAndTimeSymbols, {
      spaceSymbol: FMWSymbols.x,
      timeSymbol: FMWSymbols.t
    } )
  }
];

class DomainComboBox extends FMWComboBox {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Node} popupParent
   * @param {Object} [options]
   */
  constructor( domainProperty, popupParent, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && assert( domainProperty.validValues );
    assert && assert( popupParent instanceof Node );

    options = merge( {

      // FMWComboBox options
      textOptions: {
        maxWidth: 100 // determined empirically
      }
    }, options );

    // {{value:Domain, string:string}[]} use the choices that match the valid values for domainProperty
    const choices = _.map( domainProperty.validValues,
      value => _.find( CHOICES, choice => choice.value === value )
    );

    super( choices, domainProperty, popupParent, options );
  }
}

fourierMakingWaves.register( 'DomainComboBox', DomainComboBox );
export default DomainComboBox;