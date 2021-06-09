// Copyright 2020-2021, University of Colorado Boulder

/**
 * ContinuousScreenView is the view for the 'Continuous' screen.
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
import ContinuousModel from '../model/ContinuousModel.js';
import ComponentsChartNode from './ComponentsChartNode.js';
import ComponentsEquationNode from './ComponentsEquationNode.js';
import ContinuousAmplitudesChartNode from './ContinuousAmplitudesChartNode.js';
import ContinuousControlPanel from './ContinuousControlPanel.js';
import ContinuousSumChartNode from './ContinuousSumChartNode.js';
import ContinuousSumEquationNode from './ContinuousSumEquationNode.js';

// constants
const CHART_TITLE_Y_SPACING = 15; // space between chart title and the chart

class ContinuousScreenView extends ScreenView {

  /**
   * @param {ContinuousModel} model
   * @param {Object} [options]
   */
  constructor( model, options ) {
    assert && assert( model instanceof ContinuousModel );

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

    // An equation
    const amplitudeChartEquationNode = new RichText( `${FMWSymbols.A}<sub>${FMWSymbols.n}</sub>`, {
      font: FMWConstants.EQUATION_FONT,
      tandem: amplitudesTandem.createTandem( 'equationNode' )
    } );

    // Amplitudes chart
    const amplitudesChartNode = new ContinuousAmplitudesChartNode( model.amplitudesChart, {
      transformOptions: {
        modelXRange: new Range( 0, model.significantWidth ),
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
    const sumEquationNode = new ContinuousSumEquationNode( model.domainProperty, model.seriesTypeProperty, {
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
    const sumChartNode = new ContinuousSumChartNode( model.sumChart, {
      transformOptions: {
        modelXRange: new Range( -2, 2 ), //TODO
        modelYRange: new Range( -1.25, 1.25 ), //TODO
        viewWidth: DiscreteScreenView.CHART_RECTANGLE_SIZE.width,
        viewHeight: DiscreteScreenView.CHART_RECTANGLE_SIZE.height
      },
      visibleProperty: model.sumChart.chartVisibleProperty,
      tandem: sumTandem.createTandem( 'sumChartNode' )
    } );

    const controlPanel = new ContinuousControlPanel( model, popupParent );

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
      amplitudesChartNode.y = 54;

      // Equation centered above Amplitudes chart
      amplitudeChartEquationNode.centerX = amplitudesChartNode.x + DiscreteScreenView.CHART_RECTANGLE_SIZE.width / 2;
      amplitudeChartEquationNode.bottom = amplitudesChartNode.top - 3;

      // Components chart below the Amplitudes chart
      componentsExpandCollapseButton.left = layoutBounds.left + FMWConstants.SCREEN_VIEW_X_MARGIN;
      componentsExpandCollapseButton.top = amplitudesChartNode.bottom + 15;
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
        amplitudeChartEquationNode,
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

    // Center dynamic equations above their respective charts.
    // Since we need to listen to the bounds of these equations in order to respect their maxWidth, wrapper Nodes are
    // transformed. See https://github.com/phetsims/fourier-making-waves/issues/40
    componentsEquationNode.boundsProperty.link( () => {
      componentsEquationWrapperNode.centerX = componentsChartNode.x + DiscreteScreenView.CHART_RECTANGLE_SIZE.width / 2;
      componentsEquationWrapperNode.bottom = componentsChartNode.top - 3;
    } );
    sumEquationNode.boundsProperty.link( () => {
      sumEquationWrapperNode.centerX = sumChartNode.x + DiscreteScreenView.CHART_RECTANGLE_SIZE.width / 2;
      sumEquationWrapperNode.bottom = sumChartNode.top - 3;
    } );

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

fourierMakingWaves.register( 'ContinuousScreenView', ContinuousScreenView );
export default ContinuousScreenView;