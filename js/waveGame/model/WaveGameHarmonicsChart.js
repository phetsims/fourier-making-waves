// Copyright 2021, University of Colorado Boulder

/**
 * WaveGameHarmonicsChart is the model for the 'Harmonics' chart in the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Domain from '../../common/model/Domain.js';
import HarmonicsChart from '../../common/model/HarmonicsChart.js';
import SeriesType from '../../common/model/SeriesType.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class WaveGameHarmonicsChart extends HarmonicsChart {

  /**
   * @param {FourierSeries} guessFourierSeries
   * @param {Object} [options]
   */
  constructor( guessFourierSeries, domain, seriesType, t, xAxisDescription, options ) {

    super(
      guessFourierSeries,
      new EnumerationProperty( Domain, domain ),
      new EnumerationProperty( SeriesType, seriesType ),
      new NumberProperty( t ),
      new Property( xAxisDescription ),
      options
    );
  }
}

fourierMakingWaves.register( 'WaveGameHarmonicsChart', WaveGameHarmonicsChart );
export default WaveGameHarmonicsChart;