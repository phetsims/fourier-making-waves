// Copyright 2021, University of Colorado Boulder

/**
 * DiscreteSumChart is the model for the 'Sum' chart in the 'Discrete' screen.
 * It adds the following the base class:
 * - a plot for preset waveforms that shows what the waveform would look like if approximated by a Fourier Series with
 *   an infinite number of harmonics
 * - x-axis formatting that depends on domain
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
   * @param {DerivedProperty.<TickLabelFormat>} xAxisTickLabelFormatProperty
   * @param {Property.<AxisDescription>} xAxisDescriptionProperty
   * @param {EnumerationProperty.<Waveform>} waveformProperty
   * @param {Object} [options]
   */
  constructor( fourierSeries, domainProperty, seriesTypeProperty, tProperty, xAxisTickLabelFormatProperty,
               xAxisDescriptionProperty, waveformProperty, options ) {

    assert && assert( xAxisTickLabelFormatProperty instanceof DerivedProperty );
    assert && AssertUtils.assertEnumerationPropertyOf( waveformProperty, Waveform );

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    super( fourierSeries, domainProperty, seriesTypeProperty, tProperty, xAxisDescriptionProperty, options );

    // @public
    this.xAxisTickLabelFormatProperty = xAxisTickLabelFormatProperty;
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
      [ this.infiniteHarmonicsVisibleProperty, this.sumDataSetProperty, waveformProperty, domainProperty, seriesTypeProperty, tProperty ],
      ( infiniteHarmonicsVisible, sumDataSet, waveform, domain, seriesType, t ) => {
        let dataSet = EMPTY_DATA_SET;
        if ( infiniteHarmonicsVisible ) {
          if ( waveform === Waveform.SINUSOID ) {

            // Identical to the sum, so reuse the sum's data set.
            dataSet = sumDataSet;
          }
          else {
            dataSet = waveform.getInfiniteHarmonicsDataSet( domain, seriesType, t, L, T );
          }
        }
        return dataSet;
      } );
  }

  /**
   * @public
   * @override
   */
  reset() {
    super.reset();
    this.infiniteHarmonicsVisibleProperty.reset();
  }
}

fourierMakingWaves.register( 'DiscreteSumChart', DiscreteSumChart );
export default DiscreteSumChart;