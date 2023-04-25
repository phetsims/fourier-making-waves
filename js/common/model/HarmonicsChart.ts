// Copyright 2021-2023, University of Colorado Boulder

/**
 * HarmonicsChart is the model base class model for the 'Harmonics' chart in the 'Discrete' and 'Wave Game' screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import DiscreteAxisDescriptions from '../../discrete/model/DiscreteAxisDescriptions.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWConstants from '../FMWConstants.js';
import AxisDescription from './AxisDescription.js';
import DomainChart from './DomainChart.js';
import EmphasizedHarmonics from './EmphasizedHarmonics.js';
import FourierSeries from './FourierSeries.js';
import Domain from './Domain.js';
import SeriesType from './SeriesType.js';

export default class HarmonicsChart extends DomainChart {

  public readonly fourierSeries: FourierSeries;
  public readonly emphasizedHarmonics: EmphasizedHarmonics;
  public readonly yAxisDescription: AxisDescription; // fixed y-axis

  // A data set for each harmonic, indexed in harmonic order. Points are ordered by increasing x value.
  public readonly harmonicDataSetProperties: TReadOnlyProperty<Vector2[]>[];

  protected constructor( fourierSeries: FourierSeries,
                         emphasizedHarmonics: EmphasizedHarmonics,
                         domainProperty: EnumerationProperty<Domain>,
                         seriesTypeProperty: EnumerationProperty<SeriesType>,
                         tProperty: TReadOnlyProperty<number>,
                         xAxisDescriptionProperty: Property<AxisDescription>,
                         tandem: Tandem ) {

    super( domainProperty, xAxisDescriptionProperty, fourierSeries.L, fourierSeries.T, tandem );

    this.fourierSeries = fourierSeries;
    this.emphasizedHarmonics = emphasizedHarmonics;
    this.yAxisDescription = DiscreteAxisDescriptions.DEFAULT_Y_AXIS_DESCRIPTION;

    this.harmonicDataSetProperties = fourierSeries.harmonics.map( harmonic => {

      // The number of points for each harmonic plot is a function of order, because higher-frequency harmonics require
      // more points to draw a smooth plot.
      const numberOfPoints = Math.ceil( FMWConstants.MAX_POINTS_PER_DATA_SET *
                                        harmonic.order / fourierSeries.harmonics.length );

      // the derived data set for this harmonic
      return new DerivedProperty(
        [ harmonic.amplitudeProperty, xAxisDescriptionProperty, domainProperty, seriesTypeProperty, tProperty ],
        ( amplitude, xAxisDescription, domain, seriesType, t ) => {
          return harmonic.createDataSet( numberOfPoints, fourierSeries.L, fourierSeries.T, xAxisDescription,
            domain, seriesType, t );
        } );
    } );
  }
}

fourierMakingWaves.register( 'HarmonicsChart', HarmonicsChart );