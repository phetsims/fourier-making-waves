// Copyright 2020, University of Colorado Boulder

//TODO it's odd that VSlider requires all of the widths and heights to be swapped herein
/**
 * AmplitudeSlider is a slider for changing the amplitude of a harmonic.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Color from '../../../../scenery/js/util/Color.js';
import ColorDef from '../../../../scenery/js/util/ColorDef.js';
import SliderTrack from '../../../../sun/js/SliderTrack.js';
import VSlider from '../../../../sun/js/VSlider.js';
import Waveform from '../../discrete/model/Waveform.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWConstants from '../FMWConstants.js';

// constants
const LINE_WIDTH = 1;

class AmplitudeSlider extends VSlider {

  /**
   * @param {NumberProperty} amplitudeProperty
   * @param {Property.<ColorDef>} colorProperty
   * @param {EnumerationProperty.<Waveform>} waveformProperty
   * @param {Object} [options]
   */
  constructor( amplitudeProperty, colorProperty, waveformProperty, options ) {

    assert && assert( amplitudeProperty instanceof NumberProperty, 'invalid amplitudeProperty' );
    assert && AssertUtils.assertProperty( colorProperty, value => ColorDef.isColorDef( value ) );
    assert && AssertUtils.assertEnumerationPropertyOf( waveformProperty, Waveform );

    options = merge( {

      // {number|null} On end drag, snap to this interval, unless the value is min or max
      snapInterval: FMWConstants.AMPLITUDE_SLIDER_SNAP_INTERVAL,

      // AmplitudeSliderThumb options
      thumbHeight: 4,

      // AmplitudeSliderTrack options
      trackWidth: 40,
      trackHeight: 120

    }, options );

    const thumbNode = new AmplitudeSliderThumb( options.thumbHeight, options.trackWidth );
    thumbNode.touchArea = thumbNode.localBounds.dilatedXY( 8, 0 );
    thumbNode.mouseArea = thumbNode.localBounds.dilatedXY( 4, 0 );

    // Constrain the range to the desired number of decimal places.
    const amplitudeRange = new Range(
      Utils.toFixedNumber( amplitudeProperty.range.min, FMWConstants.AMPLITUDE_SLIDER_DECIMAL_PLACES ),
      Utils.toFixedNumber( amplitudeProperty.range.max, FMWConstants.AMPLITUDE_SLIDER_DECIMAL_PLACES )
    );

    const trackNode = new AmplitudeSliderTrack( amplitudeProperty, amplitudeRange, colorProperty, {
      trackWidth: options.trackWidth,
      trackHeight: options.trackHeight
    } );

    assert && assert( !options.trackNode, 'AmplitudeSlider sets trackNode' );
    options.trackNode = trackNode;

    assert && assert( !options.thumbNode, 'AmplitudeSlider sets thumbNode' );
    options.thumbNode = thumbNode;

    // When we edit an amplitude, switch to custom.
    assert && assert( !options.startDrag, 'AmplitudeSlider sets startDrag' );
    options.startDrag = () => {
      waveformProperty.value = Waveform.CUSTOM;
    };

    // Snap to interval
    if ( options.snapInterval ) {
      assert && assert( !options.endDrag, 'AmplitudeSlider sets endDrag' );
      options.endDrag = () => {
        const amplitude = amplitudeProperty.value;
        if ( amplitude !== amplitudeRange.min && amplitude !== amplitudeRange.max ) {
          amplitudeProperty.value = Utils.roundToInterval( amplitude, options.snapInterval );
        }
      };
    }

    super( amplitudeProperty, amplitudeRange, options );
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
 * AmplitudeSliderThumb is a custom thumb for AmplitudeSlider.
 */
class AmplitudeSliderThumb extends Rectangle {

  /**
   * @param {number} width
   * @param {number} height
   */
  constructor( width, height ) {
    super( 0, 0, width, height, {
      fill: 'black',
      stroke: 'black',
      lineWidth: LINE_WIDTH
    } );
  }
}

/**
 * AmplitudeSliderTrack is a custom track for AmplitudeSlider.  It fills a colored bar that grows up and down from
 * the center of the track.
 */
class AmplitudeSliderTrack extends SliderTrack {

  /**
   * @param {Property.<number>} amplitudeProperty
   * @param {Range} amplitudeRange
   * @param {Property.<Color>} colorProperty
   * @param {Object} [options]
   */
  constructor( amplitudeProperty, amplitudeRange, colorProperty, options ) {

    assert && AssertUtils.assertPropertyOf( amplitudeProperty, 'number' );
    assert && assert( amplitudeRange instanceof Range, 'invalid amplitudeRange' );
    assert && assert( amplitudeRange.getCenter() === 0, 'implementation assumes that range is symmetric' );
    assert && AssertUtils.assertPropertyOf( colorProperty, Color );

    options = merge( {
      trackWidth: 5,
      trackHeight: 5
    }, options );

    const invisibleTrackNode = new Rectangle( 0, 0, options.trackHeight, options.trackWidth, {
      fill: 'transparent',
      stroke: phet.chipper.queryParameters.dev ? 'red' : null,
      lineWidth: 0.25
    } );

    const visibleTrackNode = new Rectangle( 0, 0, options.trackHeight, options.trackWidth, {
      fill: colorProperty,
      stroke: 'black',
      lineWidth: LINE_WIDTH
    } );

    const trackNode = new Node( {
      children: [ invisibleTrackNode, visibleTrackNode ]
    } );

    super( trackNode, amplitudeProperty, amplitudeRange, {
      size: new Dimension2( options.trackHeight, options.trackWidth )
    } );

    // When the amplitude changes, redraw the track to make it look like a bar extends up or down from amplitude = 0.
    const amplitudeListener = amplitude => {
      visibleTrackNode.visible = ( amplitude !== 0 );
      if ( amplitude === 0 ) {
        visibleTrackNode.setRect( 0, 0, 1, 1 );
      }
      else if ( amplitude > 0 ) {
        const trackHeight = ( options.trackHeight / 2 ) * amplitude / amplitudeRange.max;
        visibleTrackNode.setRect( options.trackHeight / 2, 0, trackHeight, options.trackWidth );
      }
      else {
        const trackHeight = ( options.trackHeight / 2 ) * amplitude / amplitudeRange.min;
        visibleTrackNode.setRect( ( options.trackHeight / 2 ) - trackHeight, 0, trackHeight, options.trackWidth );
      }
    };
    amplitudeProperty.link( amplitudeListener );
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