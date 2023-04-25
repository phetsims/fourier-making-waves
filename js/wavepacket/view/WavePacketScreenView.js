// Copyright 2020-2023, University of Colorado Boulder

/**
 * WavePacketScreenView is the view for the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import { Node, Rectangle, RichText } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWQueryParameters from '../../common/FMWQueryParameters.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import LabeledExpandCollapseButton from '../../common/view/LabeledExpandCollapseButton.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';
import WavePacketModel from '../model/WavePacketModel.js';
import ComponentsEquationText from './ComponentsEquationText.js';
import ComponentSpacingToolNode from './ComponentSpacingToolNode.js';
import ContinuousWaveformCheckbox from './ContinuousWaveformCheckbox.js';
import WaveformEnvelopeCheckbox from './WaveformEnvelopeCheckbox.js';
import WavePacketAmplitudesChartNode from './WavePacketAmplitudesChartNode.js';
import WavePacketComponentsChartNode from './WavePacketComponentsChartNode.js';
import WavePacketControlPanel from './WavePacketControlPanel.js';
import WavePacketLengthToolNode from './WavePacketLengthToolNode.js';
import WavePacketSumChartNode from './WavePacketSumChartNode.js';
import WavePacketSumEquationNode from './WavePacketSumEquationNode.js';

export default class WavePacketScreenView extends ScreenView {

  /**
   * @param {WavePacketModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {
    assert && assert( model instanceof WavePacketModel );
    assert && assert( tandem instanceof Tandem );

    super( {
      tandem: tandem
    } );

    //------------------------------------------------------------------------------------------------------------------
    // View Properties
    //------------------------------------------------------------------------------------------------------------------

    // Parent tandem for all charts
    const viewPropertiesTandem = tandem.createTandem( 'viewProperties' );

    // View Properties
    const componentSpacingToolVisibleProperty = new BooleanProperty( false, {
      tandem: viewPropertiesTandem.createTandem( 'componentSpacingToolVisibleProperty' )
    } );

    const lengthToolVisibleProperty = new BooleanProperty( false, {
      tandem: viewPropertiesTandem.createTandem( 'lengthToolVisibleProperty' )
    } );

    //------------------------------------------------------------------------------------------------------------------
    // Amplitudes chart
    //------------------------------------------------------------------------------------------------------------------

    // Parent tandem for all charts
    const chartsTandem = tandem.createTandem( 'charts' );

    // Parent tandem for all elements related to the Amplitudes chart
    const amplitudesTandem = chartsTandem.createTandem( 'amplitudes' );

    // Button to show/hide the Amplitudes chart and its related UI element
    const amplitudesExpandCollapseButton = new LabeledExpandCollapseButton(
      FourierMakingWavesStrings.amplitudesOfFourierComponentsStringProperty,
      model.amplitudesChart.chartExpandedProperty, {
        textOptions: { maxWidth: 300 },
        tandem: amplitudesTandem.createTandem( 'amplitudesExpandCollapseButton' )
      } );

    // 'Amplitudes of Fourier Components' chart
    const amplitudesChartNode = new WavePacketAmplitudesChartNode( model.amplitudesChart, {
      chartTransformOptions: {
        modelXRange: model.wavePacket.waveNumberRange
        // modelYRange will automatically scale to fit the data set
      },
      tandem: amplitudesTandem.createTandem( 'amplitudesChartNode' )
    } );

    const amplitudesEquationStringProperty = new DerivedProperty(
      [ FMWSymbols.AStringProperty, FMWSymbols.nStringProperty ],
      ( A, n ) => `${A}<sub>${n}</sub>`
    );

    // Equation above the Amplitudes chart
    const amplitudesEquationText = new RichText( amplitudesEquationStringProperty, {
      font: FMWConstants.EQUATION_FONT,
      maxWidth: 100,
      tandem: amplitudesTandem.createTandem( 'amplitudesEquationText' )
    } );

    const continuousWaveformCheckbox = new ContinuousWaveformCheckbox(
      model.amplitudesChart.continuousWaveformVisibleProperty, {
        tandem: amplitudesTandem.createTandem( 'continuousWaveformCheckbox' )
      } );

    // All of the elements that should be hidden when chartExpandedProperty is set to false.
    // That can be done using amplitudesExpandCollapseButton, or by changing amplitudesChart.chartExpandedProperty via PhET-iO.
    const amplitudesParentNode = new Node( {
      visibleProperty: model.amplitudesChart.chartExpandedProperty,
      children: [ amplitudesChartNode, amplitudesEquationText, continuousWaveformCheckbox ]
    } );

    //------------------------------------------------------------------------------------------------------------------
    // Components chart
    //------------------------------------------------------------------------------------------------------------------

    // Parent tandem for all elements related to the Components chart
    const componentsTandem = chartsTandem.createTandem( 'components' );

    // Button to show/hide the Components chart and its related UI element
    const componentsExpandCollapseButton = new LabeledExpandCollapseButton(
      FourierMakingWavesStrings.fourierComponentsStringProperty, model.componentsChart.chartExpandedProperty, {
        tandem: componentsTandem.createTandem( 'componentsExpandCollapseButton' )
      } );

    // Components chart
    const componentsChartNode = new WavePacketComponentsChartNode( model.componentsChart, {
      tandem: componentsTandem.createTandem( 'componentsChartNode' )
    } );

    // Equation above the Components chart
    const componentsEquationText = new ComponentsEquationText( model.domainProperty, model.seriesTypeProperty, {
      maxWidth: 0.5 * FMWConstants.CHART_RECTANGLE_SIZE.width,
      tandem: componentsTandem.createTandem( 'componentsEquationText' )
    } );

    // All of the elements that should be hidden when chartExpandedProperty is set to false.
    // That can be done using harmonicsExpandCollapseButton, or by changing harmonicsChart.chartExpandedProperty via PhET-iO.
    const componentsParentNode = new Node( {
      visibleProperty: model.componentsChart.chartExpandedProperty,
      children: [ componentsChartNode, componentsEquationText ]
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
    const sumChartNode = new WavePacketSumChartNode( model.sumChart, {
      tandem: sumTandem.createTandem( 'sumChartNode' )
    } );

    // Equation above the Sum chart
    const sumEquationNode = new WavePacketSumEquationNode( model.domainProperty, model.seriesTypeProperty,
      model.wavePacket.componentSpacingProperty, {
        maxWidth: 0.5 * FMWConstants.CHART_RECTANGLE_SIZE.width,
        tandem: sumTandem.createTandem( 'sumEquationNode' )
      } );

    // Waveform Envelope checkbox
    const waveformEnvelopeCheckbox = new WaveformEnvelopeCheckbox( model.sumChart.waveformEnvelopeVisibleProperty, {
      tandem: sumTandem.createTandem( 'waveformEnvelopeCheckbox' )
    } );

    // All of the elements that should be hidden when chartExpandedProperty is set to false.
    // That can be done using sumExpandCollapseButton, or by changing sumChart.chartExpandedProperty via PhET-iO.
    const sumParentNode = new Node( {
      visibleProperty: model.sumChart.chartExpandedProperty,
      children: [ sumChartNode, sumEquationNode, waveformEnvelopeCheckbox ]
    } );

    //------------------------------------------------------------------------------------------------------------------
    // Other UI elements
    //------------------------------------------------------------------------------------------------------------------

    // Parent for all popups
    const popupParent = new Node();

    const controlPanel = new WavePacketControlPanel( model, componentSpacingToolVisibleProperty,
      lengthToolVisibleProperty, popupParent, {
        tandem: tandem.createTandem( 'controlPanel' )
      } );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        resetMeasurementTools();
      },
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    //------------------------------------------------------------------------------------------------------------------
    // Layout
    //------------------------------------------------------------------------------------------------------------------

    const chartTitleBottomSpacing = 15; // space below the title of a chart

    // Amplitudes chart at top left
    amplitudesExpandCollapseButton.left = this.layoutBounds.left + FMWConstants.SCREEN_VIEW_X_MARGIN;
    amplitudesExpandCollapseButton.top = this.layoutBounds.top + 10;
    amplitudesChartNode.x = FMWConstants.X_CHART_RECTANGLES;
    amplitudesChartNode.y = amplitudesExpandCollapseButton.bottom + chartTitleBottomSpacing;
    const amplitudesChartRectangleLocalBounds = amplitudesChartNode.chartRectangle.boundsTo( this );

    continuousWaveformCheckbox.boundsProperty.link( bounds => {
      continuousWaveformCheckbox.right = amplitudesChartRectangleLocalBounds.right - 5;
      continuousWaveformCheckbox.top = amplitudesChartNode.bottom + 8;
    } );

    // Components chart below the Amplitudes chart
    componentsExpandCollapseButton.left = this.layoutBounds.left + FMWConstants.SCREEN_VIEW_X_MARGIN;
    componentsExpandCollapseButton.top = continuousWaveformCheckbox.bottom;
    componentsChartNode.x = amplitudesChartNode.x;
    componentsChartNode.y = componentsExpandCollapseButton.bottom + chartTitleBottomSpacing;
    const componentsChartRectangleLocalBounds = componentsChartNode.chartRectangle.boundsTo( this );

    // Sum chart below the Components chart
    sumExpandCollapseButton.left = componentsExpandCollapseButton.left;
    sumExpandCollapseButton.top = componentsChartNode.bottom + 30;
    sumChartNode.x = componentsChartNode.x;
    sumChartNode.y = sumExpandCollapseButton.bottom + chartTitleBottomSpacing;
    const sumChartRectangleLocalBounds = sumChartNode.chartRectangle.boundsTo( this );

    waveformEnvelopeCheckbox.boundsProperty.link( bounds => {
      waveformEnvelopeCheckbox.right = sumChartRectangleLocalBounds.right - 5;
      waveformEnvelopeCheckbox.top = sumChartNode.bottom + 8;
    } );

    // Reset All button at bottom right
    resetAllButton.right = this.layoutBounds.maxX - FMWConstants.SCREEN_VIEW_X_MARGIN;
    resetAllButton.bottom = this.layoutBounds.maxY - FMWConstants.SCREEN_VIEW_Y_MARGIN;

    // Control panel centered in the space to the right of the charts.
    // Constrain dimensions of the control panel as a fallback, so that sim is still usable if something unforeseen
    // happens - e.g. font size differences on platforms, or a subcomponent misbehaving.
    controlPanel.centerX = componentsChartNode.right + ( this.layoutBounds.right - componentsChartNode.right ) / 2;
    controlPanel.top = this.layoutBounds.top + 10; // a bit less than SCREEN_VIEW_X_MARGIN, to gain some height
    controlPanel.maxWidth = this.layoutBounds.right - controlPanel.width - FMWConstants.SCREEN_VIEW_X_MARGIN;
    controlPanel.maxHeight = resetAllButton.top - controlPanel.top - 5;

    //------------------------------------------------------------------------------------------------------------------
    // Rendering order
    //------------------------------------------------------------------------------------------------------------------

    // Measurement tools are created later, added to this parent so we know the rendering order.
    const measurementToolsParent = new Node();

    // Add everything to one root Node, then add that root Node to the scene graph.
    // This should improve startup performance, compared to calling this.addChild for each Node.
    const screenViewRootNode = new Node( {
      children: [
        amplitudesExpandCollapseButton,
        amplitudesParentNode,
        componentsExpandCollapseButton,
        componentsParentNode,
        sumExpandCollapseButton,
        sumParentNode,
        measurementToolsParent,
        controlPanel,
        resetAllButton,

        // parent for popups on top
        popupParent
      ]
    } );
    this.addChild( screenViewRootNode );

    //------------------------------------------------------------------------------------------------------------------
    // Equation positions
    //------------------------------------------------------------------------------------------------------------------

    // Center dynamic equations above their respective charts. Since we need to listen to the bounds of these equations
    // in order to respect their maxWidth, wrapper Nodes are transformed for equations that are dynamic.
    // See https://github.com/phetsims/fourier-making-waves/issues/40

    // Space between top of the ChartRectangle and bottom of the equation
    const equationYSpacing = 3;

    amplitudesEquationText.boundsProperty.link( () => {
      amplitudesEquationText.centerX = amplitudesChartRectangleLocalBounds.centerX;
      amplitudesEquationText.bottom = amplitudesChartRectangleLocalBounds.top - equationYSpacing;
    } );

    componentsEquationText.boundsProperty.link( () => {
      componentsEquationText.centerX = componentsChartRectangleLocalBounds.centerX;
      componentsEquationText.bottom = componentsChartRectangleLocalBounds.top - equationYSpacing;
    } );

    sumEquationNode.boundsProperty.link( () => {
      sumEquationNode.centerX = sumChartRectangleLocalBounds.centerX;
      sumEquationNode.bottom = sumChartRectangleLocalBounds.top - equationYSpacing;
    } );

    //------------------------------------------------------------------------------------------------------------------
    // Measurement Tools
    //------------------------------------------------------------------------------------------------------------------

    // Create measurement tools after layout of charts, because their initial positions and drag bounds depend on
    // final positions and bounds of ChartRectangles.

    // Parent tandem for all measurement tools
    const measurementToolsTandem = tandem.createTandem( 'measurementTools' );

    // Keep tool in the vicinity of the Amplitudes chart, and keep its label visible.
    const componentSpacingToolDragBounds = new Bounds2(
      amplitudesChartRectangleLocalBounds.left,
      amplitudesChartRectangleLocalBounds.top + 10,
      amplitudesChartRectangleLocalBounds.right + 15,
      amplitudesChartRectangleLocalBounds.bottom
    );

    // Component Spacing (k1 or omega1) measurement tool
    const componentSpacingToolNode = new ComponentSpacingToolNode( model.wavePacket.componentSpacingProperty,
      amplitudesChartNode.chartTransform, model.domainProperty, {
        position: new Vector2( amplitudesChartRectangleLocalBounds.right - 80, amplitudesChartRectangleLocalBounds.top + 50 ),
        dragBounds: componentSpacingToolDragBounds,
        visibleProperty: componentSpacingToolVisibleProperty,
        tandem: measurementToolsTandem.createTandem( 'componentSpacingToolNode' )
      } );
    measurementToolsParent.addChild( componentSpacingToolNode );

    // lengthToolNode can be dragged around on the Components and Sum charts.
    const lengthToolDragBounds = new Bounds2(
      componentsChartRectangleLocalBounds.left - 15,
      componentsChartRectangleLocalBounds.top,
      componentsChartRectangleLocalBounds.right + 20,
      this.layoutBounds.bottom - 20
    );

    // Wavelength (lamda1) or period (T1) tool
    const lengthToolNode = new WavePacketLengthToolNode( model.wavePacket.lengthProperty,
      componentsChartNode.chartTransform, model.domainProperty, {

        // See https://github.com/phetsims/fourier-making-waves/issues/134 for position.
        position: sumChartRectangleLocalBounds.center,
        dragBounds: lengthToolDragBounds,
        visibleProperty: lengthToolVisibleProperty,
        tandem: measurementToolsTandem.createTandem( 'lengthToolNode' )
      } );
    measurementToolsParent.addChild( lengthToolNode );

    // Show drag bounds for the measurement tools.
    if ( FMWQueryParameters.debugTools ) {
      measurementToolsParent.addChild( new Rectangle( componentSpacingToolDragBounds, {
        stroke: 'red'
      } ) );
      measurementToolsParent.addChild( new Rectangle( lengthToolDragBounds, {
        stroke: 'red'
      } ) );
    }

    const resetMeasurementTools = () => {
      componentSpacingToolVisibleProperty.reset();
      componentSpacingToolNode.reset();
      lengthToolVisibleProperty.reset();
      lengthToolNode.reset();
    };

    //------------------------------------------------------------------------------------------------------------------
    // PDOM
    //------------------------------------------------------------------------------------------------------------------

    // pdom - traversal order
    // See https://github.com/phetsims/fourier-making-waves/issues/53 and https://github.com/phetsims/fourier-making-waves/issues/84.
    screenViewRootNode.pdomOrder = [
      controlPanel,
      componentSpacingToolNode,
      lengthToolNode,
      amplitudesExpandCollapseButton,
      continuousWaveformCheckbox,
      componentsExpandCollapseButton,
      componentsChartNode,
      sumExpandCollapseButton,
      sumChartNode,
      waveformEnvelopeCheckbox,
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

fourierMakingWaves.register( 'WavePacketScreenView', WavePacketScreenView );