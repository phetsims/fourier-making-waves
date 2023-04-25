// Copyright 2021-2023, University of Colorado Boulder

/**
 * DiscreteHarmonicsChart is the model for the 'Harmonics' chart in the 'Discrete' screen.
 * It adds x-axis formatting that depends on Domain.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import HarmonicsChart from '../../common/model/HarmonicsChart.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

export default class DiscreteHarmonicsChart extends HarmonicsChart {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {EmphasizedHarmonics} emphasizedHarmonics
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<SeriesType>} seriesTypeProperty
   * @param {Property.<number>} tProperty
   * @param {DerivedProperty.<TickLabelFormat>} xAxisTickLabelFormatProperty
   * @param {Property.<AxisDescription>} xAxisDescriptionProperty
   * @param {Tandem} tandem
   */
  constructor( fourierSeries, emphasizedHarmonics, domainProperty, seriesTypeProperty, tProperty,
               xAxisTickLabelFormatProperty, xAxisDescriptionProperty, tandem ) {
    assert && assert( xAxisTickLabelFormatProperty instanceof DerivedProperty );
    assert && assert( tandem instanceof Tandem );

    super( fourierSeries, emphasizedHarmonics, domainProperty, seriesTypeProperty, tProperty, xAxisDescriptionProperty, tandem );

    // @public
    this.xAxisTickLabelFormatProperty = xAxisTickLabelFormatProperty;
  }
}

fourierMakingWaves.register( 'DiscreteHarmonicsChart', DiscreteHarmonicsChart );