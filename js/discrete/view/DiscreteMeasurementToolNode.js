// Copyright 2021-2023, University of Colorado Boulder

/**
 * DiscreteMeasurementToolNode is the base class for tools that are used to measure harmonics in the 'Discrete' screen.
 * Responsibilities include:
 * - positioning the tool
 * - visibility
 * - updating when the associated harmonic changes
 * - emphasizing the associated harmonic on ( isPressed || isHovering )
 * - dragging, constrained to dynamic drag bounds
 * - keeping the tool inside dynamic drag bounds
 * - interrupting a drag
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import { Circle, DragListener, KeyboardDragListener, Node } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import FMWQueryParameters from '../../common/FMWQueryParameters.js';
import EmphasizedHarmonics from '../../common/model/EmphasizedHarmonics.js';
import Harmonic from '../../common/model/Harmonic.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import DiscreteMeasurementTool from '../model/DiscreteMeasurementTool.js';

export default class DiscreteMeasurementToolNode extends Node {

  /**
   * @param {DiscreteMeasurementTool} tool
   * @param {ReadOnlyProperty.<Harmonic>} harmonicProperty
   * @param {EmphasizedHarmonics} emphasizedHarmonics
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Domain[]} relevantDomains - the Domain values that are relevant for this tool
   * @param {Object} [options]
   */
  constructor( tool, harmonicProperty, emphasizedHarmonics, domainProperty, relevantDomains, options ) {

    assert && assert( tool instanceof DiscreteMeasurementTool );
    assert && AssertUtils.assertAbstractPropertyOf( harmonicProperty, Harmonic );
    assert && assert( emphasizedHarmonics instanceof EmphasizedHarmonics );
    assert && assert( domainProperty instanceof EnumerationProperty );
    assert && assert( Array.isArray( relevantDomains ) );

    options = merge( {

      position: new Vector2( 0, 0 ),
      dragBounds: null, // {Bounds2|null}

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

    assert && assert( !options.visibleProperty, 'DiscreteMeasurementToolNode sets visibleProperty' );
    options.visibleProperty = new DerivedProperty( [ tool.isSelectedProperty, domainProperty ],
      ( isSelected, domain ) => ( isSelected && relevantDomains.includes( domain ) ), {
        tandem: options.tandem.createTandem( 'visibleProperty' ),
        phetioValueType: BooleanIO
      } );

    super( options );

    // @private
    this.harmonicProperty = harmonicProperty;
    this.emphasizedHarmonics = emphasizedHarmonics;

    // Show a red dot at the tool's origin.
    if ( FMWQueryParameters.debugTools ) {
      this.addChild( new Circle( 2, { fill: 'red' } ) );
    }

    const positionProperty = new Vector2Property( options.position, {
      tandem: options.tandem.createTandem( 'positionProperty' ),
      phetioDocumentation: 'position of this tool, in view coordinates'
    } );
    positionProperty.link( position => {
      this.translation = position;
    } );

    // {Property.<Bounds2>} This is a fixed value, but DragListener requires a Property.
    const dragBoundsProperty = new Property( options.dragBounds, {
      validValues: [ options.dragBounds ]
    } );

    // Constrained dragging of the tool. Some tools (e.g. calipers) may be wider than the ScreenView, so we cannot
    // constrain the entire tool to be within the drag bounds. So just the origin is constrained.
    const dragListener = new DragListener( {
      positionProperty: positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      tandem: options.tandem.createTandem( 'dragListener' ),
      phetioEnabledPropertyInstrumented: true
    } );
    this.addInputListener( dragListener );

    // Whether this slider has keyboard focus.
    const hasFocusProperty = new BooleanProperty( this.focused );
    this.addInputListener( {
      focus: () => { hasFocusProperty.value = true; },
      blur: () => { hasFocusProperty.value = false; }
    } );

    // {DerivedProperty.<boolean>}
    // The associated harmonic is emphasized if we're interacting with the tool in some way.
    const isEmphasizedProperty = DerivedProperty.or( [ dragListener.isHighlightedProperty, hasFocusProperty ] );

    // Emphasize the associated harmonic while interacting with this tool.
    isEmphasizedProperty.lazyLink( isEmphasized => {
      const harmonic = harmonicProperty.value;
      phet.log && phet.log( `${options.debugName} isEmphasized=${isEmphasized} n=${harmonic.order}` );
      if ( isEmphasized ) {
        emphasizedHarmonics.push( this, harmonic );
      }
      else if ( emphasizedHarmonics.includesNode( this ) ) {
        emphasizedHarmonics.remove( this );
      }
    } );

    // Interrupt interaction
    harmonicProperty.lazyLink( () => this.interruptSubtreeInput() );
    this.visibleProperty.lazyLink( () => this.interruptSubtreeInput() );

    // pdom - dragging using the keyboard
    const keyboardDragListener = new KeyboardDragListener( {
      positionProperty: positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      dragVelocity: 100, // velocity - change in position per second
      shiftDragVelocity: 20, // finer-grained
      tandem: options.tandem.createTandem( 'keyboardDragListener' )
    } );
    this.addInputListener( keyboardDragListener );

    // @public
    this.positionProperty = positionProperty; // {Property.<Vector2>}
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
   * @public
   */
  reset() {
    this.positionProperty.reset();
  }
}

fourierMakingWaves.register( 'DiscreteMeasurementToolNode', DiscreteMeasurementToolNode );