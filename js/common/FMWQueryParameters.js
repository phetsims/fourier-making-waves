// Copyright 2021, University of Colorado Boulder

/**
 * FMWQueryParameters defines query parameters that are specific to this simulation.
 * Run with ?log to print these query parameters and their values to the browser console at startup.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import logGlobal from '../../../phet-core/js/logGlobal.js';
import fourierMakingWaves from '../fourierMakingWaves.js';

const SCHEMA = {

  // Enables sounds for the SoundManager 'user-interface' category.
  // For internal use only.
  uiSoundsEnabled: {
    type: 'boolean',
    defaultValue: true
  },

  // Reaching this score results in a reward.
  // For internal use only, not public facing.
  rewardScore: {
    type: 'number',
    defaultValue: 10,
    isValidValue: value => ( value > 0 )
  }
};

const FMWQueryParameters = QueryStringMachine.getAll( SCHEMA );

fourierMakingWaves.register( 'FMWQueryParameters', FMWQueryParameters );

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
logGlobal( 'phet.fourierMakingWaves.FMWQueryParameters' );

export default FMWQueryParameters;