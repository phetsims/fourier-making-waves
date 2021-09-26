// Copyright 2021, University of Colorado Boulder

/**
 * FMWQueryParameters defines query parameters that are specific to this simulation.
 * Run with ?log to print these all query parameters and their values to the browser console at startup.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../../dot/js/Utils.js';
import logGlobal from '../../../phet-core/js/logGlobal.js';
import fourierMakingWaves from '../fourierMakingWaves.js';
import FMWConstants from './FMWConstants.js';

const SCHEMA = {

  //------------------------------------------------------------------------------------------------------------------
  // Public-facing query parameters
  //------------------------------------------------------------------------------------------------------------------

  // The score (number of points) required to see the reward in the Wave Game screen.
  rewardScore: {
    public: true,
    type: 'number',
    defaultValue: 5,
    isValidValue: value => ( value > 0 ) && Number.isInteger( value )
  },

  // The levels to show in the Wave Game screen.
  // The level numbers must be unique, valid, and in ascending order.
  // See https://github.com/phetsims/fourier-making-waves/issues/145
  gameLevels: {
    public: true,
    type: 'array',
    elementSchema: {
      type: 'number',
      isValidValue: Number.isInteger
    },
    defaultValue: null,
    isValidValue: array => {
      return ( array === null ) || (
        array.length > 0 &&
        // unique level numbers
        array.length === _.uniq( array ).length &&
        // valid level numbers
        _.every( array, element => element >= 1 && element <= FMWConstants.NUMBER_OF_GAME_LEVELS ) &&
        // sorted by ascending level number
        _.every( array, ( value, index, array ) => ( index === 0 || array[ index - 1 ] <= value ) )
      );
    }
  },

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
    isValidValue: array => ( array === null ) || ( array.length === FMWConstants.MAX_HARMONICS ),
    elementSchema: {
      type: 'number',
      isValidValue: amplitude =>
        ( amplitude >= -FMWConstants.MAX_AMPLITUDE && amplitude <= FMWConstants.MAX_AMPLITUDE ) &&
        ( Utils.numberOfDecimalPlaces( amplitude ) <= FMWConstants.WAVE_GAME_AMPLITUDE_DECIMAL_PLACES )
    },
    defaultValue: null
  },

  // Shows the origin (as a red dot) and the drag bounds (as a red rectangle) for measurement tools.
  debugTools: {
    type: 'flag'
  }
};

const FMWQueryParameters = QueryStringMachine.getAll( SCHEMA );

fourierMakingWaves.register( 'FMWQueryParameters', FMWQueryParameters );

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
logGlobal( 'phet.fourierMakingWaves.FMWQueryParameters' );

export default FMWQueryParameters;