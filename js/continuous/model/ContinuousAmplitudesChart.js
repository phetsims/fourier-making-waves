// Copyright 2021, University of Colorado Boulder

/**
 * ContinuousAmplitudesChart is the 'Amplitudes' chart on the 'Continuous' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class ContinuousAmplitudesChart {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    //TODO
  }

  /**
   * @public
   */
  reset() {
    //TODO
  }
}

fourierMakingWaves.register( 'ContinuousAmplitudesChart', ContinuousAmplitudesChart );
export default ContinuousAmplitudesChart;