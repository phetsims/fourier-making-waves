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
import Orientation from '../../../../phet-core/js/Orientation.js';
import PressListener from '../../../../scenery/js/listeners/PressListener.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Color from '../../../../scenery/js/util/Color.js';
import Slider from '../../../../sun/js/Slider.js';
import SliderTrack from '../../../../sun/js/SliderTrack.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWConstants from '../FMWConstants.js';
import EmphasizedHarmonics from '../model/EmphasizedHarmonics.js';
import Harmonic from '../model/Harmonic.js';
import AudibleSlider from './AudibleSlider.js';

// constants
const TRACK_WIDTH = 40; // track height specified in constructor options
const THUMB_WIDTH = TRACK_WIDTH - 15;
const THUMB_HEIGHT = 8;

// Dimension2 instances must be swapped, because VSlider rotates its thumb and track -90 degrees. So we'll specify the
// dimensions related to our custom thumb and track in vertical orientation, create our custom thumb and track in
// horizontal orientation, and Slider will rotate them into vertical orientation. Pretty gross, eh?
const THUMB_TOUCH_AREA_DILATION = new Dimension2( 10, 4 ).swapped();
const THUMB_MOUSE_AREA_DILATION = new Dimension2( 10, 4 ).swapped();

class AmplitudeSlider extends AudibleSlider {

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

      // AudibleSlider options
      orientation: Orientation.VERTICAL,

      // pdom
      keyboardStep: FMWConstants.AMPLITUDE_SLIDER_SNAP_INTERVAL,
      shiftKeyboardStep: 1 / Math.pow( 10, FMWConstants.AMPLITUDE_SLIDER_DECIMAL_PLACES ), // finer grain
      pageKeyboardStep: 2 * FMWConstants.AMPLITUDE_SLIDER_SNAP_INTERVAL, // coarser grain

      // phet-io
      tandem: Tandem.REQUIRED
    }, options );

    // Constrain the range to the desired number of decimal places.
    const amplitudeRange = new Range(
      Utils.toFixedNumber( harmonic.amplitudeProperty.range.min, FMWConstants.AMPLITUDE_SLIDER_DECIMAL_PLACES ),
      Utils.toFixedNumber( harmonic.amplitudeProperty.range.max, FMWConstants.AMPLITUDE_SLIDER_DECIMAL_PLACES )
    );

    // See note above about what swapped is necessary.
    const thumbSize = new Dimension2( THUMB_WIDTH, THUMB_HEIGHT ).swapped();
    const trackSize = new Dimension2( TRACK_WIDTH, options.trackHeight ).swapped();

    // Custom thumb
    const thumbNode = new GrippyThumb( thumbSize, harmonic, {
      tandem: options.tandem.createTandem( Slider.THUMB_NODE_TANDEM_NAME )
    } );
    thumbNode.touchArea = thumbNode.localBounds.dilatedXY( THUMB_TOUCH_AREA_DILATION.width, THUMB_TOUCH_AREA_DILATION.height );
    thumbNode.mouseArea = thumbNode.localBounds.dilatedXY( THUMB_MOUSE_AREA_DILATION.width, THUMB_MOUSE_AREA_DILATION.height );
    assert && assert( !options.thumbNode, 'AmplitudeSlider sets thumbNode' );
    options.thumbNode = thumbNode;

    // Custom track
    const trackNode = new BarTrack( harmonic, amplitudeRange, {
      size: trackSize,
      tandem: options.tandem.createTandem( Slider.TRACK_NODE_TANDEM_NAME )
    } );
    assert && assert( !options.trackNode, 'AmplitudeSlider sets trackNode' );
    options.trackNode = trackNode;

    //TODO https://github.com/phetsims/sun/issues/698 constrainValue is overriding shiftKeyboardStep
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

    //TODO is this necessary, or does scenery interrupt when a Node becomes invisible?
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
   * @param {Object} [options]
   */
  constructor( thumbSize, harmonic, options ) {

    assert && assert( thumbSize instanceof Dimension2, 'invalid thumbSize' );
    assert && assert( harmonic instanceof Harmonic, 'invalid harmonic' );

    options = merge( {
      tandem: Tandem.REQUIRED
    }, options );

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

    assert && assert( !options.children, 'GrippyThumb sets children' );
    options.children = [ rectangle, dotsNode ];

    super( options );
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
   * @param {Harmonic} harmonic
   * @param {Range} amplitudeRange
   * @param {Object} [options]
   */
  constructor( harmonic, amplitudeRange, options ) {

    assert && assert( harmonic instanceof Harmonic, 'invalid harmonic' );
    assert && assert( amplitudeRange instanceof Range, 'invalid amplitudeRange' );
    assert && assert( amplitudeRange.getCenter() === 0, 'implementation assumes that range is symmetric' );

    options = merge( {
      size: new Dimension2( 10, 10 ),
      tandem: Tandem.REQUIRED
    }, options );

    // To improve readability
    const width = options.size.width;
    const height = options.size.height;

    const invisibleTrackNode = new Rectangle( 0, 0, width, height, {
      fill: 'transparent',
      stroke: phet.chipper.queryParameters.dev ? 'red' : null,
      lineWidth: 0.25
    } );

    const visibleTrackNode = new Rectangle( 0, 0, width, height, {
      fill: harmonic.colorProperty,
      stroke: 'black',
      lineWidth: 1
    } );

    const trackNode = new Node( {
      children: [ invisibleTrackNode, visibleTrackNode ]
    } );

    super( trackNode, harmonic.amplitudeProperty, amplitudeRange, options );

    // When the amplitude changes, redraw the track to make it look like a bar extends up or down from amplitude = 0.
    // Note that this code is actually extending left or right, because VSlider rotates its track -90 degrees.
    const amplitudeListener = amplitude => {
      visibleTrackNode.visible = ( amplitude !== 0 );
      if ( amplitude === 0 ) {
        visibleTrackNode.setRect( 0, 0, 1, 1 );
      }
      else if ( amplitude > 0 ) {
        const trackWidth = ( width / 2 ) * amplitude / amplitudeRange.max;
        visibleTrackNode.setRect( width / 2, 0, trackWidth, height );
      }
      else {
        const trackWidth = ( width / 2 ) * amplitude / amplitudeRange.min;
        visibleTrackNode.setRect( ( width / 2 ) - trackWidth, 0, trackWidth, height );
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