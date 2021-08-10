// Copyright 2020-2021, University of Colorado Boulder

/**
 * WavePacketScreenView is the view for the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import merge from '../../../../phet-core/js/merge.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import LabeledExpandCollapseButton from '../../common/view/LabeledExpandCollapseButton.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import WavePacketModel from '../model/WavePacketModel.js';
import ComponentsEquationNode from './ComponentsEquationNode.js';
import ComponentSpacingToolNode from './ComponentSpacingToolNode.js';
import ContinuousWaveformCheckbox from './ContinuousWaveformCheckbox.js';
import WaveformEnvelopeCheckbox from './WaveformEnvelopeCheckbox.js';
import WavePacketAmplitudesChartNode from './WavePacketAmplitudesChartNode.js';
import WavePacketComponentsChartNode from './WavePacketComponentsChartNode.js';
import WavePacketControlPanel from './WavePacketControlPanel.js';
import WavePacketLengthToolNode from './WavePacketLengthToolNode.js';
import WavePacketSumChartNode from './WavePacketSumChartNode.js';
import WavePacketSumEquationNode from './WavePacketSumEquationNode.js';

// constants
const TITLE_BOTTOM_SPACING = 15; // space below the title of a chart

class WavePacketScreenView extends ScreenView {

  /**
   * @param {WavePacketModel} model
   * @param {Object} [options]
   */
  constructor( model, options ) {
    assert && assert( model instanceof WavePacketModel );

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    super( options );

    // Parent tandem for all charts
    const chartsTandem = options.tandem.createTandem( 'charts' );

    //------------------------------------------------------------------------------------------------------------------
    // Amplitudes chart
    //------------------------------------------------------------------------------------------------------------------

    // Parent tandem for all elements related to the Amplitudes chart
    const amplitudesTandem = chartsTandem.createTandem( 'amplitudes' );

    // Button to show/hide the Amplitudes chart and its related UI element
    const amplitudesExpandCollapseButton = new LabeledExpandCollapseButton(
      fourierMakingWavesStrings.amplitudesOfFourierComponents, model.amplitudesChart.chartVisibleProperty, {
        textOptions: { maxWidth: 300 },
        tandem: amplitudesTandem.createTandem( 'amplitudesExpandCollapseButton' )
      } );

    // Amplitudes chart
    const amplitudesChartNode = new WavePacketAmplitudesChartNode( model.amplitudesChart, {
      chartTransformOptions: {
        modelXRange: model.wavePacket.waveNumberRange
        // modelYRange will automatically scale to fit the data set
      },
      tandem: amplitudesTandem.createTandem( 'amplitudesChartNode' )
    } );

    // Equation above the Amplitudes chart
    const amplitudeEquationNode = new RichText( `${FMWSymbols.A}<sub>${FMWSymbols.n}</sub>`, {
      font: FMWConstants.EQUATION_FONT,
      maxWidth: 100,
      tandem: amplitudesTandem.createTandem( 'amplitudeEquationNode' )
    } );

    const continuousWaveformCheckbox = new ContinuousWaveformCheckbox(
      model.amplitudesChart.continuousWaveformVisibleProperty, {
        tandem: amplitudesTandem.createTandem( 'continuousWaveformCheckbox' )
      } );

    // All of the Amplitudes elements whose visibility should change together.
    const amplitudesParentNode = new Node( {
      visibleProperty: model.amplitudesChart.chartVisibleProperty,
      children: [ amplitudesChartNode, amplitudeEquationNode, continuousWaveformCheckbox ]
    } );

    //------------------------------------------------------------------------------------------------------------------
    // Components chart
    //------------------------------------------------------------------------------------------------------------------

    // Parent tandem for all elements related to the Components chart
    const componentsTandem = chartsTandem.createTandem( 'components' );

    // Button to show/hide the Components chart and its related UI element
    const componentsExpandCollapseButton = new LabeledExpandCollapseButton(
      fourierMakingWavesStrings.fourierComponents, model.componentsChart.chartVisibleProperty, {
        tandem: componentsTandem.createTandem( 'componentsExpandCollapseButton' )
      } );

    // Components chart
    const componentsChartNode = new WavePacketComponentsChartNode( model.componentsChart, {
      tandem: componentsTandem.createTandem( 'componentsChartNode' )
    } );

    // Equation above the Components chart
    const componentsEquationNode = new ComponentsEquationNode( model.domainProperty, model.seriesTypeProperty, {
      maxWidth: 0.5 * FMWConstants.CHART_RECTANGLE_SIZE.width,
      tandem: componentsTandem.createTandem( 'componentsEquationNode' )
    } );

    // All of the Components elements whose visibility should change together.
    const componentsParentNode = new Node( {
      visibleProperty: model.componentsChart.chartVisibleProperty,
      children: [ componentsChartNode, componentsEquationNode ]
    } );

    //------------------------------------------------------------------------------------------------------------------
    // Sum chart
    //------------------------------------------------------------------------------------------------------------------

    // Parent tandem for all elements related to the Sum chart
    const sumTandem = chartsTandem.createTandem( 'sum' );

    // Button to show/hide the Sum chart and its related UI element
    const sumExpandCollapseButton = new LabeledExpandCollapseButton(
      fourierMakingWavesStrings.sum, model.sumChart.chartVisibleProperty, {
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

    // All of the Sum elements whose visibility should change together.
    const sumParentNode = new Node( {
      visibleProperty: model.sumChart.chartVisibleProperty,
      children: [ sumChartNode, sumEquationNode, waveformEnvelopeCheckbox ]
    } );

    //------------------------------------------------------------------------------------------------------------------
    // Other UI elements
    //------------------------------------------------------------------------------------------------------------------

    // Parent for all popups
    const popupParent = new Node();

    const controlPanel = new WavePacketControlPanel( model, popupParent, {
      tandem: options.tandem.createTandem( 'controlPanel' )
    } );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        resetMeasurementTools();
      },
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );

    //------------------------------------------------------------------------------------------------------------------
    // Layout
    //------------------------------------------------------------------------------------------------------------------

    // Amplitudes chart at top left
    amplitudesExpandCollapseButton.left = this.layoutBounds.left + FMWConstants.SCREEN_VIEW_X_MARGIN;
    amplitudesExpandCollapseButton.top = this.layoutBounds.top + 10;
    amplitudesChartNode.x = FMWConstants.X_CHART_RECTANGLES;
    amplitudesChartNode.y = amplitudesExpandCollapseButton.bottom + TITLE_BOTTOM_SPACING;
    const amplitudeChartRectangleLocalBounds = amplitudesChartNode.chartRectangle.boundsTo( this );
    continuousWaveformCheckbox.right = amplitudeChartRectangleLocalBounds.right - 5;
    continuousWaveformCheckbox.top = amplitudesChartNode.bottom + 8;

    // Components chart below the Amplitudes chart
    componentsExpandCollapseButton.left = this.layoutBounds.left + FMWConstants.SCREEN_VIEW_X_MARGIN;
    componentsExpandCollapseButton.top = continuousWaveformCheckbox.bottom;
    componentsChartNode.x = amplitudesChartNode.x;
    componentsChartNode.y = componentsExpandCollapseButton.bottom + TITLE_BOTTOM_SPACING;
    const componentsChartRectangleLocalBounds = componentsChartNode.chartRectangle.boundsTo( this );

    // Sum chart below the Components chart
    sumExpandCollapseButton.left = componentsExpandCollapseButton.left;
    sumExpandCollapseButton.top = componentsChartNode.bottom + 30;
    sumChartNode.x = componentsChartNode.x;
    sumChartNode.y = sumExpandCollapseButton.bottom + TITLE_BOTTOM_SPACING;
    const sumChartRectangleLocalBounds = sumChartNode.chartRectangle.boundsTo( this );
    waveformEnvelopeCheckbox.right = sumChartRectangleLocalBounds.right - 5;
    waveformEnvelopeCheckbox.top = sumChartNode.bottom + 8;

    // Control panel centered in the space to the right of the charts
    controlPanel.centerX = amplitudesChartNode.right + ( this.layoutBounds.right - amplitudesChartNode.right ) / 2;
    controlPanel.top = this.layoutBounds.top + FMWConstants.SCREEN_VIEW_Y_MARGIN;

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
        amplitudesExpandCollapseButton,
        amplitudesParentNode,
        componentsExpandCollapseButton,
        componentsParentNode,
        sumExpandCollapseButton,
        sumParentNode,
        controlPanel,
        resetAllButton,
        measurementToolsParent,

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

    amplitudeEquationNode.boundsProperty.link( () => {
      amplitudeEquationNode.centerX = amplitudeChartRectangleLocalBounds.centerX;
      amplitudeEquationNode.bottom = amplitudeChartRectangleLocalBounds.top - equationYSpacing;
    } );

    componentsEquationNode.boundsProperty.link( () => {
      componentsEquationNode.centerX = componentsChartRectangleLocalBounds.centerX;
      componentsEquationNode.bottom = componentsChartRectangleLocalBounds.top - equationYSpacing;
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
    const measurementToolsTandem = options.tandem.createTandem( 'measurementTools' );

    // Component Spacing (k1 or omega1) measurement tool
    const componentSpacingToolNode = new ComponentSpacingToolNode( model.wavePacket.componentSpacingProperty,
      amplitudesChartNode.chartTransform, model.domainProperty, {
        position: new Vector2( amplitudeChartRectangleLocalBounds.right - 80, amplitudeChartRectangleLocalBounds.top + 50 ),
        dragBounds: amplitudeChartRectangleLocalBounds.withOffsets( 0, 10, 25, 0 ),
        tandem: measurementToolsTandem.createTandem( 'componentSpacingToolNode' )
      } );

    // So that this tool will change visibility with the other Amplitudes chart elements.
    amplitudesParentNode.addChild( componentSpacingToolNode );

    // lengthToolNode can be dragged around on the Components and Sum charts.
    const lengthToolDragBounds = new Bounds2(
      this.layoutBounds.left + 15,
      componentsChartRectangleLocalBounds.top,
      componentsChartRectangleLocalBounds.right + 25,
      this.layoutBounds.bottom - 5
    );

    // Wavelength (lamda1) or period (T1) tool
    const lengthToolNode = new WavePacketLengthToolNode( model.wavePacket.lengthProperty,
      componentsChartNode.chartTransform, model.domainProperty, {
        position: sumChartRectangleLocalBounds.center,
        dragBounds: lengthToolDragBounds,
        tandem: measurementToolsTandem.createTandem( 'componentSpacingToolNode' )
      } );

    // Wrap lengthToolNode in a parent Node, so that lengthToolNode can be permanently hidden via PhET-iO.
    const lengthToolParent = new Node( {
      children: [ lengthToolNode ],

      // Visible if either the Components or Sum chart is visible.
      visibleProperty: new DerivedProperty(
        [ model.componentsChart.chartVisibleProperty, model.sumChart.chartVisibleProperty ],
        ( componentsChartVisible, sumChartVisible ) => ( componentsChartVisible || sumChartVisible ) )
    } );
    measurementToolsParent.addChild( lengthToolParent );

    const resetMeasurementTools = () => {
      componentSpacingToolNode.reset();
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
export default WavePacketScreenView;