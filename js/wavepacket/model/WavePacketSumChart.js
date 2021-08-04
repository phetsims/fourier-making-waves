// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketSumChart is the 'Sum' chart on the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import WaveformChart from '../../common/model/WaveformChart.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WavePacket from './WavePacket.js';

class WavePacketSumChart extends WaveformChart {

  /**
   * @param {DerivedProperty.<Array.<Array.<Vector2>>>} componentDataSetsProperty
   * @param {WavePacket} wavePacket
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<TickLabelFormat>} xAxisTickLabelFormatProperty
   * @param {Property.<AxisDescription>} xAxisDescriptionProperty
   * @param {Property.<AxisDescription>} yAxisDescriptionProperty
   * @param {Object} [options]
   */
  constructor( componentDataSetsProperty, wavePacket, domainProperty, xAxisTickLabelFormatProperty, xAxisDescriptionProperty,
               yAxisDescriptionProperty, options ) {
    assert && assert( wavePacket instanceof WavePacket );

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

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

    // @public {DerivedProperty.<Array.<Vector2>>}
    // Data set for the sum of a finite number of components, [] when the number of components is infinite.
    // This simply takes the data sets for components, and sums the y values (amplitudes) of corresponding x values.
    // Points are ordered by increasing x value.
    this.sumDataSetProperty = new DerivedProperty(
      [ componentDataSetsProperty ],
      componentDataSets => {
        const sumDataSet = [];
        if ( componentDataSets.length > 0 ) {

          const pointsPerDataSet = componentDataSets[ 0 ].length;
          assert && assert( pointsPerDataSet > 0 );

          if ( pointsPerDataSet > 0 ) {
            assert && assert( _.every( componentDataSets, dataSet => dataSet.length === pointsPerDataSet ),
              `All data sets much have ${pointsPerDataSet} points.` );

            for ( let i = 0; i < pointsPerDataSet; i++ ) {
              let sum = 0;
              const x = componentDataSets[ 0 ][ i ].x;
              for ( let j = 0; j < componentDataSets.length; j++ ) {
                assert && assert( componentDataSets[ j ][ i ].x === x,
                  'all points with the same index must have the same x coordinate' );
                sum += componentDataSets[ j ][ i ].y;
              }
              sumDataSet.push( new Vector2( x, sum ) );
            }
          }
        }
        return sumDataSet;
      } );

    //TODO plot for infinite components
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