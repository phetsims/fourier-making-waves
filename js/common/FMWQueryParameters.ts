// Copyright 2021-2023, University of Colorado Boulder

/**
 * FMWQueryParameters defines query parameters that are specific to this simulation.
 * Run with ?log to print these all query parameters and their values to the browser console at startup.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../../dot/js/Utils.js';
import logGlobal from '../../../phet-core/js/logGlobal.js';
import getGameLevelsSchema from '../../../vegas/js/getGameLevelsSchema.js';
import fourierMakingWaves from '../fourierMakingWaves.js';
import FMWConstants from './FMWConstants.js';

const FMWQueryParameters = QueryStringMachine.getAll( {

  //------------------------------------------------------------------------------------------------------------------
  // Public-facing query parameters
  //------------------------------------------------------------------------------------------------------------------

  // The score (number of points) required to see the reward in the Wave Game screen.
  rewardScore: {
    public: true,
    type: 'number',
    defaultValue: 5,
    isValidValue: ( value: number ) => ( value > 0 ) && Number.isInteger( value )
  },

  // The levels to show in the Wave Game screen.
  gameLevels: getGameLevelsSchema( FMWConstants.NUMBER_OF_GAME_LEVELS ),

  //------------------------------------------------------------------------------------------------------------------
  // Internal query parameters
  //------------------------------------------------------------------------------------------------------------------

  // Shows the reward after any correct answer, for testing the Wave Game reward.
  // For internal use only, not public facing.
  showReward: { type: 'flag' },

  // Seeds the game with a specific first challenge in level 5. This is useful for reproducing and testing specific
  // challenges. You must provide amplitude values for all 11 harmonics, including the zero values.
  // Example: answer5=0,0.5,0,1,0,0,0,0,0,0,0
  // For internal use only, not public facing.
  answer5: {
    type: 'array',
    isValidValue: ( array: number[] ) => ( array === null ) || ( array.length === FMWConstants.MAX_HARMONICS ),
    elementSchema: {
      type: 'number',
      isValidValue: ( amplitude: number ) =>
        ( amplitude >= -FMWConstants.MAX_AMPLITUDE && amplitude <= FMWConstants.MAX_AMPLITUDE ) &&
        ( Utils.numberOfDecimalPlaces( amplitude ) <= FMWConstants.WAVE_GAME_AMPLITUDE_DECIMAL_PLACES )
    },
    defaultValue: null
  },

  // Shows the origin (as a red dot) and the drag bounds (as a red rectangle) for measurement tools.
  // For internal use only, not public facing.
  debugTools: {
    type: 'flag'
  },

  // Adds keyboard navigation support for AmplitudeNumberDisplay, the readouts above the amplitude sliders.
  // See https://github.com/phetsims/fourier-making-waves/issues/206
  focusableAmplitudeNumberDisplay: {
    type: 'flag'
  }
} );

fourierMakingWaves.register( 'FMWQueryParameters', FMWQueryParameters );

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
logGlobal( 'phet.fourierMakingWaves.FMWQueryParameters' );

export default FMWQueryParameters;