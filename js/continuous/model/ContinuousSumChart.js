// Copyright 2021, University of Colorado Boulder

/**
 * ContinuousSumChart is the 'Sum' chart on the 'Continuous' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class ContinuousSumChart {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    // @public whether the Sum chart is visible
    this.chartVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'chartVisibleProperty' )
    } );
  }

  /**
   * @public
   */
  reset() {
    this.chartVisibleProperty.reset();
  }
}

fourierMakingWaves.register( 'ContinuousSumChart', ContinuousSumChart );
export default ContinuousSumChart;