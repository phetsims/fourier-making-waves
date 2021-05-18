// Copyright 2021, University of Colorado Boulder

/**
 * WaveformChart is the base class for charts that plot one or more 2D waveforms related to a Fourier series.
 * The x axis is either space or time, while the y axis is always amplitude.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import AxisDescription from './AxisDescription.js';
import Domain from './Domain.js';
import FourierSeries from './FourierSeries.js';
import TickLabelFormat from './TickLabelFormat.js';
import XAxisDescription from './XAxisDescription.js';

class WaveformChart {

  /**
   * @param {FourierSeries} fourierSeries - Fourier series associated with the chart
   * @param {EnumerationProperty.<Domain>} domainProperty - domain of the x axis
   * @param {Property.<TickLabelFormat>} xAxisTickLabelFormatProperty - determines the format of the x-axis tick labels
   * @param {Property.<XAxisDescription>} xAxisDescriptionProperty - describes the x axis
   * @param {Property.<AxisDescription>} yAxisDescriptionProperty - describes the y axis
   * @param {Object} [options]
   */
  constructor( fourierSeries, domainProperty,
               xAxisTickLabelFormatProperty, xAxisDescriptionProperty, yAxisDescriptionProperty, options ) {

    assert && assert( fourierSeries instanceof FourierSeries );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertPropertyOf( xAxisTickLabelFormatProperty, TickLabelFormat );
    assert && AssertUtils.assertPropertyOf( xAxisDescriptionProperty, XAxisDescription );
    assert && AssertUtils.assertPropertyOf( yAxisDescriptionProperty, AxisDescription );

    // @public (read-only)
    this.fourierSeries = fourierSeries;
    this.domainProperty = domainProperty;
    this.xAxisTickLabelFormatProperty = xAxisTickLabelFormatProperty;
    this.xAxisDescriptionProperty = xAxisDescriptionProperty;
    this.yAxisDescriptionProperty = yAxisDescriptionProperty;
  }
}

fourierMakingWaves.register( 'WaveformChart', WaveformChart );
export default WaveformChart;