// Copyright 2020, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Color from '../../../../scenery/js/util/Color.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class Harmonic extends PhetioObject {

  /**
   * @param {number} order - the order of the harmonic
   * @param {Property.<Color>} colorProperty - the color used to render visual representations of the harmonic
   * @param {Range} amplitudeRange
   * @param {Object} [options]
   */
  constructor( order, colorProperty, amplitudeRange, options ) {
    assert && AssertUtils.assertPositiveInteger( order );
    assert && AssertUtils.assertPropertyOf( colorProperty, Color );
    assert && assert( amplitudeRange instanceof Range, 'invalid amplitudeRange' );

    options = merge( {
      amplitude: 0,
      tandem: Tandem.REQUIRED,
      phetioState: false
    }, options );

    super( options );

    // @public (read-only)
    this.order = order;
    this.colorProperty = colorProperty;
    this.amplitudeRange = amplitudeRange;

    // @public
    this.amplitudeProperty = new NumberProperty( options.amplitude, {
      range: amplitudeRange,
      tandem: options.tandem.createTandem( 'amplitudeProperty' )
    } );

    // Show link to colorProperty in Studio
    this.addLinkedElement( this.colorProperty, {
      tandem: options.tandem.createTandem( 'colorProperty' )
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