// Copyright 2021, University of Colorado Boulder

/**
 * DomainChart is the base class for charts that need to modify their presentation to match a domain -
 * space, time, or space-&-time.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import AxisDescription from './AxisDescription.js';
import Domain from './Domain.js';

class DomainChart {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty - domain of the x axis
   * @param {Property.<AxisDescription>} xAxisDescriptionProperty - describes the x axis
   * @param {Property.<AxisDescription>} yAxisDescriptionProperty - describes the y axis
   * @param {number} L - wavelength of the fundamental harmonic, in meters
   * @param {number} T - period of the fundamental harmonic, in milliseconds
   * @param {Object} [options]
   */
  constructor( domainProperty, xAxisDescriptionProperty, yAxisDescriptionProperty, L, T, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertPropertyOf( xAxisDescriptionProperty, AxisDescription );
    assert && AssertUtils.assertPropertyOf( yAxisDescriptionProperty, AxisDescription );
    assert && AssertUtils.assertPositiveNumber( L );
    assert && AssertUtils.assertPositiveNumber( T );

    // @public (read-only) params
    this.domainProperty = domainProperty;
    this.xAxisDescriptionProperty = xAxisDescriptionProperty;
    this.yAxisDescriptionProperty = yAxisDescriptionProperty;
    this.L = L;
    this.T = T;

    // @public whether this chart is expanded
    this.chartExpandedProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'chartExpandedProperty' )
    } );
  }

  /**
   * @public
   */
  reset() {
    this.chartExpandedProperty.reset();
  }
}

fourierMakingWaves.register( 'DomainChart', DomainChart );
export default DomainChart;