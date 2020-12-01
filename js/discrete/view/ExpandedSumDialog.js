// Copyright 2020, University of Colorado Boulder

/**
 * ExpandedSumDialog is a modal dialog that displays the expanded sum of a Fourier series.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Dialog from '../../../../sun/js/Dialog.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import EquationFactory from './EquationFactory.js';

class ExpandedSumDialog extends Dialog {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {MathForm} mathForm
   * @param {Object} [options]
   */
  constructor( fourierSeries, mathForm, options ) {

    options = merge( {
      xSpacing: 30
    }, options );

    assert && assert( !options.title, 'ExpandedSumDialog sets children' );
    options.title = new Text( fourierMakingWavesStrings.expandedSum, {
      font: FMWConstants.TITLE_FONT
    } ); //TODO i18n

    const generalFormNode = EquationFactory.createSumWavelengthForm( fourierSeries.numberOfHarmonicsProperty.value );

    let expandedFormMarkup = `${MathSymbols.EQUAL_TO} `;
    const amplitudes = fourierSeries.amplitudesProperty.value;
    for ( let n = 1; n <= amplitudes.length; n++ ) {
      const amplitude = Utils.toFixedNumber( amplitudes[ n - 1 ], FMWConstants.AMPLITUDE_SLIDER_DECIMAL_PLACES );
      expandedFormMarkup += EquationFactory.createHarmonicWavelengthFormMarkup( amplitude, n );
      if ( n !== amplitudes.length ) {
        expandedFormMarkup += ` ${MathSymbols.PLUS} `;
      }
      if ( n % 4 === 0 ) {
        expandedFormMarkup += '<br>';
      }
    }

    const expandedFormNode = new RichText( expandedFormMarkup, {
      font: FMWConstants.EQUATION_FONT
    } );

    const content = new VBox( {
      spacing: 15,
      align: 'left',
      children: [ generalFormNode, expandedFormNode ]
    } );

    super( content, options );
  }
}

fourierMakingWaves.register( 'ExpandedSumDialog', ExpandedSumDialog );
export default ExpandedSumDialog;