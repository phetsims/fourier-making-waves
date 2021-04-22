// Copyright 2021, University of Colorado Boulder

/**
 * AudibleSlider is a slider that supports user-interface sound. You'll hear one sound for the snap interval,
 * and another sound for the min or max value.
 *
 * NOTE: Slider.js currently does not support sound, and this is a way to keep the sound-specific implementation
 * encapsulated.  When Slider gets a proper sound API, this implementation should be considered for incorporation
 * into that API, and this class can eventually be replaced or rewritten.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Slider from '../../../../sun/js/Slider.js';
import generalBoundaryBoopSoundPlayer from '../../../../tambo/js/shared-sound-players/generalBoundaryBoopSoundPlayer.js';
import generalSoftClickSoundPlayer from '../../../../tambo/js/shared-sound-players/generalSoftClickSoundPlayer.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

// constants
const DEFAULT_MIN_MAX_SOUND = generalBoundaryBoopSoundPlayer;
const DEFAULT_SNAP_SOUND = generalSoftClickSoundPlayer;
const MIN_SOUND_INTERVAL = 100; // minimum time between sounds, in milliseconds

class AudibleSlider extends Slider {

  /**
   * @param {Property.<number>} property
   * @param {Range} range
   * @param {Object} [options]
   */
  constructor( property, range, options ) {

    options = merge( {
      snapInterval: 1,
      minMaxSound: DEFAULT_MIN_MAX_SOUND,
      snapSound: DEFAULT_SNAP_SOUND
    }, options );

    assert && assert( options.snapInterval > 0, `invalid snapInterval: ${options.snapInterval}` );

    // Keep track of the previous value on slider drag for playing sounds
    let previousValue = property.value;

    // The time at which the most recent sound started playing, in milliseconds.
    let tPlay = Date.now();

    assert && assert( !options.drag, 'AudibleSlider defines drag' );
    options.drag = () => {

      // options.drag is called after the Property is set, so this is the current value.
      const currentValue = property.value;
      
      const dtPlay = Date.now() - tPlay;

      if ( currentValue !== previousValue && dtPlay >= MIN_SOUND_INTERVAL ) {

        options.snapSound.isPlaying && options.snapSound.stop();
        options.minMaxSound.isPlaying && options.minMaxSound.stop();

        if ( currentValue === range.min || currentValue === range.max ) {
          options.minMaxSound.play();
        }
        else {
          options.snapSound.play();
        }

        tPlay = Date.now();
      }

      previousValue = currentValue;
    };

    super( property, range, options );
  }
}

fourierMakingWaves.register( 'AudibleSlider', AudibleSlider );
export default AudibleSlider;