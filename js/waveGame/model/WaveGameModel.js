// Copyright 2020, University of Colorado Boulder

/**
 * WaveGameModel is the top-level model for the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWUtils from '../../common/FMWUtils.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WaveGameChallengeGenerator1 from './WaveGameChallengeGenerator1.js';
import WaveGameLevel from './WaveGameLevel.js';

class WaveGameModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    //TODO descriptions
    //TODO i18n
    //TODO level-specific subclasses of WaveGameChallengeGenerator
    // @public
    this.levels = [
      new WaveGameLevel( 1, '1 non-zero harmonic', new WaveGameChallengeGenerator1() ),
      new WaveGameLevel( 2, '2 non-zero harmonics', new WaveGameChallengeGenerator1() ),
      new WaveGameLevel( 3, '3 non-zero harmonics', new WaveGameChallengeGenerator1() ),
      new WaveGameLevel( 4, '4 non-zero harmonics', new WaveGameChallengeGenerator1() ),
      new WaveGameLevel( 5, '5 or more non-zero harmonics', new WaveGameChallengeGenerator1() )
    ];

    // @public {Property.<null|WaveGameLevel>} the selected game level, null returns to the level-selection UI
    this.levelProperty = new Property( null, {
      validValues: [ null, ...this.levels ]
    } );

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