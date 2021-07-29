// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketAmplitudesChart is the 'Amplitudes' chart on the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Domain from '../../common/model/Domain.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WavePacket from './WavePacket.js';
import WavePacketFourierSeries from './WavePacketFourierSeries.js';

class WavePacketAmplitudesChart {

  /**
   * @param {WavePacketFourierSeries} fourierSeries
   * @param {WavePacket} wavePacket
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Object} [options]
   */
  constructor( fourierSeries, wavePacket, domainProperty, options ) {

    assert && assert( fourierSeries instanceof WavePacketFourierSeries );
    assert && assert( wavePacket instanceof WavePacket );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // @public
    this.fourierSeries = fourierSeries;
    this.wavePacket = wavePacket;
    this.domainProperty = domainProperty;

    // @public
    this.continuousWaveformVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'continuousWaveformVisibleProperty' )
    } );

    // @public {DerivedProperty.<Vector2[]>} data set for the Fourier component amplitudes
    this.componentAmplitudesDataSetProperty = new DerivedProperty(
      [ fourierSeries.componentSpacingProperty, wavePacket.centerProperty, wavePacket.standardDeviationProperty ],
      () => fourierSeries.getComponentAmplitudesDataSet( wavePacket )
    );

    // @public {DerivedProperty.<Vector2[]>} data set display when the 'Continuous Wave' checkbox is checked
    this.continuousWaveformDataSetProperty = new DerivedProperty(
      [ fourierSeries.componentSpacingProperty, wavePacket.centerProperty, wavePacket.standardDeviationProperty ],
      () => fourierSeries.getContinuousWaveformDataSet( wavePacket )
    );
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