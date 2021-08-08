// Copyright 2020-2021, University of Colorado Boulder

/**
 * WavePacketScreenView is the view for the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

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

    // Parent tandem for all components related to the Components chart
    const amplitudesTandem = chartsTandem.createTandem( 'amplitudes' );

    // Button to show/hide the Amplitudes chart
    const amplitudesExpandCollapseButton = new LabeledExpandCollapseButton(
      fourierMakingWavesStrings.amplitudesOfFourierComponents, model.amplitudesChart.chartVisibleProperty, {
        textOptions: { maxWidth: 300 },
        tandem: amplitudesTandem.createTandem( 'amplitudesExpandCollapseButton' )
      } );

    // Amplitudes chart
    const amplitudesChartNode = new WavePacketAmplitudesChartNode( model.amplitudesChart, {
      visibleProperty: model.amplitudesChart.chartVisibleProperty,
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
      tandem: amplitudesTandem.createTandem( 'equationNode' )
    } );
    const amplitudeEquationWrapperNode = new Node( {
      visibleProperty: model.amplitudesChart.chartVisibleProperty,
      children: [ amplitudeEquationNode ]
    } );

    const continuousWaveformCheckbox = new ContinuousWaveformCheckbox(
      model.amplitudesChart.continuousWaveformVisibleProperty, {
        visibleProperty: model.amplitudesChart.chartVisibleProperty,
        tandem: amplitudesTandem.createTandem( 'continuousWaveformCheckbox' )
      } );
    this.addChild( continuousWaveformCheckbox );

    // Parent tandem for all components related to the Components chart
    const componentsTandem = chartsTandem.createTandem( 'components' );

    // Button to show/hide the Components chart
    const componentsExpandCollapseButton = new LabeledExpandCollapseButton(
      fourierMakingWavesStrings.fourierComponents, model.componentsChart.chartVisibleProperty, {
        tandem: componentsTandem.createTandem( 'componentsExpandCollapseButton' )
      } );

    // Components chart
    const componentsChartNode = new WavePacketComponentsChartNode( model.componentsChart, {
      visibleProperty: model.componentsChart.chartVisibleProperty,
      tandem: componentsTandem.createTandem( 'componentsChartNode' )
    } );

    // Equation above the Components chart
    const componentsEquationNode = new ComponentsEquationNode( model.domainProperty, model.seriesTypeProperty, {
      maxWidth: 0.5 * FMWConstants.CHART_RECTANGLE_SIZE.width,
      tandem: componentsTandem.createTandem( 'equationNode' )
    } );
    const componentsEquationWrapperNode = new Node( {
      visibleProperty: model.componentsChart.chartVisibleProperty,
      children: [ componentsEquationNode ]
    } );

    // Parent tandem for all components related to the Sum chart
    const sumTandem = chartsTandem.createTandem( 'sum' );

    // Button to show/hide the Sum chart
    const sumExpandCollapseButton = new LabeledExpandCollapseButton(
      fourierMakingWavesStrings.sum, model.sumChart.chartVisibleProperty, {
        tandem: sumTandem.createTandem( 'sumExpandCollapseButton' )
      } );

    // Sum chart
    const sumChartNode = new WavePacketSumChartNode( model.sumChart, {
      visibleProperty: model.sumChart.chartVisibleProperty,
      tandem: sumTandem.createTandem( 'sumChartNode' )
    } );

    // Equation above the Sum chart
    const sumEquationNode = new WavePacketSumEquationNode( model.domainProperty, model.seriesTypeProperty,
      model.wavePacket.componentSpacingProperty, {
        maxWidth: 0.5 * FMWConstants.CHART_RECTANGLE_SIZE.width,
        tandem: sumTandem.createTandem( 'equationNode' )
      } );
    const sumEquationWrapperNode = new Node( {
      visibleProperty: model.sumChart.chartVisibleProperty,
      children: [ sumEquationNode ]
    } );

    // Waveform Envelope checkbox
    const waveformEnvelopeCheckbox = new WaveformEnvelopeCheckbox( model.sumChart.waveformEnvelopeVisibleProperty, {
      visibleProperty: model.sumChart.chartVisibleProperty,
      tandem: sumTandem.createTandem( 'waveformEnvelopeCheckbox' )
    } );

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
        amplitudeEquationWrapperNode,
        amplitudesChartNode,
        continuousWaveformCheckbox,
        componentsEquationWrapperNode,
        componentsExpandCollapseButton,
        componentsChartNode,
        sumEquationWrapperNode,
        sumExpandCollapseButton,
        sumChartNode,
        waveformEnvelopeCheckbox,
        controlPanel,
        resetAllButton,

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
        componentsEquationWrapperNode.centerX = componentsChartRectangleLocalBounds.centerX;
        componentsEquationWrapperNode.bottom = componentsChartRectangleLocalBounds.top - equationYSpacing;
      } );

      sumEquationNode.boundsProperty.link( () => {
        sumEquationWrapperNode.centerX = sumChartRectangleLocalBounds.centerX;
        sumEquationWrapperNode.bottom = sumChartRectangleLocalBounds.top - equationYSpacing;
      } );
    }

    // pdom -traversal order
    // See https://github.com/phetsims/fourier-making-waves/issues/53 and https://github.com/phetsims/fourier-making-waves/issues/84.
    screenViewRootNode.pdomOrder = [
      controlPanel,
      //TODO https://github.com/phetsims/fourier-making-waves/issues/84 put measurement tools here
      amplitudesChartNode,
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