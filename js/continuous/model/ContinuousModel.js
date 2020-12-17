// Copyright 2020, University of Colorado Boulder

/**
 * ContinuousModel is the top-level model for the 'Continuous' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import FMWUtils from '../../common/FMWUtils.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class ContinuousModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );
    //TODO

    // @private
    this.resetContinuousModel = () => {

      // Reset all non-inherited, non-derived Properties
      FMWUtils.resetOwnProperties( this );
    };
  }

  /**
   * @public
   */
  reset() {
    this.resetContinuousModel();
  }

  /**
   * @public
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }
}

fourierMakingWaves.register( 'ContinuousModel', ContinuousModel );
export default ContinuousModel;