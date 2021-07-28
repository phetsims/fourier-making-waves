// Copyright 2020-2021, University of Colorado Boulder

/**
 * FourierSoundGenerator generates sound for a fourier series.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import LinearFunction from '../../../../dot/js/LinearFunction.js';
import Range from '../../../../dot/js/Range.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import OscillatorSoundGenerator from '../../../../tambo/js/sound-generators/OscillatorSoundGenerator.js';
import SoundGenerator from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import FMWConstants from '../../common/FMWConstants.js';
import FourierSeries from '../../common/model/FourierSeries.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

// Output level range of each harmonic. These have a reduced range because harmonics are summed.
// See https://github.com/phetsims/fourier-making-waves/issues/45
const HARMONIC_OUTPUT_LEVEL_RANGE = new Range( -1 / FMWConstants.MAX_HARMONICS, 1 / FMWConstants.MAX_HARMONICS );

class FourierSoundGenerator extends SoundGenerator {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {Property.<boolean>} enabledProperty
   * @param {NumberProperty} outputLevelProperty
   */
  constructor( fourierSeries, enabledProperty, outputLevelProperty ) {

    assert && assert( fourierSeries instanceof FourierSeries );
    assert && AssertUtils.assertPropertyOf( enabledProperty, 'boolean' );
    assert && assert( outputLevelProperty instanceof NumberProperty );
    assert && assert( outputLevelProperty.range, 'outputLevelProperty.range required' );

    super( {

      // OscillatorSoundGenerator options
      initialOutputLevel: outputLevelProperty.value
    } );

    // Maps amplitude to an output level that is appropriate for SoundGenerator.
    const amplitudeToOutputLevel = new LinearFunction(
      fourierSeries.amplitudeRange.min, fourierSeries.amplitudeRange.max,
      HARMONIC_OUTPUT_LEVEL_RANGE.min, HARMONIC_OUTPUT_LEVEL_RANGE.max
    );

    // {OscillatorSoundGenerator[]} Create an oscillator for each harmonic.
    const oscillatorSoundGenerators = [];
    for ( let i = 0; i < fourierSeries.harmonics.length; i++ ) {
      const harmonic = fourierSeries.harmonics[ i ];
      const oscillatorSoundGenerator = new OscillatorSoundGenerator( {
        initialFrequency: harmonic.frequency,
        initialOutputLevel: amplitudeToOutputLevel( harmonic.amplitudeProperty.value )
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
      const timeConstant = enabledProperty.value ? undefined : 0;

      // Set amplitudes for the harmonics.
      for ( let i = 0; i < amplitudes.length; i++ ) {
        oscillatorSoundGenerators[ i ].setOutputLevel( amplitudeToOutputLevel( amplitudes[ i ] ), timeConstant );
      }
    } );

    // Set the master output level.
    outputLevelProperty.link( outputLevel => {

      // See comment above about timeConstant.
      const timeConstant = enabledProperty.value ? undefined : 0;
      this.setOutputLevel( outputLevel, timeConstant );
      phet.log && phet.log( `FourierSoundGenerator outputLevel=${outputLevel}` );
    } );

    // Turn sound on/off. We could have controlled this via options.enableControlProperties,
    // but stopping OscillatorSoundGenerators may use fewer resources.
    enabledProperty.link( enabled => {
      if ( enabled ) {
        oscillatorSoundGenerators.forEach( oscillatorSoundGenerator => oscillatorSoundGenerator.play() );
      }
      else {
        oscillatorSoundGenerators.forEach( oscillatorSoundGenerator => oscillatorSoundGenerator.stop() );
      }
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

fourierMakingWaves.register( 'FourierSoundGenerator', FourierSoundGenerator );
export default FourierSoundGenerator;