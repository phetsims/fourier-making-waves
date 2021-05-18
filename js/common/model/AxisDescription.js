// Copyright 2020, University of Colorado Boulder

/**
 * AxisDescription is a data structure used to describe the range, grid lines, and ticks for an axis at a specific
 * zoom level. A zoom level is an index into a {AxisDescription[]}. Units for the fields in an AxisDescription are
 * specific to the axis.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import required from '../../../../phet-core/js/required.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class AxisDescription {

  /**
   * @param config - see doc of fields below, all values are in model coordinates, with units specific to the axis
   */
  constructor( config ) {

    config = merge( {

      // {number} used to define a symmetric range [-max,max] for the axis
      max: required( config.max ),

      // {number} spacing between grid lines
      gridLineSpacing: required( config.gridLineSpacing ),

      // {number} spacing between tick marks
      tickMarkSpacing: required( config.tickMarkSpacing ),

      // {number} spacing between tick labels
      tickLabelSpacing: required( config.tickLabelSpacing )
    }, config );

    // @public (read-only)
    this.range = new Range( -config.max, config.max );
    this.gridLineSpacing = config.gridLineSpacing;
    this.tickMarkSpacing = config.tickMarkSpacing;
    this.tickLabelSpacing = config.tickLabelSpacing;
  }

  /**
   * Gets AxisDescription that is appropriate for a specified axis range.
   * This is the first entry in axisDescriptions such that range.max >= axisDescription.range.max.
   * This is used to keep the y-axis description in-sync with auto scaling, but is general enough to be used with
   * either axis.
   * @param {Range} range
   * @param {AxisDescription[]} axisDescriptions
   * @returns {AxisDescription}
   * @public
   */
  static getAxisDescriptionForRange( range, axisDescriptions ) {
    assert && assert( range instanceof Range );
    assert && assert( Math.abs( range.min ) === range.max, 'expected range to be symmetrical' );
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
}

fourierMakingWaves.register( 'AxisDescription', AxisDescription );
export default AxisDescription;