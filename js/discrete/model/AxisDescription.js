// Copyright 2020, University of Colorado Boulder

//TODO move constants for x-axis and y-axis to a separate file
/**
 * AxisDescription is a data structure used to describe the range, grid lines, and ticks for an axis at a specific
 * zoom level. A zoom level is an index into a {AxisDescription[]}.
 *
 * NOTE that for the x axis, the values in AxisDescription are coefficients (multipliers) for L or T, depending on
 * which domain is plotted.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import required from '../../../../phet-core/js/required.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import Domain from '../../common/model/Domain.js';

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
   * Gets the zoom level that corresponds to an axis range.  This is used to keep the y-axis zoom level in-sync with
   * auto scaling, but is general enough to be used with either axis.
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

//======================================================================================================================
// y axis
//======================================================================================================================

// Alert that you've done something that may require revising Y_AXIS_DESCRIPTIONS.
assert && assert( FMWConstants.MAX_AMPLITUDE === 1.5,
  'Y_AXIS_DESCRIPTIONS have been tuned for the specific amplitude range [-1.5,1.5]. ' +
  'It looks like you have changed FMWConstants.MAX_AMPLITUDE, and may need to revise.' );

// @public {AxisDescription[]} descriptions for the y axis, one for each zoom level. Values are amplitude (unitless).
AxisDescription.Y_AXIS_DESCRIPTIONS = [
  new AxisDescription( {
    max: 15,
    gridLineSpacing: 5,
    tickMarkSpacing: 5,
    tickLabelSpacing: 5
  } ),
  new AxisDescription( {
    max: 10,
    gridLineSpacing: 5,
    tickMarkSpacing: 5,
    tickLabelSpacing: 5
  } ),
  new AxisDescription( {
    max: 8,
    gridLineSpacing: 1,
    tickMarkSpacing: 5,
    tickLabelSpacing: 5
  } ),
  new AxisDescription( {
    max: 5,
    gridLineSpacing: 1,
    tickMarkSpacing: 5,
    tickLabelSpacing: 5
  } ),
  new AxisDescription( {
    max: 4,
    gridLineSpacing: 1,
    tickMarkSpacing: 2,
    tickLabelSpacing: 2
  } ),
  new AxisDescription( {
    max: 3,
    gridLineSpacing: 1,
    tickMarkSpacing: 1,
    tickLabelSpacing: 1
  } ),
  new AxisDescription( {
    max: 2,
    gridLineSpacing: 1,
    tickMarkSpacing: 1,
    tickLabelSpacing: 1
  } ),
  new AxisDescription( {
    max: FMWConstants.MAX_AMPLITUDE,
    gridLineSpacing: 0.5,
    tickMarkSpacing: 0.5,
    tickLabelSpacing: 0.5
  } )
];
assert && assert( AxisDescription.isSortedDescending( AxisDescription.Y_AXIS_DESCRIPTIONS ),
  'Y_AXIS_DESCRIPTIONS must be sorted by descending max value, from most zoomed-out to most zoomed-in' );

// @public default zoom level for the y axis
AxisDescription.DEFAULT_Y_ZOOM_LEVEL = AxisDescription.Y_AXIS_DESCRIPTIONS.length - 1;

// @public default description for the y axis
AxisDescription.DEFAULT_Y_AXIS_DESCRIPTION = AxisDescription.Y_AXIS_DESCRIPTIONS[ AxisDescription.DEFAULT_Y_ZOOM_LEVEL ];

// Guard again accidentally changing the default when Y_AXIS_DESCRIPTIONS is modified.
assert && assert( AxisDescription.DEFAULT_Y_AXIS_DESCRIPTION.range.max === FMWConstants.MAX_AMPLITUDE,
  'DEFAULT_Y_ZOOM_LEVEL is probably incorrect - did you add an AxisDescription?' );

fourierMakingWaves.register( 'AxisDescription', AxisDescription );
export default AxisDescription;