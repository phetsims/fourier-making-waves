// Copyright 2020-2023, University of Colorado Boulder

/**
 * DiscreteControlPanel is the control panel for the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import audioManager from '../../../../joist/js/audioManager.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import { AlignBox, AlignBoxOptions, AlignGroup, Color, HBox, HBoxOptions, HSeparator, Node, Path, SceneryConstants, Text, VBox } from '../../../../scenery/js/imports.js';
import volumeDownSolidShape from '../../../../sherpa/js/fontawesome-5/volumeDownSolidShape.js';
import volumeOffSolidShape from '../../../../sherpa/js/fontawesome-5/volumeOffSolidShape.js';
import volumeUpSolidShape from '../../../../sherpa/js/fontawesome-5/volumeUpSolidShape.js';
import HSlider from '../../../../sun/js/HSlider.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWColors from '../../common/FMWColors.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import Domain from '../../common/model/Domain.js';
import DomainComboBox from '../../common/view/DomainComboBox.js';
import SeriesTypeRadioButtonGroup from '../../common/view/SeriesTypeRadioButtonGroup.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';
import DiscreteMeasurementTool from '../model/DiscreteMeasurementTool.js';
import DiscreteModel from '../model/DiscreteModel.js';
import Waveform from '../model/Waveform.js';
import DiscreteInfoDialog from './DiscreteInfoDialog.js';
import EquationComboBox from './EquationComboBox.js';
import FourierSoundEnabledCheckbox from './FourierSoundEnabledCheckbox.js';
import HarmonicsSpinner from './HarmonicsSpinner.js';
import OrderSpinner from './OrderSpinner.js';
import PeriodCheckbox from './PeriodCheckbox.js';
import WaveformComboBox from './WaveformComboBox.js';
import WavelengthCheckbox from './WavelengthCheckbox.js';
import DiscreteFourierSeries from '../model/DiscreteFourierSeries.js';
import Property from '../../../../axon/js/Property.js';
import SeriesType from '../../common/model/SeriesType.js';
import EquationForm from '../model/EquationForm.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';

export default class DiscreteControlPanel extends Panel {

  public constructor( model: DiscreteModel, popupParent: Node, tandem: Tandem ) {

    const fourierSeriesSubpanel = new FourierSeriesSubpanel( model.fourierSeries, model.waveformProperty, popupParent,
      tandem.createTandem( 'fourierSeriesSubpanel' ) );

    // {Node[]} logical sections of the control panel
    const sectionNodes = [
      fourierSeriesSubpanel,
      new GraphControlsSubpanel( model.domainProperty, model.seriesTypeProperty, model.equationFormProperty, popupParent,
        tandem.createTandem( 'graphControlsSubpanel' ) ),
      new MeasurementToolsSubpanel( model.wavelengthTool, model.periodTool, model.domainProperty,
        tandem.createTandem( 'measurementToolsSubpanel' ) )
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
      spacing: FMWConstants.VBOX_SPACING
    } );

    // Dialog that displays a key for math symbols. Created eagerly and reused for PhET-iO.
    const infoDialog = new DiscreteInfoDialog( tandem.createTandem( 'infoDialog' ) );

    // Button to open the dialog
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
    infoButton.centerY = fourierSeriesSubpanel.fourierSeriesText.boundsTo( vBox ).centerY;

    super( content, combineOptions<PanelOptions>( {}, FMWConstants.PANEL_OPTIONS, {

      // PanelOptions
      maxWidth: 258, // as a fallback, in case some subcomponent is misbehaving
      tandem: tandem
    } ) );

    // pdom - traversal order
    // See https://github.com/phetsims/fourier-making-waves/issues/53
    this.pdomOrder = [
      infoButton,
      vBox
    ];
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

/**
 * FourierSeriesSubpanel is the 'Fourier Series' subpanel of this control panel.
 */
class FourierSeriesSubpanel extends VBox {

  public readonly fourierSeriesText: Text;

  public constructor( fourierSeries: DiscreteFourierSeries, waveformProperty: Property<Waveform>,
                      popupParent: Node, tandem: Tandem ) {

    // To make all labels have the same effective width
    const labelsAlignBoxOptions: AlignBoxOptions = {
      xAlign: 'left',
      group: new AlignGroup( {
        matchVertical: false
      } )
    };

    // Title for this subpanel
    const fourierSeriesText = new Text( FourierMakingWavesStrings.fourierSeriesStringProperty, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 180 // determined empirically
    } );

