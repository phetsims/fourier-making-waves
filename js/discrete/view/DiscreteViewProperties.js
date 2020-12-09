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

/**
 * @typedef {Object} ZoomDescription
 * @property {number} max - multiplier for L or T
 * @property {number} gridLineSpacing - multiplier for L or T
 * @property {number} tickMarkSpacing - multiplier for L or T
 */

// {ZoomDescription[]} zoom descriptions for the x axis, one for each zoom level
// These values are all multipliers for L and T.
const X_ZOOM_DESCRIPTIONS = [
  {
    max: 2,
    gridLineSpacing: 1 / 8,
    tickMarkSpacing: 1 / 4,
    tickLabelSpacing: 1 / 2
  },
  {
    max: 3 / 2,
    gridLineSpacing: 1 / 8,
    tickMarkSpacing: 1 / 4,
    tickLabelSpacing: 1 / 2
  },
  {
    max: 1,
    gridLineSpacing: 1 / 8,
    tickMarkSpacing: 1 / 4,
    tickLabelSpacing: 1 / 4
  },
  {
    max: 3 / 4,
    gridLineSpacing: 1 / 8,
    tickMarkSpacing: 1 / 4,
    tickLabelSpacing: 1 / 4
  },
  {
    max: 1 / 2,
    gridLineSpacing: 1 / 8,
    tickMarkSpacing: 1 / 4,
    tickLabelSpacing: 1 / 4
  },
  {
    max: 1 / 4,
    gridLineSpacing: 1 / 8,
    tickMarkSpacing: 1 / 4,
    tickLabelSpacing: 1 / 4
  }
];

// {ZoomDescription[]} zoom descriptions for the y axis, one for each zoom level
const Y_ZOOM_DESCRIPTIONS = [
  {
    max: 20,
    gridLineSpacing: 5,
    tickMarkSpacing: 10,
    tickLabelSpacing: 10
  },
  {
    max: 15,
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
    max: 5,
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
    max: 3,
    gridLineSpacing: 1,
    tickMarkSpacing: 1,
    tickLabelSpacing: 1
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

    // @public whether the Sum chart shows what the waveform looks like for an infinite Fourier series
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

    // @public {DerivedProperty.<ZoomDescription>} x-axis zoom description
    this.xZoomDescriptionProperty = new DerivedProperty(
      [ this.xZoomLevelProperty ],
      xZoomLevel => X_ZOOM_DESCRIPTIONS[ xZoomLevel ]
    );

    // @public zoom level for the y axis, index into Y_MAXIMUMS and Y_TICK_SPACINGS
    this.yZoomLevelProperty = new NumberProperty( 0, {
      range: new Range( 0, Y_ZOOM_DESCRIPTIONS.length - 1 )
    } );

    // @public {DerivedProperty.<ZoomDescription>} y-axis zoom description
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