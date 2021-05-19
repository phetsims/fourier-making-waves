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

    // @public {WaveGameLevel[]}
    this.levels = [];
    for ( let i = 1; i <= NUMBER_OF_LEVELS; i++ ) {

      let getNumberOfNonZeroHarmonics; // {function():number
      let statusBarMessage; // {string}
      let infoDialogDescription; // {string}

      if ( i === 1 ) {
        getNumberOfNonZeroHarmonics = () => i;
        statusBarMessage = fourierMakingWavesStrings.statusOneHarmonic;
        infoDialogDescription = fourierMakingWavesStrings.infoOneHarmonic;
      }
      else if ( i === NUMBER_OF_LEVELS ) {
        getNumberOfNonZeroHarmonics = () => dotRandom.nextIntBetween( NUMBER_OF_LEVELS, FMWConstants.MAX_HARMONICS );
        statusBarMessage = StringUtils.fillIn( fourierMakingWavesStrings.statusNumberOrMoreHarmonics, {
          levelNumber: i,
          numberOfHarmonics: i
        } );
        infoDialogDescription = StringUtils.fillIn( fourierMakingWavesStrings.infoNumberOrMoreHarmonics, {
          levelNumber: i,
          numberOfHarmonics: i
        } );
      }
      else {
        getNumberOfNonZeroHarmonics = () => i;
        statusBarMessage = StringUtils.fillIn( fourierMakingWavesStrings.statusNumberHarmonics, {
          levelNumber: i,
          numberOfHarmonics: i
        } );
        infoDialogDescription = StringUtils.fillIn( fourierMakingWavesStrings.infoNumberHarmonics, {
          levelNumber: i,
          numberOfHarmonics: i
        } );
      }

      this.levels.push( new WaveGameLevel( i, statusBarMessage, infoDialogDescription, {
        getNumberOfNonZeroHarmonics: getNumberOfNonZeroHarmonics,
        tandem: options.tandem.createTandem( `level${i}` )
      } ) );
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