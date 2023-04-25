// Copyright 2020-2023, University of Colorado Boulder

/**
 * WaveGameModel is the top-level model for the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Property from '../../../../axon/js/Property.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import TModel from '../../../../joist/js/TModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWQueryParameters from '../../common/FMWQueryParameters.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';
import WaveGameLevel from './WaveGameLevel.js';

export default class WaveGameModel implements TModel {

  // reaching this number of points results in a reward
  public readonly rewardScore: number;

  // game levels, ordered by increasing level number
  public readonly levels: WaveGameLevel[];

  // the selected game level. null means 'no selection' and causes the view to return to the level-selection UI.
  public readonly levelProperty: Property<WaveGameLevel | null>;

  public constructor( tandem: Tandem ) {

    this.rewardScore = FMWQueryParameters.rewardScore;

    // There's some duplication of level number constants here. But the specification for levels changed SO many times,
    // that this brute force initialization ended up being easier to change and maintain.  So I'm willing to make a
    // trade-off here, sacrificing some duplication for a more straightforward implementation.
    this.levels = [

      // Level 1
      new WaveGameLevel( 1, {
        defaultNumberOfAmplitudeControls: 2,
        statusBarMessageProperty: FourierMakingWavesStrings.matchUsing1HarmonicStringProperty,
        infoDialogDescriptionProperty: FourierMakingWavesStrings.info1HarmonicStringProperty,
        tandem: tandem.createTandem( 'level1' )
      } ),

      // Level 2
      new WaveGameLevel( 2, {
        defaultNumberOfAmplitudeControls: 3,
        tandem: tandem.createTandem( 'level2' )
      } ),

      // Level 3
      new WaveGameLevel( 3, {
        defaultNumberOfAmplitudeControls: 5,
        tandem: tandem.createTandem( 'level3' )
      } ),

      // Level 4
      new WaveGameLevel( 4, {
        defaultNumberOfAmplitudeControls: 6,
        tandem: tandem.createTandem( 'level4' )
      } ),

      // Level 5
      new WaveGameLevel( 5, {
        getNumberOfNonZeroHarmonics: () => dotRandom.nextIntBetween( 5, FMWConstants.MAX_HARMONICS ),
        defaultNumberOfAmplitudeControls: FMWConstants.MAX_HARMONICS,
        statusBarMessageProperty: new PatternStringProperty( FourierMakingWavesStrings.matchUsingNOrMoreHarmonicsStringProperty, {
          levelNumber: 5,
          numberOfHarmonics: 5
        } ),
        infoDialogDescriptionProperty: new PatternStringProperty( FourierMakingWavesStrings.infoNOrMoreHarmonicsStringProperty, {
          levelNumber: 5,
          numberOfHarmonics: 5
        } ),
        tandem: tandem.createTandem( 'level5' )
      } )
    ];
    assert && assert( this.levels.length === FMWConstants.NUMBER_OF_GAME_LEVELS );

    this.levelProperty = new Property( null, {
      validValues: [ null, ...this.levels ],
      phetioValueType: NullableIO( WaveGameLevel.WaveGameLevelIO ),
      tandem: tandem.createTandem( 'levelProperty' ),
      phetioDocumentation: 'The level currently selected in the Wave Game, null if no level is selected.'
    } );
  }

  public reset(): void {
    this.levels.forEach( level => level.reset() );
    this.levelProperty.reset();
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }
}

fourierMakingWaves.register( 'WaveGameModel', WaveGameModel );