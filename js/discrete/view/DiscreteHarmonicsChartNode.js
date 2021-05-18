// Copyright 2021, University of Colorado Boulder

/**
 * DiscreteHarmonicsChartNode displays the 'Harmonics' chart in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import FMWConstants from '../../common/FMWConstants.js';
import FMWZoomButtonGroup from '../../common/view/FMWZoomButtonGroup.js';
import HarmonicsChartNode from '../../common/view/HarmonicsChartNode.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import DiscreteHarmonicsChart from '../model/DiscreteHarmonicsChart.js';

class DiscreteHarmonicsChartNode extends HarmonicsChartNode {

  /**
   * @param {DiscreteHarmonicsChart} harmonicsChart
   * @param {Property.<TickLabelFormat>} xAxisTickLabelFormatProperty
   * @param {Object} [options]
   */
  constructor( harmonicsChart, xAxisTickLabelFormatProperty, options ) {

    assert && assert( harmonicsChart instanceof DiscreteHarmonicsChart );

    super( harmonicsChart, xAxisTickLabelFormatProperty, options );

    // Fields of interest in harmonicsChart, to improve readability
    const xAxisDescriptionProperty = harmonicsChart.xAxisDescriptionProperty;

    //TODO duplicated from DiscreteHarmonicsChartNode, should zoom buttons be an option for FMWChartNode?
    // Zoom buttons for the x-axis range, at bottom right.
    const xZoomButtonGroup = new FMWZoomButtonGroup( xAxisDescriptionProperty, {
      orientation: 'horizontal',
      scale: FMWConstants.ZOOM_BUTTON_GROUP_SCALE,
      touchAreaXDilation: 5,
      touchAreaYDilation: 10,
      left: this.chartRectangle.right + 6,
      bottom: this.chartRectangle.bottom,
      tandem: options.tandem.createTandem( 'xZoomButtonGroup' )
    } );
    this.addChild( xZoomButtonGroup );

    // Interrupt interaction when visibility changes.
    this.visibleProperty.link( () => this.interruptSubtreeInput() );
  }
}

fourierMakingWaves.register( 'DiscreteHarmonicsChartNode', DiscreteHarmonicsChartNode );
export default DiscreteHarmonicsChartNode;