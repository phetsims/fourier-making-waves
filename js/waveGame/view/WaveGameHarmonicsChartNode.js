// Copyright 2021, University of Colorado Boulder

//TODO no x-axis zoom buttons - remove from HarmonicsChartNode and add in new DiscreteHarmonicsChartNode ?
/**
 * WaveGameHarmonicsChartNode is the view for the 'Harmonics' chart in the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Domain from '../../discrete/model/Domain.js';
import EquationForm from '../../discrete/model/EquationForm.js';
import HarmonicsChartNode from '../../discrete/view/HarmonicsChartNode.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WaveGameHarmonicsChart from '../model/WaveGameHarmonicsChart.js';

class WaveGameHarmonicsChartNode extends HarmonicsChartNode {

  /**
   * @param {WaveGameHarmonicsChart} harmonicsChart
   * @param {Object} [options]
   */
  constructor( harmonicsChart, options ) {

    assert && assert( harmonicsChart instanceof WaveGameHarmonicsChart, 'invalid harmonicsChart' );

    // These aspects of the Harmonics chart do not change in the Wave Game screen.
    const domainProperty = new EnumerationProperty( Domain, Domain.SPACE );
    const equationFormProperty = new EnumerationProperty( EquationForm, EquationForm.HIDDEN );

    //TODO emphasized harmonics do not work because we're using adapterFourierSeries
    super( harmonicsChart, harmonicsChart.adapterFourierSeries, domainProperty, equationFormProperty, options );
  }
}

fourierMakingWaves.register( 'WaveGameHarmonicsChartNode', WaveGameHarmonicsChartNode );
export default WaveGameHarmonicsChartNode;