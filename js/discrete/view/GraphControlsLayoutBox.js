// Copyright 2020, University of Colorado Boulder

/**
 * GraphControlsLayoutBox is the 'Graph Controls' section of the control panel in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import AlignBox from '../../../../scenery/js/nodes/AlignBox.js';
import AlignGroup from '../../../../scenery/js/nodes/AlignGroup.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import Domain from '../model/Domain.js';
import EquationForm from '../model/EquationForm.js';
import SeriesType from '../model/SeriesType.js';
import DomainComboBox from './DomainComboBox.js';
import EquationComboBox from './EquationComboBox.js';
import SeriesTypeRadioButtonGroup from './SeriesTypeRadioButtonGroup.js';

class GraphControlsLayoutBox extends VBox {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<SeriesType>} seriesTypeProperty
   * @param {EnumerationProperty.<EquationForm>} equationFormProperty
   * @param {Node} popupParent
   * @param {Object} [options]
   */
  constructor( domainProperty, seriesTypeProperty, equationFormProperty, popupParent, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertEnumerationPropertyOf( seriesTypeProperty, SeriesType );
    assert && AssertUtils.assertEnumerationPropertyOf( equationFormProperty, EquationForm );
    assert && assert( popupParent instanceof Node, 'invalid popupParent' );

    options = merge( {
      tandem: Tandem.REQUIRED
    }, FMWConstants.VBOX_OPTIONS, options );

    // To make all labels have the same effective width
    const labelsAlignBoxOptions = {
      xAlign: 'left',
      group: new AlignGroup( {
        matchVertical: false
      } )
    };

    // Graph Controls
    const graphControlsText = new Text( fourierMakingWavesStrings.graphControls, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 200, // determined empirically
      tandem: options.tandem.createTandem( 'graphControlsText' )
    } );

    const functionOfText = new Text( fourierMakingWavesStrings.functionOf, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 70, // determined empirically
      tandem: options.tandem.createTandem( 'functionOfText' )
    } );

    const domainComboBox = new DomainComboBox( domainProperty, popupParent, {
      tandem: options.tandem.createTandem( 'domainComboBox' )
    } );

    const functionOfBox = new HBox( {
      spacing: 5,
      children: [ new AlignBox( functionOfText, labelsAlignBoxOptions ), domainComboBox ]
    } );

    const seriesText = new Text( fourierMakingWavesStrings.series, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 70, // determined empirically
      tandem: options.tandem.createTandem( 'seriesText' )
    } );

    const seriesTypeRadioButtonGroup = new SeriesTypeRadioButtonGroup( seriesTypeProperty, {
      tandem: options.tandem.createTandem( 'seriesTypeRadioButtonGroup' )
    } );

    const seriesBox = new HBox( {
      spacing: 10,
      children: [ new AlignBox( seriesText, labelsAlignBoxOptions ), seriesTypeRadioButtonGroup ]
    } );

    const equationText = new Text( fourierMakingWavesStrings.equation, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 70, // determined empirically
      tandem: options.tandem.createTandem( 'equationText' )
    } );

    const equationComboBox = new EquationComboBox( equationFormProperty, domainProperty, popupParent, {
      tandem: options.tandem.createTandem( 'equationComboBox' )
    } );

    const equationBox = new HBox( {
      spacing: 5,
      children: [ new AlignBox( equationText, labelsAlignBoxOptions ), equationComboBox ]
    } );

    assert && assert( !options.children, 'GraphControls sets children' );
    options.children = [
      graphControlsText,
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