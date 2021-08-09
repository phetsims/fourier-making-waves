// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketComponentsChart is the 'Components' chart on the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import Domain from '../../common/model/Domain.js';
import Harmonic from '../../common/model/Harmonic.js';
import SeriesType from '../../common/model/SeriesType.js';
import WaveformChart from '../../common/model/WaveformChart.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierComponent from './FourierComponent.js';
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

    // @public {DerivedProperty<Array.<Array.<Vector2>>}
    // A data set for each Fourier component's waveform, [] when the number of components is infinite.
    // Ordered by increasing order of Fourier component, i.e. the fundamental component has index=0.
    // This is loosely based on the update method in D2CComponentsView.java.
    this.componentDataSetsProperty = new DerivedProperty(
      [ wavePacket.componentsProperty, domainProperty, seriesTypeProperty, xAxisDescriptionProperty ],
      ( components, domain, seriesType, xAxisDescription ) => {
        let dataSets = [];
        if ( components.length > 0 ) {
          dataSets = WavePacketComponentsChart.createComponentsDataSets( components,
            wavePacket.componentSpacingProperty.value, domain, seriesType, xAxisDescription.range );
        }
        return dataSets;
      } );

    // NOTE: This chart does not have a maxYProperty because its more efficient for the view to determine
    // the y-axis range while iterating over componentDataSetsProperty.
  }

  /**
   * Creates data sets for the waveforms that correspond to a set of Fourier components.
   * @param {FourierComponent[]} components
   * @param {number} componentSpacing
   * @param {Domain} domain
   * @param {SeriesType} seriesType
   * @param {Range} xRange
   * @returns {Array.<Array.<Vector2>}
   * @public
   * @static
   */
  static createComponentsDataSets( components, componentSpacing, domain, seriesType, xRange ) {

    assert && AssertUtils.assertArrayOf( components, FourierComponent );
    assert && assert( components.length > 0 );
    assert && AssertUtils.assertNonNegativeNumber( componentSpacing );
    assert && assert( Domain.includes( domain ) );
    assert && assert( SeriesType.includes( seriesType ) );
    assert && assert( xRange instanceof Range );

    const dataSets = []; // {Array.<Array.<Vector2>>}
    const L = 2 * Math.PI / componentSpacing;
    const T = L; // because the WavePacket model is independent of domain, and assumes that L === T
    const t = 0; // there is no animation in this screen, so time is always 0

    for ( let order = 1; order <= components.length; order++ ) {
      const amplitude = components[ order - 1 ].amplitude;

      //TODO createDataSetStatic uses pooling
      dataSets.push( Harmonic.createDataSetStatic( order, amplitude, POINTS_PER_DATA_SET, L, T, xRange, domain, seriesType, t ) );
    }
    return dataSets;
  }
}

fourierMakingWaves.register( 'WavePacketComponentsChart', WavePacketComponentsChart );
export default WavePacketComponentsChart;