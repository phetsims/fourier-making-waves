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
import DKControl from './DKControl.js';
import DXControl from './DXControl.js';
import K0Control from './K0Control.js';
import ComponentSpacingControl from './ComponentSpacingControl.js';
import WavePacketSymbolsDialog from './WavePacketSymbolsDialog.js';
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

    const fourierSeriesLayoutBox = new ComponentSpacingLayoutBox( model.domainProperty,
      model.wavePacket.componentSpacingProperty, {
        spacing: VERTICAL_SPACING,
        tandem: options.tandem.createTandem( 'fourierSeriesLayoutBox' )
      } );

    const sectionNodes = [

      // Fourier Series
      fourierSeriesLayoutBox,

      // Wave Packet - Center
      new WavePacketCenterLayoutBox( model.domainProperty, model.wavePacket.k0Property, {
        spacing: VERTICAL_SPACING,
        tandem: options.tandem.createTandem( 'wavePacketCenterLayoutBox' )
      } ),

      // Wave Packet - Width
      new WavePacketWidthLayoutBox( model.domainProperty, model.wavePacket.dkProperty,
        model.widthIndicatorsVisibleProperty, {
          spacing: VERTICAL_SPACING,
          tandem: options.tandem.createTandem( 'wavePacketCenterLayoutBox' )
        } ),

      // Graph Controls
      new GraphControlsLayoutBox( model.domainProperty, model.seriesTypeProperty, popupParent, {
        spacing: VERTICAL_SPACING,
        tandem: options.tandem.createTandem( 'graphControlsLayoutBox' )
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

    // Dialog that displays a key for math symbols
    const symbolsDialog = new WavePacketSymbolsDialog();

    // Push button to open the dialog.
    const symbolsButton = new InfoButton( {
      listener: () => symbolsDialog.show(),
      iconFill: 'rgb( 50, 145, 184 )',
      scale: 0.4,
      right: vBox.right,
      centerY: fourierSeriesLayoutBox.globalToParentBounds(
        fourierSeriesLayoutBox.componentSpacingText.parentToGlobalBounds(
          fourierSeriesLayoutBox.componentSpacingText.bounds ) ).centerY
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
 * ComponentSpacingLayoutBox is the 'Fourier Component Spacing' section of this control panel.
 */
class ComponentSpacingLayoutBox extends VBox {

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

    // Fourier Series
    const componentSpacingText = new Text( fourierMakingWavesStrings.componentSpacing, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 180, // determined empirically
      tandem: options.tandem.createTandem( 'componentSpacingText' )
    } );

    const componentSpacingControl = new ComponentSpacingControl( domainProperty, componentSpacingProperty, {
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
 * WavePacketCenterLayoutBox is the 'Wave Packet - Center' section of this control panel.
 */
class WavePacketCenterLayoutBox extends VBox {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {NumberProperty} k0Property
   * @param {Object} [options]
   */
  constructor( domainProperty, k0Property, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && assert( k0Property instanceof NumberProperty );

    options = merge( {}, FMWConstants.VBOX_OPTIONS, {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // Wave Packet - Center
    const wavePacketCenter = new Text( fourierMakingWavesStrings.wavePacketCenter, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 180, // determined empirically
      tandem: options.tandem.createTandem( 'wavePacketCenter' )
    } );

    const k0Control = new K0Control( domainProperty, k0Property, {
      tandem: options.tandem.createTandem( 'k0Control' )
    } );

    assert && assert( !options.children, 'WavePacketCenterLayoutBox sets children' );
    options.children = [
      wavePacketCenter,
      k0Control
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
 * WavePacketWidthLayoutBox is the 'Wave Packet - Width' section of this control panel.
 */
class WavePacketWidthLayoutBox extends VBox {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {NumberProperty} dkProperty
   * @param {Property.<boolean>} widthIndicatorsVisibleProperty
   * @param {Object} [options]
   */
  constructor( domainProperty, dkProperty, widthIndicatorsVisibleProperty, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && assert( dkProperty instanceof NumberProperty );
    assert && AssertUtils.assertPropertyOf( widthIndicatorsVisibleProperty, 'boolean' );

    options = merge( {}, FMWConstants.VBOX_OPTIONS, {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // Wave Packet - Width
    const wavePacketWidth = new Text( fourierMakingWavesStrings.wavePacketWidth, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 180, // determined empirically
      tandem: options.tandem.createTandem( 'wavePacketWidth' )
    } );

    //TODO only update dkProperty when a slider is released, will require an adapter Property

    const dkControl = new DKControl( domainProperty, dkProperty, {
      tandem: options.tandem.createTandem( 'dkControl' )
    } );

    const dxControl = new DXControl( domainProperty, dkProperty, {
      tandem: options.tandem.createTandem( 'dxControl' )
    } );

    // Interaction with these 2 controls is mutually-exclusive, because dk * dx = 1.
    dkControl.isPressedProperty.link( isPressed => {
      isPressed && dxControl.interruptSubtreeInput();
    } );
    dxControl.isPressedProperty.link( isPressed => {
      isPressed && dkControl.interruptSubtreeInput();
    } );

    const widthIndicatorsCheckbox = new WidthIndicatorsCheckbox( widthIndicatorsVisibleProperty, {
      tandem: options.tandem.createTandem( 'widthIndicatorsCheckbox' )
    } );

    assert && assert( !options.children, 'WavePacketLayoutBox sets children' );
    options.children = [
      wavePacketWidth,
      dkControl,
      dxControl,
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
 * GraphControlsLayoutBox is the 'Graph Controls' section of this control panel.
 */
class GraphControlsLayoutBox extends VBox {

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

    // Graph Controls
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
      tandem: options.tandem.createTandem( 'domainComboBox' )
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
      tandem: options.tandem.createTandem( 'seriesTypeRadioButtonGroup' )
    } );

    const seriesBox = new HBox( {
      spacing: 10,
      children: [ seriesText, seriesTypeRadioButtonGroup ]
    } );

    assert && assert( !options.children, 'GraphControlsLayoutBox sets children' );
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