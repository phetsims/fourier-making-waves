// Copyright 2020-2021, University of Colorado Boulder

/**
 * WavePacketScreenView is the view for the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import Property from '../../../../axon/js/Property.js';
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

    // To improve readability
    const layoutBounds = this.layoutBounds;

    // Parent for all popups
    const popupParent = new Node();

    // Parent tandem for all charts
    const chartsTandem = options.tandem.createTandem( 'charts' );

    // Amplitudes chart -------------------------------------------------------------------

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

    // Components chart -------------------------------------------------------------------

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

    // Sum chart -------------------------------------------------------------------

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

    // Measurement Tools -------------------------------------------------------------------

    // Drag bounds will be adjusted later, to constrain to specific charts.
    const componentSpacingToolDragBoundsProperty = new Property( this.layoutBounds );

    // Measures component spacing (k1 or omega1)
    const componentSpacingToolNode = new ComponentSpacingToolNode( model.wavePacket.componentSpacingProperty,
      amplitudesChartNode.chartTransform, model.domainProperty, componentSpacingToolDragBoundsProperty );

    // Other UI elements -------------------------------------------------------------------

    const controlPanel = new WavePacketControlPanel( model, popupParent, {
      tandem: options.tandem.createTandem( 'controlPanel' )
    } );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
      },
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );

    // Layout vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

    // Amplitudes chart at top left
    amplitudesExpandCollapseButton.left = layoutBounds.left + FMWConstants.SCREEN_VIEW_X_MARGIN;
    amplitudesExpandCollapseButton.top = layoutBounds.top + 10;
    amplitudesChartNode.x = FMWConstants.X_CHART_RECTANGLES;
    amplitudesChartNode.y = amplitudesExpandCollapseButton.bottom + TITLE_BOTTOM_SPACING;
    const amplitudeChartRectangleLocalBounds = amplitudesChartNode.chartRectangle.boundsTo( this );
    continuousWaveformCheckbox.right = amplitudeChartRectangleLocalBounds.right - 5;
    continuousWaveformCheckbox.top = amplitudesChartNode.bottom + 8;

    // Components chart below the Amplitudes chart
    componentsExpandCollapseButton.left = layoutBounds.left + FMWConstants.SCREEN_VIEW_X_MARGIN;
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

    // Measurement tools in upper-right corner of their associated charts
    componentSpacingToolNode.top = amplitudeChartRectangleLocalBounds.top + 5;
    componentSpacingToolNode.right = amplitudeChartRectangleLocalBounds.right - 20;

    // Control panel centered in the space to the right of the charts
    controlPanel.centerX = amplitudesChartNode.right + ( layoutBounds.right - amplitudesChartNode.right ) / 2;
    controlPanel.top = layoutBounds.top + FMWConstants.SCREEN_VIEW_Y_MARGIN;

    // Reset All button at bottom right
    resetAllButton.right = layoutBounds.maxX - FMWConstants.SCREEN_VIEW_X_MARGIN;
    resetAllButton.bottom = layoutBounds.maxY - FMWConstants.SCREEN_VIEW_Y_MARGIN;

    // Layout ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

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
        componentSpacingToolNode,

        // parent for popups on top
        popupParent
      ]
    } );
    this.addChild( screenViewRootNode );

    // Center dynamic equations above their respective charts. Since we need to listen to the bounds of these equations
    // in order to respect their maxWidth, wrapper Nodes are transformed for equations that are dynamic.
    // See https://github.com/phetsims/fourier-making-waves/issues/40
    {
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
    }

    // Adjust drag bounds of measurement tools.
    componentSpacingToolDragBoundsProperty.value = amplitudeChartRectangleLocalBounds.dilatedXY( 25, 25 );

    // pdom -traversal order
    // See https://github.com/phetsims/fourier-making-waves/issues/53 and https://github.com/phetsims/fourier-making-waves/issues/84.
    screenViewRootNode.pdomOrder = [
      controlPanel,
      //TODO https://github.com/phetsims/fourier-making-waves/issues/84 put measurement tools here
      componentSpacingToolNode,
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