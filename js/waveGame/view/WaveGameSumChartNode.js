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
import Domain from '../../discrete/model/Domain.js'; //TODO discrete
import EquationForm from '../../discrete/model/EquationForm.js'; //TODO discrete
import Waveform from '../../discrete/model/Waveform.js'; //TODO discrete
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

    //TODO duplicated elsewhere
    // These aspects of the Harmonics chart do not change in the Wave Game screen.
    const waveformProperty = new EnumerationProperty( Waveform, Waveform.CUSTOM );
    const domainProperty = new EnumerationProperty( Domain, Domain.SPACE );
    const equationFormProperty = new EnumerationProperty( EquationForm, EquationForm.HIDDEN );

    //TODO emphasized harmonics do not work because we're using adapterFourierSeries
    super( sumChart, sumChart.adapterFourierSeries, waveformProperty, domainProperty, equationFormProperty, options );

    //TODO add sum for sumChart.challengeProperty.value.answerSeries
  }
}

fourierMakingWaves.register( 'WaveGameSumChartNode', WaveGameSumChartNode );
export default WaveGameSumChartNode;