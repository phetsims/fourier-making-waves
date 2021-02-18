// Copyright 2020, University of Colorado Boulder

/**
 * WaveGameModel is the top-level model for the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import Property from '../../../../axon/js/Property.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWUtils from '../../common/FMWUtils.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WaveGameChallengeGenerator from './WaveGameChallengeGenerator.js';
import WaveGameLevel from './WaveGameLevel.js';

class WaveGameModel {
  get levelProperty() {
    return this._levelProperty;
  }

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
      new WaveGameLevel( 1, '1 non-zero harmonic', new WaveGameChallengeGenerator( {
        getNumberOfNonZeroHarmonics: () => 1
      } ) ),
      new WaveGameLevel( 2, '2 non-zero harmonics', new WaveGameChallengeGenerator( {
        getNumberOfNonZeroHarmonics: () => 2
      } ) ),
      new WaveGameLevel( 3, '3 non-zero harmonics', new WaveGameChallengeGenerator( {
        getNumberOfNonZeroHarmonics: () => 3
      } ) ),
      new WaveGameLevel( 4, '4 non-zero harmonics', new WaveGameChallengeGenerator( {
        getNumberOfNonZeroHarmonics: () => 4
      } ) ),
      new WaveGameLevel( 5, '5 or more non-zero harmonics', new WaveGameChallengeGenerator( {
        getNumberOfNonZeroHarmonics: () => dotRandom.nextIntBetween( 5, FMWConstants.MAX_HARMONICS )
      } ) )
    ];

    // @public {Property.<null|WaveGameLevel>} the selected game level, null returns to the level-selection UI
    this._levelProperty = new Property( null, {
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