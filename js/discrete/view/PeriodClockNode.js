// Copyright 2020, University of Colorado Boulder

//TODO factor out stuff related to DragListener that this shares with LengthToolNode
/**
 * PeriodClockNode is the measurement tool for period in the 'space & time' domain. It looks like a clock, with a
 * portion of the clock face filled in with the harmonic's color.  The portion filled in represents the portion of
 * the harmonic's period that has elapsed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ObservableArrayDef from '../../../../axon/js/ObservableArrayDef.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import DragBoundsProperty from '../../../../scenery-phet/js/DragBoundsProperty.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Color from '../../../../scenery/js/util/Color.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import Harmonic from '../../common/model/Harmonic.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import Domain from '../model/Domain.js';

class PeriodClockNode extends HBox {

  /**
   * @param {Harmonic[]} harmonics
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Property.<number>} orderProperty - order of the harmonic to be measured
   * @param {Property.<boolean>} selectedProperty
   * @param {Property.<number>} tProperty
   * @param {ObservableArrayDef} emphasizedHarmonics
   * @param {Property.<Bounds2>} dragBoundsProperty
   * @param {Object} [options]
   */
  constructor( harmonics, domainProperty, orderProperty, selectedProperty, tProperty, emphasizedHarmonics, dragBoundsProperty, options ) {

    assert && assert( Array.isArray( harmonics ), 'invalid harmonics' );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertPropertyOf( orderProperty, 'number' );
    assert && AssertUtils.assertPropertyOf( selectedProperty, 'boolean' );
    assert && AssertUtils.assertPropertyOf( tProperty, 'number' );
    assert && assert( ObservableArrayDef.isObservableArray( emphasizedHarmonics ), 'invalid emphasizedHarmonics' );
    assert && AssertUtils.assertPropertyOf( dragBoundsProperty, Bounds2 );

    options = merge( {
      cursor: 'pointer',
      spacing: 5
    }, options );

    const harmonicProperty = new Property( harmonics[ orderProperty.value ] );

    const clockFaceNode = new ClockFaceNode( harmonicProperty, tProperty );

    const labelNode = new RichText( '', {
      font: FMWConstants.TOOL_LABEL_FONT
    } );

    // A translucent background for the label
    const backgroundNode = new Rectangle( 0, 0, 1, 1, {
      fill: Color.grayColor( 255, 0.75 )
    } );

    // Resize the background to fit the label, and keep label centered in background.
    // unlink is not needed.
    labelNode.localBoundsProperty.link( () => {
      backgroundNode.setRect( 0, 0, 1.2 * labelNode.width, 1.1 * labelNode.height );
      backgroundNode.center = labelNode.center;
    } );

    assert && assert( !options.children, 'PeriodClockNode sets children' );
    options.children = [ clockFaceNode, new Node( { children: [ backgroundNode, labelNode ] } ) ];

    super( options );

    // Display the period for the selected harmonic. unlink is not needed.
    orderProperty.link( order => {
      this.interruptSubtreeInput();
      harmonicProperty.value = harmonics[ order - 1 ];
    } );

    harmonicProperty.link( harmonic => {
      labelNode.text = `${FMWSymbols.T}<sub>${harmonic.order}</sub>`;
    } );

    // Visibility, unmultilink is not needed.
    Property.multilink( [ selectedProperty, domainProperty ],
      ( selected, domain ) => {
        this.interruptSubtreeInput();
        this.visible = selected && ( domain === Domain.SPACE_AND_TIME );
      } );

    const positionProperty = new Property( this.translation );
    positionProperty.lazyLink( position => {
      this.translation = position;
    } );

    const derivedDragBoundsProperty = new DragBoundsProperty( this, dragBoundsProperty );

    // If the tool is outside the drag bounds, move it inside.
    derivedDragBoundsProperty.link( derivedDragBounds => {
      if ( !derivedDragBounds.containsPoint( positionProperty.value ) ) {
        this.interruptSubtreeInput();
        positionProperty.value = derivedDragBounds.closestPointTo( positionProperty.value );
      }
    } );

    const dragListener = new DragListener( {
      positionProperty: positionProperty,
      dragBoundsProperty: derivedDragBoundsProperty
    } );
    this.addInputListener( dragListener ); // removeInputListener is not needed.

    // Emphasize the associated harmonic.
    dragListener.isHighlightedProperty.link( isHighlighted => {
      if ( isHighlighted ) {
        emphasizedHarmonics.push( harmonicProperty.value );
      }
      else {
        if ( emphasizedHarmonics.includes( harmonicProperty.value ) ) {
          emphasizedHarmonics.remove( harmonicProperty.value );
        }
      }
    } );
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