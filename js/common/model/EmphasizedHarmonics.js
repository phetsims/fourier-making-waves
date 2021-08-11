// Copyright 2021, University of Colorado Boulder

/**
 * EmphasizedHarmonics is an observable set of associations between interactive Nodes and Harmonics.
 *
 * When the user begins interaction with a Node, an entry is added to this set.
 * When the user ends interaction with a Node, an entry is removed from this set.
 * All Harmonic instances appearing in this set are to be emphasized in the Harmonics chart, and that is the
 * responsibility of HarmonicsChartNode.
 *
 * Each Node can interact with 1 Harmonic at a time, while a Harmonic can be manipulated by multiple Nodes
 * simultaneously (e.g. an amplitude slider and a measurement tool) via multi-touch. 'node' is therefore a
 * unique key for elements in this set.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import createObservableArray from '../../../../axon/js/createObservableArray.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import Harmonic from './Harmonic.js';

class EmphasizedHarmonics {

  constructor() {

    // @private {ObservableArrayDef.<{node:Node, harmonic: Harmonic}>}
    // Each element identifies an interactive Node and the harmonic that it is manipulating.
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
   * Adds a node/harmonic pair to the set. Enforces uniqueness of the node key.
   * @param {Node} node
   * @param {Harmonic} harmonic
   * @public
   */
  push( node, harmonic ) {
    assert && assert( harmonic instanceof Harmonic );
    assert && assert( node instanceof Node );
    assert && assert( !this.includesNode( node ), 'node is already in the set' );
    this.observableArray.push( { node: node, harmonic: harmonic } );
  }

  /**
   * Removes the element that corresponds to node, which is a unique key.
   * @param {Node} node
   * @public
   */
  remove( node ) {
    assert && assert( node instanceof Node );
    const element = _.find( this.observableArray, element => element.node === node );
    assert && assert( element, 'no element in set' );
    element && this.observableArray.remove( element );
  }

  /**
   * Does the set include an element related to a specified node?
   * @param {Node} node
   * @returns {boolean}
   * @public
   */
  includesNode( node ) {
    assert && assert( node instanceof Node );
    return _.some( this.observableArray, element => element.node === node );
  }

  /**
   * Does the set include an element related to a specified harmonic?
   * @param {Harmonic} harmonic
   * @returns {boolean}
   * @public
   */
  includesHarmonic( harmonic ) {
    assert && assert( harmonic instanceof Harmonic );
    return _.some( this.observableArray, element => element.harmonic === harmonic );
  }

  /**
   * Resets (clears) the set.
   * @public
   */
  reset() {
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
    assert && assert( typeof listener === 'function' );
    assert && assert( !this.observableArray.lengthProperty.hasListener( listener ) );
    this.observableArray.lengthProperty.lazyLink( () => listener() );
  }
}

fourierMakingWaves.register( 'EmphasizedHarmonics', EmphasizedHarmonics );
export default EmphasizedHarmonics;