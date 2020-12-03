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
import WaveType from '../model/WaveType.js';
import DomainComboBox from './DomainComboBox.js';
import WaveTypeRadioButtonGroup from './WaveTypeRadioButtonGroup.js';

class GraphControlsLayoutBox extends VBox {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<WaveType>} waveTypeProperty
   * @param {Node} popupParent
   * @param {Object} [options]
   */
  constructor( domainProperty, waveTypeProperty, popupParent, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertEnumerationPropertyOf( waveTypeProperty, WaveType );
    assert && assert( popupParent instanceof Node, 'invalid popupParent' );

    options = merge( {}, FMWConstants.LAYOUT_BOX_OPTIONS, options );

    // Graph Controls
    const titleText = new Text( fourierMakingWavesStrings.graphControls, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 215 // determined empirically
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

    const waveTypeRadioButtonGroup = new WaveTypeRadioButtonGroup( waveTypeProperty );

    assert && assert( !options.children, 'GraphControls sets children' );
    options.children = [
      titleText,
      functionOfBox,
      waveTypeRadioButtonGroup
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