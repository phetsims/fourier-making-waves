// Copyright 2021, University of Colorado Boulder

/**
 * AnswersNode is used to show the answers in the game when the ?showAnswers query parameter is present.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WaveGameChallenge from '../model/WaveGameChallenge.js';

// constants
const TEXT_OPTIONS = {
  font: new PhetFont( 14 ),
  fill: 'red'
};

class AnswersNode extends Node {

  /**
   * @param {ChartTransform} chartTransform
   * @param {Property.<WaveGameChallenge>} challengeProperty
   * @param {Object} [options]
   */
  constructor( chartTransform, challengeProperty, options ) {
    assert && assert( chartTransform instanceof ChartTransform, 'invalid chartTransform' );
    assert && AssertUtils.assertPropertyOf( challengeProperty, WaveGameChallenge );

    options = merge( {}, options );

    const amplitudeNodes = []; // {Text[]}
    for ( let i = 0; i < FMWConstants.MAX_HARMONICS; i++ ) {
      amplitudeNodes.push( new Text( '', TEXT_OPTIONS ) );
    }

    // unlink is not needed.
    challengeProperty.link( challenge => {
      const amplitudes = challenge.getAnswerAmplitudes();
      for ( let i = 0; i < amplitudes.length; i++ ) {
        amplitudeNodes[ i ].text = ( amplitudes[ i ] === 0 ) ? '' : `${amplitudes[ i ]}`;
        amplitudeNodes[ i ].centerX = chartTransform.modelToViewX( i + 1 );
      }
    } );

    assert && assert( !options.children, 'AnswersNode sets children' );
    options.children = amplitudeNodes;

    super( options );
  }
}

fourierMakingWaves.register( 'AnswersNode', AnswersNode );
export default AnswersNode;