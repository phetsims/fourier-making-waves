// Copyright 2020, University of Colorado Boulder

/**
 * GraphControlsLayoutBox is the 'Graph Controls' section of the control panel in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import Domain from '../model/Domain.js';
import MathForm from '../model/MathForm.js';
import SeriesType from '../model/SeriesType.js';
import DomainComboBox from './DomainComboBox.js';
import EquationComboBox from './EquationComboBox.js';
import SeriesTypeRadioButtonGroup from './SeriesTypeRadioButtonGroup.js';

class GraphControlsLayoutBox extends VBox {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<SeriesType>} seriesTypeProperty
   * @param {EnumerationProperty.<MathForm>} mathFormProperty
   * @param {Node} popupParent
   * @param {Object} [options]
   */
  constructor( domainProperty, seriesTypeProperty, mathFormProperty, popupParent, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertEnumerationPropertyOf( seriesTypeProperty, SeriesType );
    assert && AssertUtils.assertEnumerationPropertyOf( mathFormProperty, MathForm );
    assert && assert( popupParent instanceof Node, 'invalid popupParent' );

    options = merge( {}, FMWConstants.LAYOUT_BOX_OPTIONS, options );

    // Graph Controls
    const titleText = new Text( fourierMakingWavesStrings.graphControls, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 200 // determined empirically
    } );

    const functionOfText = new Text( fourierMakingWavesStrings.functionOf, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 70 // determined empirically
    } );

    const domainComboBox = new DomainComboBox( domainProperty, popupParent );

    const functionOfBox = new HBox( {
      spacing: 5,
      children: [ functionOfText, domainComboBox ]
    } );

    const seriesText = new Text( fourierMakingWavesStrings.series, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 70 // determined empirically
    } );

    const seriesTypeRadioButtonGroup = new SeriesTypeRadioButtonGroup( seriesTypeProperty );

    const seriesBox = new HBox( {
      spacing: 10,
      children: [ seriesText, seriesTypeRadioButtonGroup ]
    } );

    const equationText = new Text( fourierMakingWavesStrings.equation, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 70 // determined empirically
    } );

    const equationComboBox = new EquationComboBox( mathFormProperty, domainProperty, popupParent );

    const equationBox = new HBox( {
      spacing: 5,
      children: [ equationText, equationComboBox ]
    } );

    assert && assert( !options.children, 'GraphControls sets children' );
    options.children = [
      titleText,
      functionOfBox,
      seriesBox,
      equationBox
    ];

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

fourierMakingWaves.register( 'GraphControlsLayoutBox', GraphControlsLayoutBox );
export default GraphControlsLayoutBox;