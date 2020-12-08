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

const L = FMWConstants.L;
const T = FMWConstants.T;

/**
 *
 * @type DomainDescription
 * @property {number} max - maximum of range, actual range is [-max,max]
 * @property {number} gridLineSpacing - grid line spacing
 * @property {number} tickMarkSpacing - tick mark spacing
 * @property {number[]} symbolicTickValues - values for symbolic tick labels
 * @property {string[]} symbolicTickValues - a symbolic label for each value in symbolicTickValues
 */

/**
 * @typedef XZoomDescription
 * @property {DomainDescription} space - descriptions for space domains
 * @property {DomainDescription} time - description for time domains
 */

// {XZoomDescription[]} zoom descriptions for the x axis, one for each zoom level
const X_ZOOM_DESCRIPTIONS = [
  {
    space: {
      max: 2 * L,
      gridLineSpacing: L / 8,
      tickMarkSpacing: L / 4,
      symbolicTickValues: [ 2 * L, 3 * L / 2, L, L / 2, 0 ],
      symbolicTickLabels: [ '2L', '3L/2', 'L', 'L/2', '0' ] //TODO i18n
    },
    time: {
      max: 2 * T,
      gridLineSpacing: T / 8,
      tickMarkSpacing: T / 4,
      symbolicTickValues: [ 2 * T, 3 * T / 2, T, T / 2, 0 ],
      symbolicTickLabels: [ '2T', '3T/2', 'T', 'T/2', '0' ] //TODO i18n
    }
  },
  {
    space: {
      max: 3 * L / 2,
      gridLineSpacing: L / 8,
      tickMarkSpacing: L / 4,
      symbolicTickValues: [ 3 * L / 2, L, L / 2, 0 ],
      symbolicTickLabels: [ '3L/2', 'L', 'L/2', '0' ] //TODO i18n
    },
    time: {
      max: 3 * T / 2,
      gridLineSpacing: T / 8,
      tickMarkSpacing: T / 4,
      symbolicTickValues: [ 3 * T / 2, T, T / 2, 0 ],
      symbolicTickLabels: [ '3T/2', 'T', 'T/2', '0' ] //TODO i18n
    }
  },
  {
    space: {
      max: L,
      gridLineSpacing: L / 8,
      tickMarkSpacing: L / 4,
      symbolicTickValues: [ L, 3 * L / 4, L / 2, L / 4, 0 ],
      symbolicTickLabels: [ 'L', '3L/4', 'L/2', 'L/4', '0' ] //TODO i18n
    },
    time: {
      max: T,
      gridLineSpacing: T / 8,
      tickMarkSpacing: T / 4,
      symbolicTickValues: [ T, 3 * T / 4, T / 2, T / 4, 0 ],
      symbolicTickLabels: [ 'T', '3T/4', 'T/2', 'T/4', '0' ] //TODO i18n
    }
  },
  {
    space: {
      max: 3 * L / 4,
      gridLineSpacing: L / 8,
      tickMarkSpacing: L / 4,
      symbolicTickValues: [ 3 * L / 4, L / 2, L / 4, 0 ],
      symbolicTickLabels: [ '3L/4', 'L/2', 'L/4', '0' ] //TODO i18n
    },
    time: {
      max: 3 * T / 4,
      gridLineSpacing: T / 8,
      tickMarkSpacing: T / 4,
      symbolicTickValues: [ 3 * T / 4, T / 2, T / 4, 0 ],
      symbolicTickLabels: [ '3T/4', 'T/2', 'T/4', '0' ] //TODO i18n
    }
  },
  {
    space: {
      max: L / 2,
      gridLineSpacing: L / 8,
      tickMarkSpacing: L / 4,
      symbolicTickValues: [ L / 2, L / 4, 0 ],
      symbolicTickLabels: [ 'L/2', 'L/4', '0' ] //TODO i18n
    },
    time: {
      max: T / 2,
      gridLineSpacing: T / 8,
      tickMarkSpacing: T / 4,
      symbolicTickValues: [ T / 2, T / 4, 0 ],
      symbolicTickLabels: [ 'T/2', 'T/4', '0' ] //TODO i18n
    }
  },
  {
    space: {
      max: L / 4,
      gridLineSpacing: L / 8,
      tickMarkSpacing: L / 4,
      symbolicTickValues: [ L / 4, 0 ],
      symbolicTickLabels: [ 'L/4', '0' ] //TODO i18n
    },
    time: {
      max: T / 4,
      gridLineSpacing: T / 8,
      tickMarkSpacing: T / 4,
      symbolicTickValues: [ T / 4, 0 ],
      symbolicTickLabels: [ 'T/4', '0' ] //TODO i18n
    }
  }
];

