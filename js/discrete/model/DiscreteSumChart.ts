// Copyright 2021-2023, University of Colorado Boulder

/**
 * DiscreteSumChart is the model for the 'Sum' chart in the 'Discrete' screen.
 * It adds the following the base class:
 * - a data set for preset waveforms that shows what the waveform would look like if approximated by a Fourier Series
 *   with an infinite number of harmonics
 * - x-axis formatting that depends on Domain
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import SumChart from '../../common/model/SumChart.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import Waveform from './Waveform.js';
import FourierSeries from '../../common/model/FourierSeries.js';
import Domain from '../../common/model/Domain.js';
import SeriesType from '../../common/model/SeriesType.js';
import TickLabelFormat from '../../common/model/TickLabelFormat.js';
import AxisDescription from '../../common/model/AxisDescription.js';

// constants
const EMPTY_DATA_SET = FMWConstants.EMPTY_DATA_SET;

export default class DiscreteSumChart extends SumChart {

  public readonly xAxisTickLabelFormatProperty: TReadOnlyProperty<TickLabelFormat>;
  public readonly waveformProperty: Property<Waveform>;

  // whether the Sum chart shows what the waveform looks like for an infinite Fourier series
  public readonly infiniteHarmonicsVisibleProperty: Property<boolean>;

  // Data set that corresponds to a waveform preset, as if it were approximated using a Fourier series with an
  // infinite number of harmonics. If the preset is not visible, then returns EMPTY_DATA_SET.
  public readonly infiniteHarmonicsDataSetProperty: TReadOnlyProperty<Vector2[]>;

  public constructor( fourierSeries: FourierSeries,
                      domainProperty: EnumerationProperty<Domain>,
                      seriesTypeProperty: EnumerationProperty<SeriesType>,
                      tProperty: TReadOnlyProperty<number>,
                      xAxisTickLabelFormatProperty: TReadOnlyProperty<TickLabelFormat>,
                      xAxisDescriptionProperty: Property<AxisDescription>,
                      waveformProperty: Property<Waveform>,
                      tandem: Tandem ) {

    super( fourierSeries, domainProperty, seriesTypeProperty, tProperty, xAxisDescriptionProperty, tandem );

    this.xAxisTickLabelFormatProperty = xAxisTickLabelFormatProperty;
    this.waveformProperty = waveformProperty;

    this.infiniteHarmonicsVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'infiniteHarmonicsVisibleProperty' )
    } );

    // To improve readability
    const L = fourierSeries.L;
    const T = fourierSeries.T;

    this.infiniteHarmonicsDataSetProperty = new DerivedProperty(
      [ this.infiniteHarmonicsVisibleProperty, this.sumDataSetProperty, waveformProperty, domainProperty, seriesTypeProperty, tProperty ],
      ( infiniteHarmonicsVisible, sumDataSet, waveform, domain, seriesType, t ) => {
        if ( infiniteHarmonicsVisible && waveform.supportsInfiniteHarmonics ) {
          assert && assert( waveform.getInfiniteHarmonicsDataSet );
          return waveform.getInfiniteHarmonicsDataSet!( domain, seriesType, t, L, T );
        }
        else {
          return EMPTY_DATA_SET;
        }
      }
    );
  }

  public override reset(): void {
    super.reset();
    this.infiniteHarmonicsVisibleProperty.reset();
  }
}

fourierMakingWaves.register( 'DiscreteSumChart', DiscreteSumChart );