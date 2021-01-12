// Copyright 2020, University of Colorado Boulder

//TODO factor out stuff that this shares with WidthToolNode
/**
 * PeriodClockNode is the measurement tool for period in the 'space & time' domain. It looks like a clock, with a
 * portion of the clock face filled in with the harmonic's color.  The portion filled in represents the portion of
 * the harmonic's period that has elapsed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import DragBoundsProperty from '../../../../scenery-phet/js/DragBoundsProperty.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Color from '../../../../scenery/js/util/Color.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import Harmonic from '../../common/model/Harmonic.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import DiscreteModel from '../model/DiscreteModel.js';
import Domain from '../model/Domain.js';

// Margins for the translucent background behind the label
const BACKGROUND_X_MARGIN = 2;
const BACKGROUND_Y_MARGIN = 2;

class PeriodClockNode extends Node {

  /**
   * @param {DiscreteModel} model
   * @param {Property.<Bounds2>} dragBoundsProperty
   * @param {Object} [options]
   */
  constructor( model, dragBoundsProperty, options ) {

    assert && assert( model instanceof DiscreteModel, 'invalid model' );
    assert && AssertUtils.assertPropertyOf( dragBoundsProperty, Bounds2 );

    options = merge( {
      cursor: 'pointer'
    }, options );

    // The harmonic associated with this tool
    const harmonicProperty = new DerivedProperty(
      [ model.periodToolOrderProperty ],
      order => model.fourierSeries.harmonics[ order - 1 ]
    );

    const clockFaceNode = new ClockFaceNode( harmonicProperty, model.tProperty );

    const labelNode = new RichText( '', {
      font: FMWConstants.TOOL_LABEL_FONT,
      maxWidth: 50
    } );

    // A translucent background for the label
    const backgroundNode = new Rectangle( 0, 0, 1, 1, {
      fill: Color.grayColor( 255, 0.75 )
    } );

    assert && assert( !options.children, 'PeriodClockNode sets children' );
    options.children = [ clockFaceNode, backgroundNode, labelNode ];

    super( options );

    // @private
    this.emphasizedHarmonics = model.chartsModel.emphasizedHarmonics;
    this.harmonicProperty = harmonicProperty;
    this.clockFaceNode = clockFaceNode;
    this.labelNode = labelNode;
    this.backgroundNode = backgroundNode;

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

    // Display the period for the selected harmonic. unlink is not needed.
    harmonicProperty.link( () => {
      this.interruptDrag();
      this.update();
    } );

    // Visibility, unmultilink is not needed.
    Property.multilink( [ model.periodToolSelectedProperty, model.domainProperty ],
      ( selected, domain ) => {
        this.interruptDrag();
        this.visible = selected && ( domain === Domain.SPACE_AND_TIME );
      } );

    // If ( isPressed || isHovering ), emphasize the associated harmonic. unlink is not needed.
    this.dragListener.isHighlightedProperty.link( isHighlighted => {
      const harmonic = harmonicProperty.value;
      if ( isHighlighted ) {
        model.chartsModel.emphasizedHarmonics.push( harmonic );
      }
      else if ( model.chartsModel.emphasizedHarmonics.includes( harmonic ) ) {
        model.chartsModel.emphasizedHarmonics.remove( harmonic );
      }
    } );

    // If the tool is outside the drag bounds, move it inside. unlink is not needed.
    derivedDragBoundsProperty.link( derivedDragBounds => {
      if ( !derivedDragBounds.containsPoint( positionProperty.value ) ) {
        this.interruptDrag();
        positionProperty.value = derivedDragBounds.closestPointTo( positionProperty.value );
      }
    } );

    // Synchronize visibility of the clock face, so we can short-circuit updates while it's invisible.
    this.visibleProperty.link( visible => {
      clockFaceNode.visible = visible;
    } );
  }

  /**
   * Updates the tool to match the selected harmonic.
   * @private
   */
  update() {

    const order = this.harmonicProperty.value.order;

    // Change the label
    this.labelNode.text = `${FMWSymbols.T}<sub>${order}</sub>`;
    this.labelNode.left = this.clockFaceNode.right + BACKGROUND_X_MARGIN + 2;
    this.labelNode.centerY = this.clockFaceNode.centerY;

    // Resize the background to fit the label, and keep label centered in background.
    this.backgroundNode.setRect( 0, 0, this.labelNode.width + 2 * BACKGROUND_X_MARGIN, this.labelNode.height + 2 * BACKGROUND_Y_MARGIN );
    this.backgroundNode.center = this.labelNode.center;
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

/**
 * ClockFaceNode displays a clock face, with a portion of the clock face filled in with a harmonic's color.
 * The portion filled in represents the portion of the harmonic's period that has elapsed.
 */
class ClockFaceNode extends Node {

  /**
   * @param {Property.<Harmonic>} harmonicProperty
   * @param {Property.<number>} tProperty
   * @param [options]
   */
  constructor( harmonicProperty, tProperty, options ) {

    assert && AssertUtils.assertPropertyOf( harmonicProperty, Harmonic );
    assert && AssertUtils.assertPropertyOf( tProperty, 'number' );

    options = merge( {
      radius: 15
    }, options );

    // White background circle
    const backgroundNode = new Circle( options.radius, {
      fill: 'white'
    } );

    // Partial circle filled with the harmonic's color
    const elapsedTimeNode = new Path( null, {
      fill: harmonicProperty.value.colorProperty,
      stroke: 'black',
      lineWidth: 0.5
    } );

    // Black rim in the foreground, to hide any seams
    const rimNode = new Circle( options.radius, {
      stroke: 'black',
      lineWidth: 2
    } );

    assert && assert( !options.children, 'ClockFaceNode sets children' );
    options.children = [ backgroundNode, elapsedTimeNode, rimNode ];

    super( options );

    // When the harmonic changes, update the color used to fill in the elapsed time, and
    // update the elapsed time to correspond to the new harmonic's period at the current time t.
    // unlink is not needed.
    harmonicProperty.link( harmonic => {
      elapsedTimeNode.fill = harmonic.colorProperty;
      if ( this.visible ) {
        elapsedTimeNode.shape = createElapsedTimeShape( harmonic, tProperty.value, options.radius );
      }
    } );

    // When the time changes while the tool is visible, update the elapsed time to correspond to the harmonic's period
    // at the current time t. unlink is not needed.
    tProperty.link( t => {
      if ( this.visible ) {
        elapsedTimeNode.shape = createElapsedTimeShape( harmonicProperty.value, t, options.radius );
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

/**
 * Creates a partially filled clock face, which represents the portion of a harmonic's period that has elapsed.
 * @param {Harmonic} harmonic
 * @param {number} t
 * @param {number} radius
 * @returns {Shape}
 */
function createElapsedTimeShape( harmonic, t, radius ) {

  assert && assert( harmonic instanceof Harmonic, 'invalid harmonic' );
  assert && assert( typeof t === 'number' && t >= 0, 'invalid t' );
  assert && assert( typeof radius === 'number' && radius > 0, 'invalid radius' );

  const percentTime = ( t % harmonic.period ) / harmonic.period;
  const startAngle = -Math.PI / 2; // 12:00
  const endAngle = startAngle + ( percentTime * 2 * Math.PI );
  return new Shape()
    .moveTo( 0, 0 )
    .arc( 0, 0, radius, startAngle, endAngle )
    .close();
}

fourierMakingWaves.register( 'PeriodClockNode', PeriodClockNode );
export default PeriodClockNode;