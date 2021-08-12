// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketControlPanel is the control panel in the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import HSeparator from '../../../../sun/js/HSeparator.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWColors from '../../common/FMWColors.js';
import FWMConstants from '../../common/FMWConstants.js';
import FMWConstants from '../../common/FMWConstants.js';
import Domain from '../../common/model/Domain.js';
import SeriesType from '../../common/model/SeriesType.js';
import DomainComboBox from '../../common/view/DomainComboBox.js';
import SeriesTypeRadioButtonGroup from '../../common/view/SeriesTypeRadioButtonGroup.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import WavePacketModel from '../model/WavePacketModel.js';
import CenterControl from './CenterControl.js';
import ComponentSpacingControl from './ComponentSpacingControl.js';
import ConjugateStandardDeviationControl from './ConjugateStandardDeviationControl.js';
import StandardDeviationControl from './StandardDeviationControl.js';
import WavePacketInfoDialog from './WavePacketInfoDialog.js';
import WidthIndicatorsCheckbox from './WidthIndicatorsCheckbox.js';

// constants
const VERTICAL_SPACING = 7;

class WavePacketControlPanel extends Panel {

  /**
   * @param {WavePacketModel} model
   * @param {Node} popupParent
   * @param {Object} [options]
   */
  constructor( model, popupParent, options ) {

    assert && assert( model instanceof WavePacketModel );
    assert && assert( popupParent instanceof Node );

    options = merge( {}, FMWConstants.PANEL_OPTIONS, {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    const componentSpacingSubpanel = new ComponentSpacingSubpanel( model.domainProperty,
      model.wavePacket.componentSpacingProperty, {
        spacing: VERTICAL_SPACING,
        tandem: options.tandem.createTandem( 'componentSpacingSubpanel' )
      } );

    const sectionNodes = [

      // Fourier Series
      componentSpacingSubpanel,

      // Wave Packet - Center
      new WavePacketCenterSubpanel( model.domainProperty, model.wavePacket.centerProperty, {
        spacing: VERTICAL_SPACING,
        tandem: options.tandem.createTandem( 'wavePacketCenterSubpanel' )
      } ),

      // Wave Packet - Width
      new WavePacketWidthSubpanel( model.domainProperty, model.wavePacket.standardDeviationProperty,
        model.wavePacket.conjugateStandardDeviationProperty, model.widthIndicatorsVisibleProperty, {
          spacing: VERTICAL_SPACING,
          tandem: options.tandem.createTandem( 'wavePacketWidthSubpanel' )
        } ),

      // Graph Controls
      new GraphControlsSubpanel( model.domainProperty, model.seriesTypeProperty, popupParent, {
        spacing: VERTICAL_SPACING,
        tandem: options.tandem.createTandem( 'graphControlsSubpanel' )
      } )
    ];

    // Put a separator between each logical section.
    // Use a uniform separator width, sized to fit the widest section
    const separatorWidth = _.maxBy( sectionNodes, layoutBox => layoutBox.width ).width;
    const separatorOptions = {
      stroke: FMWColors.separatorStrokeProperty
    };
    const children = [];
    for ( let i = 0; i < sectionNodes.length; i++ ) {
      children.push( sectionNodes[ i ] );
      if ( i < sectionNodes.length - 1 ) {
        children.push( new HSeparator( separatorWidth, separatorOptions ) );
      }
    }

    const vBox = new VBox( merge( {}, FWMConstants.VBOX_OPTIONS, {
      children: children,
      spacing: 10
    } ) );

    // Dialog that displays a key for math symbols. Created eagerly and reused for PhET-iO.
    const infoDialog = new WavePacketInfoDialog( {
      tandem: options.tandem.createTandem( 'infoDialog' )
    } );

    // Button to open the dialog.
    const infoButton = new InfoButton( {
      listener: () => infoDialog.show(),
      iconFill: 'rgb( 50, 145, 184 )',
      scale: 0.4,
      touchAreaDilation: 15,
      tandem: options.tandem.createTandem( 'infoButton' )
    } );

    const content = new Node( {
      children: [ vBox, infoButton ]
    } );

    // InfoButton at upper-right of control panel, vertically centered on title.
    infoButton.right = vBox.right;
    infoButton.centerY = componentSpacingSubpanel.componentSpacingText.boundsTo( vBox ).centerY;

    super( content, options );

    // pdom - traversal order
    // See https://github.com/phetsims/fourier-making-waves/issues/53
    this.pdomOrder = [
      infoButton,
      vBox
    ];
  }
}

/**
 * ComponentSpacingSubpanel is the 'Fourier Component Spacing' section of this control panel.
 */
class ComponentSpacingSubpanel extends VBox {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Property} componentSpacingProperty
   * @param {Object} [options]
   */
  constructor( domainProperty, componentSpacingProperty, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertPropertyOf( componentSpacingProperty, 'number' );

    options = merge( {}, FMWConstants.VBOX_OPTIONS, {

      // VBox options
      spacing: 8,

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // Title for this subpanel
    const componentSpacingText = new Text( fourierMakingWavesStrings.componentSpacing, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 180, // determined empirically
      tandem: options.tandem.createTandem( 'componentSpacingText' )
    } );

    const componentSpacingControl = new ComponentSpacingControl( componentSpacingProperty, domainProperty, {
      tandem: options.tandem.createTandem( 'componentSpacingControl' )
    } );

    assert && assert( !options.children, 'ComponentSpacingSubpanel sets children' );
    options.children = [
      componentSpacingText,
      componentSpacingControl
    ];

    super( options );

    // @public for layout
    this.componentSpacingText = componentSpacingText;
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

/**
 * WavePacketCenterSubpanel is the 'Wave Packet - Center' section of this control panel.
 */
class WavePacketCenterSubpanel extends VBox {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {NumberProperty} centerProperty
   * @param {Object} [options]
   */
  constructor( domainProperty, centerProperty, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && assert( centerProperty instanceof NumberProperty );

    options = merge( {}, FMWConstants.VBOX_OPTIONS, {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    /// Title for this subpanel
    const wavePacketCenterText = new Text( fourierMakingWavesStrings.wavePacketCenter, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 180, // determined empirically
      tandem: options.tandem.createTandem( 'wavePacketCenterText' )
    } );

    const centerControl = new CenterControl( centerProperty, domainProperty, {
      tandem: options.tandem.createTandem( 'centerControl' )
    } );

    assert && assert( !options.children, 'WavePacketCenterSubpanel sets children' );
    options.children = [
      wavePacketCenterText,
      centerControl
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

/**
 * WavePacketWidthSubpanel is the 'Wave Packet - Width' section of this control panel.
 */
class WavePacketWidthSubpanel extends VBox {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {NumberProperty} standardDeviationProperty
   * @param {NumberProperty} conjugateStandardDeviationProperty
   * @param {Property.<boolean>} widthIndicatorsVisibleProperty
   * @param {Object} [options]
   */
  constructor( domainProperty, standardDeviationProperty, conjugateStandardDeviationProperty, widthIndicatorsVisibleProperty, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && assert( standardDeviationProperty instanceof NumberProperty );
    assert && assert( conjugateStandardDeviationProperty instanceof NumberProperty );
    assert && AssertUtils.assertPropertyOf( widthIndicatorsVisibleProperty, 'boolean' );

    options = merge( {}, FMWConstants.VBOX_OPTIONS, {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // Title for this subpanel
    const wavePacketWidthText = new Text( fourierMakingWavesStrings.wavePacketWidth, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 180, // determined empirically
      tandem: options.tandem.createTandem( 'wavePacketWidthText' )
    } );

    const standardDeviationControl = new StandardDeviationControl( standardDeviationProperty, domainProperty, {
      tandem: options.tandem.createTandem( 'standardDeviationControl' )
    } );

    const conjugateStandardDeviationControl =
      new ConjugateStandardDeviationControl( conjugateStandardDeviationProperty, domainProperty, {
        tandem: options.tandem.createTandem( 'conjugateStandardDeviationControl' )
      } );

    // Interaction with these 2 controls is mutually-exclusive, because they both change standardDeviation.
    standardDeviationControl.isPressedProperty.link( isPressed => {
      isPressed && conjugateStandardDeviationControl.interruptSubtreeInput();
    } );
    conjugateStandardDeviationControl.isPressedProperty.link( isPressed => {
      isPressed && standardDeviationControl.interruptSubtreeInput();
    } );

    const widthIndicatorsCheckbox = new WidthIndicatorsCheckbox( widthIndicatorsVisibleProperty, {
      tandem: options.tandem.createTandem( 'widthIndicatorsCheckbox' )
    } );

    assert && assert( !options.children, 'WavePacketLayoutBox sets children' );
    options.children = [
      wavePacketWidthText,
      standardDeviationControl,
      conjugateStandardDeviationControl,
      widthIndicatorsCheckbox
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

/**
 * GraphControlsSubpanel is the 'Graph Controls' section of this control panel.
 */
class GraphControlsSubpanel extends VBox {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<SeriesType>} seriesTypeProperty
   * @param {Node} popupParent
   * @param {Object} [options]
   */
  constructor( domainProperty, seriesTypeProperty, popupParent, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertEnumerationPropertyOf( seriesTypeProperty, SeriesType );
    assert && assert( popupParent instanceof Node );

    options = merge( {}, FMWConstants.VBOX_OPTIONS, {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // Title for this subpanel
    const graphControlsText = new Text( fourierMakingWavesStrings.graphControls, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 200, // determined empirically
      tandem: options.tandem.createTandem( 'graphControlsText' )
    } );

    // Function of:
    const functionOfText = new Text( fourierMakingWavesStrings.functionOf, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 70, // determined empirically
      tandem: options.tandem.createTandem( 'functionOfText' )
    } );

    const domainComboBox = new DomainComboBox( domainProperty, popupParent, {
      tandem: options.tandem.createTandem( 'functionOfComboBox' ) // tandem name differs by request
    } );

    const functionOfBox = new HBox( {
      spacing: 5,
      children: [ functionOfText, domainComboBox ]
    } );

    // Series:
    const seriesText = new Text( fourierMakingWavesStrings.series, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 70, // determined empirically
      tandem: options.tandem.createTandem( 'seriesText' )
    } );

    const seriesTypeRadioButtonGroup = new SeriesTypeRadioButtonGroup( seriesTypeProperty, {
      tandem: options.tandem.createTandem( 'seriesRadioButtonGroup' ) // tandem name differs by request
    } );

    const seriesBox = new HBox( {
      spacing: 10,
      children: [ seriesText, seriesTypeRadioButtonGroup ]
    } );

    assert && assert( !options.children, 'GraphControlsSubpanel sets children' );
    options.children = [
      graphControlsText,
      functionOfBox,
      seriesBox
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

fourierMakingWaves.register( 'WavePacketControlPanel', WavePacketControlPanel );
export default WavePacketControlPanel;