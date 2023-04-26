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
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import { AlignBox, AlignGroup, Color, HBox, HSeparator, Node, Path, SceneryConstants, Text, VBox } from '../../../../scenery/js/imports.js';
import volumeDownSolidShape from '../../../../sherpa/js/fontawesome-5/volumeDownSolidShape.js';
import volumeOffSolidShape from '../../../../sherpa/js/fontawesome-5/volumeOffSolidShape.js';
import volumeUpSolidShape from '../../../../sherpa/js/fontawesome-5/volumeUpSolidShape.js';
import HSlider from '../../../../sun/js/HSlider.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWColors from '../../common/FMWColors.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import Domain from '../../common/model/Domain.js';
import FourierSeries from '../../common/model/FourierSeries.js';
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

export default class DiscreteControlPanel extends Panel {

  /**
   * @param {DiscreteModel} model
   * @param {Node} popupParent
   * @param {Object} [options]
   */
  constructor( model, popupParent, options ) {

    assert && assert( model instanceof DiscreteModel );
    assert && assert( popupParent instanceof Node );

    options = merge( {}, FMWConstants.PANEL_OPTIONS, {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    const fourierSeriesSubpanel = new FourierSeriesSubpanel( model.fourierSeries, model.waveformProperty, popupParent, {
      tandem: options.tandem.createTandem( 'fourierSeriesSubpanel' )
    } );

    // {Node[]} logical sections of the control panel
    const sectionNodes = [
      fourierSeriesSubpanel,
      new GraphControlsSubpanel( model.domainProperty, model.seriesTypeProperty, model.equationFormProperty, popupParent, {
        tandem: options.tandem.createTandem( 'graphControlsSubpanel' )
      } ),
      new MeasurementToolsSubpanel( model.wavelengthTool, model.periodTool, model.domainProperty, {
        tandem: options.tandem.createTandem( 'measurementToolsSubpanel' )
      } )
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

    const vBox = new VBox( merge( {}, FMWConstants.VBOX_OPTIONS, {
      children: children
    } ) );

    // Dialog that displays a key for math symbols. Created eagerly and reused for PhET-iO.
    const infoDialog = new DiscreteInfoDialog( {
      tandem: options.tandem.createTandem( 'infoDialog' )
    } );

    // Button to open the dialog
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
    infoButton.centerY = fourierSeriesSubpanel.fourierSeriesText.boundsTo( vBox ).centerY;

    super( content, options );

    // pdom - traversal order
    // See https://github.com/phetsims/fourier-making-waves/issues/53
    this.pdomOrder = [
      infoButton,
      vBox
    ];
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
 * FourierSeriesSubpanel is the 'Fourier Series' subpanel of this control panel.
 */
class FourierSeriesSubpanel extends VBox {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {Property.<Waveform>} waveformProperty
   * @param {Node} popupParent
   * @param {Object} [options]
   */
  constructor( fourierSeries, waveformProperty, popupParent, options ) {

    assert && assert( fourierSeries instanceof FourierSeries );
    assert && AssertUtils.assertPropertyOf( waveformProperty, Waveform );
    assert && assert( popupParent instanceof Node );

    options = merge( {}, FMWConstants.VBOX_OPTIONS, {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // To make all labels have the same effective width
    const labelsAlignBoxOptions = {
      xAlign: 'left',
      group: new AlignGroup( {
        matchVertical: false
      } )
    };

    // Title for this subpanel
    const fourierSeriesText = new Text( FourierMakingWavesStrings.fourierSeriesStringProperty, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 180, // determined empirically
      tandem: options.tandem.createTandem( 'fourierSeriesText' )
    } );

    // Waveform combo box
    const waveformText = new Text( FourierMakingWavesStrings.waveformStringProperty, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 70, // determined empirically
      tandem: options.tandem.createTandem( 'waveformText' )
    } );

    const waveformComboBox = new WaveformComboBox( waveformProperty, popupParent,
      options.tandem.createTandem( 'waveformComboBox' ) );

    const waveformBox = new HBox( {
      spacing: 3,
      children: [ new AlignBox( waveformText, labelsAlignBoxOptions ), waveformComboBox ]
    } );

    // Harmonics spinner
    const harmonicsText = new Text( FourierMakingWavesStrings.harmonicsStringProperty, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 70,  // determined empirically
      tandem: options.tandem.createTandem( 'harmonicsText' )
    } );

    const harmonicsSpinner = new HarmonicsSpinner( fourierSeries.numberOfHarmonicsProperty, {
      tandem: options.tandem.createTandem( 'harmonicsSpinner' )
    } );

    const harmonicsBox = new HBox( {
      spacing: 5,
      children: [ new AlignBox( harmonicsText, labelsAlignBoxOptions ), harmonicsSpinner ]
    } );

    // Sound checkbox and slider
    const soundBox = new SoundBox( fourierSeries.soundEnabledProperty, fourierSeries.soundOutputLevelProperty, {
      tandem: options.tandem.createTandem( 'soundBox' )
    } );

    assert && assert( !options.children, 'FourierSeriesSubpanel sets children' );
    options.children = [
      fourierSeriesText,
      waveformBox,
      harmonicsBox,
      soundBox
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
 * GraphControlsSubpanel is the 'Graph Controls' subpanel of this control panel.
 */
class GraphControlsSubpanel extends VBox {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<SeriesType>} seriesTypeProperty
   * @param {EnumerationProperty.<EquationForm>} equationFormProperty
   * @param {Node} popupParent
   * @param {Object} [options]
   */
  constructor( domainProperty, seriesTypeProperty, equationFormProperty, popupParent, options ) {

    assert && assert( domainProperty instanceof EnumerationProperty );
    assert && assert( seriesTypeProperty instanceof EnumerationProperty );
    assert && assert( equationFormProperty instanceof EnumerationProperty );
    assert && assert( popupParent instanceof Node );

    options = merge( {}, FMWConstants.VBOX_OPTIONS, {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // To make all labels have the same effective width
    const labelsAlignBoxOptions = {
      xAlign: 'left',
      group: new AlignGroup( {
        matchVertical: false
      } )
    };

    // Title for this subpanel
    const graphControlsText = new Text( FourierMakingWavesStrings.graphControlsStringProperty, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 200, // determined empirically
      tandem: options.tandem.createTandem( 'graphControlsText' )
    } );

    const functionOfText = new Text( FourierMakingWavesStrings.functionOfStringProperty, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 70, // determined empirically
      tandem: options.tandem.createTandem( 'functionOfText' )
    } );

    const domainComboBox = new DomainComboBox( domainProperty, popupParent,
      options.tandem.createTandem( 'functionOfComboBox' ) // tandem name differs by request
    );

    const functionOfBox = new HBox( {
      spacing: 5,
      children: [ new AlignBox( functionOfText, labelsAlignBoxOptions ), domainComboBox ]
    } );

    const seriesText = new Text( FourierMakingWavesStrings.seriesStringProperty, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 70, // determined empirically
      tandem: options.tandem.createTandem( 'seriesText' )
    } );

    const seriesTypeRadioButtonGroup = new SeriesTypeRadioButtonGroup( seriesTypeProperty, {
      tandem: options.tandem.createTandem( 'seriesRadioButtonGroup' ) // tandem name differs by request
    } );

    const seriesBox = new HBox( {
      spacing: 10,
      children: [ new AlignBox( seriesText, labelsAlignBoxOptions ), seriesTypeRadioButtonGroup ]
    } );

    const equationText = new Text( FourierMakingWavesStrings.equationStringProperty, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 70, // determined empirically
      tandem: options.tandem.createTandem( 'equationText' )
    } );

    const equationComboBox = new EquationComboBox( equationFormProperty, domainProperty, popupParent,
      options.tandem.createTandem( 'equationComboBox' ) );

    const equationBox = new HBox( {
      spacing: 5,
      children: [ new AlignBox( equationText, labelsAlignBoxOptions ), equationComboBox ]
    } );

    assert && assert( !options.children, 'DiscreteGraphControlsSubpanel sets children' );
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

/**
 * MeasurementToolsSubpanel is the 'Measurement Tools' subpanel of this control panel.
 */
class MeasurementToolsSubpanel extends VBox {

  /**
   * @param {DiscreteMeasurementTool} wavelengthTool
   * @param {DiscreteMeasurementTool} periodTool
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Object} [options]
   */
  constructor( wavelengthTool, periodTool, domainProperty, options ) {

    assert && assert( wavelengthTool instanceof DiscreteMeasurementTool );
    assert && assert( periodTool instanceof DiscreteMeasurementTool );
    assert && assert( domainProperty instanceof EnumerationProperty );

    options = merge( {}, FMWConstants.VBOX_OPTIONS, {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // Title for this subpanel
    const measurementToolsText = new Text( FourierMakingWavesStrings.measurementToolsStringProperty, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 200, // determined empirically
      tandem: options.tandem.createTandem( 'measurementToolsText' )
    } );

    // To make checkboxes have the same effective width
    const checkboxAlignBoxOptions = {
      group: new AlignGroup( { matchVertical: false } ),
      xAlign: 'left'
    };

    // To make spinners have the same effective width
    const spinnerAlignBoxOptions = {
      group: new AlignGroup( { matchVertical: false } ),
      xAlign: 'center'
    };

    const hBoxOptions = {
      spacing: 16
    };

    // Wavelength
    const wavelengthCheckbox = new WavelengthCheckbox( wavelengthTool.isSelectedProperty, {
      maxWidth: 90,
      enabledProperty: new DerivedProperty(
        [ domainProperty ],
        domain => ( domain === Domain.SPACE || domain === Domain.SPACE_AND_TIME )
      ),
      tandem: options.tandem.createTandem( 'wavelengthCheckbox' )
    } );
    const wavelengthSpinner = new OrderSpinner( FMWSymbols.lambdaStringProperty, wavelengthTool.orderProperty, {
      enabledProperty: new DerivedProperty(
        [ wavelengthTool.isSelectedProperty, domainProperty ],
        ( isSelected, domain ) =>
          isSelected && ( domain === Domain.SPACE || domain === Domain.SPACE_AND_TIME )
      ),
      tandem: options.tandem.createTandem( 'wavelengthSpinner' )
    } );
    const wavelengthBox = new HBox( merge( {}, hBoxOptions, {
      children: [
        new AlignBox( wavelengthCheckbox, checkboxAlignBoxOptions ),
        new AlignBox( wavelengthSpinner, spinnerAlignBoxOptions )
      ]
    } ) );

    // Period
    const periodCheckbox = new PeriodCheckbox( periodTool.isSelectedProperty, {
      maxWidth: 90,
      enabledProperty: new DerivedProperty(
        [ domainProperty ],
        domain => ( domain === Domain.TIME || domain === Domain.SPACE_AND_TIME )
      ),
      tandem: options.tandem.createTandem( 'periodCheckbox' )
    } );
    const periodSpinner = new OrderSpinner( FMWSymbols.TStringProperty, periodTool.orderProperty, {
      enabledProperty: new DerivedProperty(
        [ periodTool.isSelectedProperty, domainProperty ],
        ( isSelected, domain ) =>
          isSelected && ( domain === Domain.TIME || domain === Domain.SPACE_AND_TIME )
      ),
      tandem: options.tandem.createTandem( 'periodSpinner' )
    } );
    const periodBox = new HBox( merge( {}, hBoxOptions, {
      children: [
        new AlignBox( periodCheckbox, checkboxAlignBoxOptions ),
        new AlignBox( periodSpinner, spinnerAlignBoxOptions )
      ]
    } ) );

    assert && assert( !options.children, 'MeasurementToolsSubpanel sets children' );
    options.children = [
      measurementToolsText,
      wavelengthBox,
      periodBox
    ];

    super( options );

    wavelengthTool.isSelectedProperty.link( () => wavelengthSpinner.interruptSubtreeInput() );
    periodTool.isSelectedProperty.link( () => periodSpinner.interruptSubtreeInput() );

    // Interrupt input for controls that can be disabled.
    wavelengthCheckbox.enabledProperty.link( () => wavelengthCheckbox.interruptSubtreeInput() );
    wavelengthSpinner.enabledProperty.link( () => wavelengthSpinner.interruptSubtreeInput() );
    periodCheckbox.enabledProperty.link( () => periodCheckbox.interruptSubtreeInput() );
    periodSpinner.enabledProperty.link( () => periodSpinner.interruptSubtreeInput() );
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
 * SoundBox contains controls for enabling sound and adjusting output level. It's used to control the sound
 * associated with the Fourier series.
 */
class SoundBox extends HBox {

  /**
   * @param {Property.<boolean>} soundEnabledProperty
   * @param {NumberProperty} soundOutputLevelProperty
   * @param {Object} [options]
   */
  constructor( soundEnabledProperty, soundOutputLevelProperty, options ) {

    assert && AssertUtils.assertPropertyOf( soundEnabledProperty, 'boolean' );
    assert && assert( soundOutputLevelProperty instanceof NumberProperty );
    assert && assert( soundOutputLevelProperty.range, 'soundOutputLevelProperty.range required' );

    options = merge( {

      // HBox options
      spacing: 20,

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // Checkbox with music icon
    const soundEnabledCheckbox = new FourierSoundEnabledCheckbox( soundEnabledProperty, {
      tandem: options.tandem.createTandem( 'soundEnabledCheckbox' )
    } );

    // Slider for controlling output level
    const outputLevelSlider = new HSlider( soundOutputLevelProperty, soundOutputLevelProperty.range, {
      thumbSize: new Dimension2( 10, 20 ),
      trackSize: new Dimension2( 100, 3 ),
      trackStroke: Color.grayColor( 160 ),
      soundGenerator: null,
      tandem: options.tandem.createTandem( 'outputLevelSlider' )
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

    assert && assert( !options.children, 'SoundBox sets children' );
    options.children = [ soundEnabledCheckbox, sliderBox ];

    super( options );

    // Disable this control when UI sounds are not being produced.
    audioManager.audioAndSoundEnabledProperty.link( audioAndSoundEnabled => {
      this.interruptSubtreeInput();
      soundEnabledCheckbox.enabled = audioAndSoundEnabled;
      outputLevelSlider.enabled = audioAndSoundEnabled;
      minVolumeIcon.opacity = audioAndSoundEnabled ? 1 : SceneryConstants.DISABLED_OPACITY;
      maxVolumeIcon.opacity = audioAndSoundEnabled ? 1 : SceneryConstants.DISABLED_OPACITY;
    } );
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

fourierMakingWaves.register( 'DiscreteControlPanel', DiscreteControlPanel );