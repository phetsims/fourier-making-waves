// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketControlPanel is the control panel in the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
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
import FMWColorProfile from '../../common/FMWColorProfile.js';
import FWMConstants from '../../common/FMWConstants.js';
import FMWConstants from '../../common/FMWConstants.js';
import Domain from '../../common/model/Domain.js';
import SeriesType from '../../common/model/SeriesType.js';
import DomainComboBox from '../../common/view/DomainComboBox.js';
import SeriesTypeRadioButtonGroup from '../../common/view/SeriesTypeRadioButtonGroup.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import WavePacketModel from '../model/WavePacketModel.js';
import ComponentSpacingControl from './ComponentSpacingControl.js';
import WavePacketCenterControl from './WavePacketCenterControl.js';
import WavePacketKWidthControl from './WavePacketKWidthControl.js';
import WavePacketSymbolsDialog from './WavePacketSymbolsDialog.js';
import WavePacketXWidthControl from './WavePacketXWidthControl.js';
import WidthIndicatorsCheckbox from './WidthIndicatorsCheckbox.js';

// constants
const VERTICAL_SPACING = 8;

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

    const componentSpacingLayoutBox = new ComponentSpacingLayoutBox( model.domainProperty,
      model.wavePacket.componentSpacingProperty, model.wavePacket.componentSpacingIndexProperty, {
        spacing: VERTICAL_SPACING,
        tandem: options.tandem.createTandem( 'componentSpacingLayoutBox' )
      } );

    const sectionNodes = [

      // Component Spacing
      componentSpacingLayoutBox,

      // Wave Packet Center
      new WavePacketCenterLayoutBox( model.domainProperty, model.wavePacket.centerProperty, {
        spacing: VERTICAL_SPACING,
        tandem: options.tandem.createTandem( 'wavePacketCenterLayoutBox' )
      } ),

      // Wave Packet Width
      new WavePacketWidthLayoutBox( model.domainProperty, model.wavePacket.kWidthProperty, model.wavePacket.xWidthProperty, {
        spacing: VERTICAL_SPACING,
        tandem: options.tandem.createTandem( 'wavePacketWidthLayoutBox' )
      } ),

      // Graph Controls
      new GraphControlsLayoutBox( model.domainProperty, model.seriesTypeProperty,
        model.widthIndicatorsVisibleProperty, popupParent, {
          spacing: VERTICAL_SPACING,
          tandem: options.tandem.createTandem( 'graphControlsLayoutBox' )
        } )
    ];

    // Put a separator between each logical section.
    // Use a uniform separator width, sized to fit the widest section
    const separatorWidth = _.maxBy( sectionNodes, layoutBox => layoutBox.width ).width;
    const separatorOptions = {
      stroke: FMWColorProfile.separatorStrokeProperty
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

    // Dialog that displays a key for math symbols
    const symbolsDialog = new WavePacketSymbolsDialog();

    //TODO where should this button be located?
    // Push button to open the dialog.
    const symbolsButton = new InfoButton( {
      listener: () => symbolsDialog.show(),
      iconFill: 'rgb( 50, 145, 184 )',
      scale: 0.4,
      right: vBox.right,
      centerY: componentSpacingLayoutBox.globalToParentBounds(
        componentSpacingLayoutBox.componentSpacingText.parentToGlobalBounds( componentSpacingLayoutBox.componentSpacingText.bounds ) ).centerY

    } );

    const content = new Node( {
      children: [ vBox, symbolsButton ]
    } );

    super( content, options );

    // pdom - traversal order
    // See https://github.com/phetsims/fourier-making-waves/issues/53
    this.pdomOrder = [
      symbolsButton,
      vBox
    ];
  }
}

/**
 * ComponentSpacingLayoutBox is the 'Component Spacing' section of this control panel.
 */
