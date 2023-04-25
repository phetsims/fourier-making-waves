// Copyright 2020-2023, University of Colorado Boulder

/**
 * DiscreteScreenView is the view for the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import merge from '../../../../phet-core/js/merge.js';
import EraserButton from '../../../../scenery-phet/js/buttons/EraserButton.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import OopsDialog from '../../../../scenery-phet/js/OopsDialog.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import { Node, Rectangle } from '../../../../scenery/js/imports.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWQueryParameters from '../../common/FMWQueryParameters.js';
import Domain from '../../common/model/Domain.js';
import AmplitudeKeypadDialog from '../../common/view/AmplitudeKeypadDialog.js';
import LabeledExpandCollapseButton from '../../common/view/LabeledExpandCollapseButton.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';
import DiscreteModel from '../model/DiscreteModel.js';
import EquationForm from '../model/EquationForm.js';
import Waveform from '../model/Waveform.js';
import DiscreteAmplitudesChartNode from './DiscreteAmplitudesChartNode.js';
import DiscreteControlPanel from './DiscreteControlPanel.js';
import DiscreteHarmonicsChartNode from './DiscreteHarmonicsChartNode.js';
import DiscreteSumChartNode from './DiscreteSumChartNode.js';
import DiscreteSumEquationNode from './DiscreteSumEquationNode.js';
import ExpandedFormButton from './ExpandedFormButton.js';
import ExpandedFormDialog from './ExpandedFormDialog.js';
import FourierSoundGenerator from './FourierSoundGenerator.js';
import HarmonicsEquationNode from './HarmonicsEquationNode.js';
import InfiniteHarmonicsCheckbox from './InfiniteHarmonicsCheckbox.js';
import PeriodCalipersNode from './PeriodCalipersNode.js';
import PeriodClockNode from './PeriodClockNode.js';
import WavelengthCalipersNode from './WavelengthCalipersNode.js';

export default class DiscreteScreenView extends ScreenView {

  /**
   * @param {DiscreteModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {
    assert && assert( model instanceof DiscreteModel );
    assert && assert( tandem instanceof Tandem );

    super( {
      tandem: tandem
    } );

    //------------------------------------------------------------------------------------------------------------------
    // Sound
    //------------------------------------------------------------------------------------------------------------------

    // Sound for the Fourier series
    const fourierSoundGenerator = new FourierSoundGenerator( model.fourierSeries );
    soundManager.addSoundGenerator( fourierSoundGenerator, {
      associatedViewNode: this
    } );

    //------------------------------------------------------------------------------------------------------------------
    // Amplitudes chart
    //------------------------------------------------------------------------------------------------------------------

    // Parent tandem for all charts
    const chartsTandem = tandem.createTandem( 'charts' );

    // Parent tandem for all elements related to the Amplitudes chart
    const amplitudesTandem = chartsTandem.createTandem( 'amplitudes' );

    // Keypad Dialog, for changing amplitude value
    const amplitudeKeypadDialog = new AmplitudeKeypadDialog( model.fourierSeries.amplitudeRange, {
      decimalPlaces: FMWConstants.DISCRETE_AMPLITUDE_DECIMAL_PLACES,
      layoutBounds: this.layoutBounds,
      tandem: amplitudesTandem.createTandem( 'amplitudeKeypadDialog' )
    } );

    // Amplitudes chart
    const amplitudesChartNode = new DiscreteAmplitudesChartNode( model.amplitudesChart, amplitudeKeypadDialog, {

      // Changing any amplitude switches the waveform to 'custom'.
      onEdit: () => { model.waveformProperty.value = Waveform.CUSTOM; },
      tandem: amplitudesTandem.createTandem( 'amplitudesChartNode' )
    } );

    // Disable the eraser button when all amplitudes are zero.
    const eraserButtonEnabledProperty = new DerivedProperty(
      [ model.fourierSeries.amplitudesProperty ],
      amplitudes => !!_.find( amplitudes, amplitude => ( amplitude !== 0 ) )
    );

    // Push button to reset all amplitudes to zero
    const eraserButton = new EraserButton( merge( {}, FMWConstants.ERASER_BUTTON_OPTIONS, {
      listener: () => {
        model.waveformProperty.value = Waveform.CUSTOM;
        model.fourierSeries.setAllAmplitudes( 0 );
      },
      enabledProperty: eraserButtonEnabledProperty,
      tandem: amplitudesTandem.createTandem( 'eraserButton' )
    } ) );

    // All of the elements that should be hidden when chartExpandedProperty is set to false.
    // In this screen, amplitudesChart.chartExpandedProperty can only be changed via PhET-iO.
    const amplitudesParentNode = new Node( {
      visibleProperty: model.amplitudesChart.chartExpandedProperty,
      children: [ amplitudesChartNode, eraserButton ]
    } );

    //------------------------------------------------------------------------------------------------------------------
    // Harmonics chart
    //------------------------------------------------------------------------------------------------------------------

    // Parent tandem for all elements related to the Harmonics chart
    const harmonicsTandem = chartsTandem.createTandem( 'harmonics' );

    // Button to show/hide the Harmonics chart and its related UI element
    const harmonicsExpandCollapseButton = new LabeledExpandCollapseButton(
      FourierMakingWavesStrings.harmonicsChartStringProperty, model.harmonicsChart.chartExpandedProperty, {
        tandem: harmonicsTandem.createTandem( 'harmonicsExpandCollapseButton' )
      } );

    // Harmonics chart
    const harmonicsChartNode = new DiscreteHarmonicsChartNode( model.harmonicsChart, {
      tandem: harmonicsTandem.createTandem( 'harmonicsChartNode' )
    } );

    // Equation that appears above the Harmonics chart, with wrapper Node to handle centering
    const harmonicsEquationNode = new HarmonicsEquationNode(
      model.domainProperty, model.seriesTypeProperty, model.equationFormProperty, {
        maxWidth: 0.5 * FMWConstants.CHART_RECTANGLE_SIZE.width,
        tandem: harmonicsTandem.createTandem( 'harmonicsEquationNode' ),
        visiblePropertyOptions: { phetioReadOnly: true }
      } );

    // All of the elements that should be hidden when chartExpandedProperty is set to false.
    // That can be done using harmonicsExpandCollapseButton, or by changing harmonicsChart.chartExpandedProperty via PhET-iO.
    const harmonicsParentNode = new Node( {
      visibleProperty: model.harmonicsChart.chartExpandedProperty,
      children: [ harmonicsChartNode, harmonicsEquationNode ]
    } );

    //------------------------------------------------------------------------------------------------------------------
    // Sum chart
    //------------------------------------------------------------------------------------------------------------------

    // Parent tandem for all elements related to the Sum chart
    const sumTandem = chartsTandem.createTandem( 'sum' );

    // Button to show/hide the Sum chart and its related UI element
    const sumExpandCollapseButton = new LabeledExpandCollapseButton(
      FourierMakingWavesStrings.sumStringProperty, model.sumChart.chartExpandedProperty, {
        tandem: sumTandem.createTandem( 'sumExpandCollapseButton' )
      } );

    // Sum chart
    const sumChartNode = new DiscreteSumChartNode( model.sumChart, {
      tandem: sumTandem.createTandem( 'sumChartNode' )
    } );

    // Equation that appears above the Sum chart, with wrapper Node to handle centering
    const sumEquationNodeTandem = sumTandem.createTandem( 'sumEquationNode' );
    const sumEquationNode = new DiscreteSumEquationNode( model.fourierSeries.numberOfHarmonicsProperty, model.domainProperty,
      model.seriesTypeProperty, model.equationFormProperty, {
        maxWidth: 0.5 * FMWConstants.CHART_RECTANGLE_SIZE.width,
        tandem: sumTandem.createTandem( 'sumEquationNode' ),
        visiblePropertyOptions: { phetioReadOnly: true }
      } );

    const expandedFormDialog = new ExpandedFormDialog(
      model.fourierSeries, model.domainProperty, model.seriesTypeProperty, model.equationFormProperty, {
        tandem: sumEquationNodeTandem.createTandem( 'expandedFormDialog' ),
        phetioDocumentation: 'This dialog shows the expanded form of the Sum equation.'
      } );

    // Push button that opens the 'Expanded Form' dialog
    const expandedFormButton = new ExpandedFormButton( {
      scale: 0.45,
      listener: () => expandedFormDialog.show(),

      // Make this button appear to be a child of sumEquationNode.
      tandem: sumEquationNodeTandem.createTandem( 'expandedFormButton' ),
      phetioDocumentation: 'Pressing this button opens a dialog that shows the expanded form of the Sum equation.'
    } );

    const sumEquationParentNode = new Node( {
      children: [ sumEquationNode, expandedFormButton ]
    } );

    // Shows the wave that the Fourier series is attempting to approximate
    const infiniteHarmonicsCheckbox = new InfiniteHarmonicsCheckbox( model.sumChart.infiniteHarmonicsVisibleProperty, {
      tandem: sumTandem.createTandem( 'infiniteHarmonicsCheckbox' )
    } );

    // Disable infiniteHarmonicsCheckbox for custom and wave-packet waveforms.
    model.waveformProperty.link( waveform => {
      infiniteHarmonicsCheckbox.interruptSubtreeInput();
      infiniteHarmonicsCheckbox.enabled = waveform.supportsInfiniteHarmonics;
    } );

    // All of the elements that should be hidden when chartExpandedProperty is set to false.
    // That can be done using sumExpandCollapseButton, or by changing sumChart.chartExpandedProperty via PhET-iO.
    const sumParentNode = new Node( {
      visibleProperty: model.sumChart.chartExpandedProperty,
      children: [ sumChartNode, sumEquationParentNode, infiniteHarmonicsCheckbox ]
    } );

    //------------------------------------------------------------------------------------------------------------------
    // Other UI elements
    //------------------------------------------------------------------------------------------------------------------

    // Parent for all popups
    const popupParent = new Node();

    // Control panel
    const controlPanel = new DiscreteControlPanel( model, popupParent, {
      maxWidth: 258, // as a fallback, in case some subcomponent is misbehaving
      tandem: tandem.createTandem( 'controlPanel' )
    } );

    // Time controls
    const timeControlNode = new TimeControlNode( model.isPlayingProperty, {
      playPauseStepButtonOptions: {
        playPauseButtonOptions: {
          //TODO https://github.com/phetsims/fourier-making-waves/issues/92 workaround, we do not want partial hotkey support for TimeControlNode
          includeGlobalHotkey: false
        },
        stepForwardButtonOptions: {
          listener: () => {
            if ( model.domainProperty.value === Domain.SPACE_AND_TIME ) {
              model.stepOnce();
            }
          }
        }
      },
      tandem: tandem.createTandem( 'timeControlNode' )
    } );

    // Enable time controls only when there is the possibility of animation.
    model.domainProperty.link( domain => {
      timeControlNode.enabled = ( domain === Domain.SPACE_AND_TIME );
    } );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        resetMeasurementTools();
      },
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    // Creating a sawtooth wave using cosines is impossible because it is asymmetric. Display a dialog if the user
    // attempts this.  The model is responsible for other adjustments. This dialog is created eagerly because it's
    // highly likely that this situation will be encountered.
    const oopsSawtoothWithCosinesDialog = new OopsDialog( FourierMakingWavesStrings.sawtoothWithCosinesStringProperty, {
      phetioReadOnly: true,
      visiblePropertyOptions: { phetioReadOnly: true },
      tandem: tandem.createTandem( 'oopsSawtoothWithCosinesDialog' )
    } );
    model.oopsSawtoothWithCosinesEmitter.addListener( () => oopsSawtoothWithCosinesDialog.show() );

    //------------------------------------------------------------------------------------------------------------------
    // Layout
    //------------------------------------------------------------------------------------------------------------------

    const chartTitleBottomSpacing = 15; // space below the title of a chart

    // Amplitudes chart at top left
    amplitudesChartNode.x = FMWConstants.X_CHART_RECTANGLES;
    amplitudesChartNode.y = 58;
    const amplitudesChartRectangleLocalBounds = amplitudesChartNode.chartRectangle.boundsTo( this );

    // Eraser button to the right of the amplitude NumberDisplays
    const amplitudesChartRightTop = amplitudesChartRectangleLocalBounds.rightTop;
    eraserButton.left = amplitudesChartRightTop.x + 10;
    eraserButton.bottom = amplitudesChartRightTop.y - 10;

    // Harmonics chart below the Amplitudes chart
    harmonicsExpandCollapseButton.left = this.layoutBounds.left + FMWConstants.SCREEN_VIEW_X_MARGIN;
    harmonicsExpandCollapseButton.top = amplitudesChartNode.bottom + 15;
    harmonicsChartNode.x = FMWConstants.X_CHART_RECTANGLES;
    harmonicsChartNode.y = harmonicsExpandCollapseButton.bottom + chartTitleBottomSpacing;
    const harmonicsChartRectangleLocalBounds = harmonicsChartNode.chartRectangle.boundsTo( this );

    // Sum chart below the Harmonics chart
    sumExpandCollapseButton.left = harmonicsExpandCollapseButton.left;
    sumExpandCollapseButton.top = harmonicsChartNode.bottom + 30;
    sumChartNode.x = FMWConstants.X_CHART_RECTANGLES;
    sumChartNode.y = sumExpandCollapseButton.bottom + chartTitleBottomSpacing;
    const sumChartRectangleLocalBounds = sumChartNode.chartRectangle.boundsTo( this );

    infiniteHarmonicsCheckbox.boundsProperty.link( bounds => {
      infiniteHarmonicsCheckbox.right = sumChartRectangleLocalBounds.right - 5;
      infiniteHarmonicsCheckbox.top = sumChartNode.bottom + 8;
    } );

    // Control panel to the right of the charts
    controlPanel.right = this.layoutBounds.right - FMWConstants.SCREEN_VIEW_X_MARGIN;
    controlPanel.top = this.layoutBounds.top + FMWConstants.SCREEN_VIEW_Y_MARGIN;

    // Time control below the control panel
    timeControlNode.left = controlPanel.left + 30;
    timeControlNode.bottom = this.layoutBounds.bottom - FMWConstants.SCREEN_VIEW_Y_MARGIN;

    // Reset All button at bottom right
    resetAllButton.right = this.layoutBounds.maxX - FMWConstants.SCREEN_VIEW_X_MARGIN;
    resetAllButton.bottom = this.layoutBounds.maxY - FMWConstants.SCREEN_VIEW_Y_MARGIN;

    //------------------------------------------------------------------------------------------------------------------
    // Rendering order
    //------------------------------------------------------------------------------------------------------------------

    // Measurement tools are created later, added to this parent so we know the rendering order.
    const measurementToolsParent = new Node();

    // Add everything to one root Node, then add that root Node to the scene graph.
    // This should improve startup performance, compared to calling this.addChild for each Node.
    const screenViewRootNode = new Node( {
      children: [
        amplitudesParentNode,
        harmonicsExpandCollapseButton,
        harmonicsParentNode,
        sumExpandCollapseButton,
        sumParentNode,
        measurementToolsParent,
        controlPanel,
        timeControlNode,
        resetAllButton,

        // parent for popups on top
        popupParent
      ]
    } );
    this.addChild( screenViewRootNode );

    //------------------------------------------------------------------------------------------------------------------
    // Equation positions
    //------------------------------------------------------------------------------------------------------------------

    // Center equations above their respective charts.
    // Since we need to listen to the bounds of these equations in order to respect their maxWidth, wrapper Nodes are
    // transformed. See https://github.com/phetsims/fourier-making-waves/issues/40

    // Space between top of the ChartRectangle and bottom of the equation
    const equationYSpacing = 3;

    harmonicsEquationNode.boundsProperty.link( () => {

      // Center the equation above the Harmonics chart.
      harmonicsEquationNode.centerX = harmonicsChartRectangleLocalBounds.centerX;
      harmonicsEquationNode.bottom = harmonicsChartRectangleLocalBounds.top - equationYSpacing;
    } );

    sumEquationNode.boundsProperty.link( () => {

      // Ensure that expandedFormButton is always above the chart, regardless of how tall the equation is.
      const maxHeight = Math.max( sumEquationNode.height, expandedFormButton.height );

      // Center the equation above the Sum chart.
      sumEquationNode.centerX = sumChartRectangleLocalBounds.centerX;
      sumEquationNode.centerY = sumChartRectangleLocalBounds.top - ( maxHeight / 2 ) - equationYSpacing;

      // Button to the right of the equation
      expandedFormButton.left = sumEquationNode.right + 20;
      expandedFormButton.centerY = sumEquationNode.centerY;
    } );

    // Visibility of the equations above the charts
    model.equationFormProperty.link( equationForm => {
      const visible = ( equationForm !== EquationForm.HIDDEN );
      harmonicsEquationNode.visible = visible;
      sumEquationParentNode.visible = visible;
    } );

    //------------------------------------------------------------------------------------------------------------------
    // Measurement tools
    //------------------------------------------------------------------------------------------------------------------

    // Create measurement tools after layout of charts, because their initial positions and drag bounds depend on
    // final positions and bounds of ChartRectangles.

    // Parent tandem for all measurement tools
    const measurementToolsTandem = tandem.createTandem( 'measurementTools' );

    // Drag bounds for all measurement tools.
    const measurementToolsDragBounds = new Bounds2(
      this.layoutBounds.left + 20,
      amplitudesChartRectangleLocalBounds.bottom,
      harmonicsChartRectangleLocalBounds.right + 20,
      this.layoutBounds.bottom - 20
    );

    // For measuring a harmonic's wavelength in the 'space' and 'space & time' Domains.
    const wavelengthCalipersNode = new WavelengthCalipersNode( model, harmonicsChartNode.chartTransform, {
      position: harmonicsChartRectangleLocalBounds.leftCenter,
      dragBounds: measurementToolsDragBounds,
      tandem: measurementToolsTandem.createTandem( 'wavelengthCalipersNode' )
    } );
    measurementToolsParent.addChild( wavelengthCalipersNode );

    // For measuring a harmonic's period in the time Domain.
    const periodCalipersNode = new PeriodCalipersNode( model, harmonicsChartNode.chartTransform, {
      position: harmonicsChartRectangleLocalBounds.leftCenter,
      dragBounds: measurementToolsDragBounds,
      tandem: measurementToolsTandem.createTandem( 'periodCalipersNode' )
    } );
    measurementToolsParent.addChild( periodCalipersNode );

    // For measuring a harmonic's period in the 'space & time' Domain.
    const periodClockNode = new PeriodClockNode( model, {
      position: new Vector2(
        harmonicsChartRectangleLocalBounds.right,
        harmonicsChartNode.bottom + ( sumChartRectangleLocalBounds.minY - harmonicsChartNode.bottom ) / 2
      ),
      dragBounds: measurementToolsDragBounds,
      tandem: measurementToolsTandem.createTandem( 'periodClockNode' )
    } );
    measurementToolsParent.addChild( periodClockNode );

    // Show drag bounds for the measurement tools.
    if ( FMWQueryParameters.debugTools ) {
      measurementToolsParent.addChild( new Rectangle( measurementToolsDragBounds, {
        stroke: 'red'
      } ) );
    }

    const resetMeasurementTools = () => {
      wavelengthCalipersNode.reset();
      periodCalipersNode.reset();
      periodClockNode.reset();
    };

    //------------------------------------------------------------------------------------------------------------------
    // PDOM
    //------------------------------------------------------------------------------------------------------------------

    // pdom -traversal order
    // See https://github.com/phetsims/fourier-making-waves/issues/53
    screenViewRootNode.pdomOrder = [
      amplitudesChartNode,
      eraserButton,
      controlPanel,
      wavelengthCalipersNode,
      periodCalipersNode,
      periodClockNode,
      harmonicsExpandCollapseButton,
      harmonicsChartNode,
      sumExpandCollapseButton,
      expandedFormButton,
      sumChartNode,
      infiniteHarmonicsCheckbox,
      timeControlNode,
      resetAllButton
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

fourierMakingWaves.register( 'DiscreteScreenView', DiscreteScreenView );