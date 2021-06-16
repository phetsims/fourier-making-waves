// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketSumChart is the 'Sum' chart on the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WavePacketChart from './WavePacketChart.js';

class WavePacketSumChart extends WavePacketChart {

  /**
   * @param {WavePacket} wavePacket
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Property.<XAxisDescription>} xAxisDescriptionProperty
   * @param {Object} [options]
   */
  constructor( wavePacket, domainProperty, xAxisDescriptionProperty, options ) {

    super( wavePacket, domainProperty, xAxisDescriptionProperty, options );

    // @public whether the Sum chart is visible
    this.chartVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'chartVisibleProperty' )
    } );

    // @public whether the envelope of the sum waveform is visible
    this.envelopeVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'envelopeVisibleProperty' )
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
    this.chartVisibleProperty.reset();
    this.envelopeVisibleProperty.reset();
  }
}

fourierMakingWaves.register( 'WavePacketSumChart', WavePacketSumChart );
export default WavePacketSumChart;