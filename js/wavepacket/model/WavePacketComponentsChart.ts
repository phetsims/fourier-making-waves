// Copyright 2021-2023, University of Colorado Boulder

/**
 * WavePacketComponentsChart is the model for the 'Fourier Components' chart in the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import Domain from '../../common/model/Domain.js';
import DomainChart from '../../common/model/DomainChart.js';
import Harmonic from '../../common/model/Harmonic.js';
import SeriesType from '../../common/model/SeriesType.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierComponent from './FourierComponent.js';
import WavePacket from './WavePacket.js';
import AxisDescription from '../../common/model/AxisDescription.js';

// We could use different numbers of points for different Fourier components, because lower-order components have a
// longer period, and therefore require fewer points to make them look smooth. But computing the same number of points
// for all components makes it easier and more efficient to compute the Sum of those components in the Wave Packet screen.
const POINTS_PER_DATA_SET = FMWConstants.MAX_POINTS_PER_DATA_SET;
const EMPTY_DATA_SET = FMWConstants.EMPTY_DATA_SET;

export default class WavePacketComponentsChart extends DomainChart {

  // A data set for each Fourier component's waveform, EMPTY_DATA_SET when the number of components is infinite.
  // Ordered by increasing order of Fourier component, i.e. the fundamental component has index=0.
  // This is loosely based on the update method in D2CComponentsView.java.
  public readonly componentDataSetsProperty: TReadOnlyProperty<Vector2[][]>;

  public constructor( wavePacket: WavePacket, domainProperty: EnumerationProperty<Domain>,
                      seriesTypeProperty: EnumerationProperty<SeriesType>,
                      xAxisDescriptionProperty: Property<AxisDescription>,
                      tandem: Tandem ) {

    super( domainProperty, xAxisDescriptionProperty, wavePacket.L, wavePacket.T, tandem );

    this.componentDataSetsProperty = new DerivedProperty(
      [ wavePacket.componentsProperty, domainProperty, seriesTypeProperty, xAxisDescriptionProperty ],
      ( components, domain, seriesType, xAxisDescription ) => {
        let dataSets: Vector2[][] = EMPTY_DATA_SET;
        if ( components.length > 0 ) {
          dataSets = WavePacketComponentsChart.createComponentsDataSets( components,
            wavePacket.componentSpacingProperty.value, domain, seriesType, xAxisDescription.range );
        }
        return dataSets;
      } );

    // NOTE: This chart does not have a peakAmplitudeProperty because its more efficient for the view to determine
    // the y-axis range while iterating over componentDataSetsProperty.
  }

  /**
   * Creates data sets for the waveforms that correspond to a set of Fourier components.
   */
  public static createComponentsDataSets( components: FourierComponent[], componentSpacing: number, domain: Domain,
                                          seriesType: SeriesType, xRange: Range ): Vector2[][] {

    assert && assert( components.length > 0 && componentSpacing >= 0 );

    const dataSets: Vector2[][] = [];
    const L = 2 * Math.PI / componentSpacing;
    const T = L; // because the WavePacket model is independent of Domain, and assumes that L === T
    const t = 0; // there is no animation in this screen, so time is always 0

    for ( let order = 1; order <= components.length; order++ ) {
      const amplitude = components[ order - 1 ].amplitude;
      dataSets.push( Harmonic.createDataSetStatic( order, amplitude, POINTS_PER_DATA_SET, L, T, xRange, domain, seriesType, t ) );
    }
    return dataSets;
  }
}

fourierMakingWaves.register( 'WavePacketComponentsChart', WavePacketComponentsChart );