class ComponentSpacingLayoutBox extends VBox {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {DerivedProperty} componentSpacingProperty
   * @param {Property.<number>} componentSpacingIndexProperty
   * @param {Object} [options]
   */
  constructor( domainProperty, componentSpacingProperty, componentSpacingIndexProperty, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && assert( componentSpacingProperty instanceof DerivedProperty );
    assert && AssertUtils.assertPropertyOf( componentSpacingIndexProperty, 'number' );

    options = merge( {}, FMWConstants.VBOX_OPTIONS, {

      // VBox options
      spacing: 8,

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // Component Spacing
    const componentSpacingText = new Text( fourierMakingWavesStrings.componentSpacing, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 180, // determined empirically
      tandem: options.tandem.createTandem( 'componentSpacingText' )
    } );

    // Value display and slider
    const componentSpacingControl = new ComponentSpacingControl( domainProperty, componentSpacingProperty,
      componentSpacingIndexProperty, {
        tandem: options.tandem.createTandem( 'componentSpacingControl' )
      } );

    assert && assert( !options.children, 'ComponentSpacingLayoutBox sets children' );
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
 * WavePacketCenterLayoutBox is the 'Wave Packet Center' section of this control panel.
 */
class WavePacketCenterLayoutBox extends VBox {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Property.<number>} wavePacketCenterProperty
   * @param {Object} [options]
   */
  constructor( domainProperty, wavePacketCenterProperty, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertPropertyOf( wavePacketCenterProperty, 'number' );

    options = merge( {}, FMWConstants.VBOX_OPTIONS, {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // Component Spacing
    const wavePacketCenterText = new Text( fourierMakingWavesStrings.wavePacketCenter, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 200, // determined empirically
      tandem: options.tandem.createTandem( 'wavePacketCenterText' )
    } );

    // Value display and slider
    const wavePacketCenterControl = new WavePacketCenterControl( domainProperty, wavePacketCenterProperty, {
      tandem: options.tandem.createTandem( 'wavePacketCenterControl' )
    } );

    assert && assert( !options.children, 'WavePacketCenterLayoutBox sets children' );
    options.children = [
      wavePacketCenterText,
      wavePacketCenterControl
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
 * WavePacketWidthLayoutBox is the 'Wave Packet Width' section of this control panel.
 */
class WavePacketWidthLayoutBox extends VBox {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Property.<number>} kWidthProperty
   * @param {Property.<number>} xWidthProperty
   * @param {Object} [options]
   */
  constructor( domainProperty, kWidthProperty, xWidthProperty, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertPropertyOf( kWidthProperty, 'number' );
    assert && AssertUtils.assertPropertyOf( xWidthProperty, 'number' );

    options = merge( {}, FMWConstants.VBOX_OPTIONS, {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // Component Spacing
    const wavePacketWidthText = new Text( fourierMakingWavesStrings.wavePacketWidth, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 200, // determined empirically
      tandem: options.tandem.createTandem( 'wavePacketWidthText' )
    } );

    const kWidthControl = new WavePacketKWidthControl( domainProperty, kWidthProperty, {
      tandem: options.tandem.createTandem( 'kWidthControl' )
    } );

    const xWidthControl = new WavePacketXWidthControl( domainProperty, xWidthProperty, {
      tandem: options.tandem.createTandem( 'xWidthControl' )
    } );

    assert && assert( !options.children, 'WavePacketWidthLayoutBox sets children' );
    options.children = [
      wavePacketWidthText,
      kWidthControl,
      xWidthControl
    ];

    super( options );

    // When one of the controls is being used, interrupt the other control.
    // unlink is not needed.
    kWidthControl.isPressedProperty.link( isPressed => ( isPressed && xWidthControl.interruptSubtreeInput() ) );
    xWidthControl.isPressedProperty.link( isPressed => ( isPressed && kWidthControl.interruptSubtreeInput() ) );
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
 * GraphControlsLayoutBox is the 'Graph Controls' section of this control panel.
 */
class GraphControlsLayoutBox extends VBox {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<SeriesType>} seriesTypeProperty
   * @param {Property.<boolean>} widthIndicatorsVisibleProperty
   * @param {Node} popupParent
   * @param {Object} [options]
   */
  constructor( domainProperty, seriesTypeProperty, widthIndicatorsVisibleProperty, popupParent, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertEnumerationPropertyOf( seriesTypeProperty, SeriesType );
    assert && AssertUtils.assertPropertyOf( widthIndicatorsVisibleProperty, 'boolean' );
    assert && assert( popupParent instanceof Node );

    options = merge( {}, FMWConstants.VBOX_OPTIONS, {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

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
      children: [ functionOfText, domainComboBox ]
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
      children: [ seriesText, seriesTypeRadioButtonGroup ]
    } );

    const widthIndicatorsCheckbox = new WidthIndicatorsCheckbox( widthIndicatorsVisibleProperty, {
      tandem: options.tandem.createTandem( 'widthIndicatorsCheckbox' )
    } );

    assert && assert( !options.children, 'GraphControlsLayoutBox sets children' );
    options.children = [
      graphControlsText,
      functionOfBox,
      seriesBox,
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

fourierMakingWaves.register( 'WavePacketControlPanel', WavePacketControlPanel );
export default WavePacketControlPanel;