// Copyright 2020, University of Colorado Boulder

/**
 * ZoomDescription is used to describe the range, grid lines, and ticks for an axis at a specific zoom level.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import required from '../../../../phet-core/js/required.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class ZoomDescription {

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

// @public {ZoomDescription[]} zoom levels for the x axis, one for each zoom level
// These values are all multipliers for L (fundamental wavelength) and T (fundamental period).
ZoomDescription.X_ZOOM_DESCRIPTIONS = [
  new ZoomDescription( {
    max: 2,
    gridLineSpacing: 1 / 8,
    tickMarkSpacing: 1 / 4,
    tickLabelSpacing: 1 / 2
  } ),
  new ZoomDescription( {
    max: 3 / 2,
    gridLineSpacing: 1 / 8,
    tickMarkSpacing: 1 / 4,
    tickLabelSpacing: 1 / 2
  } ),
  new ZoomDescription( {
    max: 1,
    gridLineSpacing: 1 / 8,
    tickMarkSpacing: 1 / 4,
    tickLabelSpacing: 1 / 4
  } ),
  new ZoomDescription( {
    max: 3 / 4,
    gridLineSpacing: 1 / 8,
    tickMarkSpacing: 1 / 4,
    tickLabelSpacing: 1 / 4
  } ),
  new ZoomDescription( {
    max: 1 / 2,
    gridLineSpacing: 1 / 8,
    tickMarkSpacing: 1 / 4,
    tickLabelSpacing: 1 / 4
  } ),
  new ZoomDescription( {
    max: 1 / 4,
    gridLineSpacing: 1 / 8,
    tickMarkSpacing: 1 / 4,
    tickLabelSpacing: 1 / 4
  } )
];
assert && assert( isSortedDescending( ZoomDescription.X_ZOOM_DESCRIPTIONS ),
  'X_ZOOM_DESCRIPTIONS must be sorted by descending max value' );

// @public default zoom level for the x axis
ZoomDescription.X_DEFAULT_ZOOM_LEVEL = ZoomDescription.X_ZOOM_DESCRIPTIONS.length - 2;

// Guard again accidentally changing the default when X_ZOOM_DESCRIPTIONS is modified.
assert && assert( ZoomDescription.X_ZOOM_DESCRIPTIONS[ ZoomDescription.X_DEFAULT_ZOOM_LEVEL ].max === 1 / 2,
  'X_DEFAULT_ZOOM_LEVEL is probably incorrect - did you add a ZoomDescription?' );

// @public {ZoomDescription[]} zoom levels for the y axis, one for each zoom level. These values have been tuned for
// the specific amplitude range [-1.5,1.5]. If you change FMWConstants.MAX_ABSOLUTE_AMPLITUDE, you'll need to revise.
ZoomDescription.Y_ZOOM_DESCRIPTIONS = [
  new ZoomDescription( {
    max: 20,
    gridLineSpacing: 5,
    tickMarkSpacing: 10,
    tickLabelSpacing: 10
  } ),
  new ZoomDescription( {
    max: 15,
    gridLineSpacing: 5,
    tickMarkSpacing: 5,
    tickLabelSpacing: 5
  } ),
  new ZoomDescription( {
    max: 10,
    gridLineSpacing: 5,
    tickMarkSpacing: 5,
    tickLabelSpacing: 5
  } ),
  new ZoomDescription( {
    max: 8,
    gridLineSpacing: 1,
    tickMarkSpacing: 5,
    tickLabelSpacing: 5
  } ),
  new ZoomDescription( {
    max: 5,
    gridLineSpacing: 1,
    tickMarkSpacing: 5,
    tickLabelSpacing: 5
  } ),
  new ZoomDescription( {
    max: 4,
    gridLineSpacing: 1,
    tickMarkSpacing: 2,
    tickLabelSpacing: 2
  } ),
  new ZoomDescription( {
    max: 3,
    gridLineSpacing: 1,
    tickMarkSpacing: 1,
    tickLabelSpacing: 1
  } ),
  new ZoomDescription( {
    max: 2,
    gridLineSpacing: 1,
    tickMarkSpacing: 1,
    tickLabelSpacing: 1
  } ),
  new ZoomDescription( {
    max: FMWConstants.MAX_ABSOLUTE_AMPLITUDE,
    gridLineSpacing: 0.5,
    tickMarkSpacing: 0.5,
    tickLabelSpacing: 0.5
  } )
];
assert && assert( isSortedDescending( ZoomDescription.Y_ZOOM_DESCRIPTIONS ),
  'Y_ZOOM_DESCRIPTIONS must be sorted by descending max value' );

// @public default zoom level for the y axis
ZoomDescription.Y_DEFAULT_ZOOM_LEVEL = ZoomDescription.Y_ZOOM_DESCRIPTIONS.length - 1;

// Guard again accidentally changing the default when Y_ZOOM_DESCRIPTIONS is modified.
assert && assert( ZoomDescription.Y_ZOOM_DESCRIPTIONS[ ZoomDescription.Y_DEFAULT_ZOOM_LEVEL ].max === FMWConstants.MAX_ABSOLUTE_AMPLITUDE,
  'Y_DEFAULT_ZOOM_LEVEL is probably incorrect - did you add a ZoomDescription?' );

/**
 * Determines whether zoomDescriptions is sorted by descending max value.
 * @param {ZoomDescription[]} zoomDescriptions
 * @returns {boolean}
 */
function isSortedDescending( zoomDescriptions ) {
  return _.every( zoomDescriptions,
    ( zoomDescription, index, zoomDescriptions ) => ( index === 0 || zoomDescriptions[ index - 1 ].max > zoomDescription.max )
  );
}

fourierMakingWaves.register( 'ZoomDescription', ZoomDescription );
export default ZoomDescription;