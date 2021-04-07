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

import SumChartNode from '../../discrete/view/SumChartNode.js'; //TODO discrete
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WaveGameSumChart from '../model/WaveGameSumChart.js';

class WaveGameSumChartNode extends SumChartNode {

  /**
   * @param {WaveGameSumChart} sumChart
   * @param {EnumerationProperty.<Waveform>} waveformProperty
   * @param {Property.<TickLabelFormat>} xAxisTickLabelFormatProperty
   * @param {Object} [options]
   */
  constructor( sumChart, waveformProperty, xAxisTickLabelFormatProperty, options ) {
    assert && assert( sumChart instanceof WaveGameSumChart, 'invalid sumChart' );

    super( sumChart, waveformProperty, xAxisTickLabelFormatProperty, options );

    //TODO add a plot for answerSeries sum, behind guessSeries sum
  }
}

fourierMakingWaves.register( 'WaveGameSumChartNode', WaveGameSumChartNode );
export default WaveGameSumChartNode;