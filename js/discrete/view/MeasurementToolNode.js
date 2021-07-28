// Copyright 2021, University of Colorado Boulder

/**
 * MeasurementToolNode is the base class for tools that are used to measure harmonics.
 * Responsibilities include:
 * - positioning the tool
 * - visibility
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
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import KeyboardDragListener from '../../../../scenery/js/listeners/KeyboardDragListener.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import Domain from '../../common/model/Domain.js';
import EmphasizedHarmonics from '../../common/model/EmphasizedHarmonics.js';
import Harmonic from '../../common/model/Harmonic.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import MeasurementTool from '../model/MeasurementTool.js';

class MeasurementToolNode extends Node {

  /**
   * @param {MeasurementTool} tool
   * @param {Property.<Harmonic>} harmonicProperty
   * @param {EmphasizedHarmonics} emphasizedHarmonics
   * @param {Property.<Bounds2>} dragBoundsProperty
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Domain[]} relevantDomains - the Domain values that are relevant for this tool
   * @param {function} updateNodes - updates this tool's child Nodes to match the selected harmonic
   * @param {Object} [options]
   */
  constructor( tool, harmonicProperty, emphasizedHarmonics, dragBoundsProperty, domainProperty, relevantDomains,
               updateNodes, options ) {

    assert && assert( tool instanceof MeasurementTool );
    assert && AssertUtils.assertPropertyOf( harmonicProperty, Harmonic );
    assert && assert( emphasizedHarmonics instanceof EmphasizedHarmonics );
    assert && AssertUtils.assertPropertyOf( dragBoundsProperty, Bounds2 );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && assert( Array.isArray( relevantDomains ) );
    assert && assert( typeof updateNodes === 'function' );

    options = merge( {

      // For debugging
      debugName: 'tool',

      // Node options
      cursor: 'pointer',

      // pdom
      tagName: 'div',
      focusable: true,

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    assert && assert( !options.visibleProperty, 'MeasurementToolNode sets visibleProperty' );
    options.visibleProperty = new DerivedProperty( [ tool.isSelectedProperty, domainProperty ],
      ( isSelected, domain ) => ( isSelected && relevantDomains.includes( domain ) ), {
        tandem: options.tandem.createTandem( 'visibleProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( BooleanIO )
      } );

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

    // Constrained dragging of the tool. Some tools (e.g. calipers) may be wider than the ScreenView, so we cannot
    // constrain the entire tool to be within the drag bounds. So just the origin is constrained.
    const dragListener = new DragListener( {
      positionProperty: positionProperty,
      dragBoundsProperty: dragBoundsProperty
    } );
    this.addInputListener( dragListener );

    // Emphasize the associated harmonic while interacting with this tool.
    dragListener.isHighlightedProperty.lazyLink( isHighlighted => {
      const harmonic = harmonicProperty.value;
      phet.log && phet.log( `${options.debugName} isHighlighted=${isHighlighted} n=${harmonic.order}` );
      if ( isHighlighted ) {
        emphasizedHarmonics.push( this, harmonic );
      }
      else if ( emphasizedHarmonics.includesNode( this ) ) {
        emphasizedHarmonics.remove( this );
      }
    } );

    // Move the tool to its position.
    positionProperty.link( position => {
      this.translation = position;
    } );

    // Update the tool to match the selected harmonic.
    harmonicProperty.lazyLink( () => {
      this.interruptSubtreeInput();
      updateNodes();
    } );

    // Interrupt interaction when visibility changes.
    this.visibleProperty.link( () => this.interruptSubtreeInput() );

    // If the tool's origin is outside the drag bounds, move it inside.
    dragBoundsProperty.link( dragBounds => {
      if ( !dragBounds.containsPoint( positionProperty.value ) ) {
        this.interruptSubtreeInput();
        positionProperty.value = dragBounds.closestPointTo( positionProperty.value );
      }
    } );

    // pdom - dragging using the keyboard
    const keyboardDragListener = new KeyboardDragListener( {
      positionProperty: positionProperty,
      dragBounds: dragBoundsProperty.value,
      dragVelocity: 100, // velocity - change in position per second
      shiftDragVelocity: 20 // finer-grained
    } );
    this.addInputListener( keyboardDragListener );

    // @public
    this.positionProperty = positionProperty;
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