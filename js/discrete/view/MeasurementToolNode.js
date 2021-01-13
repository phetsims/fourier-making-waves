// Copyright 2021, University of Colorado Boulder

/**
 * MeasurementToolNode is the base class for tools that are used to measure harmonics.
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
import fourierMakingWaves from '../../fourierMakingWaves.js';

class MeasurementToolNode extends Node {

  /**
   * @param {Property.<Harmonic>} harmonicProperty
   * @param {ObservableArrayDef.<Harmonic>} emphasizedHarmonics
   * @param {Property.<Bounds2>} visibleBoundsProperty - visible bounds of the associated ScreenView
   * @param {function} update - updates the tool to match the selected harmonic
   * @param {function(visibleBounds:Bounds2, thisLocalBounds:Bounds2)} computeDragBounds
   * @param {Object} [options]
   */
  constructor( harmonicProperty, emphasizedHarmonics, visibleBoundsProperty, update, computeDragBounds, options ) {

    assert && AssertUtils.assertPropertyOf( harmonicProperty, Harmonic );
    assert && assert( ObservableArrayDef.isObservableArray( emphasizedHarmonics ), 'invalid emphasizedHarmonics' );
    assert && AssertUtils.assertPropertyOf( visibleBoundsProperty, Bounds2 );
    assert && assert( typeof update === 'function', 'invalid update' );
    assert && assert( typeof computeDragBounds === 'function', 'invalid computeDragBounds' );

    options = merge( {
      cursor: 'pointer'
    }, options );

    super( options );

    // Show a red dot at the tool's origin.
    if ( phet.chipper.queryParameters.dev ) {
      this.addChild( new Circle( 2, { fill: 'red' } ) );
    }

    // Position of the tool in view coordinates
    const positionProperty = new Property( this.translation );

    // Drag bounds, derived from the ScreenView's visible bounds and this Node's local bounds. dispose is not needed.
    const dragBoundsProperty = new DerivedProperty(
      [ visibleBoundsProperty, this.localBoundsProperty ],
      ( visibleBounds, localBounds ) => computeDragBounds( visibleBounds, localBounds )
    );

    // @private
    this.dragListener = new DragListener( {
      positionProperty: positionProperty,
      dragBoundsProperty: dragBoundsProperty
    } );
    this.addInputListener( this.dragListener ); // removeInputListener is not needed.

    // Move the tool to its position. unlink is not needed.
    positionProperty.link( position => {
      this.translation = position;
    } );

    // Update the tool to match the selected harmonic. unlink is not needed.
    harmonicProperty.link( () => {
      this.interruptDrag();
      update();
    } );

    // @protected
    this.harmonicProperty = harmonicProperty;

    // If ( isPressed || isHovering ), emphasize the associated harmonic. unlink is not needed.
    this.dragListener.isHighlightedProperty.link( isHighlighted => {
      const harmonic = harmonicProperty.value;
      if ( isHighlighted ) {
        emphasizedHarmonics.push( harmonic );
      }
      else if ( emphasizedHarmonics.includes( harmonic ) ) {
        emphasizedHarmonics.remove( harmonic );
      }
    } );

    // If the tool is outside the drag bounds, move it inside. unlink is not needed.
    dragBoundsProperty.link( dragBounds => {
      if ( !dragBounds.containsPoint( positionProperty.value ) ) {
        this.interruptDrag();
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

  /**
   * Interrupts a drag and ensures that the associated harmonic is no longer emphasized.
   * @protected
   */
  interruptDrag() {
    if ( this.dragListener.isPressed ) {
      this.interruptSubtreeInput();
      const harmonic = this.harmonicProperty.value;
      if ( this.emphasizedHarmonics.includes( harmonic ) ) {
        this.emphasizedHarmonics.remove( harmonic );
      }
    }
  }
}

fourierMakingWaves.register( 'MeasurementToolNode', MeasurementToolNode );
export default MeasurementToolNode;