// Copyright 2021, University of Colorado Boulder

//TODO no x-axis zoom buttons
/**
 * WaveGameHarmonicsChartNode is the view for the 'Harmonics' chart in the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import EquationForm from '../../discrete/model/EquationForm.js'; //TODO discrete
import HarmonicsChartNode from '../../discrete/view/HarmonicsChartNode.js'; //TODO discrete
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WaveGameHarmonicsChart from '../model/WaveGameHarmonicsChart.js';

class WaveGameHarmonicsChartNode extends HarmonicsChartNode {

  /**
   * @param {WaveGameHarmonicsChart} harmonicsChart
   * @param {Object} [options]
   */
  constructor( harmonicsChart, options ) {

    assert && assert( harmonicsChart instanceof WaveGameHarmonicsChart, 'invalid harmonicsChart' );

    //TODO duplicated elsewhere
    // These aspects of the Harmonics chart do not change in the Wave Game screen.
    const equationFormProperty = new EnumerationProperty( EquationForm, EquationForm.HIDDEN );

    //TODO emphasized harmonics do not work because we're using adapterFourierSeries
    super( harmonicsChart, equationFormProperty, options );
  }
}

fourierMakingWaves.register( 'WaveGameHarmonicsChartNode', WaveGameHarmonicsChartNode );
export default WaveGameHarmonicsChartNode;