// Copyright 2021, University of Colorado Boulder

/**
 * DiscreteHarmonicsChart is the model for the 'Harmonics' chart in the 'Discrete' screen.
 * It adds no additional functionality to the superclass, and is provided for symmetry of the class hierarchy,
 * so that each screen has its own subclass.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import HarmonicsChart from '../../common/model/HarmonicsChart.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class DiscreteHarmonicsChart extends HarmonicsChart {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {EmphasizedHarmonics} emphasizedHarmonics
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<SeriesType>} seriesTypeProperty
   * @param {Property.<number>} tProperty
   * @param {Property.<TickLabelFormat>} xAxisTickLabelFormatProperty
   * @param {Property.<AxisDescription>} xAxisDescriptionProperty
   * @param {Property.<AxisDescription>} yAxisDescriptionProperty
   * @param {Object} [options]
   */
  constructor( fourierSeries, emphasizedHarmonics, domainProperty, seriesTypeProperty, tProperty,
               xAxisTickLabelFormatProperty, xAxisDescriptionProperty, yAxisDescriptionProperty,
               options ) {
    super( fourierSeries, emphasizedHarmonics, domainProperty, seriesTypeProperty, tProperty,
      xAxisTickLabelFormatProperty, xAxisDescriptionProperty, yAxisDescriptionProperty, options );
  }
}

fourierMakingWaves.register( 'DiscreteHarmonicsChart', DiscreteHarmonicsChart );
export default DiscreteHarmonicsChart;