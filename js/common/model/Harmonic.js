// Copyright 2020, University of Colorado Boulder

/**
 * Harmonic is the model of a harmonic in a Fourier series.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import required from '../../../../phet-core/js/required.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Color from '../../../../scenery/js/util/Color.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import Domain from './Domain.js';
import getAmplitudeFunction from './getAmplitudeFunction.js';
import SeriesType from './SeriesType.js';
import XAxisDescription from './XAxisDescription.js';

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
      amplitudeRange: required( config.amplitudeRange ), // {Range} range of amplitude, no units
      colorProperty: required( config.colorProperty ), // {Property.<Color>} the color used to visualize the harmonic

      // optional
      amplitude: 0,

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioState: false
    }, config );

    assert && AssertUtils.assertPositiveInteger( config.order );
    assert && AssertUtils.assertPositiveNumber( config.frequency );
    assert && AssertUtils.assertPositiveNumber( config.wavelength );
    assert && assert( config.amplitudeRange instanceof Range );
    assert && AssertUtils.assertPropertyOf( config.colorProperty, Color );
    assert && assert( typeof config.amplitude === 'number' );

    super( config );

    // @public (read-only)
    this.order = config.order;
    this.frequency = config.frequency;
    this.wavelength = config.wavelength;
    this.colorProperty = config.colorProperty;
    this.amplitudeRange = config.amplitudeRange;

    // public (read-only) period of the harmonic, in milliseconds
    this.period = 1000 / this.frequency;

    // @public amplitude of the harmonic, no units
    this.amplitudeProperty = new NumberProperty( config.amplitude, {
      range: this.amplitudeRange,
      phetioDocumentation: 'the amplitude of this harmonic',
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

  /**
   * Creates a data set for this harmonic.
   * @param {number} numberOfPoints
   * @param {number} L
   * @param {number} T
   * @param {XAxisDescription} xAxisDescription
   * @param {Domain} domain
   * @param {SeriesType} seriesType
   * @param {number} t
   * @returns {Vector2[]}
   * @public
   */
  createDataSet( numberOfPoints, L, T, xAxisDescription, domain, seriesType, t ) {

    assert && AssertUtils.assertPositiveInteger( numberOfPoints );
    assert && AssertUtils.assertPositiveNumber( L );
    assert && AssertUtils.assertPositiveNumber( T );
    assert && assert( xAxisDescription instanceof XAxisDescription );
    assert && assert( Domain.includes( domain ) );
    assert && assert( SeriesType.includes( seriesType ) );
    assert && assert( typeof t === 'number' && t >= 0 );

    const amplitudeFunction = getAmplitudeFunction( domain, seriesType );
    const order = this.order;
    const amplitude = this.amplitudeProperty.value;

    const xRange = xAxisDescription.createAxisRange( domain, L, T );
    const dx = xRange.getLength() / ( numberOfPoints - 1 );

    const dataSet = [];
    for ( let i = 0; i < numberOfPoints; i++ ) {
      const x = xRange.min + ( i * dx );
      const y = amplitudeFunction( x, t, L, T, order, amplitude );
      dataSet.push( new Vector2( x, y ) );
    }
    assert && assert( dataSet.length === numberOfPoints, 'incorrect number of points in dataSet' );

    return dataSet;
  }
}

fourierMakingWaves.register( 'Harmonic', Harmonic );
export default Harmonic;