// Copyright 2021, University of Colorado Boulder

/**
 * WaveGameHarmonicsChartNode is the view for the 'Harmonics' chart in the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import TickLabelFormat from '../../common/model/TickLabelFormat.js';
import HarmonicsChartNode from '../../common/view/HarmonicsChartNode.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WaveGameHarmonicsChart from '../model/WaveGameHarmonicsChart.js';

class WaveGameHarmonicsChartNode extends HarmonicsChartNode {

  /**
   * @param {WaveGameHarmonicsChart} harmonicsChart
   * @param {Object} [options]
   */
  constructor( harmonicsChart, options ) {
    assert && assert( harmonicsChart instanceof WaveGameHarmonicsChart );

    super( harmonicsChart, new Property( TickLabelFormat.NUMERIC ), options );
  }
}

fourierMakingWaves.register( 'WaveGameHarmonicsChartNode', WaveGameHarmonicsChartNode );
export default WaveGameHarmonicsChartNode;