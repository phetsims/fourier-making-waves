// Copyright 2020-2021, University of Colorado Boulder

/**
 * DiscreteControlPanel is the control panel for the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import AlignBox from '../../../../scenery/js/nodes/AlignBox.js';
import AlignGroup from '../../../../scenery/js/nodes/AlignGroup.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import SceneryConstants from '../../../../scenery/js/SceneryConstants.js';
import Color from '../../../../scenery/js/util/Color.js';
import musicSolidShape from '../../../../sherpa/js/fontawesome-5/musicSolidShape.js';
import volumeOffSolidShape from '../../../../sherpa/js/fontawesome-5/volumeOffSolidShape.js';
import volumeUpSolidShape from '../../../../sherpa/js/fontawesome-5/volumeUpSolidShape.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import HSeparator from '../../../../sun/js/HSeparator.js';
import HSlider from '../../../../sun/js/HSlider.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWColorProfile from '../../common/FMWColorProfile.js';
import FWMConstants from '../../common/FMWConstants.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymobls from '../../common/FMWSymbols.js';
import Domain from '../../common/model/Domain.js';
import SeriesType from '../../common/model/SeriesType.js';
import DomainComboBox from '../../common/view/DomainComboBox.js';
import SeriesTypeRadioButtonGroup from '../../common/view/SeriesTypeRadioButtonGroup.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import DiscreteModel from '../model/DiscreteModel.js';
import EquationForm from '../model/EquationForm.js';
import MeasurementTool from '../model/MeasurementTool.js';
import Waveform from '../model/Waveform.js';
import DiscreteSymbolsDialog from './DiscreteSymbolsDialog.js';
import EquationComboBox from './EquationComboBox.js';
import HarmonicsSpinner from './HarmonicsSpinner.js';
import OrderSpinner from './OrderSpinner.js';
import PeriodCheckbox from './PeriodCheckbox.js';
import WaveformComboBox from './WaveformComboBox.js';
import WavelengthCheckbox from './WavelengthCheckbox.js';

class DiscreteControlPanel extends Panel {

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

    const fourierSeriesLayoutBox = new FourierSeriesLayoutBox( model.waveformProperty, popupParent,
      model.fourierSeries.numberOfHarmonicsProperty, model.fourierSeriesSoundEnabledProperty,
      model.fourierSeriesSoundOutputLevelProperty, {
        tandem: options.tandem.createTandem( 'fourierSeriesLayoutBox' )
      } );

    // {Node[]} logical sections of the control panel
    const sectionNodes = [
      fourierSeriesLayoutBox,
      new GraphControlsLayoutBox( model.domainProperty, model.seriesTypeProperty, model.equationFormProperty, popupParent, {
        tandem: options.tandem.createTandem( 'graphControlsLayoutBox' )
      } ),
      new MeasurementToolsLayoutBox( model.wavelengthTool, model.periodTool, model.domainProperty, {
        tandem: options.tandem.createTandem( 'measurementToolsLayoutBox' )
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
      children: children
    } ) );

    // Dialog that displays a key for math symbols
    const symbolsDialog = new DiscreteSymbolsDialog();

    // Push button to open the dialog, vertically centered on the 'Fourier Series' title.
    const symbolsButton = new InfoButton( {
      listener: () => symbolsDialog.show(),
      iconFill: 'rgb( 50, 145, 184 )',
      scale: 0.4,
      right: vBox.right,
      centerY: fourierSeriesLayoutBox.globalToParentBounds(
        fourierSeriesLayoutBox.fourierSeriesText.parentToGlobalBounds( fourierSeriesLayoutBox.fourierSeriesText.bounds ) ).centerY
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
 * FourierSeriesLayoutBox is the 'Fourier Series' sub-panel of this control panel.
 */
class FourierSeriesLayoutBox extends VBox {

  /**
   * @param {EnumerationProperty.<Waveform>} waveformProperty
   * @param {Node} popupParent
   * @param {NumberProperty} numberOfHarmonicsProperty
   * @param {Property.<boolean>} soundEnabledProperty
   * @param {NumberProperty} soundOutputLevelProperty
   * @param {Object} [options]
   */
  constructor( waveformProperty, popupParent, numberOfHarmonicsProperty, soundEnabledProperty,
               soundOutputLevelProperty, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( waveformProperty, Waveform );
    assert && assert( numberOfHarmonicsProperty instanceof NumberProperty );
    assert && assert( popupParent instanceof Node );
    assert && AssertUtils.assertPropertyOf( soundEnabledProperty, 'boolean' );
    assert && assert( soundOutputLevelProperty instanceof NumberProperty );

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

    const fourierSeriesText = new Text( fourierMakingWavesStrings.fourierSeries, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 180, // determined empirically
      tandem: options.tandem.createTandem( 'fourierSeriesText' )
    } );

