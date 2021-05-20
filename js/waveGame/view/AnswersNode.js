// Copyright 2021, University of Colorado Boulder

/**
 * AnswersNode is used to show the answers in the game when the ?showAnswers query parameter is present.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Utils from '../../../../dot/js/Utils.js';
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
  font: new PhetFont( 12 ),
  fill: 'red'
};

class AnswersNode extends Node {

  /**
   * @param {ChartTransform} chartTransform - transform for the Amplitudes chart
   * @param {Property.<WaveGameChallenge>} challengeProperty
   * @param {Object} [options]
   */
  constructor( chartTransform, challengeProperty, options ) {
    assert && assert( chartTransform instanceof ChartTransform );
    assert && AssertUtils.assertPropertyOf( challengeProperty, WaveGameChallenge );

    options = merge( {}, options );

    const amplitudeNodes = []; // {Text[]}
    for ( let i = 0; i < FMWConstants.MAX_HARMONICS; i++ ) {
      amplitudeNodes.push( new Text( '', TEXT_OPTIONS ) );
    }

    // When the challenge changes, display all non-zero amplitudes for the answer, horizontally aligned with
    // the sliders on the Amplitudes chart. unlink is not needed.
    challengeProperty.link( challenge => {
      const amplitudes = challenge.answerFourierSeries.amplitudesProperty.value;
      for ( let i = 0; i < amplitudes.length; i++ ) {
        const amplitudeNode = amplitudeNodes[ i ];
        const amplitude = amplitudes[ i ];
        let amplitudeString = '';
        if ( amplitude !== 0 ) {
          amplitudeString = Utils.toFixed( amplitudes[ i ], FMWConstants.AMPLITUDE_SLIDER_DECIMAL_PLACES );
        }
        amplitudeNode.text = amplitudeString;
        amplitudeNode.centerX = chartTransform.modelToViewX( i + 1 );
      }
    } );

    assert && assert( !options.children, 'AnswersNode sets children' );
    options.children = amplitudeNodes;

    super( options );
  }
}

fourierMakingWaves.register( 'AnswersNode', AnswersNode );
export default AnswersNode;