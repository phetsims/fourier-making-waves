// Copyright 2021, University of Colorado Boulder

//TODO no x-axis zoom buttons
//TODO no y-axis zoom buttons
//TODO no AutoScaleCheckbox
//TODO no InfiniteHarmonicsCheckbox
/**
 * WaveGameSumChartNode is the view for the 'Sum' chart in the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import TickLabelFormat from '../../discrete/model/TickLabelFormat.js';
import Waveform from '../../discrete/model/Waveform.js';
import SumChartNode from '../../discrete/view/SumChartNode.js'; //TODO discrete
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WaveGameSumChart from '../model/WaveGameSumChart.js';

class WaveGameSumChartNode extends SumChartNode {

  /**
   * @param {WaveGameSumChart} sumChart
   * @param {Object} [options]
   */
  constructor( sumChart, options ) {
    assert && assert( sumChart instanceof WaveGameSumChart, 'invalid sumChart' );

    super( sumChart, new Property( TickLabelFormat.NUMERIC ), new EnumerationProperty( Waveform, Waveform.CUSTOM ), options );

    //TODO add a plot for answerSeries sum, behind guessSeries sum
  }
}

fourierMakingWaves.register( 'WaveGameSumChartNode', WaveGameSumChartNode );
export default WaveGameSumChartNode;