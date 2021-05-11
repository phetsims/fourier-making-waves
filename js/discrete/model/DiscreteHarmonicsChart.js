// Copyright 2021, University of Colorado Boulder

/**
 * DiscreteHarmonicsChart is the model for the 'Harmonics' chart in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import HarmonicsChart from '../../common/model/HarmonicsChart.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class DiscreteHarmonicsChart extends HarmonicsChart {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<SeriesType>} seriesTypeProperty
   * @param {Property.<number>} tProperty
   * @param {NumberProperty} xZoomLevelProperty
   * @param {Property.<AxisDescription>} xAxisDescriptionProperty
   * @param {Object} [options]
   */
  constructor( fourierSeries, domainProperty, seriesTypeProperty, tProperty,
               xZoomLevelProperty, xAxisDescriptionProperty, options ) {

    assert && assert( xZoomLevelProperty instanceof NumberProperty );

    super( fourierSeries, domainProperty, seriesTypeProperty, tProperty, xAxisDescriptionProperty, options );

    // @public
    this.xZoomLevelProperty = xZoomLevelProperty;

    // @public whether the Harmonics chart is visible
    this.chartVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'chartVisibleProperty' )
    } );
  }

  /**
   * @public
   * @override
   */
  reset() {
    super.reset();
    this.chartVisibleProperty.reset();
  }
}

fourierMakingWaves.register( 'DiscreteHarmonicsChart', DiscreteHarmonicsChart );
export default DiscreteHarmonicsChart;