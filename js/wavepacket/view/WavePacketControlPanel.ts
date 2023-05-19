// Copyright 2021-2023, University of Colorado Boulder

/**
 * WavePacketControlPanel is the control panel in the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import { HBox, HSeparator, Node, Text, VBox } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWColors from '../../common/FMWColors.js';
import FMWConstants from '../../common/FMWConstants.js';
import DomainComboBox from '../../common/view/DomainComboBox.js';
import SeriesTypeRadioButtonGroup from '../../common/view/SeriesTypeRadioButtonGroup.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';
import WavePacketModel from '../model/WavePacketModel.js';
import CenterControl from './CenterControl.js';
import ComponentSpacingControl from './ComponentSpacingControl.js';
import ComponentSpacingToolCheckbox from './ComponentSpacingToolCheckbox.js';
import ConjugateStandardDeviationControl from './ConjugateStandardDeviationControl.js';
import LengthToolCheckbox from './LengthToolCheckbox.js';
import StandardDeviationControl from './StandardDeviationControl.js';
import WavePacketInfoDialog from './WavePacketInfoDialog.js';
import WidthIndicatorsCheckbox from './WidthIndicatorsCheckbox.js';
import Property from '../../../../axon/js/Property.js';
import Domain from '../../common/model/Domain.js';
import SeriesType from '../../common/model/SeriesType.js';

// constants
const VERTICAL_SPACING = 7;

export default class WavePacketControlPanel extends Panel {

  public constructor( model: WavePacketModel,
                      componentSpacingToolVisibleProperty: Property<boolean>,
                      lengthToolVisibleProperty: Property<boolean>,
                      popupParent: Node,
                      tandem: Tandem ) {

    const componentSpacingSubpanel = new ComponentSpacingSubpanel( model.domainProperty,
      model.wavePacket.componentSpacingProperty, componentSpacingToolVisibleProperty, lengthToolVisibleProperty,
      tandem.createTandem( 'componentSpacingSubpanel' ) );

    const sectionNodes = [

      // Fourier Series
      componentSpacingSubpanel,

      // Wave Packet - Center
      new WavePacketCenterSubpanel( model.domainProperty, model.wavePacket.centerProperty,
        tandem.createTandem( 'wavePacketCenterSubpanel' ) ),

      // Wave Packet - Width
      new WavePacketWidthSubpanel( model.domainProperty, model.wavePacket.standardDeviationProperty,
        model.wavePacket.conjugateStandardDeviationProperty, model.widthIndicatorsVisibleProperty,
        tandem.createTandem( 'wavePacketWidthSubpanel' ) ),

      // Graph Controls
      new GraphControlsSubpanel( model.domainProperty, model.seriesTypeProperty, popupParent,
        tandem.createTandem( 'graphControlsSubpanel' ) )
    ];

    // Put a separator between each logical section.
    const children = [];
    for ( let i = 0; i < sectionNodes.length; i++ ) {
      children.push( sectionNodes[ i ] );
      if ( i < sectionNodes.length - 1 ) {
        children.push( new HSeparator( {
          stroke: FMWColors.separatorStrokeProperty
        } ) );
      }
    }

    const vBox = new VBox( {
      children: children,
      align: 'left',
      spacing: 10
    } );

    // Dialog that displays a key for math symbols. Created eagerly and reused for PhET-iO.
    const infoDialog = new WavePacketInfoDialog( tandem.createTandem( 'infoDialog' ) );

    // Button to open the dialog.
    const infoButton = new InfoButton( {
      listener: () => infoDialog.show(),
      iconFill: 'rgb( 50, 145, 184 )',
      scale: 0.4,
      touchAreaDilation: 15,
      tandem: tandem.createTandem( 'infoButton' )
    } );

    const content = new Node( {
      children: [ vBox, infoButton ]
    } );

    // InfoButton at upper-right of control panel, vertically centered on title.
    infoButton.right = vBox.right;
    infoButton.centerY = componentSpacingSubpanel.componentSpacingText.boundsTo( vBox ).centerY;

    super( content, merge( {}, FMWConstants.PANEL_OPTIONS, {
      yMargin: 5,
      tandem: tandem
    } ) );

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

  public readonly componentSpacingText: Node; // for layout

  public constructor( domainProperty: EnumerationProperty<Domain>,
                      componentSpacingProperty: NumberProperty,
                      componentSpacingToolVisibleProperty: Property<boolean>,
                      lengthToolVisibleProperty: Property<boolean>,
                      tandem: Tandem ) {

    // Title for this subpanel
    const componentSpacingText = new Text( FourierMakingWavesStrings.componentSpacingStringProperty, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 160, // determined empirically
      tandem: tandem.createTandem( 'componentSpacingText' )
    } );

    const componentSpacingControl = new ComponentSpacingControl( componentSpacingProperty, domainProperty,
      tandem.createTandem( 'componentSpacingControl' ) );

    const componentSpacingToolCheckbox = new ComponentSpacingToolCheckbox( componentSpacingToolVisibleProperty,
      domainProperty, tandem.createTandem( 'componentSpacingToolCheckbox' ) );

    // Checkbox for Length tool
    const lengthToolCheckbox = new LengthToolCheckbox( lengthToolVisibleProperty, domainProperty,
      tandem.createTandem( 'lengthToolCheckbox' ) );

    // Default point areas for the slider and checkboxes overlap. We can't eliminate this overlap because we can't
    // afford to add vertical space. So do our best to mitigate the issue by shifting checkbox touchAreas down.
    // See https://github.com/phetsims/fourier-making-waves/issues/196
    lengthToolCheckbox.touchArea = lengthToolCheckbox.localBounds.dilatedXY( 6, 4 ).shiftedY( 2 );
    componentSpacingToolCheckbox.touchArea = componentSpacingToolCheckbox.localBounds.dilatedXY( 6, 4 ).shiftedY( 2 );

    super( {

      // VBoxOptions
      children: [
        componentSpacingText,
        componentSpacingControl,
        new HBox( {
          children: [ componentSpacingToolCheckbox, lengthToolCheckbox ],
          spacing: 25
        } )
      ],
      align: 'left',
      spacing: VERTICAL_SPACING,
      tandem: Tandem.REQUIRED
    } );

    this.componentSpacingText = componentSpacingText;
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

/**
 * WavePacketCenterSubpanel is the 'Wave Packet - Center' section of this control panel.
 */
