// Copyright 2020, University of Colorado Boulder

/**
 * ExpandedSumDialog is a modal dialog that displays the expanded sum of a Fourier series.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Dialog from '../../../../sun/js/Dialog.js';
import FMWConstants from '../../common/FMWConstants.js';
import FourierSeries from '../../common/model/FourierSeries.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import Domain from '../model/Domain.js';
import MathForm from '../model/MathForm.js';
import EquationMarkup from './EquationMarkup.js';
import SumEquationNode from './SumEquationNode.js';

class ExpandedSumDialog extends Dialog {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<MathForm>} mathFormProperty
   * @param {Object} [options]
   */
  constructor( fourierSeries, domainProperty, mathFormProperty, options ) {

    assert && assert( fourierSeries instanceof FourierSeries, 'invalid fourierSeries' );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertEnumerationPropertyOf( mathFormProperty, MathForm );

    options = merge( {
      xSpacing: 30
    }, options );

    assert && assert( !options.title, 'ExpandedSumDialog sets children' );
    options.title = new Text( fourierMakingWavesStrings.expandedSum, {
      font: FMWConstants.TITLE_FONT
    } );

    // links to Properties, must be disposed.
    const sumEquationNode = new SumEquationNode( fourierSeries.numberOfHarmonicsProperty, domainProperty, mathFormProperty );

    const amplitudes = fourierSeries.amplitudesProperty.value;
    const domain = domainProperty.value;
    const mathForm = mathFormProperty.value;

    const equalToNode = new RichText( `${MathSymbols.EQUAL_TO} `, {
      font: FMWConstants.EQUATION_FONT
    } );

    let expandedSumMarkup = '';
    for ( let order = 1; order <= amplitudes.length; order++ ) {
      const amplitude = Utils.toFixedNumber( amplitudes[ order - 1 ], FMWConstants.AMPLITUDE_SLIDER_DECIMAL_PLACES );
      expandedSumMarkup += EquationMarkup.getRichTextMarkup( domain, mathForm, order, amplitude );
      if ( order < amplitudes.length ) {
        expandedSumMarkup += ` ${MathSymbols.PLUS} `;
      }
      if ( order % 4 === 0 ) {
        expandedSumMarkup += '<br>';
      }
    }
    const expandedSumNode = new RichText( expandedSumMarkup, {
      font: FMWConstants.EQUATION_FONT
    } );

    const expandedSumHBox = new HBox( {
      spacing: 5,
      align: 'origin',
      children: [ equalToNode, expandedSumNode ]
    } );

    const content = new VBox( {
      spacing: 5,
      align: 'left',
      children: [ sumEquationNode, expandedSumHBox ]
    } );

    super( content, options );

    // @private
    this.disposeExpandedSumDialog = () => {
      sumEquationNode.dispose();
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeExpandedSumDialog();
    super.dispose();
  }
}

fourierMakingWaves.register( 'ExpandedSumDialog', ExpandedSumDialog );
export default ExpandedSumDialog;