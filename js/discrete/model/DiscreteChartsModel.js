// Copyright 2020, University of Colorado Boulder

/**
 * DiscreteChartsModel is the model for charts in the 'Discrete' screen.
 * An instance of this sub-model is instantiated by DiscreteModel.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import createObservableArray from '../../../../axon/js/createObservableArray.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import AxisDescription from './AxisDescription.js';

class DiscreteChartsModel {

  constructor() {

    // @public whether the Harmonics chart is visible
    this.harmonicsChartVisibleProperty = new BooleanProperty( true );

    // @public whether the Sum chart is visible
    this.sumChartVisibleProperty = new BooleanProperty( true );

    // @public whether the Sum chart's y-axis automatically scales to fit its data set
    this.autoScaleProperty = new BooleanProperty( false );

    // @public whether the Sum chart shows what the waveform looks like for an infinite Fourier series
    this.infiniteHarmonicsProperty = new BooleanProperty( false );

    // @public {ObservableArrayDef} the harmonics to be emphasized in the Harmonics chart
    this.emphasizedHarmonics = createObservableArray();

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

    // @private
    this.resetDiscreteChartsModel = () => {

      this.emphasizedHarmonics.clear();

      // Reset all non-derived Properties
      for ( const propertyName in this ) {
        if ( this.hasOwnProperty( propertyName ) &&
             ( this[ propertyName ] instanceof Property ) &&
             !( this[ propertyName ] instanceof DerivedProperty ) ) {
          this[ propertyName ].reset();
        }
      }
    };
  }

  /**
   * Resets all non-derived Properties that are defined by this class.
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

fourierMakingWaves.register( 'DiscreteChartsModel', DiscreteChartsModel );
export default DiscreteChartsModel;