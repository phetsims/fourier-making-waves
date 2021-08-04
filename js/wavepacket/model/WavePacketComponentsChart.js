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
import FMWConstants from '../../common/FMWConstants.js';
import Harmonic from '../../common/model/Harmonic.js';
import SeriesType from '../../common/model/SeriesType.js';
import WaveformChart from '../../common/model/WaveformChart.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WavePacket from './WavePacket.js';

// We could use different numbers of points for different Fourier components, because lower-order components have a
// longer period, and therefore require fewer points to make them look smooth. But computing the same number of points
// for all components makes it easier and more efficient to compute the Sum of those components in the Wave Packet screen.
const POINTS_PER_DATA_SET = FMWConstants.MAX_POINTS_PER_DATA_SET;

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

    // @public {DerivedProperty<Array.<Array.<Vector2>>}
    // a data set for each Fourier component's waveform, [] when the number of components is infinite
    this.componentDataSetsProperty = new DerivedProperty(
      [ wavePacket.componentAmplitudesDataSetProperty, seriesTypeProperty, xAxisDescriptionProperty ],
      ( componentAmplitudesDataSet, seriesType, xAxisDescription ) => {

        const dataSets = []; // {Array.<Array.<Vector2>>}

        if ( componentAmplitudesDataSet.length > 0 ) {

          const domain = domainProperty.value;
          const range = xAxisDescription.range;
          const L = 2 * Math.PI / wavePacket.componentSpacingProperty.value;
          const T = L; // because the WavePacket model is independent of domain, and assumes that L === T
          const t = 0; // there is no animation in this screen, so time is always 0

          for ( let order = 1; order <= componentAmplitudesDataSet.length; order++ ) {
            const amplitude = componentAmplitudesDataSet[ order - 1 ].y;
            dataSets.push( Harmonic.createDataSetStatic( order, amplitude, POINTS_PER_DATA_SET, L, T, range, domain, seriesType, t ) );
          }
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