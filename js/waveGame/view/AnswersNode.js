// Copyright 2021, University of Colorado Boulder

/**
 * AnswersNode is used to show the answers in the Wave Game when the ?showAnswers query parameter is present.
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
import Harmonic from '../../common/model/Harmonic.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

// constants
const TEXT_OPTIONS = {
  font: new PhetFont( 12 ),
  fill: 'red'
};

class AnswersNode extends Node {

  /**
   * @param {ChartTransform} chartTransform - transform for the Amplitudes chart
   * @param {Harmonic[]} harmonics - harmonics for the challenge answer
   * @param {Object} [options]
   */
  constructor( chartTransform, harmonics, options ) {
    assert && assert( chartTransform instanceof ChartTransform );
    assert && AssertUtils.assertArrayOf( harmonics, Harmonic );

    options = merge( {}, options );

    const textNodes = []; // {Text[]}
    for ( let i = 0; i < harmonics.length; i++ ) {
      const harmonic = harmonics[ i ];

      const textNode = new Text( '', TEXT_OPTIONS );
      textNodes.push( textNode );

      const centerX = chartTransform.modelToViewX( i + 1 );

      // Keep the display in sync with the harmonic's amplitude value. Hide zero values.
      // unlink is not needed
      harmonic.amplitudeProperty.link( amplitude => {
        textNode.visible = ( amplitude !== 0 );
        textNode.text = Utils.toFixed( amplitude, FMWConstants.AMPLITUDE_SLIDER_DECIMAL_PLACES );
        textNode.centerX = centerX;
      } );
    }

    assert && assert( !options.children, 'AnswersNode sets children' );
    options.children = textNodes;

    super( options );
  }
}

fourierMakingWaves.register( 'AnswersNode', AnswersNode );
export default AnswersNode;