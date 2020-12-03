// Copyright 2020, University of Colorado Boulder

/**
 * DiscreteViewProperties is the set of view-specific Properties for the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

// Is the array sorted in descending order, with no duplicates?
function isSortedDescending( array ) {
  return _.every( array, ( value, index, array ) => ( index === 0 || array[ index - 1 ] > value ) );
}

// Multipliers for x-axis range maximums, applied to L and T
const X_MAXIMUM_MULTIPLIERS = [ 2, 1.5, 1, 0.75, 0.5, 0.25 ];
assert && assert( isSortedDescending( X_MAXIMUM_MULTIPLIERS ), 'x-axis zoom levels must be in descending order' );

// Multipliers for x-axis tick spacing, applied to L and T
const X_TICK_SPACING_MULTIPLIERS = [ 0.5, 0.5, 0.25, 0.25, 0.25, 0.25 ];
assert && assert( X_MAXIMUM_MULTIPLIERS.length === X_TICK_SPACING_MULTIPLIERS.length,
  'tick spacing required for each zoom level' );

// Maximums for each y-axis zoom level
const Y_MAXIMUMS = [ 12, 10, 8, 6, 4, 2, FMWConstants.MAX_ABSOLUTE_AMPLITUDE ];
assert && assert( isSortedDescending( Y_MAXIMUMS ), 'y-axis zoom levels must be in descending order' );

// Tick spacings for y-axis zoom levels
const Y_TICK_SPACINGS = [ 5, 5, 5, 5, 1, 1, 0.5 ];
assert && assert( Y_MAXIMUMS.length === Y_TICK_SPACINGS.length, 'tick spacing required for each zoom level' );

class DiscreteViewProperties {

  constructor() {

    // @public whether the Harmonics chart is visible
    this.harmonicsChartVisibleProperty = new BooleanProperty( true );

    // @public whether the Sum chart is visible
    this.sumChartVisibleProperty = new BooleanProperty( true );

    // @public whether the Sum chart's y-axis automatically scales to show all data
    this.autoScaleProperty = new BooleanProperty( false );

    // @public whether the Sum chart shows what the preset function looks like for an infinite Fourier series
    this.infiniteHarmonicsProperty = new BooleanProperty( false );

    // @public whether the sound of the Fourier series is enabled
    this.soundEnabledProperty = new BooleanProperty( false );

    // @public volume of the sound for the Fourier series
    this.soundOutputLevelProperty = new NumberProperty( 0.25, {
      range: new Range( 0, 1 )
    } );

    //TODO move all of the chart Properties somewhere else? FMWChartModel?

    // @public zoom level for the x axis, index into X_MAXIMUM_MULTIPLIERS and X_TICK_SPACING_MULTIPLIERS
    this.xZoomLevelProperty = new NumberProperty( 4, {
      range: new Range( 0, X_MAXIMUM_MULTIPLIERS.length - 1 )
    } );

    // @public {DerivedProperty.<Range>} multiplier for x-axis range, applied to L or T
    this.xRangeMultiplierProperty = new DerivedProperty(
      [ this.xZoomLevelProperty ],
      xZoomLevel => new Range( -X_MAXIMUM_MULTIPLIERS[ xZoomLevel ], X_MAXIMUM_MULTIPLIERS[ xZoomLevel ] )
    );

    // @public {DerivedProperty.<number>} multiplier for x-axis tick spacing, applied to L or T
    this.xTickSpacingMultiplierProperty = new DerivedProperty(
      [ this.xZoomLevelProperty ],
      xZoomLevel => X_TICK_SPACING_MULTIPLIERS[ xZoomLevel ]
    );

    // @public zoom level for the y axis, index into Y_MAXIMUMS and Y_TICK_SPACINGS
    this.yZoomLevelProperty = new NumberProperty( 0, {
      range: new Range( 0, Y_MAXIMUMS.length - 1 )
    } );

    // @public {DerivedProperty.<Range>} y-axis range
    this.yRangeProperty = new DerivedProperty(
      [ this.yZoomLevelProperty ],
      yZoomLevel => new Range( -Y_MAXIMUMS[ yZoomLevel ], Y_MAXIMUMS[ yZoomLevel ] )
    );

    // @public {DerivedProperty.<number>} y-axis tick spacing
    this.yTickSpacingProperty = new DerivedProperty(
      [ this.yZoomLevelProperty ],
      yZoomLevel => Y_TICK_SPACINGS[ yZoomLevel ]
    );
  }

  /**
   * Resets all Properties that are defined by this class.
   * @public
   */
  reset() {
    for ( const propertyName in this ) {
      if ( this.hasOwnProperty( propertyName ) &&
           ( this[ propertyName ] instanceof Property ) &&
           !( this[ propertyName ] instanceof DerivedProperty ) ) {
        this[ propertyName ].reset();
      }
    }
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }
}

fourierMakingWaves.register( 'DiscreteViewProperties', DiscreteViewProperties );
export default DiscreteViewProperties;