    // Waveform combo box
    const waveformText = new Text( FourierMakingWavesStrings.waveformStringProperty, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 70 // determined empirically
    } );

    const waveformComboBox = new WaveformComboBox( waveformProperty, popupParent,
      tandem.createTandem( 'waveformComboBox' ) );

    const waveformBox = new HBox( {
      spacing: 3,
      children: [ new AlignBox( waveformText, labelsAlignBoxOptions ), waveformComboBox ]
    } );

    // Harmonics spinner
    const harmonicsText = new Text( FourierMakingWavesStrings.harmonicsStringProperty, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 70  // determined empirically
    } );

    const harmonicsSpinner = new HarmonicsSpinner( fourierSeries.numberOfHarmonicsProperty,
      tandem.createTandem( 'harmonicsSpinner' ) );

    const harmonicsBox = new HBox( {
      spacing: 5,
      children: [ new AlignBox( harmonicsText, labelsAlignBoxOptions ), harmonicsSpinner ]
    } );

    // Sound checkbox and slider
    const soundBox = new SoundBox( fourierSeries.soundEnabledProperty, fourierSeries.soundOutputLevelProperty,
      tandem.createTandem( 'soundBox' ) );

    super( {

      // VBoxOptions
      children: [
        fourierSeriesText,
        waveformBox,
        harmonicsBox,
        soundBox
      ],
      align: 'left',
      spacing: FMWConstants.VBOX_SPACING,
      tandem: tandem
    } );

    this.fourierSeriesText = fourierSeriesText;
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

/**
 * GraphControlsSubpanel is the 'Graph Controls' subpanel of this control panel.
 */
class GraphControlsSubpanel extends VBox {

  public constructor( domainProperty: EnumerationProperty<Domain>,
                      seriesTypeProperty: EnumerationProperty<SeriesType>,
                      equationFormProperty: EnumerationProperty<EquationForm>,
                      popupParent: Node,
                      tandem: Tandem ) {

    // To make all labels have the same effective width
    const labelsAlignBoxOptions: AlignBoxOptions = {
      xAlign: 'left',
      group: new AlignGroup( {
        matchVertical: false
      } )
    };

    // Title for this subpanel
    const graphControlsText = new Text( FourierMakingWavesStrings.graphControlsStringProperty, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 200 // determined empirically
    } );

