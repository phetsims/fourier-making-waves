// Copyright 2020-2021, University of Colorado Boulder

/**
 * AxisDescription is a data structure used to describe the range, grid lines, and ticks for an axis.
 * An array of AxisDescription can be used to describe the zoom levels for an axis, where a zoom level is an index
 * into the array.
 *
 * Units for the fields in an AxisDescription are specific to the axis.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import required from '../../../../phet-core/js/required.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import Domain from './Domain.js';

class AxisDescription {

  /**
   * @param config - See doc of fields below. All values are in model coordinates, with units specific to the axis.
   */
  constructor( config ) {

    config = merge( {

      // {Range} range of the axis
      range: required( config.range ),

      // {number} spacing between grid lines
      gridLineSpacing: required( config.gridLineSpacing ),

      // {number} spacing between tick marks
      tickMarkSpacing: required( config.tickMarkSpacing ),

      // {number} spacing between tick labels
      tickLabelSpacing: required( config.tickLabelSpacing )
    }, config );

    // @public (read-only)
    this.range = config.range;
    this.gridLineSpacing = config.gridLineSpacing;
    this.tickMarkSpacing = config.tickMarkSpacing;
    this.tickLabelSpacing = config.tickLabelSpacing;
  }

  /**
   * Determines whether the range is symmetric about zero. This is a requirement for many of the axes in this sim.
   * @returns {boolean}
   * @public
   */
  hasSymmetricRange() {
    return this.range.getCenter() === 0;
  }

  /**
   * Gets AxisDescription that is the best-fit for a specified axis range.
   * This is the first entry in axisDescriptions such that range.max >= axisDescription.range.max.
   * @param {Range} range
   * @param {AxisDescription[]} axisDescriptions
   * @returns {AxisDescription}
   * @public
   */
  static getBestFit( range, axisDescriptions ) {
    assert && assert( range instanceof Range );
    assert && AssertUtils.assertArrayOf( axisDescriptions, AxisDescription );

    const axisDescription = _.find( axisDescriptions, axisDescription => range.max >= axisDescription.range.max );
    assert && assert( axisDescription );
    return axisDescription;
  }

  /**
   * Determines whether an array of AxisDescription is sorted by descending range length, from most 'zoomed out' to
   * most 'zoomed in'.
   * @param {AxisDescription[]} axisDescriptions
   * @returns {boolean}
   * @public
   */
  static isSortedDescending( axisDescriptions ) {
    return _.every( axisDescriptions,
      ( axisDescription, index, axisDescriptions ) =>
        ( index === 0 || axisDescriptions[ index - 1 ].range.getLength() > axisDescription.range.getLength() )
    );
  }

  /**
   * Creates a range for a specified Domain. This is used wherever the AxisDescriptions for the x axis contain
   * coefficients to be applied to some constant (L, T, PI), depending on which Domain (space or time) is being plotted.
   * @param {Domain} domain
   * @param {number} spaceMultiplier
   * @param {number} timeMultiplier
   * @returns {Range}
   * @public
   */
  createRangeForDomain( domain, spaceMultiplier, timeMultiplier ) {

    assert && assert( Domain.includes( domain ) );
    assert && AssertUtils.assertPositiveNumber( spaceMultiplier );
    assert && AssertUtils.assertPositiveNumber( timeMultiplier );

    const value = ( domain === Domain.TIME ) ? timeMultiplier : spaceMultiplier;
    const xMin = value * this.range.min;
    const xMax = value * this.range.max;
    return new Range( xMin, xMax );
  }
}

fourierMakingWaves.register( 'AxisDescription', AxisDescription );
export default AxisDescription;