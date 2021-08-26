// Copyright 2021, University of Colorado Boulder

/**
 * DomainChart is the base class for charts that need to modify their x-axis presentation to match a Domain -
 * space, time, or space-&-time. Note that this class has no responsibility for the y axis, since Domain affects
 * only the x axis.
 *
 * This serves as the base class for all charts except the Amplitudes chart in the 'Discrete' and 'Wave Game' screens.
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
   * @param {number} spaceMultiplier - multiplier for x values in the space or space-&-time Domains
   * @param {number} timeMultiplier - multiplier for x values in the time Domain
   * @param {Object} [options]
   */
  constructor( domainProperty, xAxisDescriptionProperty, spaceMultiplier, timeMultiplier, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertPropertyOf( xAxisDescriptionProperty, AxisDescription );
    assert && AssertUtils.assertPositiveNumber( spaceMultiplier );
    assert && AssertUtils.assertPositiveNumber( timeMultiplier );

    // @public (read-only) params
    this.domainProperty = domainProperty;
    this.xAxisDescriptionProperty = xAxisDescriptionProperty;
    this.spaceMultiplier = spaceMultiplier;
    this.timeMultiplier = timeMultiplier;

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