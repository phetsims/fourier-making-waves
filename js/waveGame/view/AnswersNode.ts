// Copyright 2021-2023, University of Colorado Boulder

/**
 * AnswersNode is used to show the answers in the Wave Game when the ?showAnswers query parameter is present.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Utils from '../../../../dot/js/Utils.js';
import NumberDisplay, { NumberDisplayOptions } from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node } from '../../../../scenery/js/imports.js';
import FMWConstants from '../../common/FMWConstants.js';
import FourierSeries from '../../common/model/FourierSeries.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

// constants
const NUMBER_DISPLAY_OPTIONS: NumberDisplayOptions = {
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
  numberFormatter: ( amplitude: number ) =>
    ( amplitude === 0 ) ? '' : Utils.toFixed( amplitude, FMWConstants.WAVE_GAME_AMPLITUDE_DECIMAL_PLACES )
};

export default class AnswersNode extends Node {

  /**
   * @param chartTransform - transform for the Amplitudes chart
   * @param answerSeries - answer to the challenge
   */
  public constructor( chartTransform: ChartTransform, answerSeries: FourierSeries ) {

    // Add a NumberDisplay for each harmonic's amplitudeProperty, horizontally centered under its associated slider.
    const numberDisplays = answerSeries.harmonics.map( ( harmonic, index ) => {
      const numberDisplay = new NumberDisplay( harmonic.amplitudeProperty, answerSeries.amplitudeRange, NUMBER_DISPLAY_OPTIONS );
      numberDisplay.centerX = chartTransform.modelToViewX( index + 1 );
      return numberDisplay;
    } );

    super( {
      children: numberDisplays,
      visible: phet.chipper.queryParameters.showAnswers
    } );
  }
}

fourierMakingWaves.register( 'AnswersNode', AnswersNode );