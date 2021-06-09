// Copyright 2021, University of Colorado Boulder

/**
 * ContinuousAmplitudesChart is the 'Amplitudes' chart on the 'Continuous' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class ContinuousAmplitudesChart {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Object} [options]
   */
  constructor( domainProperty, options ) {

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // @public
    this.domainProperty = domainProperty;

    // @public
    this.continuousWaveformVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'continuousWaveformVisibleProperty' )
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
    this.continuousWaveformVisibleProperty.reset();
  }
}

fourierMakingWaves.register( 'ContinuousAmplitudesChart', ContinuousAmplitudesChart );
export default ContinuousAmplitudesChart;