    const functionOfText = new Text( FourierMakingWavesStrings.functionOfStringProperty, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 70 // determined empirically
    } );

    const domainComboBox = new DomainComboBox( domainProperty, popupParent,
      tandem.createTandem( 'functionOfComboBox' ) // tandem name differs by request
    );

    const functionOfBox = new HBox( {
      spacing: 5,
      children: [ new AlignBox( functionOfText, labelsAlignBoxOptions ), domainComboBox ]
    } );

    const seriesText = new Text( FourierMakingWavesStrings.seriesStringProperty, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 70 // determined empirically
    } );

    const seriesTypeRadioButtonGroup = new SeriesTypeRadioButtonGroup( seriesTypeProperty,
      tandem.createTandem( 'seriesRadioButtonGroup' ) // tandem name differs by request
    );

    const seriesBox = new HBox( {
      spacing: 10,
      children: [ new AlignBox( seriesText, labelsAlignBoxOptions ), seriesTypeRadioButtonGroup ]
    } );

    const equationText = new Text( FourierMakingWavesStrings.equationStringProperty, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 70 // determined empirically
    } );

    const equationComboBox = new EquationComboBox( equationFormProperty, domainProperty, popupParent,
      tandem.createTandem( 'equationComboBox' ) );

    const equationBox = new HBox( {
      spacing: 5,
      children: [ new AlignBox( equationText, labelsAlignBoxOptions ), equationComboBox ]
    } );

    super( {

      // VBoxOptions
      children: [
        graphControlsText,
        functionOfBox,
        seriesBox,
        equationBox
      ],
      align: 'left',
      spacing: FMWConstants.VBOX_SPACING,
      tandem: tandem
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

/**
 * MeasurementToolsSubpanel is the 'Measurement Tools' subpanel of this control panel.
 */
class MeasurementToolsSubpanel extends VBox {

  public constructor( wavelengthTool: DiscreteMeasurementTool, periodTool: DiscreteMeasurementTool,
                      domainProperty: EnumerationProperty<Domain>, tandem: Tandem ) {

    // Title for this subpanel
    const measurementToolsText = new Text( FourierMakingWavesStrings.measurementToolsStringProperty, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 200 // determined empirically
    } );

    // To make checkboxes have the same effective width
    const checkboxAlignBoxOptions: AlignBoxOptions = {
      group: new AlignGroup( { matchVertical: false } ),
      xAlign: 'left'
    };

    // To make spinners have the same effective width
    const spinnerAlignBoxOptions: AlignBoxOptions = {
      group: new AlignGroup( { matchVertical: false } ),
      xAlign: 'center'
    };

    const hBoxOptions = {
      spacing: 16
    };

    // Wavelength
    const wavelengthCheckbox = new WavelengthCheckbox( wavelengthTool.isSelectedProperty, domainProperty,
      tandem.createTandem( 'wavelengthCheckbox' ) );
    const wavelengthSpinner = new OrderSpinner( FMWSymbols.lambdaSymbolProperty, wavelengthTool.orderProperty, {
      enabledProperty: new DerivedProperty(
        [ wavelengthTool.isSelectedProperty, domainProperty ],
        ( isSelected, domain ) => isSelected && ( domain === Domain.SPACE || domain === Domain.SPACE_AND_TIME )
      ),
      tandem: tandem.createTandem( 'wavelengthSpinner' )
    } );
    const wavelengthBox = new HBox( combineOptions<HBoxOptions>( {}, hBoxOptions, {
      children: [
        new AlignBox( wavelengthCheckbox, checkboxAlignBoxOptions ),
        new AlignBox( wavelengthSpinner, spinnerAlignBoxOptions )
      ]
    } ) );

    // Period
    const periodCheckbox = new PeriodCheckbox( periodTool.isSelectedProperty, domainProperty,
      tandem.createTandem( 'periodCheckbox' ) );
    const periodSpinner = new OrderSpinner( FMWSymbols.TSymbolProperty, periodTool.orderProperty, {
      enabledProperty: new DerivedProperty(
        [ periodTool.isSelectedProperty, domainProperty ],
        ( isSelected, domain ) => isSelected && ( domain === Domain.TIME || domain === Domain.SPACE_AND_TIME )
      ),
      tandem: tandem.createTandem( 'periodSpinner' )
    } );
    const periodBox = new HBox( combineOptions<HBoxOptions>( {}, hBoxOptions, {
      children: [
        new AlignBox( periodCheckbox, checkboxAlignBoxOptions ),
        new AlignBox( periodSpinner, spinnerAlignBoxOptions )
      ]
    } ) );

    super( {

      // VBoxOptions
      children: [
        measurementToolsText,
        wavelengthBox,
        periodBox
      ],
      align: 'left',
      spacing: FMWConstants.VBOX_SPACING,
      tandem: tandem
    } );

    wavelengthTool.isSelectedProperty.link( () => wavelengthSpinner.interruptSubtreeInput() );
    periodTool.isSelectedProperty.link( () => periodSpinner.interruptSubtreeInput() );

    // Interrupt input for controls that can be disabled.
    wavelengthCheckbox.enabledProperty.link( () => wavelengthCheckbox.interruptSubtreeInput() );
    wavelengthSpinner.enabledProperty.link( () => wavelengthSpinner.interruptSubtreeInput() );
    periodCheckbox.enabledProperty.link( () => periodCheckbox.interruptSubtreeInput() );
    periodSpinner.enabledProperty.link( () => periodSpinner.interruptSubtreeInput() );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

/**
 * SoundBox contains controls for enabling sound and adjusting output level. It's used to control the sound
 * associated with the Fourier series.
 */
class SoundBox extends HBox {

  public constructor( soundEnabledProperty: Property<boolean>, soundOutputLevelProperty: NumberProperty, tandem: Tandem ) {

    // Checkbox with music icon
    const soundEnabledCheckbox = new FourierSoundEnabledCheckbox( soundEnabledProperty,
      tandem.createTandem( 'soundEnabledCheckbox' ) );

    // Slider for controlling output level
    const outputLevelSlider = new HSlider( soundOutputLevelProperty, soundOutputLevelProperty.range, {
      thumbSize: new Dimension2( 10, 20 ),
      trackSize: new Dimension2( 100, 3 ),
      trackStroke: Color.grayColor( 160 ),
      soundGenerator: null,
      tandem: tandem.createTandem( 'outputLevelSlider' )
    } );

    // Icons at the extremes of the slider
    const iconOptions = {
      scale: 0.037,
      fill: 'black'
    };
    const minVolumeIcon = new Path( soundOutputLevelProperty.range.min === 0 ? volumeOffSolidShape : volumeDownSolidShape, iconOptions );
    const maxVolumeIcon = new Path( volumeUpSolidShape, iconOptions );

    // Layout for slider and icons
    const sliderBox = new HBox( {
      children: [ minVolumeIcon, outputLevelSlider, maxVolumeIcon ],
      spacing: 5
    } );

    super( {

      // HBoxOptions
      children: [ soundEnabledCheckbox, sliderBox ],
      spacing: 20,
      tandem: tandem
    } );

    // Disable this control when UI sounds are not being produced.
    audioManager.audioAndSoundEnabledProperty.link( audioAndSoundEnabled => {
      this.interruptSubtreeInput();
      soundEnabledCheckbox.enabled = audioAndSoundEnabled;
      outputLevelSlider.enabled = audioAndSoundEnabled;
      minVolumeIcon.opacity = audioAndSoundEnabled ? 1 : SceneryConstants.DISABLED_OPACITY;
      maxVolumeIcon.opacity = audioAndSoundEnabled ? 1 : SceneryConstants.DISABLED_OPACITY;
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

fourierMakingWaves.register( 'DiscreteControlPanel', DiscreteControlPanel );