class WavePacketCenterSubpanel extends VBox {

  public constructor( domainProperty: EnumerationProperty<Domain>, centerProperty: NumberProperty, tandem: Tandem ) {

    // Title for this subpanel
    const wavePacketCenterText = new Text( FourierMakingWavesStrings.wavePacketCenterStringProperty, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 180, // determined empirically
      tandem: tandem.createTandem( 'wavePacketCenterText' )
    } );

    const centerControl = new CenterControl( centerProperty, domainProperty, tandem.createTandem( 'centerControl' ) );

    super( {

      // VBoxOptions
      children: [
        wavePacketCenterText,
        centerControl
      ],
      align: 'left',
      spacing: VERTICAL_SPACING,
      tandem: tandem
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

/**
 * WavePacketWidthSubpanel is the 'Wave Packet - Width' section of this control panel.
 */
class WavePacketWidthSubpanel extends VBox {

  public constructor( domainProperty: EnumerationProperty<Domain>,
                      standardDeviationProperty: NumberProperty,
                      conjugateStandardDeviationProperty: NumberProperty,
                      widthIndicatorsVisibleProperty: Property<boolean>,
                      tandem: Tandem ) {

    // Title for this subpanel
    const wavePacketWidthText = new Text( FourierMakingWavesStrings.wavePacketWidthStringProperty, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 180, // determined empirically
      tandem: tandem.createTandem( 'wavePacketWidthText' )
    } );

    const standardDeviationControl = new StandardDeviationControl( standardDeviationProperty, domainProperty,
      tandem.createTandem( 'standardDeviationControl' ) );

    const conjugateStandardDeviationControl = new ConjugateStandardDeviationControl( conjugateStandardDeviationProperty,
      domainProperty, tandem.createTandem( 'conjugateStandardDeviationControl' ) );

    // Interaction with these 2 controls is mutually-exclusive, because they both change standardDeviation.
    standardDeviationControl.isPressedProperty.link( isPressed => {
      isPressed && conjugateStandardDeviationControl.interruptSubtreeInput();
    } );
    conjugateStandardDeviationControl.isPressedProperty.link( isPressed => {
      isPressed && standardDeviationControl.interruptSubtreeInput();
    } );

    const widthIndicatorsCheckbox = new WidthIndicatorsCheckbox( widthIndicatorsVisibleProperty,
      tandem.createTandem( 'widthIndicatorsCheckbox' ) );

    // Default pointer areas for widthIndicatorsCheckbox and standardDeviationControl.slider overlap. We can't
    // eliminate this overlap because we can't afford to add vertical space. So do our best to mitigate the issue
    // by shifting widthIndicatorsCheckbox's touchArea down.
    // See https://github.com/phetsims/fourier-making-waves/issues/124#issuecomment-897229707
    widthIndicatorsCheckbox.touchArea = widthIndicatorsCheckbox.localBounds.dilatedXY( 6, 4 ).shiftedY( 2 );

    super( {

      // VBoxOptions
      children: [
        wavePacketWidthText,
        standardDeviationControl,
        conjugateStandardDeviationControl,
        widthIndicatorsCheckbox
      ],
      align: 'left',
      spacing: VERTICAL_SPACING,
      tandem: tandem
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

/**
 * GraphControlsSubpanel is the 'Graph Controls' section of this control panel.
 */
class GraphControlsSubpanel extends VBox {

  public constructor( domainProperty: EnumerationProperty<Domain>,
                      seriesTypeProperty: EnumerationProperty<SeriesType>,
                      popupParent: Node,
                      tandem: Tandem ) {

    // Title for this subpanel
    const graphControlsText = new Text( FourierMakingWavesStrings.graphControlsStringProperty, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 200, // determined empirically
      tandem: tandem.createTandem( 'graphControlsText' )
    } );

    // Function of:
    const functionOfText = new Text( FourierMakingWavesStrings.functionOfStringProperty, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 70, // determined empirically
      tandem: tandem.createTandem( 'functionOfText' )
    } );

    const domainComboBox = new DomainComboBox( domainProperty, popupParent,
      tandem.createTandem( 'functionOfComboBox' ) // tandem name differs by request
    );

    const functionOfBox = new HBox( {
      spacing: 5,
      children: [ functionOfText, domainComboBox ]
    } );

    // Series:
    const seriesText = new Text( FourierMakingWavesStrings.seriesStringProperty, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 70, // determined empirically
      tandem: tandem.createTandem( 'seriesText' )
    } );

    const seriesTypeRadioButtonGroup = new SeriesTypeRadioButtonGroup( seriesTypeProperty,
      tandem.createTandem( 'seriesRadioButtonGroup' ) // tandem name differs by request
    );

    const seriesBox = new HBox( {
      spacing: 10,
      children: [ seriesText, seriesTypeRadioButtonGroup ]
    } );

    super( {

      // VBoxOptions
      children: [
        graphControlsText,
        functionOfBox,
        seriesBox
      ],
      align: 'left',
      spacing: VERTICAL_SPACING,
      tandem: tandem
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

fourierMakingWaves.register( 'WavePacketControlPanel', WavePacketControlPanel );