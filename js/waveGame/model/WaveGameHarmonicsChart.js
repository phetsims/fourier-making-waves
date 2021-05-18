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
import TickLabelFormat from '../../common/model/TickLabelFormat.js';
import DiscreteYAxisDescriptions from '../../discrete/model/DiscreteYAxisDescriptions.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class WaveGameHarmonicsChart extends HarmonicsChart {

  /**
   * @param {FourierSeries} guessFourierSeries
   * @param {EmphasizedHarmonics} emphasizedHarmonics
   * @param {Domain} domain
   * @param {SeriesType} seriesType
   * @param {number} t
   * @param {XAxisDescription} xAxisDescription
   * @param {Object} [options]
   */
  constructor( guessFourierSeries, emphasizedHarmonics, domain, seriesType, t, xAxisDescription, options ) {

    // y-axis scale is fixed for the Harmonics chart, there are no zoom controls
    const yAxisDescription = DiscreteYAxisDescriptions[ DiscreteYAxisDescriptions.length - 1 ];

    super(
      guessFourierSeries,
      emphasizedHarmonics,
      new EnumerationProperty( Domain, domain ),
      new EnumerationProperty( SeriesType, seriesType ),
      new NumberProperty( t ),
      new Property( TickLabelFormat.NUMERIC ),
      new Property( xAxisDescription ),
      yAxisDescription,
      options
    );
  }
}

fourierMakingWaves.register( 'WaveGameHarmonicsChart', WaveGameHarmonicsChart );
export default WaveGameHarmonicsChart;