// Copyright 2020, University of Colorado Boulder

/**
 * FourierSoundGenerator generates sound for a fourier series.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import OscillatorSoundGenerator from '../../../../tambo/js/sound-generators/OscillatorSoundGenerator.js';
import SoundGenerator from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import FourierSeries from '../../common/model/FourierSeries.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class FourierSoundGenerator extends SoundGenerator {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {Property.<boolean>} enabledProperty
   * @param {Property.<number>} outputLevelProperty
   */
  constructor( fourierSeries, enabledProperty, outputLevelProperty ) {

    assert && assert( fourierSeries instanceof FourierSeries, 'invalid fourierSeries' );
    assert && AssertUtils.assertPropertyOf( enabledProperty, 'boolean' );
    assert && AssertUtils.assertPropertyOf( outputLevelProperty, 'number' );

    super();

    const maxNumberOfHarmonics = fourierSeries.numberOfHarmonicsProperty.range.max;

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

      // Set amplitudes for the relevant harmonics
      for ( let i = 0; i < amplitudes.length; i++ ) {
        this.oscillatorSoundGenerators[ i ].outputLevel = amplitudes[ i ];
      }

      // Set amplitudes of irrelevant harmonics to zero.
      for ( let i = amplitudes.length; i < maxNumberOfHarmonics; i++ ) {
        this.oscillatorSoundGenerators[ i ].outputLevel = 0;
      }
    } );

    // Set the master output level. unlink is not needed
    outputLevelProperty.link( outputLevel => {
      this.outputLevel = outputLevel;
    } );

    //TODO can this be controlled via options.enableControlProperties?
    // Turn sound on/off. unlink is not needed
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