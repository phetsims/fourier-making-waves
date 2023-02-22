// Copyright 2020-2022, University of Colorado Boulder

/**
 * Harmonic is the model of a harmonic in a Fourier series, used in the 'Discrete' and 'Wave Game' screens.
 * For the 'Wave Packet' screen, a simpler model is used, due to the number of Fourier components required -
 * see FourierComponent..
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import required from '../../../../phet-core/js/required.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import { Color } from '../../../../scenery/js/imports.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import AxisDescription from './AxisDescription.js';
import Domain from './Domain.js';
import getAmplitudeFunction from './getAmplitudeFunction.js';
import SeriesType from './SeriesType.js';

export default class Harmonic extends PhetioObject {

  /**
   * @param {Object} config
   */
  constructor( config ) {

    config = merge( {

      // Harmonic, required
      order: required( config.order ), // {number} the order of the harmonic, numbered from 1
      frequency: required( config.frequency ), // {number} frequency, in Hz
      wavelength: required( config.wavelength ), // {number} wavelength, in meters
      amplitudeRange: required( config.amplitudeRange ), // {Range} range of amplitude, no units
      colorProperty: required( config.colorProperty ), // {Property.<Color>} the color used to visualize the harmonic

      // Harmonic, optional
      amplitude: 0,

      // phet-io options
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

    // @public (read-only) period of the harmonic, in milliseconds
    this.period = 1000 / this.frequency;

    // @public amplitude of the harmonic, no units
    this.amplitudeProperty = new NumberProperty( config.amplitude, {
      range: this.amplitudeRange,
      phetioDocumentation: 'the amplitude of this harmonic',
      tandem: config.tandem.createTandem( 'amplitudeProperty' )
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
   * Create a data set of this harmonic.
   * @param {number} numberOfPoints
   * @param {number} L
   * @param {number} T
   * @param {AxisDescription} xAxisDescription
   * @param {Domain} domain
   * @param {SeriesType} seriesType
   * @param {number} t
   * @returns {Vector2[]}
   * @public
   */
  createDataSet( numberOfPoints, L, T, xAxisDescription, domain, seriesType, t ) {
    assert && assert( xAxisDescription instanceof AxisDescription );
    const order = this.order;
    const amplitude = this.amplitudeProperty.value;
    const xRange = xAxisDescription.createRangeForDomain( domain, L, T );
    return Harmonic.createDataSetStatic( order, amplitude, numberOfPoints, L, T, xRange, domain, seriesType, t );
  }

  /**
   * Creates a data set for any harmonic. This is used in the Wave Packet screen, which does not create Harmonic
   * instances due to the large number of Fourier components involved.
   * @param {number} order
   * @param {number} amplitude
   * @param {number} numberOfPoints
   * @param {number} L
   * @param {number} T
   * @param {Range} xRange
   * @param {Domain} domain
   * @param {SeriesType} seriesType
   * @param {number} t
   * @returns {Vector2[]}
   * @public
   * @static
   */
  static createDataSetStatic( order, amplitude, numberOfPoints, L, T, xRange, domain, seriesType, t ) {

    assert && AssertUtils.assertPositiveInteger( order );
    assert && assert( typeof amplitude === 'number' );
    assert && AssertUtils.assertPositiveInteger( numberOfPoints );
    assert && AssertUtils.assertPositiveNumber( L );
    assert && AssertUtils.assertPositiveNumber( T );
    assert && assert( xRange instanceof Range );
    assert && assert( Domain.enumeration.includes( domain ) );
    assert && assert( SeriesType.enumeration.includes( seriesType ) );
    assert && AssertUtils.assertNonNegativeNumber( t );

    const dataSet = [];
    const amplitudeFunction = getAmplitudeFunction( domain, seriesType );

    // Make dx a bit larger than necessary, so that we cover the entire xRange by slightly exceeding xRange.max.
    const dx = xRange.getLength() / ( numberOfPoints - 1 );

    let x = xRange.min;
    let y;
    for ( let i = 0; i < numberOfPoints; i++ ) {
      y = amplitudeFunction( amplitude, order, x, t, L, T );
      dataSet.push( new Vector2( x, y ) );
      x += dx;
    }
    assert && assert( dataSet.length === numberOfPoints, 'incorrect number of points in dataSet' );

    return dataSet;
  }
}

fourierMakingWaves.register( 'Harmonic', Harmonic );