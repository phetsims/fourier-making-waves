// Copyright 2021-2022, University of Colorado Boulder

/**
 * DomainChart is the base class model for all charts except the Amplitudes chart in the 'Discrete' and 'Wave Game'
 * screens. It is primarily responsive for the x (Domain) axis, hence the name.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import AxisDescription from './AxisDescription.js';

class DomainChart {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty - domain of the x axis
   * @param {Property.<AxisDescription>} xAxisDescriptionProperty - describes the x axis
   * @param {number} spaceMultiplier - multiplier for x values in the space and space-&-time Domains
   * @param {number} timeMultiplier - multiplier for x values in the time Domain
   * @param {Object} [options]
   */
  constructor( domainProperty, xAxisDescriptionProperty, spaceMultiplier, timeMultiplier, options ) {

    assert && assert( domainProperty instanceof EnumerationProperty );
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