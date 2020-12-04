// Copyright 2020, University of Colorado Boulder

/**
 * MathFormLayoutBox is the 'Math Form' section of the control panel in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import Domain from '../model/Domain.js';
import MathForm from '../model/MathForm.js';
import MathFormComboBox from './MathFormComboBox.js';

class MathFormLayoutBox extends VBox {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {EnumerationProperty.<MathForm>} mathFormProperty
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Node} popupParent
   * @param {Object} [options]
   */
  constructor( fourierSeries, mathFormProperty, domainProperty, popupParent, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( mathFormProperty, MathForm );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && assert( popupParent instanceof Node, 'invalid popupParent' );

    options = merge( {}, FMWConstants.LAYOUT_BOX_OPTIONS, options );

    const titleText = new Text( fourierMakingWavesStrings.mathForm, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 200 // determined empirically
    } );

    // Math Form combo box
    const mathFormComboBox = new MathFormComboBox( mathFormProperty, domainProperty, popupParent );

    assert && assert( !options.children, 'MeasurementToolsLayoutBox sets children' );
    options.children = [ titleText, mathFormComboBox ];

    super( options );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

fourierMakingWaves.register( 'MathFormLayoutBox', MathFormLayoutBox );
export default MathFormLayoutBox;