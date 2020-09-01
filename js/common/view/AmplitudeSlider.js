// Copyright 2020, University of Colorado Boulder

//TODO it's odd that VSlider requires all of the widths and heights to be swapped herein
/**
 * AmplitudeSlider is a slider for changing the amplitude of a harmonic.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import SliderTrack from '../../../../sun/js/SliderTrack.js';
import VSlider from '../../../../sun/js/VSlider.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

// constants
const BAR_WIDTH = 50;
const BAR_HEIGHT = 125;

class AmplitudeSlider extends VSlider {

  /**
   * @param {Property.<number>} amplitudeProperty
   * @param {Range} amplitudeRange
   * @param {Color|string} color
   * @param {Object} [options]
   */
  constructor( amplitudeProperty, amplitudeRange, color, options ) {

    options = options || {};

    const thumbNode = new Rectangle( 0, 0, 5, BAR_WIDTH, {
      fill: 'black'
    } );
    thumbNode.touchArea = thumbNode.localBounds.dilatedXY( 8, 0 );
    thumbNode.mouseArea = thumbNode.localBounds.dilatedXY( 4, 0 );

    const trackNode = new AmplitudeTrack( amplitudeProperty, amplitudeRange, color );

    assert && assert( !options.trackNode, 'AmplitudeSlider sets trackNode' );
    options.trackNode = trackNode;

    assert && assert( !options.thumbNode, 'AmplitudeSlider sets thumbNode' );
    options.thumbNode = thumbNode;

    super( amplitudeProperty, amplitudeRange, options );

    // @private
    this.disposeAmplitudeSlider = () => {
      options.trackNode.dispose();
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeAmplitudeSlider();
    super.dispose();
  }

}

class AmplitudeTrack extends SliderTrack {

  constructor( amplitudeProperty, amplitudeRange, color ) {

    const invisibleTrackNode = new Rectangle( 0, 0, BAR_HEIGHT, BAR_WIDTH );

    const visibleTrackNode = new Rectangle( 0, 0, BAR_HEIGHT, BAR_WIDTH, {
      fill: color,
      stroke: 'black'
    } );

    const trackNode = new Node( {
      children: [ invisibleTrackNode, visibleTrackNode ]
    } );

    super( trackNode, amplitudeProperty, amplitudeRange, {
      pickable: false, // press in track is not desired
      size: new Dimension2( BAR_HEIGHT, BAR_WIDTH )
    } );

    const amplitudeListener = amplitude => {
      visibleTrackNode.visible = ( amplitude !== 0 );
      if ( amplitude === 0 ) {
        visibleTrackNode.setRect( 0, 0, 1, 1 );
      }
      else if ( amplitude > 0 ) {
        const barHeight = ( BAR_HEIGHT / 2 ) * amplitude / amplitudeRange.max;
        visibleTrackNode.setRect( BAR_HEIGHT / 2, 0, barHeight, BAR_WIDTH );
      }
      else {
        const barHeight = ( BAR_HEIGHT / 2 ) * amplitude / amplitudeRange.min;
        visibleTrackNode.setRect( ( BAR_HEIGHT / 2 ) - barHeight, 0, barHeight, BAR_WIDTH );
      }
    };
    amplitudeProperty.link( amplitudeListener );

    // @private
    this.disposeAmplitudeTrack = () => {
      amplitudeProperty.unlink( amplitudeListener );
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeAmplitudeTrack();
    super.dispose();
  }
}

fourierMakingWaves.register( 'AmplitudeSlider', AmplitudeSlider );
export default AmplitudeSlider;