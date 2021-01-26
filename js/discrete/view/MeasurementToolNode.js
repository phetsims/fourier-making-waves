// Copyright 2021, University of Colorado Boulder

/**
 * MeasurementToolNode is the base class for tools that are used to measure harmonics.
 * Responsibilities include:
 * - positioning the tool
 * - updating when the associated harmonic changes
 * - emphasizing the associated harmonic on ( isPressed || isHovering )
 * - dragging, constrained to drag bounds
 * - updating drag bounds
 * - keeping the tool inside drag bounds
 * - interrupting a drag
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import ObservableArrayDef from '../../../../axon/js/ObservableArrayDef.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Harmonic from '../../common/model/Harmonic.js';
import HarmonicEmphasisListener from '../../common/view/HarmonicEmphasisListener.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class MeasurementToolNode extends Node {

  /**
   * @param {Property.<Harmonic>} harmonicProperty
   * @param {ObservableArrayDef.<Harmonic>} emphasizedHarmonics
   * @param {Property.<Bounds2>} visibleBoundsProperty - visible bounds of the associated ScreenView
   * @param {function} updateNodes - updates this tool's child Nodes to match the selected harmonic
   * @param {Object} [options]
   */
  constructor( harmonicProperty, emphasizedHarmonics, visibleBoundsProperty, updateNodes, options ) {

    assert && AssertUtils.assertPropertyOf( harmonicProperty, Harmonic );
    assert && assert( ObservableArrayDef.isObservableArray( emphasizedHarmonics ), 'invalid emphasizedHarmonics' );
    assert && AssertUtils.assertPropertyOf( visibleBoundsProperty, Bounds2 );
    assert && assert( typeof updateNodes === 'function', 'invalid updateNodes' );

    options = merge( {

      // For debugging
      debugName: 'tool',

      // {Property.<Bounds2>|null} dragging is constrained to these bounds. If null, default is set below.
      dragBoundsProperty: null,

      // Node options
      cursor: 'pointer'
    }, options );

    super( options );

    // @private
    this.harmonicProperty = harmonicProperty;
    this.emphasizedHarmonics = emphasizedHarmonics;

    // Show a red dot at the tool's origin.
    if ( phet.chipper.queryParameters.dev ) {
      this.addChild( new Circle( 2, { fill: 'red' } ) );
    }

    // Position of the tool in view coordinates
    const positionProperty = new Property( this.translation );

    // By default, tools are constrained to be fully inside the visible bounds of the ScreenView.
    const dragBoundsProperty = options.dragBoundsProperty || new DerivedProperty(
      [ visibleBoundsProperty, this.localBoundsProperty ],
      ( visibleBounds, localBounds ) => visibleBounds.copy().setMinMax(
        visibleBounds.minX - localBounds.minX,
        visibleBounds.minY - localBounds.minY,
        visibleBounds.maxX - localBounds.maxX,
        visibleBounds.maxY - localBounds.maxY
      )
    );

    // removeInputListener is not needed.
    this.addInputListener( new DragListener( {
      positionProperty: positionProperty,
      dragBoundsProperty: dragBoundsProperty
    } ) );

    // Emphasize the associated harmonic. removeInputListener is not needed.
    this.addInputListener( new HarmonicEmphasisListener( harmonicProperty, emphasizedHarmonics, {
      debugName: options.debugName,
      attach: false  //TODO test that attach:false doesn't prevent this from being interrupted with Reset All
    } ) );

    // Move the tool to its position. unlink is not needed.
    positionProperty.link( position => {
      this.translation = position;
    } );

    // Update the tool to match the selected harmonic. unlink is not needed.
    harmonicProperty.lazyLink( () => {
      this.interruptSubtreeInput();
      updateNodes();
    } );

    // If the tool's origin is outside the drag bounds, move it inside. unlink is not needed.
    dragBoundsProperty.link( dragBounds => {
      if ( !dragBounds.containsPoint( positionProperty.value ) ) {
        this.interruptSubtreeInput();
        positionProperty.value = dragBounds.closestPointTo( positionProperty.value );
      }
    } );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

fourierMakingWaves.register( 'MeasurementToolNode', MeasurementToolNode );
export default MeasurementToolNode;