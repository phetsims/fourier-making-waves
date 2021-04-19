// Copyright 2020, University of Colorado Boulder

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
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import Domain from '../../common/model/Domain.js';

class AxisDescription {

  /**
   * @param config - see doc of fields below, all values are in model coordinates
   */
  constructor( config ) {

    config = merge( {

      // {number} the absolute maximum value of the range, actual range is [-absoluteMax,absoluteMax]
      absoluteMax: required( config.absoluteMax ),

      // {number} spacing between grid lines
      gridLineSpacing: required( config.gridLineSpacing ),

      // {number} spacing between tick marks
      tickMarkSpacing: required( config.tickMarkSpacing ),

      // {number} spacing between tick labels
      tickLabelSpacing: required( config.tickLabelSpacing )
    }, config );

    // @public (read-only)
    this.absoluteMax = config.absoluteMax;
    this.range = new Range( -config.absoluteMax, config.absoluteMax );
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
}

/**
 * Determines whether an array of AxisDescription is sorted by descending absoluteMax value.
 * @param {AxisDescription[]} axisDescriptions
 * @returns {boolean}
 */
function isSortedDescending( axisDescriptions ) {
  return _.every( axisDescriptions,
    ( axisDescription, index, axisDescriptions ) =>
      ( index === 0 || axisDescriptions[ index - 1 ].absoluteMax > axisDescription.absoluteMax )
  );
}

//======================================================================================================================
// x axis
//======================================================================================================================

// @public {AxisDescription[]} descriptions for the x axis, one for each zoom level
// Values are coefficients (multipliers) for L or T, depending on which domain is plotted.
AxisDescription.X_AXIS_DESCRIPTIONS = [
  new AxisDescription( {
    absoluteMax: 2,
    gridLineSpacing: 1 / 8,
    tickMarkSpacing: 1 / 4,
    tickLabelSpacing: 1 / 2
  } ),
  new AxisDescription( {
    absoluteMax: 3 / 2,
    gridLineSpacing: 1 / 8,
    tickMarkSpacing: 1 / 4,
    tickLabelSpacing: 1 / 2
  } ),
  new AxisDescription( {
    absoluteMax: 1,
    gridLineSpacing: 1 / 8,
    tickMarkSpacing: 1 / 4,
    tickLabelSpacing: 1 / 4
  } ),
  new AxisDescription( {
    absoluteMax: 3 / 4,
    gridLineSpacing: 1 / 8,
    tickMarkSpacing: 1 / 4,
    tickLabelSpacing: 1 / 4
  } ),
  new AxisDescription( {
    absoluteMax: 1 / 2,
    gridLineSpacing: 1 / 8,
    tickMarkSpacing: 1 / 4,
    tickLabelSpacing: 1 / 4
  } ),
  new AxisDescription( {
    absoluteMax: 1 / 4,
    gridLineSpacing: 1 / 8,
    tickMarkSpacing: 1 / 4,
    tickLabelSpacing: 1 / 4
  } )
];
assert && assert( isSortedDescending( AxisDescription.X_AXIS_DESCRIPTIONS ),
  'X_AXIS_DESCRIPTIONS must be sorted by descending absoluteMax value' );

// @public default zoom level for the x axis
AxisDescription.X_DEFAULT_ZOOM_LEVEL = AxisDescription.X_AXIS_DESCRIPTIONS.length - 2;

// @public zoomed out as far as possible
AxisDescription.X_FULLY_ZOOMED_OUT = AxisDescription.X_AXIS_DESCRIPTIONS[ AxisDescription.X_AXIS_DESCRIPTIONS.length - 1 ];

// Guard again accidentally changing the default when X_AXIS_DESCRIPTIONS is modified.
assert && assert( AxisDescription.X_AXIS_DESCRIPTIONS[ AxisDescription.X_DEFAULT_ZOOM_LEVEL ].absoluteMax === 1 / 2,
  'X_DEFAULT_ZOOM_LEVEL is probably incorrect - did you add a AxisDescription?' );

//======================================================================================================================
// y axis
//======================================================================================================================

// @public {AxisDescription[]} descriptions for the y axis, one for each zoom level. Values are amplitude (unitless).
AxisDescription.Y_AXIS_DESCRIPTIONS = [
  new AxisDescription( {
    absoluteMax: 15,
    gridLineSpacing: 5,
    tickMarkSpacing: 5,
    tickLabelSpacing: 5
  } ),
  new AxisDescription( {
    absoluteMax: 10,
    gridLineSpacing: 5,
    tickMarkSpacing: 5,
    tickLabelSpacing: 5
  } ),
  new AxisDescription( {
    absoluteMax: 8,
    gridLineSpacing: 1,
    tickMarkSpacing: 5,
    tickLabelSpacing: 5
  } ),
  new AxisDescription( {
    absoluteMax: 5,
    gridLineSpacing: 1,
    tickMarkSpacing: 5,
    tickLabelSpacing: 5
  } ),
  new AxisDescription( {
    absoluteMax: 4,
    gridLineSpacing: 1,
    tickMarkSpacing: 2,
    tickLabelSpacing: 2
  } ),
  new AxisDescription( {
    absoluteMax: 3,
    gridLineSpacing: 1,
    tickMarkSpacing: 1,
    tickLabelSpacing: 1
  } ),
  new AxisDescription( {
    absoluteMax: 2,
    gridLineSpacing: 1,
    tickMarkSpacing: 1,
    tickLabelSpacing: 1
  } ),
  new AxisDescription( {
    absoluteMax: FMWConstants.MAX_ABSOLUTE_AMPLITUDE,
    gridLineSpacing: 0.5,
    tickMarkSpacing: 0.5,
    tickLabelSpacing: 0.5
  } )
];
assert && assert( isSortedDescending( AxisDescription.Y_AXIS_DESCRIPTIONS ),
  'Y_AXIS_DESCRIPTIONS must be sorted by descending absoluteMax value' );

// Alert that you've done something that may require revising Y_AXIS_DESCRIPTIONS.
assert && assert( FMWConstants.MAX_ABSOLUTE_AMPLITUDE === 1.5,
  'Y_AXIS_DESCRIPTIONS have been tuned for the specific amplitude range [-1.5,1.5]. ' +
  'It looks like you have changed FMWConstants.MAX_ABSOLUTE_AMPLITUDE, and may need to revise.' );

// @public default zoom level for the y axis
AxisDescription.Y_DEFAULT_ZOOM_LEVEL = AxisDescription.Y_AXIS_DESCRIPTIONS.length - 1;

// Guard again accidentally changing the default when Y_AXIS_DESCRIPTIONS is modified.
assert && assert( AxisDescription.Y_AXIS_DESCRIPTIONS[ AxisDescription.Y_DEFAULT_ZOOM_LEVEL ].absoluteMax === FMWConstants.MAX_ABSOLUTE_AMPLITUDE,
  'Y_DEFAULT_ZOOM_LEVEL is probably incorrect - did you add a AxisDescription?' );

fourierMakingWaves.register( 'AxisDescription', AxisDescription );
export default AxisDescription;