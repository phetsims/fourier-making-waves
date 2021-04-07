// Copyright 2021, University of Colorado Boulder

/**
 * DiscreteHarmonicsChart is the model for the 'Harmonics' chart in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import HarmonicsChart from '../../common/model/HarmonicsChart.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class DiscreteHarmonicsChart extends HarmonicsChart {

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

fourierMakingWaves.register( 'DiscreteHarmonicsChart', DiscreteHarmonicsChart );
export default DiscreteHarmonicsChart;