// Copyright 2020-2021, University of Colorado Boulder

/**
 * ContinuousModel is the top-level model for the 'Continuous' screen.
 *
 * Note that while the model uses field names that are specific to the space domain, those fields are used for both
 * the space domain and time domain. We can make this simplification (which originated in the Java version) because
 * we assume that the values of L (wavelength of the fundamental harmonic) and T (period of the fundamental harmonic)
 * are the same. That is, L=1 meter and T=1 millisecond. Changing the domain therefore only changes the symbols and
 * units that appear in the user interface. Where the space domain uses meters, the time domain uses milliseconds.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import Domain from '../../common/model/Domain.js';
import SeriesType from '../../common/model/SeriesType.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import ComponentsChart from './ComponentsChart.js';
import ContinuousAmplitudesChart from './ContinuousAmplitudesChart.js';
import ContinuousSumChart from './ContinuousSumChart.js';

// valid values for componentSpacingProperty
const COMPONENT_SPACING_VALUES = [ 0, Math.PI / 4, Math.PI / 2, Math.PI, 2 * Math.PI ];

class ContinuousModel {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // @public the range over which components are significant, in radians/meter
    this.significantWidthRange = new Range( 0, 24 * Math.PI );

    // @public index into COMPONENT_SPACING_VALUES, so that we have a linear value to control via Slider
    this.componentSpacingIndexProperty = new NumberProperty( 3, {
      numberType: 'Integer',
      range: new Range( 0, COMPONENT_SPACING_VALUES.length - 1 ),
      tandem: options.tandem.createTandem( 'componentSpacingIndexProperty' )
    } );

    // @public {DerivedProperty.<number>} spacing between Fourier components, in radians/meter.
    // dispose is not needed
    this.componentSpacingProperty = new DerivedProperty(
      [ this.componentSpacingIndexProperty ],
      index => COMPONENT_SPACING_VALUES[ index ], {
        validValues: COMPONENT_SPACING_VALUES,
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO ),
        tandem: options.tandem.createTandem( 'componentSpacingProperty' )
      } );

    // @public
    this.continuousWaveformVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'continuousWaveformVisibleProperty' )
    } );

    // @public center of the Gaussian wave packet, in radians/meter.
    this.wavePacketCenterProperty = new NumberProperty( 12 * Math.PI, {
      range: new Range( 9 * Math.PI, 15 * Math.PI ),
      tandem: options.tandem.createTandem( 'wavePacketCenterProperty' )
    } );

    // @public Gaussian wave packet width in k space, in radians/meter.
    // Note that kWidth = 1 / xWidth
    this.kWidthProperty = new NumberProperty( 3 * Math.PI, {
      range: new Range( 1, 4 * Math.PI ),
      tandem: options.tandem.createTandem( 'kWidthProperty' )
    } );

    // @public Gaussian wave packet width in x space, in meters.
    // Note that xWidth = 1 / kWidth
    this.xWidthProperty = new NumberProperty( 1 / this.kWidthProperty.value, {
      range: new Range( 1 / this.kWidthProperty.range.max, 1 / this.kWidthProperty.range.min ),
      tandem: options.tandem.createTandem( 'xWidthProperty' )
    } );

    // @public
    this.domainProperty = new EnumerationProperty( Domain, Domain.SPACE, {
      validValues: [ Domain.SPACE, Domain.TIME ],
      tandem: options.tandem.createTandem( 'domainProperty' )
    } );

    // @public
    this.seriesTypeProperty = new EnumerationProperty( SeriesType, SeriesType.SINE, {
      tandem: options.tandem.createTandem( 'seriesTypeProperty' )
    } );

    // @public
    this.envelopeVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'envelopeVisibleProperty' )
    } );

    // @public
    this.widthIndicatorsVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'widthIndicatorsVisibleProperty' )
    } );

    // @public
    this.amplitudesChart = new ContinuousAmplitudesChart( {
      tandem: options.tandem.createTandem( 'amplitudesChart' )
    } );

    // @public
    this.componentsChart = new ComponentsChart( {
      tandem: options.tandem.createTandem( 'componentsChart' )
    } );

    // @public
    this.sumChart = new ContinuousSumChart( {
      tandem: options.tandem.createTandem( 'sumChart' )
    } );
  }

  /**
   * @public
   */
  reset() {

    // Properties
    this.componentSpacingIndexProperty.reset();
    this.continuousWaveformVisibleProperty.reset();
    this.wavePacketCenterProperty.reset();
    this.kWidthProperty.reset();
    this.xWidthProperty.reset();
    this.domainProperty.reset();
    this.envelopeVisibleProperty.reset();
    this.widthIndicatorsVisibleProperty.reset();

    // sub-models
    this.amplitudesChart.reset();
    this.componentsChart.reset();
    this.sumChart.reset();
  }

  /**
   * @public
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }
}

fourierMakingWaves.register( 'ContinuousModel', ContinuousModel );
export default ContinuousModel;