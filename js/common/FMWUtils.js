// Copyright 2020, University of Colorado Boulder

/**
 * FMWUtils is a collection of utility functions used in this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../axon/js/DerivedProperty.js';
import Property from '../../../axon/js/Property.js';
import fourierMakingWaves from '../fourierMakingWaves.js';

const FMWUtils = {

  /**
   * Resets all non-inherited, non-derived Properties of an object instance.
   * This does not look up the prototype chain of the object.
   * @param {Object }object
   * @public
   */
  resetOwnProperties( object ) {
    for ( const propertyName in object ) {
      if ( object.hasOwnProperty( propertyName ) &&
           ( object[ propertyName ] instanceof Property ) &&
           !( object[ propertyName ] instanceof DerivedProperty ) ) {
        object[ propertyName ].reset();
      }
    }
  },

  /**
   * Logs a global variable by converting it to JSON, then writing it to phet.log. If the global is undefined,
   * the log will show 'undefined'.  This is currently used to log collection of query parameters (which exist
   * as globals), but could be applied to other globals.
   * @param {string} globalString - the name of the global
   * @public
   */
  logGlobal( globalString ) {
    assert && assert( typeof globalString === 'string', 'invalid globalString' );
    
    const tokens = globalString.split( '.' );
    let result = window;
    for ( let i = 0; i < tokens.length && result; i++ ) {
      result = result[ tokens[ i ] ];
    }
    phet.log && phet.log( `${globalString}: ${JSON.stringify( result, null, 2 )}` );
  }
};

fourierMakingWaves.register( 'FMWUtils', FMWUtils );
export default FMWUtils;