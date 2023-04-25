// Copyright 2021-2023, University of Colorado Boulder

/**
 * DiscreteHarmonicsChart is the model for the 'Harmonics' chart in the 'Discrete' screen.
 * It adds x-axis formatting that depends on Domain.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import HarmonicsChart from '../../common/model/HarmonicsChart.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierSeries from '../../common/model/FourierSeries.js';
import EmphasizedHarmonics from '../../common/model/EmphasizedHarmonics.js';
import Domain from '../../common/model/Domain.js';
import SeriesType from '../../common/model/SeriesType.js';
import AxisDescription from '../../common/model/AxisDescription.js';
import TickLabelFormat from '../../common/model/TickLabelFormat.js';

export default class DiscreteHarmonicsChart extends HarmonicsChart {

  public readonly xAxisTickLabelFormatProperty: TReadOnlyProperty<TickLabelFormat>;

  public constructor( fourierSeries: FourierSeries,
                      emphasizedHarmonics: EmphasizedHarmonics,
                      domainProperty: EnumerationProperty<Domain>,
                      seriesTypeProperty: EnumerationProperty<SeriesType>,
                      tProperty: TReadOnlyProperty<number>,
                      xAxisTickLabelFormatProperty: TReadOnlyProperty<TickLabelFormat>,
                      xAxisDescriptionProperty: Property<AxisDescription>,
                      tandem: Tandem ) {

    super( fourierSeries, emphasizedHarmonics, domainProperty, seriesTypeProperty, tProperty, xAxisDescriptionProperty, tandem );

    this.xAxisTickLabelFormatProperty = xAxisTickLabelFormatProperty;
  }
}

fourierMakingWaves.register( 'DiscreteHarmonicsChart', DiscreteHarmonicsChart );