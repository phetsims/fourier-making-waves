// Copyright 2020-2021, University of Colorado Boulder

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

class WaveGameModel {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // @public {WaveGameLevel[]}
    // There's some duplication of level number constants here. But the specification for levels changed SO many times,
    // that this brute force initialization ended up being easier to change and maintain.
    this.levels = [

      // Level 1
      new WaveGameLevel( 1, {
        defaultNumberOfAmplitudeControls: 2,
        statusBarMessage: fourierMakingWavesStrings.statusOneHarmonic,
        infoDialogDescription: fourierMakingWavesStrings.infoOneHarmonic,
        tandem: options.tandem.createTandem( 'level1' )
      } ),

      // Level 2
      new WaveGameLevel( 2, {
        defaultNumberOfAmplitudeControls: 3,
        tandem: options.tandem.createTandem( 'level2' )
      } ),

      // Level 3
      new WaveGameLevel( 3, {
        defaultNumberOfAmplitudeControls: 5,
        tandem: options.tandem.createTandem( 'level3' )
      } ),

      // Level 4
      new WaveGameLevel( 4, {
        defaultNumberOfAmplitudeControls: 6,
        tandem: options.tandem.createTandem( 'level4' )
      } ),

      // Level 5
      new WaveGameLevel( 5, {
        getNumberOfNonZeroHarmonics: () => dotRandom.nextIntBetween( 5, FMWConstants.MAX_HARMONICS ),
        defaultNumberOfAmplitudeControls: FMWConstants.MAX_HARMONICS,
        statusBarMessage: StringUtils.fillIn( fourierMakingWavesStrings.statusNumberOrMoreHarmonics, {
          levelNumber: 5,
          numberOfHarmonics: 5
        } ),
        infoDialogDescription: StringUtils.fillIn( fourierMakingWavesStrings.infoNumberOrMoreHarmonics, {
          levelNumber: 5,
          numberOfHarmonics: 5
        } ),
        tandem: options.tandem.createTandem( 'level5' )
      } )
    ];

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