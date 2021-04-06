// Copyright 2020, University of Colorado Boulder

/**
 * AmplitudeSlider is a slider for changing the amplitude of a harmonic.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import PressListener from '../../../../scenery/js/listeners/PressListener.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Color from '../../../../scenery/js/util/Color.js';
import SliderTrack from '../../../../sun/js/SliderTrack.js';
import VSlider from '../../../../sun/js/VSlider.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWConstants from '../FMWConstants.js';
import EmphasizedHarmonics from '../model/EmphasizedHarmonics.js';
import Harmonic from '../model/Harmonic.js';

// constants
const TRACK_WIDTH = 40; // track height specified in constructor options
const THUMB_WIDTH = TRACK_WIDTH - 15;
const THUMB_HEIGHT = 8;

// flipped because VSlider rotates its subcomponents -90 degrees
const THUMB_TOUCH_AREA_DILATION = new Dimension2( 10, 4 ).flipped();
const THUMB_MOUSE_AREA_DILATION = new Dimension2( 10, 4 ).flipped();

class AmplitudeSlider extends VSlider {

  /**
   * @param {Harmonic} harmonic
   * @param {EmphasizedHarmonics} emphasizedHarmonics
   * @param {Object} [options]
   */
  constructor( harmonic, emphasizedHarmonics, options ) {

    assert && assert( harmonic instanceof Harmonic, 'invalid harmonic' );
    assert && assert( emphasizedHarmonics instanceof EmphasizedHarmonics, 'invalid emphasizedHarmonics' );

    options = merge( {

      // {function} called when there's a press anywhere on this Node
      press: _.noop,

      // {number} snap to this interval, unless the value is min or max
      snapInterval: FMWConstants.AMPLITUDE_SLIDER_SNAP_INTERVAL,

      // {number} height of the track
      trackHeight: 120,

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // flipped because VSlider rotates its subcomponents -90 degrees
    const thumbSize = new Dimension2( THUMB_WIDTH, THUMB_HEIGHT ).flipped();
    const trackSize = new Dimension2( TRACK_WIDTH, options.trackHeight ).flipped();

    const thumbNode = new GrippyThumb( thumbSize, harmonic );
    thumbNode.touchArea = thumbNode.localBounds.dilatedXY( THUMB_TOUCH_AREA_DILATION.width, THUMB_TOUCH_AREA_DILATION.height );
    thumbNode.mouseArea = thumbNode.localBounds.dilatedXY( THUMB_MOUSE_AREA_DILATION.width, THUMB_MOUSE_AREA_DILATION.height );

    // Constrain the range to the desired number of decimal places.
    const amplitudeRange = new Range(
      Utils.toFixedNumber( harmonic.amplitudeProperty.range.min, FMWConstants.AMPLITUDE_SLIDER_DECIMAL_PLACES ),
      Utils.toFixedNumber( harmonic.amplitudeProperty.range.max, FMWConstants.AMPLITUDE_SLIDER_DECIMAL_PLACES )
    );

    const trackNode = new BarTrack( trackSize, harmonic, amplitudeRange );

    assert && assert( !options.trackNode, 'AmplitudeSlider sets trackNode' );
    options.trackNode = trackNode;

    assert && assert( !options.thumbNode, 'AmplitudeSlider sets thumbNode' );
    options.thumbNode = thumbNode;

    assert && assert( !options.constrainValue, 'AmplitudeSlider sets constrainValue' );
    options.constrainValue = amplitude => {
      if ( amplitude !== amplitudeRange.min && amplitude !== amplitudeRange.max ) {
        amplitude = Utils.roundToInterval( amplitude, options.snapInterval );
      }
      return amplitude;
    };

    super( harmonic.amplitudeProperty, amplitudeRange, options );

    this.addInputListener( new PressListener( {
      attach: false,
      press: options.press
    } ) );

    // The associated harmonic is emphasized if we're interacting with either the thumb or the visible part of the track.
    const isEmphasizedProperty = new DerivedProperty(
      [ this.thumbDragListener.isHighlightedProperty, trackNode.isHighlightedProperty ],
      ( thumbIsHighlighted, trackIsHighlighted ) => ( thumbIsHighlighted || trackIsHighlighted )
    );

    // Emphasize the associated harmonic. unmultilink is not needed.
    isEmphasizedProperty.lazyLink( isEmphasized => {
      if ( isEmphasized ) {
        emphasizedHarmonics.push( this, harmonic );
      }
      else if ( emphasizedHarmonics.includesNode( this ) ) {
        emphasizedHarmonics.remove( this );
      }
    } );

    // When a slider becomes visible, interrupt any interaction that may be in progress.
    this.visibleProperty.link( visible => visible && this.interruptSubtreeInput() );
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
 * GrippyThumb is a custom thumb for AmplitudeSlider. It has grippy dots on it that are color-coded to the harmonic.
 */
class GrippyThumb extends Node {

  /**
   * @param {Dimension2} thumbSize
   * @param {Harmonic} harmonic
   */
  constructor( thumbSize, harmonic ) {

    assert && assert( thumbSize instanceof Dimension2, 'invalid thumbSize' );
    assert && assert( harmonic instanceof Harmonic, 'invalid harmonic' );

    const rectangle = new Rectangle( 0, 0, thumbSize.width, thumbSize.height, {
      fill: Color.grayColor( 200 ),
      stroke: 'black',
      lineWidth: 1,
      cornerRadius: 2
    } );

    // A row of dots, color-coded to the harmonic
    // Note that this code is actually drawing a column of dots, because VSlider rotates its thumb -90 degrees.
    const numberOfDots = 3;
    const xMargin = 2.5;
    const ySpacing = rectangle.height / ( numberOfDots + 1 );
    const dotRadius = ( rectangle.width - 2 * xMargin ) / 2;
    assert && assert( dotRadius > 0, 'invalid dotRadius' );
    const dotsShape = new Shape();
    for ( let i = 0; i < numberOfDots; i++ ) {
      const y = i * ySpacing;
      dotsShape.moveTo( dotRadius, y );
      dotsShape.arc( 0, y, dotRadius, 0, 2 * Math.PI );
    }
    const dotsNode = new Path( dotsShape, {
      fill: harmonic.colorProperty,
      stroke: 'black',
      lineWidth: 0.5,
      center: rectangle.center
    } );

    super( {
      children: [ rectangle, dotsNode ]
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
 * BarTrack is a custom track for AmplitudeSlider.  It fills a colored bar that grows up and down from
 * the center of the track.
 */
class BarTrack extends SliderTrack {

  /**
   * @param {Dimension2} trackSize
   * @param {Harmonic} harmonic
   * @param {Range} amplitudeRange
   */
  constructor( trackSize, harmonic, amplitudeRange ) {

    assert && assert( trackSize instanceof Dimension2, 'invalid trackSize' );
    assert && assert( harmonic instanceof Harmonic, 'invalid harmonic' );
    assert && assert( amplitudeRange instanceof Range, 'invalid amplitudeRange' );
    assert && assert( amplitudeRange.getCenter() === 0, 'implementation assumes that range is symmetric' );

    const invisibleTrackNode = new Rectangle( 0, 0, trackSize.width, trackSize.height, {
      fill: 'transparent',
      stroke: phet.chipper.queryParameters.dev ? 'red' : null,
      lineWidth: 0.25
    } );

    const visibleTrackNode = new Rectangle( 0, 0, trackSize.width, trackSize.height, {
      fill: harmonic.colorProperty,
      stroke: 'black',
      lineWidth: 1
    } );

    const trackNode = new Node( {
      children: [ invisibleTrackNode, visibleTrackNode ]
    } );

    super( trackNode, harmonic.amplitudeProperty, amplitudeRange, {
      size: new Dimension2( trackSize.width, trackSize.height )
    } );

    // When the amplitude changes, redraw the track to make it look like a bar extends up or down from amplitude = 0.
    // Note that this code is actually extending left or right, because VSlider rotates its track -90 degrees.
    const amplitudeListener = amplitude => {
      visibleTrackNode.visible = ( amplitude !== 0 );
      if ( amplitude === 0 ) {
        visibleTrackNode.setRect( 0, 0, 1, 1 );
      }
      else if ( amplitude > 0 ) {
        const trackWidth = ( trackSize.width / 2 ) * amplitude / amplitudeRange.max;
        visibleTrackNode.setRect( trackSize.width / 2, 0, trackWidth, trackSize.height );
      }
      else {
        const trackWidth = ( trackSize.width / 2 ) * amplitude / amplitudeRange.min;
        visibleTrackNode.setRect( ( trackSize.width / 2 ) - trackWidth, 0, trackWidth, trackSize.height );
      }
    };
    harmonic.amplitudeProperty.link( amplitudeListener ); // unlink is not needed.

    const visibleTrackPressListener = new PressListener( {
      attach: false // so that the DragListener for the track isn't ignored
    } );
    visibleTrackNode.addInputListener( visibleTrackPressListener );

    // @public This tells us when the track should be considered highlighted. We can't simply look at
    // this.dragListener.isHighlightedProperty, because that will include the invisible portion of the track.
    this.isHighlightedProperty = new DerivedProperty(
      [ this.dragListener.isPressedProperty, visibleTrackPressListener.isOverProperty ],
      ( isPressed, isOverVisible ) => ( isPressed || isOverVisible )
    );
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

fourierMakingWaves.register( 'AmplitudeSlider', AmplitudeSlider );
export default AmplitudeSlider;