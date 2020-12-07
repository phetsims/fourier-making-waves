// Copyright 2020, University of Colorado Boulder

/**
 * ExpandedFormDialog is a modal dialog that displays the expanded sum of a Fourier series.
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
import WaveType from '../model/WaveType.js';
import EquationMarkup from './EquationMarkup.js';
import SumEquationNode from './SumEquationNode.js';

// Maximum number of terms per line in the expanded form
const TERMS_PER_LINE = 3;
const MAX_WIDTH = 800; // determined empirically

class ExpandedFormDialog extends Dialog {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<WaveType>} waveTypeProperty
   * @param {EnumerationProperty.<MathForm>} mathFormProperty
   * @param {Object} [options]
   */
  constructor( fourierSeries, domainProperty, waveTypeProperty, mathFormProperty, options ) {

    assert && assert( fourierSeries instanceof FourierSeries, 'invalid fourierSeries' );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertEnumerationPropertyOf( waveTypeProperty, WaveType );
    assert && AssertUtils.assertEnumerationPropertyOf( mathFormProperty, MathForm );

    options = merge( {
      xSpacing: 30
    }, options );

    assert && assert( !options.title, 'ExpandedFormDialog sets children' );
    options.title = new Text( fourierMakingWavesStrings.expandedForm, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: MAX_WIDTH
    } );

    // links to Properties, must be disposed.
    const sumEquationNode = new SumEquationNode( fourierSeries.numberOfHarmonicsProperty, domainProperty,
      waveTypeProperty, mathFormProperty, {
        font: FMWConstants.EQUATION_FONT
      } );

    const amplitudes = fourierSeries.amplitudesProperty.value;
    const domain = domainProperty.value;
    const waveType = waveTypeProperty.value;
    const mathForm = mathFormProperty.value;

    // F(...) =
    // There's a bit of CSS cleverness here that's worth explaining. Without resorting to using multiple Nodes here
    // and in SumEquationNode, we don't want to see the 'F(..)' portion of this markup. But we need it to be present
    // in order for the '=' to align with 'F(...) =' that's at the beginning of sumEquationNode. So we're hiding the
    // 'F(...)' bit using 'color: transparent'.
    const functionEqualToNode = new RichText( `<span style='color: transparent'>${EquationMarkup.getFunctionOfMarkup( domain )}</span> ${MathSymbols.EQUAL_TO}`, {
      font: FMWConstants.EQUATION_FONT
    } );

    let expandedSumMarkup = '';
    for ( let order = 1; order <= amplitudes.length; order++ ) {

      // Limit number of decimal places, and drop trailing zeros.
      // See https://github.com/phetsims/fourier-making-waves/issues/20
      const amplitude = Utils.toFixedNumber( amplitudes[ order - 1 ], FMWConstants.AMPLITUDE_SLIDER_DECIMAL_PLACES );

      expandedSumMarkup += EquationMarkup.getSpecificFormMarkup( domain, waveType, mathForm, order, amplitude );
      if ( order < amplitudes.length ) {
        expandedSumMarkup += ` ${MathSymbols.PLUS} `;
      }
      if ( order % TERMS_PER_LINE === 0 ) {
        expandedSumMarkup += '<br>';
      }
    }
    const expandedSumNode = new RichText( expandedSumMarkup, {
      font: FMWConstants.EQUATION_FONT,
      leading: 11
    } );

    const expandedSumHBox = new HBox( {
      spacing: 4,
      align: 'origin',
      children: [ functionEqualToNode, expandedSumNode ]
    } );

    const content = new VBox( {
      spacing: 8,
      align: 'left',
      children: [ sumEquationNode, expandedSumHBox ],
      maxWidth: MAX_WIDTH
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

fourierMakingWaves.register( 'ExpandedFormDialog', ExpandedFormDialog );
export default ExpandedFormDialog;