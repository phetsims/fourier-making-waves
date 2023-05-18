// Copyright 2020-2023, University of Colorado Boulder

/**
 * FourierSoundGenerator generates sound for a Fourier series.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import LinearFunction from '../../../../dot/js/LinearFunction.js';
import Range from '../../../../dot/js/Range.js';
import OscillatorSoundGenerator from '../../../../tambo/js/sound-generators/OscillatorSoundGenerator.js';
import SoundGenerator from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import FMWConstants from '../../common/FMWConstants.js';
import FourierSeries from '../../common/model/FourierSeries.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

// Output level range of each harmonic. These have a reduced range because harmonics are summed.
// See https://github.com/phetsims/fourier-making-waves/issues/45
const HARMONIC_OUTPUT_LEVEL_RANGE = new Range( -1 / FMWConstants.MAX_HARMONICS, 1 / FMWConstants.MAX_HARMONICS );

export default class FourierSoundGenerator extends SoundGenerator {

  /**
   * @param {FourierSeries} fourierSeries
   */
  constructor( fourierSeries ) {

    assert && assert( fourierSeries instanceof FourierSeries );

    super( {

      // OscillatorSoundGenerator options
      initialOutputLevel: fourierSeries.soundOutputLevelProperty.value
    } );

    // Maps amplitude to an output level that is appropriate for SoundGenerator.
    const amplitudeToOutputLevel = new LinearFunction(
      fourierSeries.amplitudeRange.min, fourierSeries.amplitudeRange.max,
      HARMONIC_OUTPUT_LEVEL_RANGE.min, HARMONIC_OUTPUT_LEVEL_RANGE.max
    );

    // {OscillatorSoundGenerator[]} Create an oscillator for each harmonic.
    // Using for loop here instead of map, because we need to connect each OscillatorSoundGenerator to the
    // masterGainNode, and map should not have side-effects.
    const oscillatorSoundGenerators = [];
    for ( let i = 0; i < fourierSeries.harmonics.length; i++ ) {
      const harmonic = fourierSeries.harmonics[ i ];
      const oscillatorSoundGenerator = new OscillatorSoundGenerator( {
        initialFrequency: harmonic.frequency,
        initialOutputLevel: amplitudeToOutputLevel.evaluate( harmonic.amplitudeProperty.value )
      } );
      oscillatorSoundGenerator.connect( this.masterGainNode );
      oscillatorSoundGenerators.push( oscillatorSoundGenerator );
    }

    // Set amplitudes for harmonics.
    fourierSeries.amplitudesProperty.lazyLink( amplitudes => {

      // If audio is disabled, update immediately by using optional timeConstant=0. This cancels scheduled values on
      // the master gain node. If we do not do this, then we'll briefly hear stale output levels the next time that
      // oscillatorSoundGenerator.play is called.
      // See https://github.com/phetsims/fourier-making-waves/issues/45
      const timeConstant = fourierSeries.soundEnabledProperty.value ? undefined : 0;

      // Set amplitudes for the harmonics.
      for ( let i = 0; i < amplitudes.length; i++ ) {
        oscillatorSoundGenerators[ i ].setOutputLevel( amplitudeToOutputLevel.evaluate( amplitudes[ i ] ), timeConstant );
      }
    } );

    // Set the master output level.
    fourierSeries.soundOutputLevelProperty.link( outputLevel => {

      // See comment above about timeConstant.
      const timeConstant = fourierSeries.soundEnabledProperty.value ? undefined : 0;
      this.setOutputLevel( outputLevel, timeConstant );
    } );

    // Turn sound on/off. We could have controlled this via options.enableControlProperties,
    // but stopping OscillatorSoundGenerators may use fewer resources.
    fourierSeries.soundEnabledProperty.link( enabled => {
      if ( enabled ) {
        oscillatorSoundGenerators.forEach( oscillatorSoundGenerator => oscillatorSoundGenerator.play() );
      }
      else {
        oscillatorSoundGenerators.forEach( oscillatorSoundGenerator => oscillatorSoundGenerator.stop() );
      }
    } );

    // When the FourierSoundGenerator is producing audible sound, duck all user-interface sounds.
    const userInterfaceDefaultOutputLevel = soundManager.getOutputLevelForCategory( 'user-interface' );
    Multilink.multilink(
      [ this.fullyEnabledProperty, fourierSeries.soundEnabledProperty ],
      ( soundGeneratorFullyEnabled, enabled ) => {
        const soundIsAudible = ( soundGeneratorFullyEnabled && enabled );
        const outputLevel = soundIsAudible ? 0.1 * userInterfaceDefaultOutputLevel : userInterfaceDefaultOutputLevel;
        soundManager.setOutputLevelForCategory( 'user-interface', outputLevel );
      }
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

fourierMakingWaves.register( 'FourierSoundGenerator', FourierSoundGenerator );