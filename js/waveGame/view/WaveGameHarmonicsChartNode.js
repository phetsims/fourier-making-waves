// Copyright 2021, University of Colorado Boulder

//TODO no x-axis zoom buttons
//TODO no y-axis zoom buttons
//TODO no AutoScaleCheckbox
//TODO no InfiniteHarmonicsCheckbox
/**
 * WaveGameHarmonicsChartNode is the view for the 'Harmonics' chart in the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import HarmonicsChart from '../../discrete/model/HarmonicsChart.js'; //TODO discrete
import TickLabelFormat from '../../discrete/model/TickLabelFormat.js'; //TODO discrete
import HarmonicsChartNode from '../../discrete/view/HarmonicsChartNode.js'; //TODO discrete
import fourierMakingWaves from '../../fourierMakingWaves.js';

class WaveGameHarmonicsChartNode extends HarmonicsChartNode {

  /**
   * @param {HarmonicsChart} harmonicsChart
   * @param {Object} [options]
   */
  constructor( harmonicsChart, options ) {
    assert && assert( harmonicsChart instanceof HarmonicsChart, 'invalid harmonicsChart' );

    super( harmonicsChart, new Property( TickLabelFormat.NUMERIC ), options );
  }
}

fourierMakingWaves.register( 'WaveGameHarmonicsChartNode', WaveGameHarmonicsChartNode );
export default WaveGameHarmonicsChartNode;