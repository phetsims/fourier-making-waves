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
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import LabeledExpandCollapseButton from '../../common/view/LabeledExpandCollapseButton.js';
import DiscreteScreenView from '../../discrete/view/DiscreteScreenView.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import ContinuousModel from '../model/ContinuousModel.js';
import ComponentsChartNode from './ComponentsChartNode.js';
import ContinuousAmplitudesChartNode from './ContinuousAmplitudesChartNode.js';
import ContinuousControlPanel from './ContinuousControlPanel.js';
import ContinuousSumChartNode from './ContinuousSumChartNode.js';

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

    // Amplitudes chart
    const amplitudesChartNode = new ContinuousAmplitudesChartNode( model.continuousWaveformVisibleProperty, {
      transformOptions: {
        modelXRange: model.significantWidthRange,
        modelYRange: new Range( 0, model.maxAmplitude ), //TODO
        viewWidth: DiscreteScreenView.CHART_RECTANGLE_SIZE.width,
        viewHeight: DiscreteScreenView.CHART_RECTANGLE_SIZE.height
      },
      tandem: options.tandem.createTandem( 'amplitudesChartNode' )
    } );

    // Parent tandem for all components related to the Components chart
    const componentsTandem = options.tandem.createTandem( 'components' );

    // Button to show/hide the Components chart
    const componentsExpandCollapseButton = new LabeledExpandCollapseButton(
      fourierMakingWavesStrings.componentsChart, model.componentsChart.chartVisibleProperty, {
        textOptions: { maxWidth: 150 }, // determined empirically
        tandem: componentsTandem.createTandem( 'componentsExpandCollapseButton' )
      } );

    // Components chart
    const componentsChartNode = new ComponentsChartNode( {
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

    // Button to show/hide the Sum chart
    const sumExpandCollapseButton = new LabeledExpandCollapseButton(
      fourierMakingWavesStrings.sum, model.sumChart.chartVisibleProperty, {
        textOptions: { maxWidth: 150 }, // determined empirically
        tandem: sumTandem.createTandem( 'sumExpandCollapseButton' )
      } );

    // Sum chart
    const sumChartNode = new ContinuousSumChartNode( model.envelopeVisibleProperty, {
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
        amplitudesChartNode,
        componentsExpandCollapseButton,
        componentsChartNode,
        sumExpandCollapseButton,
        sumChartNode,
        controlPanel,
        resetAllButton,

        // parent for popups on top
        popupParent
      ]
    } );
    this.addChild( screenViewRootNode );

    // pdom -traversal order
    // See https://github.com/phetsims/fourier-making-waves/issues/53
    screenViewRootNode.pdomOrder = [
      controlPanel,
      componentsExpandCollapseButton,
      //TODO put componentsChartNode here
      sumExpandCollapseButton,
      //TODO put sumChartNode here
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