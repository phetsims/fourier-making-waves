// Copyright 2021, University of Colorado Boulder

/**
 * AnswersNode is used to show the answers in the game when the ?showAnswers query parameter is present.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

// constants
const DEFAULT_FONT = new PhetFont( 14 );

class AnswersNode extends RichText {

  /**
   * @param {Property.<WaveGameChallenge>} challengeProperty
   * @param {Object} [options]
   */
  constructor( challengeProperty, options ) {

    options = merge( {
      font: DEFAULT_FONT,
      fill: 'red'
    }, options );

    super( '', options );

    // unlink is not needed.
    challengeProperty.link( challenge => {
      this.text = amplitudesToDebugString( challenge.getAnswerAmplitudes() );
    } );
  }
}

/**
 * Converts an array of amplitudes to a string that shows which ones are non-zero.
 * E.g. [0,1,0,0.5] => 'A<sub>2</sub>=1, A<sub>4</sub>=0.5'
 * @param {number[]} amplitudes - in harmonic order
 * @returns {string}
 */
function amplitudesToDebugString( amplitudes ) {
  let s = '';
  for ( let order = 1; order <= amplitudes.length; order++ ) {
    const amplitude = amplitudes[ order - 1 ];
    if ( amplitude !== 0 ) {
      if ( s ) {
        s += ', ';
      }
      s += `A<sub>${order}</sub> = ${amplitude}`;
    }
  }
  return s;
}

fourierMakingWaves.register( 'AnswersNode', AnswersNode );
export default AnswersNode;