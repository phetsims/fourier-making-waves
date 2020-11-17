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
import Text from '../../../../scenery/js/nodes/Text.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import ComboBoxItem from '../../../../sun/js/ComboBoxItem.js';
import FourierMakingWavesConstants from '../../common/FourierMakingWavesConstants.js';
import Symbols from '../../common/Symbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import Domain from '../model/Domain.js';

class DomainComboBox extends ComboBox {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Node} popupParent
   * @param {Object} [options]
   */
  constructor( domainProperty, popupParent, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && assert( popupParent instanceof Node, 'invalid popupParent' );

    options = merge( {}, FourierMakingWavesConstants.COMBO_BOX_OPTIONS, options );

    const textOptions = {
      font: FourierMakingWavesConstants.CONTROL_FONT
    };

    const items = [
      new ComboBoxItem( new Text( StringUtils.fillIn( fourierMakingWavesStrings.spaceSymbol, {
        symbol: Symbols.SMALL_X
      } ), textOptions ), Domain.SPACE ),
      new ComboBoxItem( new Text( StringUtils.fillIn( fourierMakingWavesStrings.timeSymbols, {
        symbol: Symbols.SMALL_T
      } ), textOptions ), Domain.TIME ),
      new ComboBoxItem( new Text( StringUtils.fillIn( fourierMakingWavesStrings.spaceAndTimeSymbols, {
        spaceSymbol: Symbols.SMALL_X,
        timeSymbol: Symbols.SMALL_T
      } ), textOptions ), Domain.SPACE_AND_TIME )
    ];

    super( items, domainProperty, popupParent, options );
  }
}

fourierMakingWaves.register( 'DomainComboBox', DomainComboBox );
export default DomainComboBox;