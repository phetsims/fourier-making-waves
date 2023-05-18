// Copyright 2021-2023, University of Colorado Boulder

/**
 * WaveGameHarmonicsChartNode is the view for the 'Harmonics' chart in the 'Wave Game' screen.
 * This adds no new functionality, but is provided for symmetry, so that there is a screen-specific subclass
 * for each chart.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import HarmonicsChartNode from '../../common/view/HarmonicsChartNode.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

export default class WaveGameHarmonicsChartNode extends HarmonicsChartNode {

  /**
   * @param {WaveGameHarmonicsChart} harmonicsChart
   * @param {Object} [options]
   */
  constructor( harmonicsChart, options ) {
    super( harmonicsChart, options );
  }
}

fourierMakingWaves.register( 'WaveGameHarmonicsChartNode', WaveGameHarmonicsChartNode );