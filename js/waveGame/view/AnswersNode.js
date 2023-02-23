// Copyright 2021-2023, University of Colorado Boulder

/**
 * AnswersNode is used to show the answers in the Wave Game when the ?showAnswers query parameter is present.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node } from '../../../../scenery/js/imports.js';
import FMWConstants from '../../common/FMWConstants.js';
import FourierSeries from '../../common/model/FourierSeries.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

// constants
const NUMBER_DISPLAY_OPTIONS = {
  align: 'center',
  xMargin: 0,
  yMargin: 0,
  backgroundFill: null,
  backgroundStroke: null,
  textOptions: {
    font: new PhetFont( 12 ),
    fill: 'red'
  },

  // Do not display zero-amplitude values.
  numberFormatter: amplitude =>
    ( amplitude === 0 ) ? '' : Utils.toFixed( amplitude, FMWConstants.WAVE_GAME_AMPLITUDE_DECIMAL_PLACES )
};

export default class AnswersNode extends Node {

  /**
   * @param {ChartTransform} chartTransform - transform for the Amplitudes chart
   * @param {FourierSeries} answerSeries - answer to the challenge
   * @param {Object} [options]
   */
  constructor( chartTransform, answerSeries, options ) {
    assert && assert( chartTransform instanceof ChartTransform );
    assert && assert( answerSeries instanceof FourierSeries );

    options = merge( {}, options );

    // Add a NumberDisplay for each harmonic's amplitudeProperty, horizontally centered under its associated slider.
    const numberDisplays = answerSeries.harmonics.map( ( harmonic, index ) =>
      new NumberDisplay( harmonic.amplitudeProperty, answerSeries.amplitudeRange,
        merge( {
          centerX: chartTransform.modelToViewX( index + 1 )
        }, NUMBER_DISPLAY_OPTIONS ) )
    );

    assert && assert( !options.children, 'AnswersNode sets children' );
    options.children = numberDisplays;

    super( options );
  }
}

fourierMakingWaves.register( 'AnswersNode', AnswersNode );