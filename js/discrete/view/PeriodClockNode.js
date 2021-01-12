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
      cursor: 'pointer',
      spacing: 5
    }, options );

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
    harmonicProperty.link( harmonic => {
      this.interruptDrag();

      // Change the label
      labelNode.text = `${FMWSymbols.T}<sub>${harmonic.order}</sub>`;
      labelNode.left = clockFaceNode.right + 6;
      labelNode.centerY = clockFaceNode.centerY;

      // Resize the background to fit the label, and keep label centered in background.
      backgroundNode.setRect( 0, 0, 1.2 * labelNode.width, 1.1 * labelNode.height );
      backgroundNode.center = labelNode.center;
    } );

    // Visibility, unmultilink is not needed.
    Property.multilink( [ model.periodToolSelectedProperty, model.domainProperty ],
      ( selected, domain ) => {
        this.interruptDrag();
        this.visible = selected && ( domain === Domain.SPACE_AND_TIME );
      } );

    // If ( isPressed || isHovering ), emphasize the associated harmonic. unlink is not needed.
    this.dragListener.isHighlightedProperty.link( isHighlighted => {
      if ( isHighlighted ) {
        model.chartsModel.emphasizedHarmonics.push( harmonicProperty.value );
      }
      else if ( model.chartsModel.emphasizedHarmonics.includes( harmonicProperty.value ) ) {
        model.chartsModel.emphasizedHarmonics.remove( harmonicProperty.value );
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
   * Interrupts a drag and ensures that the associated harmonic is no longer emphasized.
   * @protected
   */
  interruptDrag() {
    if ( this.dragListener.isPressed ) {
      this.interruptSubtreeInput();
      if ( this.emphasizedHarmonics.includes( this.harmonic ) ) {
        this.emphasizedHarmonics.remove( this.harmonic );
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
      elapsedTimeNode.shape = createElapsedTimeShape( harmonic, tProperty.value, options.radius );
    } );

    // When the time changes, update the elapsed time to correspond to the harmonic's period at the current time t.
    // unlink is not needed.
    tProperty.link( t => {
      elapsedTimeNode.shape = createElapsedTimeShape( harmonicProperty.value, t, options.radius );
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