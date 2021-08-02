// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketAmplitudesChart is the 'Amplitudes' chart on the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
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
      () => this.createContinuousWaveformDataSet( wavePacket )
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

  /**
   * Creates the data set that approximates a continuous waveform.
   * @param {WavePacket} wavePacket
   * @returns {Vector2[]}
   * @private
   */
  createContinuousWaveformDataSet( wavePacket ) {
    assert && assert( wavePacket instanceof WavePacket );

    const dataSet = []; // {Vector2[]}
    const kStep = Math.PI / 10; // ENVELOPE_STEP in D2CAmplitudesView.java, chosen so that the plot looks smooth
    const kMax = this.fourierSeries.xRange.max + Math.PI;
    const k1 = this.fourierSeries.componentSpacingProperty.value;

    let k = this.fourierSeries.xRange.min;
    while ( k <= kMax ) {
      let amplitude = this.fourierSeries.getComponentAmplitude( k, this.wavePacket );
      if ( k1 !== 0 ) {
        amplitude *= k1;
      }
      dataSet.push( new Vector2( k, amplitude ) );
      k += kStep;
    }

    return dataSet;
  }
}

fourierMakingWaves.register( 'WavePacketAmplitudesChart', WavePacketAmplitudesChart );
export default WavePacketAmplitudesChart;