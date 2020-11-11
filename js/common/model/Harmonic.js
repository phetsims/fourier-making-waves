// Copyright 2020, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Color from '../../../../scenery/js/util/Color.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesConstants from '../FourierMakingWavesConstants.js';

class Harmonic extends PhetioObject {

  /**
   * @param {number} order - the order of the harmonic
   * @param {Property.<Color>} colorProperty - the color used to render visual representations of the harmonic
   * @param {Object} [options]
   */
  constructor( order, colorProperty, options ) {
    assert && AssertUtils.assertPositiveInteger( order );
    assert && AssertUtils.assertPropertyOf( colorProperty, Color );

    options = merge( {
      tandem: Tandem.REQUIRED,
      phetioState: false
    }, options );

    super( options );

    // @public (read-only)
    this.order = order;
    this.colorProperty = colorProperty;

    // @public
    this.amplitudeProperty = new NumberProperty( 0, {
      range: FourierMakingWavesConstants.AMPLITUDE_RANGE,
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