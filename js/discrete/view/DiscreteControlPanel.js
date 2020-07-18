// Copyright 2020, University of Colorado Boulder

/**
 * DiscreteControlPanel is the control panel for the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import HSeparator from '../../../../sun/js/HSeparator.js';
import FourierMakingWavesColors from '../../common/FourierMakingWavesColors.js';
import FourierMakingWavesConstants from '../../common/FourierMakingWavesConstants.js';
import FourierMakingWavesPanel from '../../common/view/FourierMakingWavesPanel.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import FunctionOfControl from './FunctionOfControl.js';
import HarmonicsControl from './HarmonicsControl.js';
import PresetFunctionComboBox from './PresetFunctionComboBox.js';
import WaveTypeRadioButtonGroup from './WaveTypeRadioButtonGroup.js';

// constants
const INNER_SECTION_SPACING = 6;
const SECTION_SPACING = 10;

class DiscreteControlPanel extends FourierMakingWavesPanel {

  /**
   * @param {DiscreteModel} model
   * @param {Node} popupParent
   * @param {Object} [options]
   */
  constructor( model, popupParent, options ) {

    options = merge( {}, FourierMakingWavesConstants.PANEL_OPTIONS, options );

    const separatorWidth = options.fixedWidth - ( 2 * options.xMargin );

    const titleOptions = {
      font: FourierMakingWavesConstants.TITLE_FONT,
      maxWidth: separatorWidth
    };

    const separatorOptions = {
      stroke: FourierMakingWavesColors.SEPARATOR_STROKE
    };

    // Preset Function
    const presetFunctionTitleNode = new Text( fourierMakingWavesStrings.presetFunction, titleOptions );
    const presetFunctionComboBox = new PresetFunctionComboBox( model.presetFunctionProperty, popupParent );
    const harmonicsControl = new HarmonicsControl( model.numberOfHarmonicsProperty );
    const presetFunctionBox = new VBox( merge( {}, FourierMakingWavesConstants.VBOX_OPTIONS, {
      spacing: INNER_SECTION_SPACING,
      children: [
        presetFunctionTitleNode,
        presetFunctionComboBox,
        harmonicsControl
      ]
    } ) );

    // Graph Controls
    const graphControlsTitleNode = new Text( fourierMakingWavesStrings.graphControls, titleOptions );
    const functionOfControl = new FunctionOfControl( model.domainProperty, popupParent );
    const waveTypeRadioButtonGroup = new WaveTypeRadioButtonGroup( model.waveTypeProperty );
    const graphControlsBox = new VBox( merge( {}, FourierMakingWavesConstants.VBOX_OPTIONS, {
      spacing: INNER_SECTION_SPACING,
      children: [
        graphControlsTitleNode,
        functionOfControl,
        waveTypeRadioButtonGroup
      ]
    } ) );

    // Measurement Tools
    const measurementToolsTitleNode = new Text( fourierMakingWavesStrings.measurementTools, titleOptions );
    const measurementToolsBox = new VBox( merge( {}, FourierMakingWavesConstants.VBOX_OPTIONS, {
      spacing: INNER_SECTION_SPACING,
      children: [
        measurementToolsTitleNode
      ]
    } ) );

    // Math Form
    const mathFormTitleNode = new Text( fourierMakingWavesStrings.mathForm, titleOptions );
    const mathFormBox = new VBox( merge( {}, FourierMakingWavesConstants.VBOX_OPTIONS, {
      spacing: INNER_SECTION_SPACING,
      children: [
        mathFormTitleNode
      ]
    } ) );

    const content = new VBox( merge( {}, FourierMakingWavesConstants.VBOX_OPTIONS, {
      spacing: SECTION_SPACING,
      children: [
        presetFunctionBox,
        new HSeparator( separatorWidth, separatorOptions ),
        graphControlsBox,
        new HSeparator( separatorWidth, separatorOptions ),
        measurementToolsBox,
        new HSeparator( separatorWidth, separatorOptions ),
        mathFormBox
      ]
    } ) );

    super( content, options );
  }
}

fourierMakingWaves.register( 'DiscreteControlPanel', DiscreteControlPanel );
export default DiscreteControlPanel;