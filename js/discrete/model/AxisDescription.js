// Copyright 2020, University of Colorado Boulder

/**
 * AxisDescription is a data structure used to describe the range, grid lines, and ticks for an axis at a specific
 * zoom level. A zoom level is an index into a {AxisDescription[]}.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import required from '../../../../phet-core/js/required.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class AxisDescription {

  /**
   * @param config - see doc of fields below, all values are in model coordinates
   */
  constructor( config ) {

    config = merge( {

      // {number} the absolute maximum value of the range, actual range is [-max,max]
      max: required( config.max ),

      // {number} spacing between grid lines
      gridLineSpacing: required( config.gridLineSpacing ),

      // {number} spacing between tick marks
      tickMarkSpacing: required( config.tickMarkSpacing ),

      // {number} spacing between tick labels
      tickLabelSpacing: required( config.tickLabelSpacing )
    }, config );

    // @public (read-only)
    this.max = config.max;
    this.gridLineSpacing = config.gridLineSpacing;
    this.tickMarkSpacing = config.tickMarkSpacing;
    this.tickLabelSpacing = config.tickLabelSpacing;
  }
}

// @public {AxisDescription[]} descriptions for the x axis, one for each zoom level
// These values are all multipliers for L (fundamental wavelength) and T (fundamental period).
AxisDescription.X_AXIS_DESCRIPTIONS = [
  new AxisDescription( {
    max: 2,
    gridLineSpacing: 1 / 8,
    tickMarkSpacing: 1 / 4,
    tickLabelSpacing: 1 / 2
  } ),
  new AxisDescription( {
    max: 3 / 2,
    gridLineSpacing: 1 / 8,
    tickMarkSpacing: 1 / 4,
    tickLabelSpacing: 1 / 2
  } ),
  new AxisDescription( {
    max: 1,
    gridLineSpacing: 1 / 8,
    tickMarkSpacing: 1 / 4,
    tickLabelSpacing: 1 / 4
  } ),
  new AxisDescription( {
    max: 3 / 4,
    gridLineSpacing: 1 / 8,
    tickMarkSpacing: 1 / 4,
    tickLabelSpacing: 1 / 4
  } ),
  new AxisDescription( {
    max: 1 / 2,
    gridLineSpacing: 1 / 8,
    tickMarkSpacing: 1 / 4,
    tickLabelSpacing: 1 / 4
  } ),
  new AxisDescription( {
    max: 1 / 4,
    gridLineSpacing: 1 / 8,
    tickMarkSpacing: 1 / 4,
    tickLabelSpacing: 1 / 4
  } )
];
assert && assert( isSortedDescending( AxisDescription.X_AXIS_DESCRIPTIONS ),
  'X_AXIS_DESCRIPTIONS must be sorted by descending max value' );

// @public default zoom level for the x axis
AxisDescription.X_DEFAULT_ZOOM_LEVEL = AxisDescription.X_AXIS_DESCRIPTIONS.length - 2;

// Guard again accidentally changing the default when X_AXIS_DESCRIPTIONS is modified.
assert && assert( AxisDescription.X_AXIS_DESCRIPTIONS[ AxisDescription.X_DEFAULT_ZOOM_LEVEL ].max === 1 / 2,
  'X_DEFAULT_ZOOM_LEVEL is probably incorrect - did you add a AxisDescription?' );

// @public {AxisDescription[]} descriptions for the y axis, one for each zoom level.
AxisDescription.Y_AXIS_DESCRIPTIONS = [
  new AxisDescription( {
    max: 20,
    gridLineSpacing: 5,
    tickMarkSpacing: 10,
    tickLabelSpacing: 10
  } ),
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
    max: FMWConstants.MAX_ABSOLUTE_AMPLITUDE,
    gridLineSpacing: 0.5,
    tickMarkSpacing: 0.5,
    tickLabelSpacing: 0.5
  } )
];
assert && assert( isSortedDescending( AxisDescription.Y_AXIS_DESCRIPTIONS ),
  'Y_AXIS_DESCRIPTIONS must be sorted by descending max value' );

// Alert that you've done something that may require revising Y_AXIS_DESCRIPTIONS.
assert && assert( FMWConstants.MAX_ABSOLUTE_AMPLITUDE === 1.5,
  'Y_AXIS_DESCRIPTIONS have been tuned for the specific amplitude range [-1.5,1.5]. ' + '' +
  'It looks like you have changed FMWConstants.MAX_ABSOLUTE_AMPLITUDE, and may need to revise.' );

// @public default zoom level for the y axis
AxisDescription.Y_DEFAULT_ZOOM_LEVEL = AxisDescription.Y_AXIS_DESCRIPTIONS.length - 1;

// Guard again accidentally changing the default when Y_AXIS_DESCRIPTIONS is modified.
assert && assert( AxisDescription.Y_AXIS_DESCRIPTIONS[ AxisDescription.Y_DEFAULT_ZOOM_LEVEL ].max === FMWConstants.MAX_ABSOLUTE_AMPLITUDE,
  'Y_DEFAULT_ZOOM_LEVEL is probably incorrect - did you add a AxisDescription?' );

/**
 * Determines whether an array to AxisDescription is sorted by descending max value.
 * @param {AxisDescription[]} axisDescriptions
 * @returns {boolean}
 */
function isSortedDescending( axisDescriptions ) {
  return _.every( axisDescriptions,
    ( axisDescription, index, axisDescriptions ) => ( index === 0 || axisDescriptions[ index - 1 ].max > axisDescription.max )
  );
}

fourierMakingWaves.register( 'AxisDescription', AxisDescription );
export default AxisDescription;