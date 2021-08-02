// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketComponentsChart is the 'Components' chart on the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Harmonic from '../../common/model/Harmonic.js';
import SeriesType from '../../common/model/SeriesType.js';
import WaveformChart from '../../common/model/WaveformChart.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WavePacket from './WavePacket.js';

class WavePacketComponentsChart extends WaveformChart {

  /**
   * @param {WavePacket} wavePacket
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<SeriesType>} seriesTypeProperty
   * @param {EnumerationProperty.<TickLabelFormat>} xAxisTickLabelFormatProperty
   * @param {Property.<AxisDescription>} xAxisDescriptionProperty
   * @param {Property.<AxisDescription>} yAxisDescriptionProperty
   * @param {Object} [options]
   */
  constructor( wavePacket, domainProperty, seriesTypeProperty, xAxisTickLabelFormatProperty, xAxisDescriptionProperty,
               yAxisDescriptionProperty, options ) {
    assert && assert( wavePacket instanceof WavePacket );
    assert && AssertUtils.assertEnumerationPropertyOf( seriesTypeProperty, SeriesType );

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

    //TODO adjust yAxisDescriptionProperty based on the maxY of the component data sets
    //TODO period and amplitude seem to be wrong here
    this.componentDataSetsProperty = new DerivedProperty(
      [ wavePacket.componentAmplitudesDataSetProperty, seriesTypeProperty, xAxisDescriptionProperty ],
      ( componentAmplitudesDataSet, seriesType, xAxisDescription ) => {

        // const fundamentalPeriod = 2 * Math.PI / wavePacket.centerProperty.value;
        const numberOfPoints = 1000; //TODO numberOfPoints should be based on frequency
        const domain = domainProperty.value;
        const L = wavePacket.L;
        const T = wavePacket.T;
        const t = 0;

        const dataSets = []; // {Array.<Array.<Vector2>>}
        for ( let order = 1; order <= componentAmplitudesDataSet.length; order++ ) {
          const amplitude = componentAmplitudesDataSet[ order - 1 ].y;
          dataSets.push( Harmonic.createDataSetStatic( order, amplitude, numberOfPoints, L, T, xAxisDescription, domain, seriesType, t ) );
        }
        return dataSets;
      } );
  }

  /**
   * @public
   */
  reset() {
    this.chartVisibleProperty.reset();
  }
}

fourierMakingWaves.register( 'WavePacketComponentsChart', WavePacketComponentsChart );
export default WavePacketComponentsChart;