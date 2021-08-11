// Copyright 2021, University of Colorado Boulder

/**
 * AudibleSlider is a slider that supports user-interface sound. You'll hear one sound for the min or max value,
 * and another sound for in-between values.
 * TODO https://github.com/phetsims/sun/issues/697 This is a temporary solution, and may be eliminated when the Slider sound API has been completed.
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
const DEFAULT_IN_BETWEEN_SOUND = generalSoftClickSoundPlayer;
const IN_BETWEEN_SOUND_DURATION = 25; // determined empirically
const IN_BETWEEN_SOUND_MIN_SILENCE = 15; // minimum silence between in-between sounds, in milliseconds

class AudibleSlider extends Slider {

  /**
   * @param {Property.<number>} property
   * @param {Range} range
   * @param {Object} [options]
   */
  constructor( property, range, options ) {

    options = merge( {

      // AudibleSlider options
      minMaxSound: DEFAULT_MIN_MAX_SOUND,
      inBetweenSound: DEFAULT_IN_BETWEEN_SOUND
    }, options );

    // Keep track of the previous value on slider drag for playing sounds
    let previousValue = property.value;

    // The time at which the most recent sound started playing, in milliseconds.
    let tPlay = 0;

    assert && assert( !options.drag, 'AudibleSlider defines drag' );
    options.drag = event => {

      // options.drag is called after the Property is set, so this is the current value.
      const currentValue = property.value;

      const dtPlay = Date.now() - tPlay;

      if ( currentValue !== previousValue ) {

        options.inBetweenSound.isPlaying && options.inBetweenSound.stop();
        options.minMaxSound.isPlaying && options.minMaxSound.stop();

        if ( currentValue === range.min || currentValue === range.max ) {

          // Play min/max sound regardless of time since previous sound, otherwise we will sometime not hear them.
          options.minMaxSound.play();
        }
        else if ( dtPlay >= IN_BETWEEN_SOUND_DURATION + IN_BETWEEN_SOUND_MIN_SILENCE ) {

          // Play in-between sound at some minimum interval, so that moving the slider doesn't create a bunch of sounds
          // playing on top of each other, which sounds like an out-of-control popcorn machine.
          options.inBetweenSound.play();
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