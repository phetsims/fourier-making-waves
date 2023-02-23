// Copyright 2020-2023, University of Colorado Boulder

/**
 * AmplitudeSlider is a slider for changing the amplitude of a harmonic. It is a specialization of sun.Slider
 * that is skinned to look like an interactive bar, for display on a bar chart.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import { Color, Node, Path, PressListener, Rectangle } from '../../../../scenery/js/imports.js';
import Slider from '../../../../sun/js/Slider.js';
import SliderTrack from '../../../../sun/js/SliderTrack.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWConstants from '../FMWConstants.js';
import EmphasizedHarmonics from '../model/EmphasizedHarmonics.js';
import Harmonic from '../model/Harmonic.js';

// constants
const TRACK_WIDTH = 40; // track height is specified in constructor options

// Dimension2 instances must be swapped, because VSlider rotates its thumb and track -90 degrees.
// So we'll specify the dimensions of our custom thumb and track in vertical orientation, create
// our custom thumb and track in horizontal orientation, and Slider will rotate them into vertical orientation.
// Pretty gross, eh? See https://github.com/phetsims/fourier-making-waves/issues/175
const THUMB_SIZE = new Dimension2( TRACK_WIDTH - 15, 8 ).swapped();
const THUMB_TOUCH_AREA_DILATION = new Dimension2( 10, 4 ).swapped();
const THUMB_MOUSE_AREA_DILATION = new Dimension2( 10, 4 ).swapped();

export default class AmplitudeSlider extends Slider {

  /**
   * @param {Harmonic} harmonic
   * @param {EmphasizedHarmonics} emphasizedHarmonics
   * @param {Object} [options]
   */
  constructor( harmonic, emphasizedHarmonics, options ) {

    assert && assert( harmonic instanceof Harmonic );
    assert && assert( emphasizedHarmonics instanceof EmphasizedHarmonics );

    options = merge( {

      // {number} height of the track
      trackHeight: 120,

      // {number} snap to this interval when using mouse/touch, unless the value is min or max
      mouseTouchStep: FMWConstants.DISCRETE_AMPLITUDE_STEP,

      // Slider options
      startDrag: _.noop,
      endDrag: _.noop,
      orientation: Orientation.VERTICAL,
      valueChangeSoundGeneratorOptions: {
        numberOfMiddleThresholds: ( harmonic.amplitudeProperty.range.getLength() / FMWConstants.DISCRETE_AMPLITUDE_STEP ) - 1
      },

      // pdom options
      // slider steps, see https://github.com/phetsims/fourier-making-waves/issues/53
      keyboardStep: FMWConstants.DISCRETE_AMPLITUDE_KEYBOARD_STEP, // used by all alternative-input devices
      shiftKeyboardStep: FMWConstants.DISCRETE_AMPLITUDE_SHIFT_KEYBOARD_STEP, // finer grain, used by keyboard only
      pageKeyboardStep: FMWConstants.DISCRETE_AMPLITUDE_PAGE_KEYBOARD_STEP, // coarser grain, used by keyboard only

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    assert && assert( options.shiftKeyboardStep <= options.keyboardStep );
    assert && assert( options.pageKeyboardStep >= options.keyboardStep );
    assert && assert( options.keyboardStep >= options.mouseTouchStep, 'see https://github.com/phetsims/sun/issues/698' );
    assert && assert( options.pageKeyboardStep >= options.mouseTouchStep, 'see https://github.com/phetsims/sun/issues/698' );

    const amplitudeRange = harmonic.amplitudeProperty.range;

    assert && assert( !options.constrainValue, 'AmplitudeSlider sets constrainValue' );
    options.constrainValue = amplitude => {
      if ( amplitude !== amplitudeRange.min && amplitude !== amplitudeRange.max ) {
        amplitude = Utils.roundToInterval( amplitude, options.mouseTouchStep );
      }
      return amplitude;
    };

    // Custom thumb
    const thumbNode = new GrippyThumb( THUMB_SIZE, harmonic, {
      tandem: options.tandem.createTandem( Slider.THUMB_NODE_TANDEM_NAME )
    } );
    thumbNode.touchArea = thumbNode.localBounds.dilatedXY( THUMB_TOUCH_AREA_DILATION.width, THUMB_TOUCH_AREA_DILATION.height );
    thumbNode.mouseArea = thumbNode.localBounds.dilatedXY( THUMB_MOUSE_AREA_DILATION.width, THUMB_MOUSE_AREA_DILATION.height );
    assert && assert( !options.thumbNode, 'AmplitudeSlider sets thumbNode' );
    options.thumbNode = thumbNode;

    // Custom track
    const trackNode = new BarTrack( harmonic, amplitudeRange, {

      // Propagate drag behavior to our custom track
      startDrag: options.startDrag,
      endDrag: options.endDrag,
      constrainValue: options.constrainValue,

      // See note above about why swapped is necessary.
      size: new Dimension2( TRACK_WIDTH, options.trackHeight ).swapped(),
      tandem: options.tandem.createTandem( Slider.TRACK_NODE_TANDEM_NAME )
    } );
    assert && assert( !options.trackNode, 'AmplitudeSlider sets trackNode' );
    options.trackNode = trackNode;

    super( harmonic.amplitudeProperty, amplitudeRange, options );

    // Whether this slider has keyboard focus.
    const hasFocusProperty = new BooleanProperty( this.focused );
    this.addInputListener( {
      focus: () => { hasFocusProperty.value = true; },
      blur: () => { hasFocusProperty.value = false; }
    } );

    // {DerivedProperty.<boolean>}
    // The associated harmonic is emphasized if we're interacting with the slider in some way.
    const isEmphasizedProperty = DerivedProperty.or(
      [ this.thumbDragListener.isHighlightedProperty, trackNode.isHighlightedProperty, hasFocusProperty ]
    );

    // Emphasize the associated harmonic.
    isEmphasizedProperty.lazyLink( isEmphasized => {
      if ( isEmphasized ) {
        emphasizedHarmonics.push( this, harmonic );
      }
      else if ( emphasizedHarmonics.includesNode( this ) ) {
        emphasizedHarmonics.remove( this );
      }
    } );

    // Interrupt interaction when visibility changes.
    this.visibleProperty.link( () => this.interruptSubtreeInput() );
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
 * Created in horizontal orientation because VSlider will rotate it -90 degrees to vertical orientation.
 */
class GrippyThumb extends Node {

  /**
   * @param {Dimension2} thumbSize
   * @param {Harmonic} harmonic
   * @param {Object} [options]
   */
  constructor( thumbSize, harmonic, options ) {

    assert && assert( thumbSize instanceof Dimension2 );
    assert && assert( harmonic instanceof Harmonic );

    options = merge( {
      tandem: Tandem.REQUIRED
    }, options );

    const rectangle = new Rectangle( 0, 0, thumbSize.width, thumbSize.height, {
      fill: Color.grayColor( 200 ),
      stroke: 'black',
      cornerRadius: 2
    } );

    // A row of dots, color-coded to the harmonic
    // Note that this code is actually drawing a column of dots, because VSlider rotates its thumb -90 degrees.
    const numberOfDots = 3;
    const xMargin = 2.5;
    const ySpacing = rectangle.height / ( numberOfDots + 1 );
    const dotRadius = ( rectangle.width - 2 * xMargin ) / 2;
    assert && assert( dotRadius > 0, `invalid dotRadius: ${dotRadius}` );
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
 * BarTrack is a custom track for AmplitudeSlider.
 * It fills a colored bar that grows up and down from the center of the track.
 * Created in horizontal orientation because VSlider will rotate it -90 degrees to vertical orientation.
 */
class BarTrack extends SliderTrack {

  /**
   * @param {Harmonic} harmonic
   * @param {Range} amplitudeRange
   * @param {Object} [options]
   */
  constructor( harmonic, amplitudeRange, options ) {

    assert && assert( harmonic instanceof Harmonic );
    assert && assert( amplitudeRange instanceof Range );
    assert && assert( amplitudeRange.getCenter() === 0, 'implementation assumes that range is symmetric' );

    options = merge( {
      size: new Dimension2( 10, 10 ),
      tandem: Tandem.REQUIRED
    }, options );

    // To improve readability
    const trackWidth = options.size.width;
    const trackHeight = options.size.height;

    const invisibleTrackNode = new Rectangle( 0, 0, trackWidth, trackHeight, {
      fill: 'transparent',
      stroke: phet.chipper.queryParameters.dev ? 'red' : null,
      lineWidth: 0.25
    } );

    const visibleTrackNode = new Rectangle( 0, 0, trackWidth, trackHeight, {
      fill: harmonic.colorProperty,
      stroke: 'black'
    } );

    const trackNode = new Node( {
      children: [ invisibleTrackNode, visibleTrackNode ]
    } );

    super( harmonic.amplitudeProperty, trackNode, amplitudeRange, options );

    // When the amplitude changes, redraw the track to make it look like a bar extends up or down from amplitude = 0.
    // Note that this code is actually extending left or right, because VSlider rotates its track -90 degrees.
    const amplitudeListener = amplitude => {
      visibleTrackNode.visible = ( amplitude !== 0 );
      if ( amplitude === 0 ) {
        visibleTrackNode.setRect( 0, 0, 1, 1 );
      }
      else if ( amplitude > 0 ) {
        const barWidth = ( trackWidth / 2 ) * amplitude / amplitudeRange.max;
        visibleTrackNode.setRect( trackWidth / 2, 0, barWidth, trackHeight );
      }
      else {
        const barWidth = ( trackWidth / 2 ) * amplitude / amplitudeRange.min;
        visibleTrackNode.setRect( ( trackWidth / 2 ) - barWidth, 0, barWidth, trackHeight );
      }
    };
    harmonic.amplitudeProperty.link( amplitudeListener );

    // When the cursor is over the visible part of the track, it is considered highlighted.
    const visibleTrackPressListener = new PressListener( {
      attach: false // so that the DragListener for the track isn't ignored
    } );
    visibleTrackNode.addInputListener( visibleTrackPressListener );

    // @public {DerivedProperty.<boolean>}
    // This tells us when the track should be considered highlighted. We can't simply look at
    // this.dragListener.isHighlightedProperty, because that will include the invisible portion of the track.
    // This is used to emphasize the associated harmonic's plot in the Harmonics chart. See isEmphasizedProperty
    // in AmplitudeSlider above.
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