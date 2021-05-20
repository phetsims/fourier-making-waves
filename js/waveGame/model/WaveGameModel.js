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

    //TODO replace this for loop with explicit instantiation of each WaveGameLevel, it will be clearer
    // @public {WaveGameLevel[]}
    this.levels = [];
    for ( let i = 1; i <= NUMBER_OF_LEVELS; i++ ) {

      // Configuration that is common to all levels.
      let levelConfig = {
        levelNumber: i,
        tandem: options.tandem.createTandem( `level${i}` )
      };

      if ( i === 1 ) {

        // Level 1
        levelConfig = merge( {
          getNumberOfNonZeroHarmonics: () => i,
          numberOfZeroAmplitudeControls: 1,
          statusBarMessage: fourierMakingWavesStrings.statusOneHarmonic,
          infoDialogDescription: fourierMakingWavesStrings.infoOneHarmonic
        }, levelConfig );
      }
      else if ( i > 1 && i < NUMBER_OF_LEVELS ) {

        // Levels 2, 3, 4
        levelConfig = merge( {
          getNumberOfNonZeroHarmonics: () => i,
          numberOfZeroAmplitudeControls: 2,
          statusBarMessage: StringUtils.fillIn( fourierMakingWavesStrings.statusNumberHarmonics, {
            levelNumber: i,
            numberOfHarmonics: i
          } ),
          infoDialogDescription: StringUtils.fillIn( fourierMakingWavesStrings.infoNumberHarmonics, {
            levelNumber: i,
            numberOfHarmonics: i
          } )
        }, levelConfig );
      }
      else {

        // Level 5
        assert && assert( i === NUMBER_OF_LEVELS );
        levelConfig = merge( {
          getNumberOfNonZeroHarmonics: () => dotRandom.nextIntBetween( NUMBER_OF_LEVELS, FMWConstants.MAX_HARMONICS ),
          numberOfZeroAmplitudeControls: 0,
          statusBarMessage: StringUtils.fillIn( fourierMakingWavesStrings.statusNumberOrMoreHarmonics, {
            levelNumber: i,
            numberOfHarmonics: i
          } ),
          infoDialogDescription: StringUtils.fillIn( fourierMakingWavesStrings.infoNumberOrMoreHarmonics, {
            levelNumber: i,
            numberOfHarmonics: i
          } )
        }, levelConfig );
      }

      this.levels.push( new WaveGameLevel( levelConfig ) );
    }

    // @public {Property.<null|WaveGameLevel>} the selected game level, null returns to the level-selection UI
    this.levelProperty = new Property( null, {
      validValues: [ null, ...this.levels ]
    } );
  }

  /**
   * @public
   */
  reset() {
    this.levels.forEach( level => level.reset() );
    this.levelProperty.reset();
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