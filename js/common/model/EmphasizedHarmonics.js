// Copyright 2021, University of Colorado Boulder

/**
 * EmphasizedHarmonics is an observable set of associations between listeners and harmonics.
 * While a harmonic appears in this set, it is emphasized in the Harmonics chart.
 *
 * When the user begins interacting with a harmonic, an entry is added to this set.
 * When the user ends interacting with a harmonic, an entry is removed from this set.
 *
 * Each listener can interact with 1 harmonic at a time, while a harmonic can be manipulated by multiple listeners
 * simultaneously (e.g. an amplitude slider and a measurement tool) via multi-touch. listener is therefore a unique key.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import createObservableArray from '../../../../axon/js/createObservableArray.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import HarmonicEmphasisListener from '../view/HarmonicEmphasisListener.js';
import Harmonic from './Harmonic.js';

class EmphasizedHarmonics {

  constructor() {

    // @private {ObservableArrayDef.<{listener:HarmonicEmphasisListener, harmonic: Harmonic}>}
    // Each element identifies a listener and the harmonic that it's manipulating.
    this.observableArray = createObservableArray();
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Adds listener/harmonic pair to the set. Enforces uniqueness of the listener key.
   * @param {HarmonicEmphasisListener} listener
   * @param {Harmonic} harmonic
   * @public
   */
  push( listener, harmonic ) {
    assert && assert( harmonic instanceof Harmonic, 'invalid harmonic' );
    assert && assert( listener instanceof HarmonicEmphasisListener, 'invalid listener' );
    assert && assert( !this.includesListener( listener ), 'listener is already in the set' );
    this.observableArray.push( { listener: listener, harmonic: harmonic } );
  }

  /**
   * Removes the element that corresponds to listener, which is a unique key.
   * @param {HarmonicEmphasisListener} listener
   * @public
   */
  remove( listener ) {
    assert && assert( listener instanceof HarmonicEmphasisListener, 'invalid listener' );
    const element = _.find( this.observableArray, element => element.listener === listener );
    assert && assert( element, 'no element in set' );
    element && this.observableArray.remove( element );
  }

  /**
   * Does the set include an element related to listener?
   * @param {HarmonicEmphasisListener} listener
   * @returns {boolean}
   * @public
   */
  includesListener( listener ) {
    assert && assert( listener instanceof HarmonicEmphasisListener, 'invalid listener' );
    return _.some( this.observableArray, element => element.listener === listener );
  }

  /**
   * Does the set include an element related to harmonic?
   * @param {Harmonic} harmonic
   * @returns {boolean}
   * @public
   */
  includesHarmonic( harmonic ) {
    assert && assert( harmonic instanceof Harmonic, 'invalid harmonic' );
    return _.some( this.observableArray, element => element.harmonic === harmonic );
  }

  /**
   * Clears the set.
   * @public
   */
  clear() {
    this.observableArray.clear();
  }

  /**
   * Gets the number of elements in the set.
   * @returns {number}
   * @public
   */
  getLength() {
    return this.observableArray.length;
  }

  get length() { return this.getLength(); }

  /**
   * Adds a listener that is called when the set changes.
   * There is no removeChangedListener method because listeners do not need to be removed in this sim.
   * @param {function} listener - no parameters, no return value
   * @public
   */
  addChangedListener( listener ) {
    assert && assert( typeof listener === 'function', 'invalid listener' );
    assert && assert( !this.observableArray.lengthProperty.hasListener( listener ), 'already has this listener' );
    this.observableArray.lengthProperty.lazyLink( () => listener() );
  }
}

fourierMakingWaves.register( 'EmphasizedHarmonics', EmphasizedHarmonics );
export default EmphasizedHarmonics;