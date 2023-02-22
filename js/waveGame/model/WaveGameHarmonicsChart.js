// Copyright 2021-2022, University of Colorado Boulder

/**
 * WaveGameHarmonicsChart is the model for the 'Harmonics' chart in the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import AxisDescription from '../../common/model/AxisDescription.js';
import HarmonicsChart from '../../common/model/HarmonicsChart.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

export default class WaveGameHarmonicsChart extends HarmonicsChart {

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

      // These aspects are constant in the Wave Game screen, but the superclass supports dynamic Properties.
      // We use validValues to constrain these Properties to a single value, effectively making them constants.
      new EnumerationProperty( domain, { validValues: [ domain ] } ),
      new EnumerationProperty( seriesType, { validValues: [ seriesType ] } ),
      new NumberProperty( t, { validValues: [ t ] } ),
      new Property( xAxisDescription, { validValues: [ xAxisDescription ] } ),

      options
    );
  }
}

fourierMakingWaves.register( 'WaveGameHarmonicsChart', WaveGameHarmonicsChart );