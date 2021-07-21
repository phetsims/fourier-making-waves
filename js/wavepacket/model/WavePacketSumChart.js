// Copyright 2021, University of Colorado Boulder

//TODO factor out duplication with WavePacketComponentsChart
/**
 * WavePacketSumChart is the 'Sum' chart on the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import AxisDescription from '../../common/model/AxisDescription.js';
import TickLabelFormat from '../../common/model/TickLabelFormat.js';
import WaveformChart from '../../common/model/WaveformChart.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

// constants
//TODO flesh out Y_AXIS_DESCRIPTIONS, should they be the same as WavePacketComponentsChart?
const Y_AXIS_DESCRIPTIONS = [
  new AxisDescription( {
    max: 2,
    gridLineSpacing: 1,
    tickMarkSpacing: 1,
    tickLabelSpacing: 1
  } )
];

class WavePacketSumChart extends WaveformChart {

  /**
   * @param {WavePacket} wavePacket
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Property.<XAxisDescription>} xAxisDescriptionProperty
   * @param {Object} [options]
   */
  constructor( wavePacket, domainProperty, xAxisDescriptionProperty, options ) {

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    //TODO move to model, share with WavePacketComponentsChart
    const yAxisDescriptionProperty = new Property( Y_AXIS_DESCRIPTIONS[ 0 ], {
      validValues: Y_AXIS_DESCRIPTIONS
    } );
    //TODO move to model, share with WavePacketComponentsChart
    const xAxisTickLabelFormatProperty = new EnumerationProperty( TickLabelFormat, TickLabelFormat.NUMERIC, {
      validValues: [ TickLabelFormat.NUMERIC ]
    } );

    super( wavePacket.L, wavePacket.T, domainProperty, xAxisTickLabelFormatProperty,
      xAxisDescriptionProperty, yAxisDescriptionProperty, options );

    // @public
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