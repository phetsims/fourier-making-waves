// Copyright 2021, University of Colorado Boulder

/**
 * WaveGameHarmonicsChart is the model for the 'Harmonics' chart in the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import HarmonicsChart from '../../discrete/model/HarmonicsChart.js'; //TODO discrete
import fourierMakingWaves from '../../fourierMakingWaves.js';

class WaveGameHarmonicsChart extends HarmonicsChart {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<SeriesType>} seriesTypeProperty
   * @param {Property.<number>} tProperty
   * @param {Object} [options]
   */
  constructor( fourierSeries, domainProperty, seriesTypeProperty, tProperty, options ) {

    super( fourierSeries, domainProperty, seriesTypeProperty, tProperty, options );
  }
}

fourierMakingWaves.register( 'WaveGameHarmonicsChart', WaveGameHarmonicsChart );
export default WaveGameHarmonicsChart;