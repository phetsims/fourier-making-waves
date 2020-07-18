// Copyright 2020, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import FourierMakingWavesConstants from '../../common/FourierMakingWavesConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import Domain from '../model/Domain.js';
import DomainComboBox from './DomainComboBox.js';

class FunctionOfControl extends VBox {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Node} popupParent
   * @param {Object} [options]
   */
  constructor( domainProperty, popupParent, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );

    options = merge( {}, FourierMakingWavesConstants.VBOX_OPTIONS, {
      align: 'left'
    }, options );

    const functionOfNode = new Text( fourierMakingWavesStrings.functionOf, {
      font: FourierMakingWavesConstants.CONTROL_FONT
    } );

    const domainComboBox = new DomainComboBox( domainProperty, popupParent );

    assert && assert( !options.children, 'FunctionOfControl sets children' );
    options.children = [ functionOfNode, domainComboBox ];

    super( options );
  }
}

fourierMakingWaves.register( 'FunctionOfControl', FunctionOfControl );
export default FunctionOfControl;