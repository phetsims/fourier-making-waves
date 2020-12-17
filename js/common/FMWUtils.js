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
   * It does not look up the prototype chain of the object.
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
  }
};

fourierMakingWaves.register( 'FMWUtils', FMWUtils );
export default FMWUtils;