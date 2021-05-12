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
import Domain from './Domain.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class AxisDescription {

  /**
   * @param config - see doc of fields below, all values are in model coordinates
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
   * Creates the range for the x-axis. For the x axis, AxisDescription contains coefficients to be applied to L or T,
   * depending on which domain is being plotted.
   * @param {AxisDescription} axisDescription
   * @param {Domain} domain
   * @param {number} L - wavelength of the fundamental harmonic, in m
   * @param {number} T - period of the fundamental harmonic, in
   * @returns {Range}
   * @public
   */
  static createXRange( axisDescription, domain, L, T ) {

    assert && assert( axisDescription instanceof AxisDescription, 'invalid axisDescription' );
    assert && assert( Domain.includes( domain ), 'invalid domain' );
    assert && assert( typeof L === 'number' && L > 0, 'invalid L' );
    assert && assert( typeof T === 'number' && T > 0, 'invalid T' );

    const value = ( domain === Domain.TIME ) ? T : L;
    const xMin = value * axisDescription.range.min;
    const xMax = value * axisDescription.range.max;
    return new Range( xMin, xMax );
  }

  /**
   * Gets the zoom level (index into axisDescriptions) that corresponds to an axis range.  This is used to keep the
   * y-axis zoom level in-sync with auto scaling, but is general enough to be used with either axis.
   * @param {Range} range
   * @param {AxisDescription[]} axisDescriptions
   * @returns {number} - the zoom level, an index into axisDescriptions
   * @public
   */
  static getZoomLevelForRange( range, axisDescriptions ) {
    assert && assert( range instanceof Range, 'invalid range' );
    assert && assert( Math.abs( range.min ) === range.max, 'expected range to be symmetrical' );
    assert && AssertUtils.assertArrayOf( axisDescriptions, AxisDescription );

    let zoomLevel = axisDescriptions.length - 1;
    for ( let i = 0; i < axisDescriptions.length - 1; i++ ) {
      if ( range.max >= axisDescriptions[ i ].range.max ) {
        zoomLevel = i;
        break;
      }
    }
    assert && assert( zoomLevel >= 0 && zoomLevel < axisDescriptions.length, `invalid zoomLevel: ${zoomLevel}` );
    return zoomLevel;
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