// Copyright 2021, University of Colorado Boulder

//TODO much in common with WaveformChart
/**
 * WavePacketChart is the base class for the 'Components' and 'Sum' charts on the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Domain from '../../common/model/Domain.js';
import XAxisDescription from '../../common/model/XAxisDescription.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WavePacket from './WavePacket.js';

class WavePacketChart {

  /**
   * @param {WavePacket} wavePacket
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Property.<XAxisDescription>} xAxisDescriptionProperty
   * @param {Object} [options]
   */
  constructor( wavePacket, domainProperty, xAxisDescriptionProperty, options ) {

    assert && assert( wavePacket instanceof WavePacket );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertPropertyOf( xAxisDescriptionProperty, XAxisDescription );

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // @public
    this.wavePacket = wavePacket;
    this.domainProperty = domainProperty;
    this.xAxisDescriptionProperty = xAxisDescriptionProperty;
  }

  /**
   * @public
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }
}

fourierMakingWaves.register( 'WavePacketChart', WavePacketChart );
export default WavePacketChart;