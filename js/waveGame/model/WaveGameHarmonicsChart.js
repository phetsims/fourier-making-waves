// Copyright 2021, University of Colorado Boulder

/**
 * WaveGameHarmonicsChart is the model for the 'Harmonics' chart in the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import AxisDescription from '../../common/model/AxisDescription.js';
import Domain from '../../common/model/Domain.js';
import HarmonicsChart from '../../common/model/HarmonicsChart.js';
import SeriesType from '../../common/model/SeriesType.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class WaveGameHarmonicsChart extends HarmonicsChart {

  /**
   * @param {FourierSeries} guessSeries
   * @param {EmphasizedHarmonics} emphasizedHarmonics
   * @param {Domain} domain
   * @param {SeriesType} seriesType
   * @param {number} t
   * @param {AxisDescription} xAxisDescription
   * @param {AxisDescription} yAxisDescription
   * @param {Object} [options]
   */
  constructor( guessSeries, emphasizedHarmonics, domain, seriesType, t, xAxisDescription, yAxisDescription, options ) {

    assert && assert( xAxisDescription instanceof AxisDescription );
    assert && assert( yAxisDescription instanceof AxisDescription );

    super(
      guessSeries,
      emphasizedHarmonics,

      // These aspects are static in the Wave Game screen, but dynamic in the superclass.
      new EnumerationProperty( Domain, domain ),
      new EnumerationProperty( SeriesType, seriesType ),
      new NumberProperty( t ),

      // Harmonics chart has a static scale for both axes, with no zoom buttons.
      new Property( xAxisDescription, { validValues: [ xAxisDescription ] } ),
      new Property( yAxisDescription, { validValues: [ yAxisDescription ] } ),
      options
    );
  }
}

fourierMakingWaves.register( 'WaveGameHarmonicsChart', WaveGameHarmonicsChart );
export default WaveGameHarmonicsChart;