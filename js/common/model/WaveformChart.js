// Copyright 2021, University of Colorado Boulder

/**
 * WaveformChart is the base class for charts that plot one or more 2D waveforms related to a Fourier series.
 * The x axis is either space or time, while the y axis is always amplitude.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import AxisDescription from './AxisDescription.js';
import Domain from './Domain.js';

class WaveformChart {

  /**
   * @param {number} L - wavelength of the fundamental harmonic, in meters
   * @param {number} T - period of the fundamental harmonic, in milliseconds
   * @param {EnumerationProperty.<Domain>} domainProperty - domain of the x axis
   * @param {Property.<AxisDescription>} xAxisDescriptionProperty - describes the x axis
   * @param {Property.<AxisDescription>} yAxisDescriptionProperty - describes the y axis
   * @param {Object} [options]
   */
  constructor( L, T, domainProperty, xAxisDescriptionProperty, yAxisDescriptionProperty, options ) {

    assert && AssertUtils.assertPositiveNumber( L );
    assert && AssertUtils.assertPositiveNumber( T );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertPropertyOf( xAxisDescriptionProperty, AxisDescription );
    assert && AssertUtils.assertPropertyOf( yAxisDescriptionProperty, AxisDescription );

    // @public (read-only) params
    this.L = L;
    this.T = T;
    this.domainProperty = domainProperty;
    this.xAxisDescriptionProperty = xAxisDescriptionProperty;
    this.yAxisDescriptionProperty = yAxisDescriptionProperty;

    // @public whether this chart is visible
    this.chartVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'chartVisibleProperty' )
    } );
  }

  /**
   * @public
   */
  reset() {
    this.chartVisibleProperty.reset();
  }
}

fourierMakingWaves.register( 'WaveformChart', WaveformChart );
export default WaveformChart;