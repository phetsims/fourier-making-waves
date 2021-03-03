// Copyright 2020, University of Colorado Boulder

/**
 * WaveGameModel is the top-level model for the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import Property from '../../../../axon/js/Property.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWUtils from '../../common/FMWUtils.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import WaveGameLevel from './WaveGameLevel.js';

// constants
const NUMBER_OF_LEVELS = 5;
assert && assert( NUMBER_OF_LEVELS < FMWConstants.MAX_HARMONICS, `too many levels: ${NUMBER_OF_LEVELS}` );

class WaveGameModel {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      tandem: Tandem.REQUIRED
    }, options );

    // @public {WaveGameLevel[]}
    this.levels = [];

    // All levels except the last one are 'N harmonics'
    for ( let i = 1; i < NUMBER_OF_LEVELS; i++ ) {

      // Handle singular vs plural description of the level, which appears in the scoreboard.
      const description = ( i === 1 ) ?
                          fourierMakingWavesStrings.oneNonZeroHarmonic :
                          StringUtils.fillIn( fourierMakingWavesStrings.numberNonZeroHarmonics, {
                            levelNumber: i,
                            numberOfHarmonics: i
                          } );
      this.levels.push( new WaveGameLevel( i, description, {
        getNumberOfNonZeroHarmonics: () => i,
        tandem: options.tandem.createTandem( `level${i}` )
      } ) );
    }

    // The last level is 'N or more harmonics'
    this.levels.push(
      new WaveGameLevel( NUMBER_OF_LEVELS,
        StringUtils.fillIn( fourierMakingWavesStrings.numberOrMoreNonZeroHarmonics, {
          levelNumber: NUMBER_OF_LEVELS,
          numberOfHarmonics: NUMBER_OF_LEVELS
        } ), {
          getNumberOfNonZeroHarmonics: () => dotRandom.nextIntBetween( NUMBER_OF_LEVELS, FMWConstants.MAX_HARMONICS ),
          tandem: options.tandem.createTandem( `level${NUMBER_OF_LEVELS}` )
        } ) );

    // @public {Property.<null|WaveGameLevel>} the selected game level, null returns to the level-selection UI
    this.levelProperty = new Property( null, {
      validValues: [ null, ...this.levels ]
      //TODO tandem
    } );

    // @private
    this.resetWaveGameModel = () => {

      this.levels.forEach( level => level.reset() );

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