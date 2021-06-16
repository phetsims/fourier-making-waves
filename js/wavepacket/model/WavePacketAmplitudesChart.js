// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketAmplitudesChart is the 'Amplitudes' chart on the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import AxisDescription from '../../common/model/AxisDescription.js';
import Domain from '../../common/model/Domain.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WavePacket from './WavePacket.js';

// constants

// Auto-scaling of the y axis will choose an appropriate description from this array.
const Y_AXIS_DESCRIPTIONS = [
  new AxisDescription( {
    max: 5,
    gridLineSpacing: 1,
    tickMarkSpacing: 1,
    tickLabelSpacing: 1
  } ),
  new AxisDescription( {
    max: 0.5,
    gridLineSpacing: 0.1,
    tickMarkSpacing: 0.1,
    tickLabelSpacing: 0.1
  } ),
  new AxisDescription( {
    max: 0.05,
    gridLineSpacing: 0.01,
    tickMarkSpacing: 0.01,
    tickLabelSpacing: 0.01
  } ),
  new AxisDescription( {
    max: 0.005,
    gridLineSpacing: 0.001,
    tickMarkSpacing: 0.001,
    tickLabelSpacing: 0.001
  } )
];

class WavePacketAmplitudesChart {

  /**
   * @param {WavePacket} wavePacket
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Object} [options]
   */
  constructor( wavePacket, domainProperty, options ) {

    assert && assert( wavePacket instanceof WavePacket );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // @public
    this.wavePacket = wavePacket;
    this.domainProperty = domainProperty;

    // @public
    this.continuousWaveformVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'continuousWaveformVisibleProperty' )
    } );

    // @public
    this.yAxisDescriptionProperty = new Property( Y_AXIS_DESCRIPTIONS[ 1 ], {
      isValidValue: value => Y_AXIS_DESCRIPTIONS.includes( value )
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
    this.yAxisDescriptionProperty.reset();
  }
}

fourierMakingWaves.register( 'WavePacketAmplitudesChart', WavePacketAmplitudesChart );
export default WavePacketAmplitudesChart;