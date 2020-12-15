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
import fourierMakingWaves from '../../fourierMakingWaves.js';
import AxisDescription from '../model/AxisDescription.js';

class DiscreteViewProperties {

  /**
   * @param {NumberProperty} numberOfHarmonicsProperty
   */
  constructor( numberOfHarmonicsProperty ) {
    assert && assert( numberOfHarmonicsProperty instanceof NumberProperty, 'invalid numberOfHarmonicsProperty' );
    assert && assert( numberOfHarmonicsProperty.range, 'numberOfHarmonicsProperty.range is required' );

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

    // @public whether the Wavelength tool is selected
    this.wavelengthToolSelectedProperty = new BooleanProperty( false );

    // @public whether the Period tool is selected
    this.periodToolSelectedProperty = new BooleanProperty( false );

    // @public order of the harmonic measured by the Wavelength tool
    this.wavelengthToolOrderProperty = new NumberProperty( 1, {
      numberType: 'Integer',
      range: numberOfHarmonicsProperty.range
    } );

    // @public order of the harmonic measured by the Period tool
    this.periodToolOrderProperty = new NumberProperty( 1, {
      numberType: 'Integer',
      range: numberOfHarmonicsProperty.range
    } );

    //TODO move chart Properties somewhere else? FMWChartModel?

    // @public zoom level for the x axis, index into AxisDescription.X_AXIS_DESCRIPTIONS
    this.xZoomLevelProperty = new NumberProperty( AxisDescription.X_DEFAULT_ZOOM_LEVEL, {
      numberType: 'Integer',
      range: new Range( 0, AxisDescription.X_AXIS_DESCRIPTIONS.length - 1 )
    } );

    // @public {DerivedProperty.<AxisDescription>} describes the properties of the x axis
    this.xAxisDescriptionProperty = new DerivedProperty(
      [ this.xZoomLevelProperty ],
      xZoomLevel => AxisDescription.X_AXIS_DESCRIPTIONS[ xZoomLevel ]
    );

    // @public zoom level for the y axis, index into AxisDescription.Y_AXIS_DESCRIPTIONS
    this.yZoomLevelProperty = new NumberProperty( AxisDescription.Y_DEFAULT_ZOOM_LEVEL, {
      numberType: 'Integer',
      range: new Range( 0, AxisDescription.Y_AXIS_DESCRIPTIONS.length - 1 )
    } );

    // @public {DerivedProperty.<AxisDescription>} describes the properties of the y axis
    this.yAxisDescriptionProperty = new DerivedProperty(
      [ this.yZoomLevelProperty ],
      yZoomLevel => AxisDescription.Y_AXIS_DESCRIPTIONS[ yZoomLevel ]
    );

    // unlink is not needed.
    numberOfHarmonicsProperty.link( numberOfHarmonics => {

      // If a measurement tool is selected and its harmonic is no longer relevant, unselect the tool.
      if ( this.wavelengthToolSelectedProperty.value ) {
        this.wavelengthToolSelectedProperty.value = ( this.wavelengthToolOrderProperty.value <= numberOfHarmonics );
      }
      if ( this.periodToolSelectedProperty.value ) {
        this.periodToolSelectedProperty.value = ( this.periodToolOrderProperty.value <= numberOfHarmonics );
      }

      // If a measurement tool is associated with a harmonic that is no longer relevant, associate the tool with
      // the highest-order harmonic.
      this.wavelengthToolOrderProperty.value = Math.min( numberOfHarmonics, this.wavelengthToolOrderProperty.value );
      this.wavelengthToolOrderProperty.rangeProperty.value = new Range( 1, numberOfHarmonics );
      this.periodToolOrderProperty.value = Math.min( numberOfHarmonics, this.periodToolOrderProperty.value );
      this.periodToolOrderProperty.rangeProperty.value = new Range( 1, numberOfHarmonics );
    } );
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