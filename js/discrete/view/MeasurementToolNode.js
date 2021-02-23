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
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import EmphasizedHarmonics from '../../common/model/EmphasizedHarmonics.js';
import Harmonic from '../../common/model/Harmonic.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import Domain from '../model/Domain.js';
import MeasurementTool from '../model/MeasurementTool.js';

class MeasurementToolNode extends Node {

  /**
   * @param {MeasurementTool} tool
   * @param {Property.<Harmonic>} harmonicProperty
   * @param {ObservableArrayDef.<Harmonic>} emphasizedHarmonics
   * @param {Property.<Bounds2>} visibleBoundsProperty - visible bounds of the associated ScreenView
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Domain[]} relevantDomains - the Domain values that are relevant for this tool
   * @param {function} updateNodes - updates this tool's child Nodes to match the selected harmonic
   * @param {Object} [options]
   */
  constructor( tool, harmonicProperty, emphasizedHarmonics, visibleBoundsProperty, domainProperty, relevantDomains,
               updateNodes, options ) {

    assert && assert( tool instanceof MeasurementTool, 'invalid tool' );
    assert && AssertUtils.assertPropertyOf( harmonicProperty, Harmonic );
    assert && assert( emphasizedHarmonics instanceof EmphasizedHarmonics, 'invalid emphasizedHarmonics' );
    assert && AssertUtils.assertPropertyOf( visibleBoundsProperty, Bounds2 );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && assert( Array.isArray( relevantDomains ), 'invalid relevantDomains' );
    assert && assert( typeof updateNodes === 'function', 'invalid updateNodes' );

    options = merge( {

      // For debugging
      debugName: 'tool',

      // {Property.<Bounds2>|null} dragging is constrained to these bounds. If null, default is set below.
      dragBoundsProperty: null,

      // Node options
      cursor: 'pointer',

      // phet-io
      visiblePropertyOptions: { phetioReadOnly: true },
      tandem: Tandem.REQUIRED
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

    // Constrained dragging of the tool
    const dragListener = new DragListener( {
      positionProperty: positionProperty,
      dragBoundsProperty: dragBoundsProperty
    } );
    this.addInputListener( dragListener ); // removeInputListener is not needed.

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

    // Move the tool to its position. unlink is not needed.
    positionProperty.link( position => {
      this.translation = position;
    } );

    // Update the tool to match the selected harmonic. unlink is not needed.
    harmonicProperty.lazyLink( () => {
      this.interruptSubtreeInput();
      updateNodes();
    } );

    // Visibility, unmultilink is not needed.
    Property.multilink( [ tool.isSelectedProperty, domainProperty ],
      ( isSelected, domain ) => {
        this.interruptSubtreeInput();
        this.visible = ( isSelected && relevantDomains.includes( domain ) );
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