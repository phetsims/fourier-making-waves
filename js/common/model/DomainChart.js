// Copyright 2021, University of Colorado Boulder

/**
 * DomainChart is the base class for charts that need to modify their x-axis presentation to match a domain -
 * space, time, or space-&-time. Note that this class has no responsibility for the y axis, since domain affects
 * only the x axis.
 *
 * This serves as the base class for the bottom 2 charts (Harmonics/Components and Sum) in all screens.
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
   * @param {number} L - wavelength of the fundamental harmonic, in meters
   * @param {number} T - period of the fundamental harmonic, in milliseconds
   * @param {Object} [options]
   */
  constructor( domainProperty, xAxisDescriptionProperty, L, T, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertPropertyOf( xAxisDescriptionProperty, AxisDescription );
    assert && AssertUtils.assertPositiveNumber( L );
    assert && AssertUtils.assertPositiveNumber( T );

    // @public (read-only) params
    this.domainProperty = domainProperty;
    this.xAxisDescriptionProperty = xAxisDescriptionProperty;
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