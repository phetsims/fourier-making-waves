// Copyright 2020, University of Colorado Boulder

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
import FourierSeries from '../../common/model/FourierSeries.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

// constants
const OUTPUT_LEVEL_RANGE = new Range( -1, 1 );

class FourierSoundGenerator extends SoundGenerator {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {Property.<boolean>} enabledProperty
   * @param {NumberProperty} outputLevelProperty
   */
  constructor( fourierSeries, enabledProperty, outputLevelProperty ) {

    assert && assert( fourierSeries instanceof FourierSeries, 'invalid fourierSeries' );
    assert && AssertUtils.assertPropertyOf( enabledProperty, 'boolean' );
    assert && assert( outputLevelProperty instanceof NumberProperty, 'invalid outputLevelProperty' );
    assert && assert( outputLevelProperty.range, 'outputLevelProperty.range required' );

    super();

    const maxNumberOfHarmonics = fourierSeries.numberOfHarmonicsProperty.range.max;

    // Maps amplitude to an output level that is appropriate for SoundGenerator.
    const amplitudeToOutputLevel = new LinearFunction(
      fourierSeries.amplitudeRange.min, fourierSeries.amplitudeRange.max,
      OUTPUT_LEVEL_RANGE.min, OUTPUT_LEVEL_RANGE.max
    );

    // @private {OscillatorSoundGenerator[]}
    this.oscillatorSoundGenerators = [];
    for ( let i = 0; i < maxNumberOfHarmonics; i++ ) {
      const oscillatorSoundGenerator = new OscillatorSoundGenerator( {
        initialFrequency: ( i + 1 ) * fourierSeries.fundamentalFrequency,
        initialOutputLevel: fourierSeries.amplitudesProperty.value[ i ]
      } );
      oscillatorSoundGenerator.connect( this.masterGainNode );
      this.oscillatorSoundGenerators.push( oscillatorSoundGenerator );
    }

    // Set amplitudes for harmonics. unlink is not needed.
    fourierSeries.amplitudesProperty.link( amplitudes => {

      // Set amplitudes for the relevant harmonics.
      for ( let i = 0; i < amplitudes.length; i++ ) {
        this.oscillatorSoundGenerators[ i ].outputLevel = amplitudeToOutputLevel( amplitudes[ i ] );
      }

      // Set amplitudes of irrelevant harmonics to zero.
      for ( let i = amplitudes.length; i < maxNumberOfHarmonics; i++ ) {
        this.oscillatorSoundGenerators[ i ].outputLevel = 0;
      }
    } );

    // Set the master output level. unlink is not needed.
    outputLevelProperty.link( outputLevel => {
      this.outputLevel = outputLevel;
    } );

    //TODO can this be controlled via options.enableControlProperties?
    // Turn sound on/off. unlink is not needed.
    enabledProperty.link( enabled => enabled ? this.play() : this.stop() );
  }

  /**
   * Starts the tone generator.
   * @public
   */
  play() {
    this.oscillatorSoundGenerators.forEach( oscillatorSoundGenerator => oscillatorSoundGenerator.play() );
  }

  /**
   * Stops the tone generator.
   * @public
   */
  stop() {
    this.oscillatorSoundGenerators.forEach( oscillatorSoundGenerator => oscillatorSoundGenerator.stop() );
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