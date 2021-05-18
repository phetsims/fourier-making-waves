// Copyright 2021, University of Colorado Boulder

/**
 * DiscreteSumChart is the model for the 'Sum' chart in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import SumChart from '../../common/model/SumChart.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class DiscreteSumChart extends SumChart {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<SeriesType>} seriesTypeProperty
   * @param {Property.<number>} tProperty
   * @param {Property.<TickLabelFormat>} xAxisTickLabelFormatProperty
   * @param {Property.<XAxisDescription>} xAxisDescriptionProperty
   * @param {Property.<AxisDescription>} yAxisDescriptionProperty
   * @param {Object} [options]
   */
  constructor( fourierSeries, domainProperty, seriesTypeProperty, tProperty,
               xAxisTickLabelFormatProperty, xAxisDescriptionProperty, yAxisDescriptionProperty, options ) {

    options = merge( {

      // Sum chart has zoom buttons for both axes.
      hasXZoom: true,
      hasYZoom: true
    }, options );

    super( fourierSeries, domainProperty, seriesTypeProperty, tProperty,
      xAxisTickLabelFormatProperty, xAxisDescriptionProperty, yAxisDescriptionProperty,
      options );

    // @public whether the Sum chart is visible
    this.chartVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'chartVisibleProperty' )
    } );

    // @public whether the Sum chart shows what the waveform looks like for an infinite Fourier series
    this.infiniteHarmonicsVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'infiniteHarmonicsVisibleProperty' )
    } );
  }

  /**
   * @public
   * @override
   */
  reset() {
    super.reset();
    this.chartVisibleProperty.reset();
    this.infiniteHarmonicsVisibleProperty.reset();
  }
}

fourierMakingWaves.register( 'DiscreteSumChart', DiscreteSumChart );
export default DiscreteSumChart;