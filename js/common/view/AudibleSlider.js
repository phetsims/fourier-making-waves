// Copyright 2021, University of Colorado Boulder

//TODO https://github.com/phetsims/fourier-making-waves/issues/56 sound for pressing in track
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
const SNAP_SOUND_DURATION = 25; //TODO generalSoftClickSoundPlayer.duration, https://github.com/phetsims/tandem/issues/234
const SNAP_SOUND_MIN_SILENCE = 15; // minimum silence between snap sounds, in milliseconds

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
      snapSound: DEFAULT_SNAP_SOUND,

      // Slider options
      snapInterval: 1
    }, options );

    assert && assert( options.snapInterval > 0, `invalid snapInterval: ${options.snapInterval}` );

    // Keep track of the previous value on slider drag for playing sounds
    let previousValue = property.value;

    // The time at which the most recent sound started playing, in milliseconds.
    let tPlay = 0;

    assert && assert( !options.drag, 'AudibleSlider defines drag' );
    options.drag = event => {

      // options.drag is called after the Property is set, so this is the current value.
      const currentValue = property.value;

      const dtPlay = Date.now() - tPlay;

      //TODO https://github.com/phetsims/fourier-making-waves/issues/56 Is special handling needed if event.isFromPDOM(), like WaveInterferenceSlider ?

      if ( currentValue !== previousValue ) {

        options.snapSound.isPlaying && options.snapSound.stop();
        options.minMaxSound.isPlaying && options.minMaxSound.stop();

        if ( currentValue === range.min || currentValue === range.max ) {

          // Play min/max sound regardless of time since previous sound, otherwise we will sometime not hear them.
          options.minMaxSound.play();
        }
        else if ( dtPlay >= SNAP_SOUND_DURATION + SNAP_SOUND_MIN_SILENCE ) {

          // Play snap sound at some minimum interval, so that moving the slider doesn't create a bunch of sounds
          // playing on top of each other, which sounds like garbage.
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