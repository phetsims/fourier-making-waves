// Copyright 2021, University of Colorado Boulder

/**
 * FMWQueryParameters defines query parameters that are specific to this simulation.
 * Run with ?log to print these query parameters and their values to the browser console at startup.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import fourierMakingWaves from '../fourierMakingWaves.js';

const FMWQueryParameters = QueryStringMachine.getAll( {

  //TODO delete this file if this remains empty
} );

fourierMakingWaves.register( 'FMWQueryParameters', FMWQueryParameters );

// log the values of all sim-specific query parameters
phet.log && phet.log( 'query parameters: ' + JSON.stringify( FMWQueryParameters, null, 2 ) );

export default FMWQueryParameters;