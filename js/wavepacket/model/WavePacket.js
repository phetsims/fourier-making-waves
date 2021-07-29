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
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class WavePacket {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    // @public
    this.L = 1; // wavelength, in m
    this.T = 1; // period, in ms
    assert && assert( this.L === this.T && this.L === 1 && this.T === 1,
      'Many things in this implementation assume that L === T === 1, inherited from Java version.' );

    // @public
    this.centerProperty = new NumberProperty( 12 * Math.PI, {
      range: new Range( 9 * Math.PI, 15 * Math.PI ),
      tandem: options.tandem.createTandem( 'centerProperty' ),
      phetioDocumentation: 'The center of the wave packet. ' +
                           'In the space domain, this is k<sub>0</sub>, in rad/m. ' +
                           'In the time domain, this is \u03c9<sub>0</sub>, in rad/ms.'
    } );

    // @public
    this.standardDeviationProperty = new NumberProperty( 3 * Math.PI, {
      range: new Range( 1, 4 * Math.PI ),
      tandem: options.tandem.createTandem( 'standardDeviationProperty' ),
      phetioDocumentation: 'Standard deviation, a measure of the wave packet width. ' +
                           'In the space domain, this is \u03c3<sub>k</sub>, in rad/m. ' +
                           'In the time domain, this is \u03c3<sub>\u03c9</sub>, in rad/ms.'
    } );

    // @public
    this.inverseStandardDeviationProperty = new NumberProperty( 1 / this.standardDeviationProperty.value, {
      range: new Range( 1 / this.standardDeviationProperty.range.max, 1 / this.standardDeviationProperty.range.min ),
      tandem: options.tandem.createTandem( 'inverseStandardDeviationProperty' ),
      phetioDocumentation: 'Inverse of standard deviation, a measure of the wave packet width. ' +
                           'In the space domain, this is \u03c3<sub>x</sub>, in m/rad. ' +
                           'In the time domain, this is \u03c3<sub>t</sub>, in ms/rad.'
    } );

    // inverseStandardDeviationProperty seems like a natural place to use DynamicProperty. But since we need to
    // control it with a NumberControl, it needs to be a {Property.<number>} with a Range. We also need to control
    // it from Studio, which also requires a phetioType, and there's currently no DynamicPropertyIO. So this next
    // bit of code does the work that a bidirectional DynamicProperty would do - it keeps standardDeviation and
    // inverseStandardDeviationProperty synchronized. And unlike DynamicProperty, it avoids reentrant behavior,
    // so neither Property requires reentrant:true.
    let isSynchronizing = false;
    this.standardDeviationProperty.lazyLink( standardDeviation => {
      if ( !isSynchronizing ) {
        isSynchronizing = true;
        this.inverseStandardDeviationProperty.value = 1 / standardDeviation;
        isSynchronizing = false;
      }
    } );
    this.inverseStandardDeviationProperty.lazyLink( inverseStandardDeviation => {
      if ( !isSynchronizing ) {
        isSynchronizing = true;
        this.standardDeviationProperty.value = 1 / inverseStandardDeviation;
        isSynchronizing = false;
      }
    } );

    // @public
    this.widthProperty = new DerivedProperty(
      [ this.standardDeviationProperty ],
      standardDeviation => 2 * standardDeviation, {
        tandem: options.tandem.createTandem( 'widthProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO ),
        phetioDocumentation: 'The width of the wave packet. ' +
                             'In the space domain, this is in rad/m. ' +
                             'In the time domain, this is in rad/ms.'
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
    this.centerProperty.reset();
    this.standardDeviationProperty.reset();
    this.inverseStandardDeviationProperty.reset();
  }
}

fourierMakingWaves.register( 'WavePacket', WavePacket );
export default WavePacket;