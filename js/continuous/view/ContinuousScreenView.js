// Copyright 2020-2021, University of Colorado Boulder

/**
 * ContinuousScreenView is the view for the 'Continuous' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import merge from '../../../../phet-core/js/merge.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import DiscreteScreenView from '../../discrete/view/DiscreteScreenView.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import ContinuousModel from '../model/ContinuousModel.js';
import ContinuousControlPanel from './ContinuousControlPanel.js';

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

    const amplitudesChartNode = new Rectangle( 0, 0, DiscreteScreenView.CHART_RECTANGLE_SIZE.width, DiscreteScreenView.CHART_RECTANGLE_SIZE.height, {
      stroke: 'black',
      fill: 'white'
    } );

    const componentsChartNode = new Rectangle( 0, 0, DiscreteScreenView.CHART_RECTANGLE_SIZE.width, DiscreteScreenView.CHART_RECTANGLE_SIZE.height, {
      stroke: 'black',
      fill: 'white'
    } );

    const sumChartNode = new Rectangle( 0, 0, DiscreteScreenView.CHART_RECTANGLE_SIZE.width, DiscreteScreenView.CHART_RECTANGLE_SIZE.height, {
      stroke: 'black',
      fill: 'white'
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

      // Components chart below Amplitudes chart
      componentsChartNode.x = amplitudesChartNode.x;
      componentsChartNode.top = amplitudesChartNode.bottom + 20;

      // Sum chart below Components chart
      sumChartNode.x = componentsChartNode.x;
      sumChartNode.top = componentsChartNode.bottom + 20;

      // Control panel to the right of the charts
      controlPanel.right = layoutBounds.right - FMWConstants.SCREEN_VIEW_X_MARGIN;
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
        componentsChartNode,
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
    //TODO
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