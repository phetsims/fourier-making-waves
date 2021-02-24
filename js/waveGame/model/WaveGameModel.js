// Copyright 2020, University of Colorado Boulder

/**
 * WaveGameModel is the top-level model for the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import Property from '../../../../axon/js/Property.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWUtils from '../../common/FMWUtils.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WaveGameLevel from './WaveGameLevel.js';

class WaveGameModel {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      tandem: Tandem.REQUIRED
    }, options );

    //TODO descriptions
    //TODO i18n
    //TODO level-specific subclasses of WaveGameChallengeGenerator
    // @public
    this.levels = [
      new WaveGameLevel( 1, '1 non-zero harmonic', {
        getNumberOfNonZeroHarmonics: () => 1,
        tandem: options.tandem.createTandem( 'level1' )
      } ),
      new WaveGameLevel( 2, '2 non-zero harmonics', {
        getNumberOfNonZeroHarmonics: () => 2,
        tandem: options.tandem.createTandem( 'level2' )
      } ),
      new WaveGameLevel( 3, '3 non-zero harmonics', {
        getNumberOfNonZeroHarmonics: () => 3,
        tandem: options.tandem.createTandem( 'level3' )
      } ),
      new WaveGameLevel( 4, '4 non-zero harmonics', {
        getNumberOfNonZeroHarmonics: () => 4,
        tandem: options.tandem.createTandem( 'level4' )
      } ),
      new WaveGameLevel( 5, '5 or more non-zero harmonics', {
        getNumberOfNonZeroHarmonics: () => dotRandom.nextIntBetween( 5, FMWConstants.MAX_HARMONICS ),
        tandem: options.tandem.createTandem( 'level5' )
      } )
    ];

    // @public {Property.<null|WaveGameLevel>} the selected game level, null returns to the level-selection UI
    this.levelProperty = new Property( null, {
      validValues: [ null, ...this.levels ]
      //TODO tandem
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