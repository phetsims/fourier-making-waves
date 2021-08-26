// Copyright 2021, University of Colorado Boulder

/**
 * WavePacket is the model of a Gaussian wave packet.
 *
 * Note that many of the Properties herein have values that are the same for both the space and time domain.
 * We can make this simplification (which originated in the Java version) because we assume that the values of L
 * (wavelength of the fundamental harmonic) and T (period of the fundamental harmonic) are the same. That is,
 * L=1 meter and T=1 millisecond. The units for these Properties are therefore dependent on the domain, and changing
 * the domain simply changes the symbols and units that appear in the user interface.  This also means that we can't
 * use Property's units option, so we describe the units in phetioDocumentation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierComponent from './FourierComponent.js';

// valid values for component spacing
const COMPONENT_SPACING_VALUES = [ 0, Math.PI / 4, Math.PI / 2, Math.PI ];
assert && assert(
  _.every( COMPONENT_SPACING_VALUES, ( element, index, array ) => ( index === 0 || array[ index - 1 ] < element ) ),
  'COMPONENT_SPACING_VALUES must be unique and sorted in ascending order'
);

class WavePacket {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    // @public
    this.L = 1; // wavelength when component spacing is 2 * Math.PI, in m
    this.T = 1; // period when component spacing is 2 * Math.PI, in ms
    assert && assert( this.L === this.T && this.L === 1 && this.T === 1,
      'Many things in this implementation assume that L === T === 1, inherited from Java version.' );

    // @public (read-only) range of the wave number for Fourier components
    // k (rad/m) is spatial wave number, or omega (rad/ms) is angular wave number
    this.waveNumberRange = new Range( 0, 24 * Math.PI );
    assert && assert( this.waveNumberRange.min === 0 );

    // @public the spacing between Fourier components, k1 (rad/m) or omega (rad/ms)
    this.componentSpacingProperty = new NumberProperty( COMPONENT_SPACING_VALUES[ 3 ], {
      validValues: COMPONENT_SPACING_VALUES,
      range: new Range( COMPONENT_SPACING_VALUES[ 0 ], COMPONENT_SPACING_VALUES[ COMPONENT_SPACING_VALUES.length - 1 ] ),
      tandem: options.tandem.createTandem( 'componentSpacingProperty' ),
      phetioDocumentation: 'The spacing of components in the Fourier series that is used to approximate the wave packet. ' +
                           'In the space domain, this is k<sub>1</sub> in rad/m. ' +
                           'In the time domain, this is \u03c9<sub>1</sub> in rad/ms.'
    } );

    // @public
    this.centerProperty = new NumberProperty( 12 * Math.PI, {
      range: new Range( 9 * Math.PI, 15 * Math.PI ),
      tandem: options.tandem.createTandem( 'centerProperty' ),
      phetioDocumentation: 'The center of the wave packet. ' +
                           'In the space domain, this is k<sub>0</sub> in rad/m. ' +
                           'In the time domain, this is \u03c9<sub>0</sub> in rad/ms.'
    } );

    // @public
    // See https://github.com/phetsims/fourier-making-waves/issues/105#issuecomment-889386852 for name decision.
    // This is sometimes referred to as a delta (dk, d<sub>omega</sub>) in literature and in code comments.
    this.standardDeviationProperty = new NumberProperty( 3 * Math.PI, {
      range: new Range( Math.PI, 4 * Math.PI ),
      tandem: options.tandem.createTandem( 'standardDeviationProperty' ),
      phetioDocumentation: 'Standard deviation, a measure of the wave packet width. ' +
                           'In the space domain, this is \u03c3<sub>k</sub> in rad/m. ' +
                           'In the time domain, this is \u03c3<sub>\u03c9</sub> in rad/ms.'
    } );

    // @public This is the conjugate (different form) of standardDeviationProperty. Using 'conjugate' here is
    // PhET-specific terminology, not something that you'll find in the literature. It is sometimes referred to
    // as a delta (dx, dt) in literature and in code comments. For decisions about name and units, see
    // https://github.com/phetsims/fourier-making-waves/issues/105#issuecomment-889386852
    this.conjugateStandardDeviationProperty = new NumberProperty( 1 / this.standardDeviationProperty.value, {
      range: new Range( 1 / this.standardDeviationProperty.range.max, 1 / this.standardDeviationProperty.range.min ),
      tandem: options.tandem.createTandem( 'conjugateStandardDeviationProperty' ),
      phetioDocumentation: 'This Property and standardDeviationProperty are a conjugate pair, ' +
                           'where conjugateStandardDeviation = 1 / standardDeviation.' +
                           'They are both measures of the wave packet width. ' +
                           'In the space domain, this is \u03c3<sub>x</sub> in m. ' +
                           'In the time domain, this is \u03c3<sub>t</sub> in ms.'
    } );

    // conjugateStandardDeviationProperty seems like a natural place to use DynamicProperty. But as of this writing,
    // DynamicProperty is not instrumented for PhET-iO, and it doesn't support range (needed by NumberControl).
    // So this next bit of code does the work that a bidirectional DynamicProperty would do - it keeps standardDeviation
    // and conjugateStandardDeviationProperty synchronized. And unlike DynamicProperty, it avoids reentrant behavior,
    // so neither Property requires reentrant:true.  See https://github.com/phetsims/axon/issues/358
    let isSynchronizing = false;
    this.standardDeviationProperty.lazyLink( standardDeviation => {
      if ( !isSynchronizing ) {
        isSynchronizing = true;
        this.conjugateStandardDeviationProperty.value = 1 / standardDeviation;
        isSynchronizing = false;
      }
    } );
    this.conjugateStandardDeviationProperty.lazyLink( conjugateStandardDeviation => {
      if ( !isSynchronizing ) {
        isSynchronizing = true;
        this.standardDeviationProperty.value = 1 / conjugateStandardDeviation;
        isSynchronizing = false;
      }
    } );

    // @public
    this.widthProperty = new DerivedProperty(
      [ this.standardDeviationProperty ],
      standardDeviation => 2 * standardDeviation, {
        tandem: options.tandem.createTandem( 'widthProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO ),
        phetioDocumentation: 'The width of the wave packet, derived from standardDeviationProperty. ' +
                             'In the space domain, width is in rad/m. ' +
                             'In the time domain, width is in rad/ms.'
      } );

    // @public {DerivedProperty.<number>}
    this.lengthProperty = new DerivedProperty(
      [ this.componentSpacingProperty ],
      componentSpacing => {
        let period = Infinity;
        if ( componentSpacing > 0 ) {
          period = 2 * Math.PI / componentSpacing;
        }
        return period;
      }, {
        tandem: options.tandem.createTandem( 'lengthProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO ),
        phetioDocumentation: 'A measure of the wave packet length. ' +
                             'In the space domain, wavelength \u03bb<sub>1</sub> in m. ' +
                             'In the time domain, period T<sub>1</sub> in ms.'
      } );

    // @public {DerivedProperty.<FourierComponent[]>} the Fourier components used to approximate the wave packet.
    // Ordered by increasing wave number.
    // This is loosely based on the addGeneralPathPlot method in D2CAmplitudesView.java.
    this.componentsProperty = new DerivedProperty(
      [ this.componentSpacingProperty, this.centerProperty, this.standardDeviationProperty ],
      ( componentSpacing, center, standardDeviation ) => {
        const dataSet = []; // {Vector2[]}
        const numberOfComponents = this.getNumberOfComponents();
        if ( numberOfComponents !== Infinity ) {
          for ( let i = 0; i < numberOfComponents; i++ ) {
            const waveNumber = i * componentSpacing; // spatial in rad/m, or angular in rad/ms
            const An = this.getComponentAmplitude( waveNumber ) * componentSpacing;
            dataSet.push( new FourierComponent( waveNumber, An ) );
          }
        }
        return dataSet;
      }, {
        tandem: options.tandem.createTandem( 'componentsProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( ArrayIO( FourierComponent.FourierComponentIO ) ),
        phetioDocumentation: 'The set of Fourier components used to approximate the wave packet. ' +
                             'Each component has a wave number and an amplitude. ' +
                             'For the space domain, k is the spatial wave number in rad/m. ' +
                             'For the time domain, \u03c9 is the angular wave number in rad/ms. ' +
                             'Amplitude is unitless.'
      } );
  }

  /**
   * @public
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }

  /**
   * @public
   */
  reset() {
    this.componentSpacingProperty.reset();
    this.centerProperty.reset();
    this.standardDeviationProperty.reset();
    this.conjugateStandardDeviationProperty.reset();
  }

  /**
   * Gets the number of components in the Fourier series.
   * @returns {number}
   * @public
   */
  getNumberOfComponents() {
    const componentSpacing = this.componentSpacingProperty.value;
    if ( componentSpacing === 0 ) {
      return Infinity;
    }
    else {
      return Math.floor( this.waveNumberRange.getLength() / componentSpacing ) + 1;
    }
  }

  /**
   * Gets the amplitude of Fourier component k, using the standard Gaussian formula:
   *
   * A(k,k0,dk) = exp[ -((k-k0)^2) / (2 * (dk^2) )  ] / (dk * sqrt( 2pi ))
   * where k = wave number, k0 = wave packet center, dk = standard deviation of width
   *
   * Note that symbol k used in the formula above is specific to the space domain, and is in rad/m.
   * But this method can also be used for the time domain (omega, in rad/ms), because L === T === 1.
   *
   * This was ported from the getAmplitude method in GaussianWavePacket.java.
   *
   * @param {number} waveNumber
   * @returns {number}
   * @public
   */
  getComponentAmplitude( waveNumber ) {
    assert && assert( typeof waveNumber === 'number' );
    const center = this.centerProperty.value;
    const sigma = this.standardDeviationProperty.value;
    return Math.exp( -( ( waveNumber - center ) * ( waveNumber - center ) ) / ( 2 * sigma * sigma ) ) /
           ( sigma * Math.sqrt( 2 * Math.PI ) );
  }
}

fourierMakingWaves.register( 'WavePacket', WavePacket );
export default WavePacket;