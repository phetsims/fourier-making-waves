// Copyright 2020-2021, University of Colorado Boulder

/**
 * WavePacketScreenView is the view for the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import Range from '../../../../dot/js/Range.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import merge from '../../../../phet-core/js/merge.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import LabeledExpandCollapseButton from '../../common/view/LabeledExpandCollapseButton.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import WavePacketModel from '../model/WavePacketModel.js';
import ComponentsEquationNode from './ComponentsEquationNode.js';
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

    // Title above the Amplitudes chart
    const fourierComponentAmplitudesText = new Text( fourierMakingWavesStrings.fourierComponentAmplitudes, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 300,
      tandem: amplitudesTandem.createTandem( 'fourierComponentAmplitudesText' )
    } );

    // Equation above the Amplitudes chart
    const amplitudeEquationNode = new RichText( `${FMWSymbols.A}<sub>${FMWSymbols.n}</sub>`, {
      font: FMWConstants.EQUATION_FONT,
      maxWidth: 100,
      tandem: amplitudesTandem.createTandem( 'equationNode' )
    } );

    // Amplitudes chart
    const amplitudesChartNode = new WavePacketAmplitudesChartNode( model.amplitudesChart, {
      chartTransformOptions: {
        modelXRange: model.wavePacket.waveNumberRange,
        modelYRange: new Range( 0, model.maxAmplitude ) //TODO this needs to autoscale!
      },
      tandem: amplitudesTandem.createTandem( 'amplitudesChartNode' )
    } );

    // Parent tandem for all components related to the Components chart
    const componentsTandem = chartsTandem.createTandem( 'components' );

    // Equation above the Components chart
    const componentsEquationNode = new ComponentsEquationNode( model.domainProperty, model.seriesTypeProperty, {
      maxWidth: 0.5 * FMWConstants.CHART_RECTANGLE_SIZE.width,
      tandem: componentsTandem.createTandem( 'equationNode' )
    } );
    const componentsEquationWrapperNode = new Node( {
      visibleProperty: model.componentsChart.chartVisibleProperty,
      children: [ componentsEquationNode ]
    } );

    // Button to show/hide the Components chart
    const componentsExpandCollapseButton = new LabeledExpandCollapseButton(
      fourierMakingWavesStrings.fourierComponents, model.componentsChart.chartVisibleProperty, {
        tandem: componentsTandem.createTandem( 'componentsExpandCollapseButton' )
      } );

    // Components chart
    const componentsChartNode = new WavePacketComponentsChartNode( model.componentsChart, {
      tandem: componentsTandem.createTandem( 'componentsChartNode' )
    } );

    // Parent tandem for all components related to the Sum chart
    const sumTandem = chartsTandem.createTandem( 'sum' );

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

    // Button to show/hide the Sum chart
    const sumExpandCollapseButton = new LabeledExpandCollapseButton(
      fourierMakingWavesStrings.sum, model.sumChart.chartVisibleProperty, {
        tandem: sumTandem.createTandem( 'sumExpandCollapseButton' )
      } );

    // Sum chart
    const sumChartNode = new WavePacketSumChartNode( model.sumChart, {
      tandem: sumTandem.createTandem( 'sumChartNode' )
    } );

    const controlPanel = new WavePacketControlPanel( model, popupParent, {
      tandem: options.tandem.createTandem( 'controlPanel' )
    } );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );

    // Layout, constants determined empirically
    {
      // Amplitudes chart at top left
      fourierComponentAmplitudesText.left = layoutBounds.left + FMWConstants.SCREEN_VIEW_X_MARGIN;
      fourierComponentAmplitudesText.top = layoutBounds.top + 10;
      amplitudesChartNode.x = FMWConstants.X_CHART_RECTANGLES;
      amplitudesChartNode.y = fourierComponentAmplitudesText.bottom + TITLE_BOTTOM_SPACING;

      // Components chart below the Amplitudes chart
      componentsExpandCollapseButton.left = layoutBounds.left + FMWConstants.SCREEN_VIEW_X_MARGIN;
      componentsExpandCollapseButton.top = amplitudesChartNode.bottom;
      componentsChartNode.x = amplitudesChartNode.x;
      componentsChartNode.y = componentsExpandCollapseButton.bottom + TITLE_BOTTOM_SPACING;

      // Sum chart below the Components chart
      sumExpandCollapseButton.left = componentsExpandCollapseButton.left;
      sumExpandCollapseButton.top = componentsChartNode.bottom + 30;
      sumChartNode.x = componentsChartNode.x;
      sumChartNode.y = sumExpandCollapseButton.bottom + TITLE_BOTTOM_SPACING;

      // Control panel centered in the space to the right of the charts
      controlPanel.centerX = amplitudesChartNode.right + ( layoutBounds.right - amplitudesChartNode.right ) / 2;
      controlPanel.top = layoutBounds.top + FMWConstants.SCREEN_VIEW_Y_MARGIN;

      // Reset All button at bottom right
      resetAllButton.right = layoutBounds.maxX - FMWConstants.SCREEN_VIEW_X_MARGIN;
      resetAllButton.bottom = layoutBounds.maxY - FMWConstants.SCREEN_VIEW_Y_MARGIN;
    }

    // Add everything to one root Node, then add that root Node to the scene graph.
    // This should improve startup performance, compared to calling this.addChild for each Node.
    const screenViewRootNode = new Node( {
      children: [
        fourierComponentAmplitudesText,
        amplitudeEquationNode,
        amplitudesChartNode,
        componentsEquationWrapperNode,
        componentsExpandCollapseButton,
        componentsChartNode,
        sumEquationWrapperNode,
        sumExpandCollapseButton,
        sumChartNode,
        controlPanel,
        resetAllButton,

        // parent for popups on top
        popupParent
      ]
    } );
    this.addChild( screenViewRootNode );

    // Get the bounds of the ChartRectangles in this coordinate frame, used for layout.
    // Do this AFTER adding Nodes to the scene graph.
    const amplitudeChartRectangleLocalBounds = this.globalToLocalBounds( amplitudesChartNode.chartRectangle.parentToGlobalBounds( amplitudesChartNode.chartRectangle.bounds ) );
    const componentsChartRectangleLocalBounds = this.globalToLocalBounds( componentsChartNode.chartRectangle.parentToGlobalBounds( componentsChartNode.chartRectangle.bounds ) );
    const sumChartRectangleLocalBounds = this.globalToLocalBounds( sumChartNode.chartRectangle.parentToGlobalBounds( sumChartNode.chartRectangle.bounds ) );

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
      componentsExpandCollapseButton,
      componentsChartNode,
      sumExpandCollapseButton,
      sumChartNode,
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

  /**
   * Resets the view.
   * @public
   */
  reset() {
    //TODO
  }
}

fourierMakingWaves.register( 'WavePacketScreenView', WavePacketScreenView );
export default WavePacketScreenView;