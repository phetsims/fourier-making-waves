// Copyright 2021, University of Colorado Boulder

/**
 * FMWQueryParameters defines query parameters that are specific to this simulation.
 * Run with ?log to print these query parameters and their values to the browser console at startup.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import fourierMakingWaves from '../fourierMakingWaves.js';
import FMWUtils from './FMWUtils.js';

const SCHEMA = {

  // Enables sounds for the SoundManager 'user-interface' category.
  // For internal use only.
  uiSoundsEnabled: {
    type: 'boolean',
    defaultValue: false //TODO https://github.com/phetsims/fourier-making-waves/issues/48 change to true for a future release?
  }
};

const FMWQueryParameters = QueryStringMachine.getAll( SCHEMA );

fourierMakingWaves.register( 'FMWQueryParameters', FMWQueryParameters );

FMWUtils.logGlobal( 'phet.chipper.queryParameters' );
FMWUtils.logGlobal( 'phet.preloads.phetio.queryParameters' );
FMWUtils.logGlobal( 'phet.fourierMakingWaves.FMWQueryParameters' );

export default FMWQueryParameters;  x