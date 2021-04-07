// Copyright 2021, University of Colorado Boulder

/**
 * DiscreteHarmonicsChartNode displays the 'Harmonics' chart in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import HarmonicsChartNode from '../../common/view/HarmonicsChartNode.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class DiscreteHarmonicsChartNode extends HarmonicsChartNode {

  /**
   * @param {HarmonicsChart} harmonicsChart
   * @param {Property.<TickLabelFormat>} xAxisTickLabelFormatProperty
   * @param {Object} [options]
   */
  constructor( harmonicsChart, xAxisTickLabelFormatProperty, options ) {
    super( harmonicsChart, xAxisTickLabelFormatProperty, options );
  }
}

fourierMakingWaves.register( 'DiscreteHarmonicsChartNode', DiscreteHarmonicsChartNode );
export default DiscreteHarmonicsChartNode;