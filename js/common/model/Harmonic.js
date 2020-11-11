// Copyright 2020, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import ColorDef from '../../../../scenery/js/util/ColorDef.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesConstants from '../FourierMakingWavesConstants.js';

class Harmonic {

  /**
   * @param {number} order - the order of the harmonic
   * @param {Property.<ColorDef>} colorProperty - the color used to render visual representations of the harmonic
   * @param {Object} [options]
   */
  constructor( order, colorProperty, options ) {
    assert && AssertUtils.assertPositiveInteger( order );
    assert && AssertUtils.assertProperty( colorProperty, value => ColorDef.isColorDef( value ) );

    options = merge( {
      tandem: Tandem.REQUIRED
    }, options );

    // @public (read-only)
    this.order = order;
    this.colorProperty = colorProperty;

    // @public
    this.amplitudeProperty = new NumberProperty( 0, {
      range: FourierMakingWavesConstants.AMPLITUDE_RANGE,
      tandem: options.tandem.createTandem( 'amplitudeProperty' )
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