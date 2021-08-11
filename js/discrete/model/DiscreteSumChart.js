// Copyright 2021, University of Colorado Boulder

/**
 * DiscreteSumChart is the model for the 'Sum' chart in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import SumChart from '../../common/model/SumChart.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import Waveform from './Waveform.js';

// constants
const EMPTY_DATA_SET = FMWConstants.EMPTY_DATA_SET;

class DiscreteSumChart extends SumChart {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<SeriesType>} seriesTypeProperty
   * @param {Property.<number>} tProperty
   * @param {Property.<TickLabelFormat>} xAxisTickLabelFormatProperty
   * @param {Property.<AxisDescription>} xAxisDescriptionProperty
   * @param {Property.<AxisDescription>} yAxisDescriptionProperty
   * @param {EnumerationProperty.<Waveform>} waveformProperty
   * @param {Object} [options]
   */
  constructor( fourierSeries, domainProperty, seriesTypeProperty, tProperty,
               xAxisTickLabelFormatProperty, xAxisDescriptionProperty, yAxisDescriptionProperty,
               waveformProperty, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( waveformProperty, Waveform );

    assert && assert( !options.yAutoScaleProperty );
    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    assert && assert( !options.yAutoScaleProperty );
    options.yAutoScaleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'yAutoScaleProperty' )
    } );

    super( fourierSeries, domainProperty, seriesTypeProperty, tProperty,
      xAxisTickLabelFormatProperty, xAxisDescriptionProperty, yAxisDescriptionProperty,
      options );

    // @public
    this.waveformProperty = waveformProperty;

    // @public whether the Sum chart shows what the waveform looks like for an infinite Fourier series
    this.infiniteHarmonicsVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'infiniteHarmonicsVisibleProperty' )
    } );

    // To improve readability
    const L = fourierSeries.L;
    const T = fourierSeries.T;

    // @public {DerivedProperty.<Vector2>} Data set that corresponds to a waveform preset, as if it were approximated
    // using a Fourier series with an infinite number of harmonics. If the preset is not visible, then returns
    // EMPTY_DATA_SET.
    this.infiniteHarmonicsDataSetProperty = new DerivedProperty(
      [ this.infiniteHarmonicsVisibleProperty, waveformProperty, domainProperty, seriesTypeProperty, tProperty ],
      ( infiniteHarmonicsVisible, waveform, domain, seriesType, t ) => {
        let dataSet = EMPTY_DATA_SET;
        if ( infiniteHarmonicsVisible ) {
          if ( waveform === Waveform.SINUSOID ) {

            // Identical to the sum, so reuse the sum's data set.
            dataSet = this.sumDataSetProperty.value;
          }
          else {
            dataSet = waveform.getInfiniteHarmonicsDataSet( domain, seriesType, t, L, T );
          }
        }
        return dataSet;
      } );

    // @private
    this.resetDiscreteSumChart = () => {
      options.yAutoScaleProperty.reset();
      this.infiniteHarmonicsVisibleProperty.reset();
    };
  }

  /**
   * @public
   * @override
   */
  reset() {
    super.reset();
    this.resetDiscreteSumChart();
  }
}

fourierMakingWaves.register( 'DiscreteSumChart', DiscreteSumChart );
export default DiscreteSumChart;