// Copyright 2021-2023, University of Colorado Boulder

/**
 * SumChart is the model base class for the 'Sum' chart in the 'Discrete' and 'Wave Game' screens.
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
import DiscreteAxisDescriptions from '../../discrete/model/DiscreteAxisDescriptions.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import AxisDescription from './AxisDescription.js';
import DomainChart from './DomainChart.js';
import FourierSeries from './FourierSeries.js';
import Domain from './Domain.js';
import SeriesType from './SeriesType.js';

export default class SumChart extends DomainChart {

  public readonly fourierSeries: FourierSeries;

  // The data set for the sum. Points are ordered by increasing x value.
  public readonly sumDataSetProperty: TReadOnlyProperty<Vector2[]>;

  // range of the y-axis, fitted to the sum's peak amplitude
  public readonly yAxisRangeProperty: TReadOnlyProperty<Range>;

  // y-axis description that is the best-fit for yAxisRangeProperty
  public readonly yAxisDescriptionProperty: TReadOnlyProperty<AxisDescription>;

  protected constructor( fourierSeries: FourierSeries,
                         domainProperty: EnumerationProperty<Domain>,
                         seriesTypeProperty: EnumerationProperty<SeriesType>,
                         tProperty: TReadOnlyProperty<number>,
                         xAxisDescriptionProperty: Property<AxisDescription>,
                         tandem: Tandem ) {

    super( domainProperty, xAxisDescriptionProperty, fourierSeries.L, fourierSeries.T, tandem );

    this.fourierSeries = fourierSeries;

    this.sumDataSetProperty = new DerivedProperty(
      [ fourierSeries.amplitudesProperty, xAxisDescriptionProperty, domainProperty, seriesTypeProperty, tProperty ],
      ( amplitudes, xAxisDescription, domain, seriesType, t ) =>
        fourierSeries.createSumDataSet( xAxisDescription, domain, seriesType, t )
    );

    this.yAxisRangeProperty = new DerivedProperty(
      [ this.sumDataSetProperty ],
      sumDataSet => {

        const peakPoint = _.maxBy( sumDataSet, point => point.y );
        assert && assert( peakPoint );
        const peakAmplitude = peakPoint!.y;

        // no smaller than the max amplitude of one harmonic, with a bit of padding added at top and bottom
        const maxY = Math.max( fourierSeries.amplitudeRange.max, peakAmplitude * 1.05 );
        return new Range( -maxY, maxY );
      } );

    this.yAxisDescriptionProperty = new DerivedProperty(
      [ this.yAxisRangeProperty ],
      yAxisRange => AxisDescription.getBestFit( yAxisRange, DiscreteAxisDescriptions.Y_AXIS_DESCRIPTIONS ), {
        validValues: DiscreteAxisDescriptions.Y_AXIS_DESCRIPTIONS
      } );
  }
}

fourierMakingWaves.register( 'SumChart', SumChart );