    // Waveform combo box
    const waveformText = new Text( fourierMakingWavesStrings.waveform, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 70, // determined empirically
      tandem: options.tandem.createTandem( 'waveformText' )
    } );

    const waveformComboBox = new WaveformComboBox( waveformProperty, popupParent, {
      tandem: options.tandem.createTandem( 'waveformComboBox' )
    } );

    const waveformBox = new HBox( {
      spacing: 3,
      children: [ new AlignBox( waveformText, labelsAlignBoxOptions ), waveformComboBox ]
    } );

    // Harmonics spinner
    const harmonicsText = new Text( fourierMakingWavesStrings.harmonics, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 70,  // determined empirically
      tandem: options.tandem.createTandem( 'harmonicsText' )
    } );

    const harmonicsSpinner = new HarmonicsSpinner( numberOfHarmonicsProperty, {
      tandem: options.tandem.createTandem( 'harmonicsSpinner' )
    } );

    const harmonicsBox = new HBox( {
      spacing: 5,
      children: [ new AlignBox( harmonicsText, labelsAlignBoxOptions ), harmonicsSpinner ]
    } );

    // Sound checkbox and slider
    const soundLayoutBox = new SoundLayoutBox( soundEnabledProperty, soundOutputLevelProperty, {
      tandem: options.tandem.createTandem( 'soundLayoutBox' )
    } );

    assert && assert( !options.children, 'FourierSeriesLayoutBox sets children' );
    options.children = [
      fourierSeriesText,
      waveformBox,
      harmonicsBox,
      soundLayoutBox
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
 * GraphControlsLayoutBox is the 'Graph Controls' sub-panel of this control panel.
 */
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

    assert && assert( !options.children, 'DiscreteGraphControlsLayoutBox sets children' );
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
 * MeasurementToolsLayoutBox is the 'Measurement Tools' sub-panel of this control panel.
 */
class MeasurementToolsLayoutBox extends VBox {

  /**
   * @param {MeasurementTool} wavelengthTool
   * @param {MeasurementTool} periodTool
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Object} [options]
   */
  constructor( wavelengthTool, periodTool, domainProperty, options ) {

    assert && assert( wavelengthTool instanceof MeasurementTool );
    assert && assert( periodTool instanceof MeasurementTool );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );

    options = merge( {}, FMWConstants.VBOX_OPTIONS, {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // Measurement Tools
    const measurementToolsText = new Text( fourierMakingWavesStrings.measurementTools, {
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
      spacing: 10
    };

    // Wavelength
    const wavelengthCheckbox = new WavelengthCheckbox( wavelengthTool.isSelectedProperty, {
      tandem: options.tandem.createTandem( 'wavelengthCheckbox' )
    } );
    const wavelengthSpinner = new OrderSpinner( FMWSymobls.lambda, wavelengthTool.orderProperty, {
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
      tandem: options.tandem.createTandem( 'periodCheckbox' )
    } );
    const periodSpinner = new OrderSpinner( FMWSymobls.T, periodTool.orderProperty, {
      tandem: options.tandem.createTandem( 'periodSpinner' )
    } );
    const periodBox = new HBox( merge( {}, hBoxOptions, {
      children: [
        new AlignBox( periodCheckbox, checkboxAlignBoxOptions ),
        new AlignBox( periodSpinner, spinnerAlignBoxOptions )
      ]
    } ) );

    assert && assert( !options.children, 'MeasurementToolsLayoutBox sets children' );
    options.children = [
      measurementToolsText,
      wavelengthBox,
      periodBox
    ];

    super( options );

    // unlink is not necessary
    wavelengthTool.isSelectedProperty.link( () => wavelengthSpinner.interruptSubtreeInput() );
    periodTool.isSelectedProperty.link( () => periodSpinner.interruptSubtreeInput() );

    // unlink is not necessary
    domainProperty.link( domain => {

      // Wavelength measurement is enabled when domain involves space.
      const hasSpace = ( domain === Domain.SPACE || domain === Domain.SPACE_AND_TIME );
      wavelengthCheckbox.enabledProperty.value = hasSpace;
      wavelengthSpinner.enabledProperty.value = hasSpace;

      // Period measurement is enabled when domain involves time.
      const hasTime = ( domain === Domain.TIME || domain === Domain.SPACE_AND_TIME );
      periodCheckbox.enabledProperty.value = hasTime;
      periodSpinner.enabledProperty.value = hasTime;
    } );

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
 * SoundLayoutBox contains controls for enabling sound and adjusting output level. It's used to control the sound
 * associated with the Fourier series.
 */
class SoundLayoutBox extends HBox {

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

    // Checkbox with fontawesome music icon
    const soundEnabledCheckbox = new Checkbox( new Path( musicSolidShape, {
      scale: 0.028,
      fill: 'black'
    } ), soundEnabledProperty, merge( {}, FMWConstants.CHECKBOX_OPTIONS, {
      tandem: options.tandem.createTandem( 'soundEnabledCheckbox' )
    } ) );

    // Slider for controlling output level
    //TODO https://github.com/phetsims/fourier-making-waves/issues/54 UI sound
    const outputLevelSlider = new HSlider( soundOutputLevelProperty, soundOutputLevelProperty.range, {
      thumbSize: new Dimension2( 10, 20 ),
      trackSize: new Dimension2( 100, 3 ),
      trackStroke: Color.grayColor( 160 ),
      tandem: options.tandem.createTandem( 'outputLevelSlider' )
    } );

    // Icons at the extremes of the slider
    const iconOptions = {
      scale: 0.037,
      fill: 'black'
    };
    const volumeOffIcon = new Path( volumeOffSolidShape, iconOptions );
    const volumeUpIcon = new Path( volumeUpSolidShape, iconOptions );

    // Layout for slider and icons
    const sliderBox = new HBox( {
      children: [ volumeOffIcon, outputLevelSlider, volumeUpIcon ],
      spacing: 5
    } );

    assert && assert( !options.children, 'SoundLayoutBox sets children' );
    options.children = [ soundEnabledCheckbox, sliderBox ];

    super( options );

    // Disable this control when UI sounds are disabled.
    //TODO https://github.com/phetsims/joist/issues/724 this is a temporary workaround, do not publish
    phet.joist.sim.allAudioEnabledProperty.link( enabled => {
      this.interruptSubtreeInput();
      soundEnabledCheckbox.enabled = enabled;
      outputLevelSlider.enabled = enabled;
      volumeOffIcon.opacity = enabled ? 1 : SceneryConstants.DISABLED_OPACITY;
      volumeUpIcon.opacity = enabled ? 1 : SceneryConstants.DISABLED_OPACITY;
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
export default DiscreteControlPanel;