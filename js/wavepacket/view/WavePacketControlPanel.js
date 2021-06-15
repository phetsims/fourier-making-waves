// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketControlPanel is the control panel in the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
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
import FMWColorProfile from '../../common/FMWColorProfile.js';
import FWMConstants from '../../common/FMWConstants.js';
import FMWConstants from '../../common/FMWConstants.js';
import Domain from '../../common/model/Domain.js';
import SeriesType from '../../common/model/SeriesType.js';
import DomainComboBox from '../../common/view/DomainComboBox.js';
import SeriesTypeRadioButtonGroup from '../../common/view/SeriesTypeRadioButtonGroup.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import WavePacket from '../model/WavePacket.js';
import WavePacketModel from '../model/WavePacketModel.js';
import ComponentSpacingControl from './ComponentSpacingControl.js';
import WavePacketCenterControl from './WavePacketCenterControl.js';
import WavePacketKWidthControl from './WavePacketKWidthControl.js';
import WavePacketSymbolsDialog from './WavePacketSymbolsDialog.js';
import WavePacketXWidthControl from './WavePacketXWidthControl.js';
import WidthIndicatorsCheckbox from './WidthIndicatorsCheckbox.js';

// constants
const VERTICAL_SPACING = 6;

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

    const fourierSeriesLayoutBox = new FourierSeriesLayoutBox( model.domainProperty,
      model.wavePacket.componentSpacingProperty, model.wavePacket.componentSpacingIndexProperty, {
        spacing: VERTICAL_SPACING,
        tandem: options.tandem.createTandem( 'fourierSeriesLayoutBox' )
      } );

    const sectionNodes = [

      // Fourier Series
      fourierSeriesLayoutBox,

      // Wave Packet
      new WavePacketLayoutBox( model.domainProperty, model.wavePacket, model.widthIndicatorsVisibleProperty, {
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

    // Push button to open the dialog.
    const symbolsButton = new InfoButton( {
      listener: () => symbolsDialog.show(),
      iconFill: 'rgb( 50, 145, 184 )',
      scale: 0.4,
      right: vBox.right,
      centerY: fourierSeriesLayoutBox.globalToParentBounds(
        fourierSeriesLayoutBox.fourierSeriesText.parentToGlobalBounds(
          fourierSeriesLayoutBox.fourierSeriesText.bounds ) ).centerY
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
 * FourierSeriesLayoutBox is the 'Fourier Series' section of this control panel.
 */
class FourierSeriesLayoutBox extends VBox {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {DerivedProperty} componentSpacingProperty
   * @param {NumberProperty} componentSpacingIndexProperty
   * @param {Object} [options]
   */
  constructor( domainProperty, componentSpacingProperty, componentSpacingIndexProperty, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && assert( componentSpacingProperty instanceof DerivedProperty );
    assert && assert( componentSpacingIndexProperty instanceof NumberProperty );

    options = merge( {}, FMWConstants.VBOX_OPTIONS, {

      // VBox options
      spacing: 8,

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // Fourier Series
    const fourierSeriesText = new Text( fourierMakingWavesStrings.fourierSeries, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 180, // determined empirically
      tandem: options.tandem.createTandem( 'fourierSeriesText' )
    } );

    // Component Spacing
    const componentSpacingText = new Text( fourierMakingWavesStrings.componentSpacing, {
      font: FMWConstants.SUBTITLE_FONT,
      maxWidth: 180, // determined empirically
      tandem: options.tandem.createTandem( 'componentSpacingText' )
    } );

    // Value display and slider
    const componentSpacingControl = new ComponentSpacingControl( domainProperty, componentSpacingProperty,
      componentSpacingIndexProperty, {
        tandem: options.tandem.createTandem( 'componentSpacingControl' )
      } );

    assert && assert( !options.children, 'FourierSeriesLayoutBox sets children' );
    options.children = [
      fourierSeriesText,
      componentSpacingText,
      componentSpacingControl
    ];

    super( options );

    // @public for layout
    this.fourierSeriesText = fourierSeriesText;
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
 * WavePacketLayoutBox is the 'Wave Packet' section of this control panel.
 */
class WavePacketLayoutBox extends VBox {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {WavePacket} wavePacket
   * @param {Property.<boolean>} widthIndicatorsVisibleProperty
   * @param {Object} [options]
   */
  constructor( domainProperty, wavePacket, widthIndicatorsVisibleProperty, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && assert( wavePacket instanceof WavePacket );
    assert && AssertUtils.assertPropertyOf( widthIndicatorsVisibleProperty, 'boolean' );

    options = merge( {}, FMWConstants.VBOX_OPTIONS, {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // Wave packet
    const wavePacketText = new Text( fourierMakingWavesStrings.wavePacketTitle, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 180, // determined empirically
      tandem: options.tandem.createTandem( 'wavePacketText' )
    } );

    // Center
    const centerText = new Text( fourierMakingWavesStrings.center, {
      font: FMWConstants.SUBTITLE_FONT,
      maxWidth: 200, // determined empirically
      tandem: options.tandem.createTandem( 'centerText' )
    } );

    const wavePacketCenterControl = new WavePacketCenterControl( domainProperty, wavePacket.centerProperty, {
      tandem: options.tandem.createTandem( 'wavePacketCenterControl' )
    } );

    // Width
    const widthText = new Text( fourierMakingWavesStrings.width, {
      font: FMWConstants.SUBTITLE_FONT,
      maxWidth: 200, // determined empirically
      tandem: options.tandem.createTandem( 'widthText' )
    } );

    const kWidthControl = new WavePacketKWidthControl( domainProperty, wavePacket.kWidthProperty, {
      tandem: options.tandem.createTandem( 'kWidthControl' )
    } );

    const xWidthControl = new WavePacketXWidthControl( domainProperty, wavePacket.xWidthProperty, {
      tandem: options.tandem.createTandem( 'xWidthControl' )
    } );

    const widthIndicatorsCheckbox = new WidthIndicatorsCheckbox( widthIndicatorsVisibleProperty, {
      tandem: options.tandem.createTandem( 'widthIndicatorsCheckbox' )
    } );

    assert && assert( !options.children, 'WavePacketLayoutBox sets children' );
    options.children = [
      wavePacketText,
      centerText,
      wavePacketCenterControl,
      widthText,
      kWidthControl,
      xWidthControl,
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