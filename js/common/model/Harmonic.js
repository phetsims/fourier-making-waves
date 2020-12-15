// Copyright 2020, University of Colorado Boulder

/**
 * Harmonic is the model of a harmonic in a Fourier series.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import required from '../../../../phet-core/js/required.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class Harmonic extends PhetioObject {

  /**
   * @param {Object} config
   */
  constructor( config ) {

    config = merge( {

      // required
      order: required( config.order ), // {number} the order of the harmonic, numbered from 1
      frequency: required( config.frequency ), // {number} frequency, in Hz
      wavelength: required( config.wavelength ), // {number} wavelength, in meters
      amplitudeRange: required( config.amplitudeRange ), // {Range} range of amplitude
      colorProperty: required( config.colorProperty ), // {Property.<Color>} the color used to visualize the harmonic

      // optional
      amplitude: 0,

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioState: false
    }, config );

    super( config );

    // @public (read-only)
    this.order = config.order;
    this.frequency = config.frequency;
    this.wavelength = config.wavelength;
    this.colorProperty = config.colorProperty;
    this.amplitudeRange = config.amplitudeRange;

    // public (read-only)
    this.period = 1000 / this.frequency;

    // @public
    this.amplitudeProperty = new NumberProperty( config.amplitude, {
      range: this.amplitudeRange,
      tandem: config.tandem.createTandem( 'amplitudeProperty' )
    } );

    // Show link to colorProperty in Studio
    this.addLinkedElement( this.colorProperty, {
      tandem: config.tandem.createTandem( 'colorProperty' )
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
    this.amplitudeProperty.reset();
  }
}

fourierMakingWaves.register( 'Harmonic', Harmonic );
export default Harmonic;