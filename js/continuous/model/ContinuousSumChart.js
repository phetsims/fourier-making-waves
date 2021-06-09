// Copyright 2021, University of Colorado Boulder

//TODO delete if not used
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

    //TODO flesh out
  }

  /**
   * @public
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
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