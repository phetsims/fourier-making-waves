// Copyright 2020, University of Colorado Boulder

/**
 * WaveGameModel is the top-level model for the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import FMWUtils from '../../common/FMWUtils.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class WaveGameModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );
    //TODO

    // @private
    this.resetWaveGameModel = () => {

      // Reset all non-inherited, non-derived Properties
      FMWUtils.resetOwnProperties( this );
    };
  }

  /**
   * @public
   */
  reset() {
    this.resetWaveGameModel();
  }

  /**
   * @public
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }
}

fourierMakingWaves.register( 'WaveGameModel', WaveGameModel );
export default WaveGameModel;