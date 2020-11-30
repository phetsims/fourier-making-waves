// Copyright 2020, University of Colorado Boulder

/**
 * SoundLayoutBox contains that controls for the Fourier series' sound.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import FontAwesomeNode from '../../../../sun/js/FontAwesomeNode.js';
import HSlider from '../../../../sun/js/HSlider.js';
import SunConstants from '../../../../sun/js/SunConstants.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class SoundLayoutBox extends HBox {

  /**
   * @param {Property.<boolean>} soundEnabledProperty
   * @param {NumberProperty} outputLevelProperty
   * @param {Object} [options]
   */
  constructor( soundEnabledProperty, outputLevelProperty, options ) {

    assert && AssertUtils.assertPropertyOf( soundEnabledProperty, 'boolean' );
    assert && assert( outputLevelProperty instanceof NumberProperty, 'invalid outputLevelProperty' );
    assert && assert( outputLevelProperty.range, 'outputLevelProperty.range required' );

    options = merge( {
      spacing: 30
    }, options );

    // Checkbox with music notes icon
    const soundEnabledCheckbox = new Checkbox( new FontAwesomeNode( 'music_solid', {
      scale: 0.35
    } ), soundEnabledProperty, FMWConstants.CHECKBOX_OPTIONS );

    // Slider for controlling output level
    const outputLevelSlider = new HSlider( outputLevelProperty, outputLevelProperty.range, {
      thumbSize: new Dimension2( 10, 20 ),
      trackSize: new Dimension2( 100, 3 ),
      trackStroke: 'rgb( 160, 160, 160 )'
    } );

    // Icons at the extremes of the slider
    const iconOptions = { scale: 0.5 };
    const volumeOffIcon = new FontAwesomeNode( 'volume_off', iconOptions );
    const volumeUpIcon = new FontAwesomeNode( 'volume_up', iconOptions );

    // Layout for slider and icons
    const sliderBox = new HBox( {
      children: [ volumeOffIcon, outputLevelSlider, volumeUpIcon ],
      spacing: 5
    } );

    assert && assert( !options.children, 'SoundLayoutBox sets children' );
    options.children = [ soundEnabledCheckbox, sliderBox ];

    super( options );

    // Disable this control when soundManager is disabled.
    soundManager.enabledProperty.link( enabled => {
      this.interruptSubtreeInput();
      soundEnabledCheckbox.enabled = enabled;
      outputLevelSlider.enabled = enabled;
      volumeOffIcon.opacity = enabled ? 1 : SunConstants.DISABLED_OPACITY;
      volumeUpIcon.opacity = enabled ? 1 : SunConstants.DISABLED_OPACITY;
    } );
  }
}

fourierMakingWaves.register( 'SoundLayoutBox', SoundLayoutBox );
export default SoundLayoutBox;