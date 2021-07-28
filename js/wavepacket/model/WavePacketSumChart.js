// Copyright 2021, University of Colorado Boulder

//TODO factor out duplication with WavePacketComponentsChart
/**
 * WavePacketSumChart is the 'Sum' chart on the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import WaveformChart from '../../common/model/WaveformChart.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WavePacket from './WavePacket.js';
import WavePacketFourierSeries from './WavePacketFourierSeries.js';

class WavePacketSumChart extends WaveformChart {

  /**
   * @param {WavePacketFourierSeries} fourierSeries
   * @param {WavePacket} wavePacket
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<TickLabelFormat>} xAxisTickLabelFormatProperty
   * @param {Property.<AxisDescription>} xAxisDescriptionProperty
   * @param {Property.<AxisDescription>} yAxisDescriptionProperty
   * @param {Object} [options]
   */
  constructor( fourierSeries, wavePacket, domainProperty, xAxisTickLabelFormatProperty, xAxisDescriptionProperty,
               yAxisDescriptionProperty, options ) {
    assert && assert( fourierSeries instanceof WavePacketFourierSeries );
    assert && assert( wavePacket instanceof WavePacket );

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    super( wavePacket.L, wavePacket.T, domainProperty, xAxisTickLabelFormatProperty,
      xAxisDescriptionProperty, yAxisDescriptionProperty, options );

    // @public
    this.fourierSeries = fourierSeries;
    this.wavePacket = wavePacket;

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