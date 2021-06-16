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
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import LabeledExpandCollapseButton from '../../common/view/LabeledExpandCollapseButton.js';
import DiscreteScreenView from '../../discrete/view/DiscreteScreenView.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import WavePacketModel from '../model/WavePacketModel.js';
import ComponentsChartNode from './ComponentsChartNode.js';
import ComponentsEquationNode from './ComponentsEquationNode.js';
import WavePacketAmplitudesChartNode from './WavePacketAmplitudesChartNode.js';
import WavePacketControlPanel from './WavePacketControlPanel.js';
import WavePacketSumChartNode from './WavePacketSumChartNode.js';
import WavePacketSumEquationNode from './WavePacketSumEquationNode.js';

// constants
const CHART_TITLE_Y_SPACING = 15; // space between chart title and the chart

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

    // Parent tandem for all components related to the Components chart
    const amplitudesTandem = options.tandem.createTandem( 'amplitudes' );

    // Equation above the Amplitudes chart
    const amplitudeEquationNode = new RichText( `${FMWSymbols.A}<sub>${FMWSymbols.n}</sub>`, {
      font: FMWConstants.EQUATION_FONT,
      tandem: amplitudesTandem.createTandem( 'equationNode' )
    } );

    // Amplitudes chart
    const amplitudesChartNode = new WavePacketAmplitudesChartNode( model.amplitudesChart, {
      transformOptions: {
        modelXRange: model.wavePacket.xRange,
        modelYRange: new Range( 0, model.maxAmplitude ), //TODO this needs to autoscale!
        viewWidth: DiscreteScreenView.CHART_RECTANGLE_SIZE.width,
        viewHeight: DiscreteScreenView.CHART_RECTANGLE_SIZE.height
      },
      tandem: options.tandem.createTandem( 'amplitudesChartNode' )
    } );

    // Parent tandem for all components related to the Components chart
    const componentsTandem = options.tandem.createTandem( 'components' );

    // Equation above the Components chart
    const componentsEquationNode = new ComponentsEquationNode( model.domainProperty, model.seriesTypeProperty, {
      tandem: componentsTandem.createTandem( 'equationNode' )
    } );
    const componentsEquationWrapperNode = new Node( {
      visibleProperty: model.componentsChart.chartVisibleProperty,
      children: [ componentsEquationNode ]
    } );

    // Button to show/hide the Components chart
    const componentsExpandCollapseButton = new LabeledExpandCollapseButton(
      fourierMakingWavesStrings.componentsChart, model.componentsChart.chartVisibleProperty, {
        textOptions: { maxWidth: 150 }, // determined empirically
        tandem: componentsTandem.createTandem( 'componentsExpandCollapseButton' )
      } );

    // Components chart
    const componentsChartNode = new ComponentsChartNode( model.componentsChart, {
      transformOptions: {
        modelXRange: new Range( -2, 2 ), //TODO
        modelYRange: new Range( -model.maxAmplitude, model.maxAmplitude ), //TODO
        viewWidth: DiscreteScreenView.CHART_RECTANGLE_SIZE.width,
        viewHeight: DiscreteScreenView.CHART_RECTANGLE_SIZE.height
      },
      visibleProperty: model.componentsChart.chartVisibleProperty,
      tandem: componentsTandem.createTandem( 'componentsChartNode' )
    } );

    // Parent tandem for all components related to the Sum chart
    const sumTandem = options.tandem.createTandem( 'sum' );

    // Equation above the Sum chart
    const sumEquationNode = new WavePacketSumEquationNode( model.domainProperty, model.seriesTypeProperty,
      model.wavePacket.numberOfComponentsProperty, {
        visibleProperty: model.sumChart.chartVisibleProperty,
        tandem: sumTandem.createTandem( 'equationNode' )
      } );
    const sumEquationWrapperNode = new Node( {
      children: [ sumEquationNode ]
    } );

    // Button to show/hide the Sum chart
    const sumExpandCollapseButton = new LabeledExpandCollapseButton(
      fourierMakingWavesStrings.sum, model.sumChart.chartVisibleProperty, {
        textOptions: { maxWidth: 150 }, // determined empirically
        tandem: sumTandem.createTandem( 'sumExpandCollapseButton' )
      } );

    // Sum chart
    const sumChartNode = new WavePacketSumChartNode( model.sumChart, {
      transformOptions: {
        modelXRange: new Range( -2, 2 ), //TODO
        modelYRange: new Range( -1.25, 1.25 ), //TODO
        viewWidth: DiscreteScreenView.CHART_RECTANGLE_SIZE.width,
        viewHeight: DiscreteScreenView.CHART_RECTANGLE_SIZE.height
      },
      visibleProperty: model.sumChart.chartVisibleProperty,
      tandem: sumTandem.createTandem( 'sumChartNode' )
    } );

    const controlPanel = new WavePacketControlPanel( model, popupParent );

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
      amplitudesChartNode.x = DiscreteScreenView.X_CHART_RECTANGLES;
      amplitudesChartNode.y = 32;

      // Components chart below the Amplitudes chart
      componentsExpandCollapseButton.left = layoutBounds.left + FMWConstants.SCREEN_VIEW_X_MARGIN;
      componentsExpandCollapseButton.top = amplitudesChartNode.bottom;
      componentsChartNode.x = amplitudesChartNode.x;
      componentsChartNode.y = componentsExpandCollapseButton.bottom + CHART_TITLE_Y_SPACING;

      // Sum chart below the Components chart
      sumExpandCollapseButton.left = componentsExpandCollapseButton.left;
      sumExpandCollapseButton.top = componentsChartNode.bottom + 30;
      sumChartNode.x = componentsChartNode.x;
      sumChartNode.y = sumExpandCollapseButton.bottom + CHART_TITLE_Y_SPACING;

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

    // Center dynamic equations above their respective charts. Since we need to listen to the bounds of these equations
    // in order to respect their maxWidth, wrapper Nodes are transformed for equations that are dynamic.
    // See https://github.com/phetsims/fourier-making-waves/issues/40
    {
      const amplitudeChartRectangleLocalBounds = this.globalToLocalBounds( amplitudesChartNode.chartRectangle.parentToGlobalBounds( amplitudesChartNode.chartRectangle.bounds ) );
      const componentsChartRectangleLocalBounds = this.globalToLocalBounds( componentsChartNode.chartRectangle.parentToGlobalBounds( componentsChartNode.chartRectangle.bounds ) );
      const sumChartRectangleLocalBounds = this.globalToLocalBounds( sumChartNode.chartRectangle.parentToGlobalBounds( sumChartNode.chartRectangle.bounds ) );

      amplitudeEquationNode.boundsProperty.link( () => {
        amplitudeEquationNode.centerX = amplitudeChartRectangleLocalBounds.centerX;
        amplitudeEquationNode.bottom = amplitudeChartRectangleLocalBounds.top - 3;
      } );

      componentsEquationNode.boundsProperty.link( () => {
        componentsEquationWrapperNode.centerX = componentsChartRectangleLocalBounds.centerX;
        componentsEquationWrapperNode.bottom = componentsChartRectangleLocalBounds.top - 3;
      } );

      sumEquationNode.boundsProperty.link( () => {
        sumEquationWrapperNode.centerX = sumChartRectangleLocalBounds.centerX;
        sumEquationWrapperNode.bottom = sumChartRectangleLocalBounds.top - 3;
      } );
    }

    // pdom -traversal order
    // See https://github.com/phetsims/fourier-making-waves/issues/53
    screenViewRootNode.pdomOrder = [
      controlPanel,
      amplitudesChartNode,
      componentsExpandCollapseButton,
      componentsChartNode,
      sumExpandCollapseButton,
      sumChartNode,
      //TODO put width indicators here
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