// Validate X_ZOOM_DESCRIPTIONS
assert && assert( _.every( X_ZOOM_DESCRIPTIONS, zoomDescription =>
  isSortedDescending( zoomDescription.space.symbolicTickValues )
), 'symbolicTickValues must be sorted in descending order' );
assert && assert( _.every( X_ZOOM_DESCRIPTIONS, zoomDescription =>
  isSortedDescending( zoomDescription.time.symbolicTickValues )
), 'symbolicTickValues must be sorted in descending order' );
assert && assert( _.every( X_ZOOM_DESCRIPTIONS, zoomDescription =>
  zoomDescription.space.symbolicTickValues.length === zoomDescription.space.symbolicTickLabels.length
), 'a tick label is required for every tick value' );
assert && assert( _.every( X_ZOOM_DESCRIPTIONS, zoomDescription =>
  zoomDescription.time.symbolicTickValues.length === zoomDescription.time.symbolicTickLabels.length
), 'a tick label is required for every tick value' );

/**
 * @type YZoomDescription
 * @property {number} max - maximum of range, actual range is [-max,max]
 * @property {number} gridLineSpacing
 * @property {number} tickMarkSpacing
 * @property {number} tickLabelSpacing
 */

// {YZoomDescription[]} zoom descriptions for the y axis, one for each zoom level
const Y_ZOOM_DESCRIPTIONS = [
  {
    max: 12,
    gridLineSpacing: 5,
    tickMarkSpacing: 5,
    tickLabelSpacing: 5
  },
  {
    max: 10,
    gridLineSpacing: 5,
    tickMarkSpacing: 5,
    tickLabelSpacing: 5
  },
  {
    max: 8,
    gridLineSpacing: 1,
    tickMarkSpacing: 5,
    tickLabelSpacing: 5
  },
  {
    max: 6,
    gridLineSpacing: 1,
    tickMarkSpacing: 5,
    tickLabelSpacing: 5
  },
  {
    max: 4,
    gridLineSpacing: 1,
    tickMarkSpacing: 2,
    tickLabelSpacing: 2
  },
  {
    max: 2,
    gridLineSpacing: 1,
    tickMarkSpacing: 1,
    tickLabelSpacing: 1
  },
  {
    max: FMWConstants.MAX_ABSOLUTE_AMPLITUDE,
    gridLineSpacing: 0.5,
    tickMarkSpacing: 0.5,
    tickLabelSpacing: 0.5
  }
];

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

    //TODO move chart Properties somewhere else? FMWChartModel?

    // @public zoom level for the x axis, index into X_MAXIMUM_MULTIPLIERS and X_TICK_SPACING_MULTIPLIERS
    this.xZoomLevelProperty = new NumberProperty( 0, {
      range: new Range( 0, X_ZOOM_DESCRIPTIONS.length - 1 )
    } );

    // @public {DerivedProperty.<XZoomDescription>} x-axis zoom description
    this.xZoomDescriptionProperty = new DerivedProperty(
      [ this.xZoomLevelProperty ],
      xZoomLevel => X_ZOOM_DESCRIPTIONS[ xZoomLevel ]
    );

    // @public zoom level for the y axis, index into Y_MAXIMUMS and Y_TICK_SPACINGS
    this.yZoomLevelProperty = new NumberProperty( 0, {
      range: new Range( 0, Y_ZOOM_DESCRIPTIONS.length - 1 )
    } );

    // @public {DerivedProperty.<YZoomDescription>} y-axis zoom description
    this.yZoomDescriptionProperty = new DerivedProperty(
      [ this.yZoomLevelProperty ],
      yZoomLevel => Y_ZOOM_DESCRIPTIONS[ yZoomLevel ]
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