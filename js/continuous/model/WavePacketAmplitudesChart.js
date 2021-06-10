// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketAmplitudesChart is the 'Amplitudes' chart on the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Domain from '../../common/model/Domain.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class WavePacketAmplitudesChart {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Object} [options]
   */
  constructor( domainProperty, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );

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

fourierMakingWaves.register( 'WavePacketAmplitudesChart', WavePacketAmplitudesChart );
export default WavePacketAmplitudesChart;