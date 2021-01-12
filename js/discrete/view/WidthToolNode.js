// Copyright 2020, University of Colorado Boulder

/**
 * WidthToolNode is the base class for tools used to measure a quantity of a harmonic that has a width.
 * Responsible for synchronizing with the selected harmonic, and for its own visibility.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ObservableArrayDef from '../../../../axon/js/ObservableArrayDef.js';
import Property from '../../../../axon/js/Property.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import DragBoundsProperty from '../../../../scenery-phet/js/DragBoundsProperty.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Color from '../../../../scenery/js/util/Color.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import Domain from '../model/Domain.js';

class WidthToolNode extends VBox {

  /**
   * @param {string} symbol
   * @param {ChartTransform} chartTransform
   * @param {Harmonic[]} harmonics
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Property.<number>} orderProperty - order of the harmonic to be measured
   * @param {Property.<boolean>} selectedProperty - whether the tool is selected
   * @param {ObservableArrayDef} emphasizedHarmonics
   * @param {Property.<Bounds2>} dragBoundsProperty
   * @param {function(harmonic:Harmonic):number} getModelValue
   * @param {function(selected:boolean, domain:Domain):boolean} getVisible
   * @param {Object} [options]
   */
  constructor( symbol, chartTransform, harmonics, domainProperty, orderProperty, selectedProperty,
               emphasizedHarmonics, dragBoundsProperty, getModelValue, getVisible, options ) {

    assert && assert( typeof symbol === 'string', 'invalid symbol' );
    assert && assert( chartTransform instanceof ChartTransform, 'invalid chartTransform' );
    assert && assert( Array.isArray( harmonics ), 'invalid harmonics' );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertPropertyOf( orderProperty, 'number' );
    assert && AssertUtils.assertPropertyOf( selectedProperty, 'boolean' );
    assert && assert( ObservableArrayDef.isObservableArray( emphasizedHarmonics ), 'invalid emphasizedHarmonics' );
    assert && AssertUtils.assertPropertyOf( dragBoundsProperty, Bounds2 );
    assert && assert( typeof getModelValue === 'function', 'invalid getModelValue' );
    assert && assert( typeof getVisible === 'function', 'invalid getVisible' );

    options = merge( {
      spacing: 2, // between label and tool
      cursor: 'pointer'
    }, options );

    super();

    // @private
    this.chartTransform = chartTransform;
    this.symbol = symbol;
    this.getModelValue = getModelValue;
    this.harmonic = harmonics[ orderProperty.value ];
    this.viewValue = 0;

    // Initialize
    this.update();

    // mutate after initializing, so that transform options work correctly
    this.mutate( options );

    // Update when the range of the associated axis changes. removeListener is not needed.
    chartTransform.changedEmitter.addListener( () => this.update() );

    const positionProperty = new Property( this.translation );

    const derivedDragBoundsProperty = new DragBoundsProperty( this, dragBoundsProperty );

    const dragListener = new DragListener( {
      positionProperty: positionProperty,
      dragBoundsProperty: derivedDragBoundsProperty
    } );
    this.addInputListener( dragListener ); // removeInputListener is not needed.

    // Interrupts a drag and ensures that the associated harmonic is no longer emphasized.
    function interruptDrag() {
      if ( dragListener.isPressed ) {
        this.interruptSubtreeInput();
        if ( emphasizedHarmonics.includes( this.harmonic ) ) {
          emphasizedHarmonics.remove( this.harmonic );
        }
      }
    }

    // Move the tool to its position. unlink is not needed.
    positionProperty.lazyLink( position => {
      this.translation = position;
    } );

    // Visibility, unmultilink is not needed.
    Property.multilink( [ selectedProperty, domainProperty ],
      ( selected, domain ) => {
        interruptDrag();
        this.visible = getVisible( selected, domain );
      } );

    // Update the tool to match the selected harmonic. unlink is not needed.
    orderProperty.link( order => {
      interruptDrag();
      this.harmonic = harmonics[ order - 1 ];
      this.viewValue = 0; // to force an update, in case 2 harmonics had the same value but different colors
      this.update();
    } );

    // If ( isPressed || isHovering ), emphasize the associated harmonic. unlink is not needed.
    dragListener.isHighlightedProperty.link( isHighlighted => {
      if ( isHighlighted ) {
        emphasizedHarmonics.push( this.harmonic );
      }
      else if ( emphasizedHarmonics.includes( this.harmonic ) ) {
        emphasizedHarmonics.remove( this.harmonic );
      }
    } );

    // If the tool is outside the drag bounds, move it inside. unlink is not needed.
    derivedDragBoundsProperty.link( derivedDragBounds => {
      if ( !derivedDragBounds.containsPoint( positionProperty.value ) ) {
        interruptDrag();
        positionProperty.value = derivedDragBounds.closestPointTo( positionProperty.value );
      }
    } );
  }

  // @private
  update() {

    // Compute the value in view coordinates
    const modelValue = this.getModelValue( this.harmonic );
    const viewValue = this.chartTransform.modelToViewDeltaX( modelValue );

    // Update if the change is visually noticeable.
    if ( Math.abs( viewValue - this.viewValue ) > 0.25 ) {

      // The main part of the tool is a horizontal bar, whose ends are caliper-like.
      // The Shape is described clockwise from the upper-left.
      const barThickness = 5;
      const caliperThickness = 5;
      const caliperLength = 20;
      const toolShape = new Shape()
        .moveTo( -caliperThickness, 0 )
        .lineTo( viewValue + caliperThickness, 0 )
        .lineTo( viewValue + caliperThickness, barThickness )
        .lineTo( viewValue, caliperLength )
        .lineTo( viewValue, barThickness )
        .lineTo( 0, barThickness )
        .lineTo( 0, caliperLength )
        .lineTo( -caliperThickness, barThickness )
        .close();
      const toolNode = new Path( toolShape, {
        fill: this.harmonic.colorProperty,
        stroke: 'black'
      } );

      // Label is the symbol with harmonic order subscript
      const labelNode = new RichText( `${this.symbol}<sub>${this.harmonic.order}</sub>`, {
        font: FMWConstants.TOOL_LABEL_FONT
      } );

      // A translucent background for the label
      const backgroundNode = new Rectangle( 0, 0, 1.2 * labelNode.width, 1.1 * labelNode.height, {
        fill: Color.grayColor( 255, 0.75 ),
        center: labelNode.center
      } );

      this.children = [ new Node( { children: [ backgroundNode, labelNode ] } ), toolNode ];

      // No not adjust position. We want the left edge of the tool to remain where it was, since that is
      // the edge that the user should be positioning in order to measure the width of something.
    }
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

fourierMakingWaves.register( 'WidthToolNode', WidthToolNode );
export default WidthToolNode;