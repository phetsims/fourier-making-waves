// Copyright 2021, University of Colorado Boulder

/**
 * WaveGameHarmonicsChart is the model for the 'Harmonics' chart in the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Domain from '../../common/model/Domain.js';
import HarmonicsChart from '../../discrete/model/HarmonicsChart.js'; //TODO discrete
import SeriesType from '../../common/model/SeriesType.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class WaveGameHarmonicsChart extends HarmonicsChart {

  /**
   * @param {FourierSeries} guessFourierSeries
   * @param {Object} [options]
   */
  constructor( guessFourierSeries, options ) {

    super(
      guessFourierSeries,
      new EnumerationProperty( Domain, Domain.SPACE ), //TODO eliminate?
      new EnumerationProperty( SeriesType, SeriesType.SINE ), //TODO eliminate?
      new NumberProperty( 0 ), //TODO eliminate?
      options
    );
  }
}

fourierMakingWaves.register( 'WaveGameHarmonicsChart', WaveGameHarmonicsChart );
export default WaveGameHarmonicsChart;