// Copyright 2020, University of Colorado Boulder

/**
 * DomainComboBox is the combo box for choosing a domain in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import Domain from '../model/Domain.js';
import FMWComboBox from './FMWComboBox.js';

class DomainComboBox extends FMWComboBox {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Node} popupParent
   * @param {Object} [options]
   */
  constructor( domainProperty, popupParent, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && assert( popupParent instanceof Node, 'invalid popupParent' );

    options = merge( {
      textOptions: {
        maxWidth: 215 // determined empirically
      }
    }, options );

    // {{string:string, value:Domain}[]}
    const choices = [
      {
        value: Domain.SPACE,
        string: StringUtils.fillIn( fourierMakingWavesStrings.spaceSymbol, {
          symbol: FMWSymbols.SMALL_X
        } )
      },
      {
        value: Domain.TIME,
        string: StringUtils.fillIn( fourierMakingWavesStrings.timeSymbols, {
          symbol: FMWSymbols.SMALL_T
        } )
      },
      {
        value: Domain.SPACE_AND_TIME,
        string: StringUtils.fillIn( fourierMakingWavesStrings.spaceAndTimeSymbols, {
          spaceSymbol: FMWSymbols.SMALL_X,
          timeSymbol: FMWSymbols.SMALL_T
        } )
      }
    ];

    super( choices, domainProperty, popupParent, options );
  }
}

fourierMakingWaves.register( 'DomainComboBox', DomainComboBox );
export default DomainComboBox;