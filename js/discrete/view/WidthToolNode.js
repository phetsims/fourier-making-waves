// Copyright 2020, University of Colorado Boulder

/**
 * WidthToolNode is the base class for tools used to measure a quantity of a harmonic that has a width.
 * Responsible for synchronizing with the selected harmonic, and for its own visibility.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
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
import Color from '../../../../scenery/js/util/Color.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

// Margins for the translucent background behind the label
const BACKGROUND_X_MARGIN = 2;
const BACKGROUND_Y_MARGIN = 2;

class WidthToolNode extends Node {

  /**
   * @param {string} symbol
   * @param {Harmonic[]} harmonics
   * @param {ObservableArrayDef.<Harmonic>} emphasizedHarmonics
   * @param {Property.<number>} orderProperty - order of the harmonic to be measured
   * @param {ChartTransform} chartTransform
   * @param {Property.<Bounds2>} dragBoundsProperty
   * @param {function(harmonic:Harmonic):number} getModelValue
   * @param {Object} [options]
   */
  constructor( symbol, harmonics, emphasizedHarmonics, orderProperty, chartTransform, dragBoundsProperty, getModelValue, options ) {

    assert && assert( typeof symbol === 'string', 'invalid symbol' );
    assert && assert( Array.isArray( harmonics ), 'invalid harmonics' );
    assert && assert( ObservableArrayDef.isObservableArray( emphasizedHarmonics ), 'invalid emphasizedHarmonics' );
    assert && AssertUtils.assertPropertyOf( orderProperty, 'number' );
    assert && assert( chartTransform instanceof ChartTransform, 'invalid chartTransform' );
    assert && AssertUtils.assertPropertyOf( dragBoundsProperty, Bounds2 );
    assert && assert( typeof getModelValue === 'function', 'invalid getModelValue' );

    options = merge( {
      cursor: 'pointer'
    }, options );

    // The harmonic associated with this tool
    const harmonicProperty = new DerivedProperty(
      [ orderProperty ],
      order => harmonics[ order - 1 ]
    );

    // Horizontal beam
    const beamNode = new Path( null, {
      stroke: 'black'
    } );

    // Label above the beam
    const labelNode = new RichText( '', {
      font: FMWConstants.TOOL_LABEL_FONT,
      maxWidth: 50
    } );

    // A translucent background for the label
    const backgroundNode = new Rectangle( 0, 0, 1, 1, {
      fill: Color.grayColor( 255, 0.75 ),
      center: labelNode.center
    } );

    assert && assert( !options.children, 'PeriodClockNode sets children' );
    options.children = [ beamNode, backgroundNode, labelNode ];

    super( options );

    // @private
    this.symbol = symbol;
    this.chartTransform = chartTransform;
    this.emphasizedHarmonics = emphasizedHarmonics;
    this.getModelValue = getModelValue;
    this.viewValue = 0;
    this.harmonicProperty = harmonicProperty;
    this.beamNode = beamNode;
    this.labelNode = labelNode;
    this.backgroundNode = backgroundNode;

    // Initialize
    this.update();

    // Update when the range of the associated axis changes. removeListener is not needed.
    chartTransform.changedEmitter.addListener( () => this.update() );

    const positionProperty = new Property( this.translation );

    const derivedDragBoundsProperty = new DragBoundsProperty( this, dragBoundsProperty );

    // @private
    this.dragListener = new DragListener( {
      positionProperty: positionProperty,
      dragBoundsProperty: derivedDragBoundsProperty
    } );
    this.addInputListener( this.dragListener ); // removeInputListener is not needed.

    // Move the tool to its position. unlink is not needed.
    positionProperty.lazyLink( position => {
      this.translation = position;
    } );

    // Update the tool to match the selected harmonic. unlink is not needed.
    harmonicProperty.link( () => {
      this.interruptDrag();
      this.update();
    } );

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
    derivedDragBoundsProperty.link( derivedDragBounds => {
      if ( !derivedDragBounds.containsPoint( positionProperty.value ) ) {
        this.interruptDrag();
        positionProperty.value = derivedDragBounds.closestPointTo( positionProperty.value );
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
   * Updates the tool to match the selected harmonic.
   * @private
   */
  update() {

    const harmonic = this.harmonicProperty.value;

    // Compute the value in view coordinates
    const modelValue = this.getModelValue( harmonic );
    const viewValue = this.chartTransform.modelToViewDeltaX( modelValue );

    // Update if the change is visually noticeable.
    if ( Math.abs( viewValue - this.viewValue ) > 0.25 ) {

      // The horizontal beam has ends that are caliper-like.
      // The Shape is described clockwise from the upper-left.
      const barThickness = 5;
      const caliperThickness = 5;
      const caliperLength = 20;
      this.beamNode.shape = new Shape()
        .moveTo( -caliperThickness, 0 )
        .lineTo( viewValue + caliperThickness, 0 )
        .lineTo( viewValue + caliperThickness, barThickness )
        .lineTo( viewValue, caliperLength )
        .lineTo( viewValue, barThickness )
        .lineTo( 0, barThickness )
        .lineTo( 0, caliperLength )
        .lineTo( -caliperThickness, barThickness )
        .close();
      this.beamNode.fill = harmonic.colorProperty;

      // Label is the symbol with harmonic order subscript
      this.labelNode.text = `${this.symbol}<sub>${harmonic.order}</sub>`;
      this.labelNode.centerX = this.beamNode.centerX;
      this.labelNode.bottom = this.beamNode.top - BACKGROUND_Y_MARGIN - 1;

      // Resize the translucent background and center it on the label
      this.backgroundNode.setRect( 0, 0, this.labelNode.width + 2 * BACKGROUND_X_MARGIN, this.labelNode.height + 2 * BACKGROUND_Y_MARGIN );
      this.backgroundNode.center = this.labelNode.center;

      // Do not adjust position. We want the left edge of the tool to remain where it was, since that is
      // the edge that the user should be positioning in order to measure the width of something.
    }
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

fourierMakingWaves.register( 'WidthToolNode', WidthToolNode );
export default WidthToolNode;