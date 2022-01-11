// Copyright 2020-2021, University of Colorado Boulder

/**
 * ExpandedFormDialog is a modal dialog that displays the expanded sum of a Fourier series.
 * This dialog is designed so that 1 instance can be used, and the expand form that is displayed
 * will remain synchronized to the model.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import { HBox } from '../../../../scenery/js/imports.js';
import { RichText } from '../../../../scenery/js/imports.js';
import { Text } from '../../../../scenery/js/imports.js';
import { VBox } from '../../../../scenery/js/imports.js';
import Dialog from '../../../../sun/js/Dialog.js';
import FMWConstants from '../../common/FMWConstants.js';
import Domain from '../../common/model/Domain.js';
import SeriesType from '../../common/model/SeriesType.js';
import EquationMarkup from '../../common/view/EquationMarkup.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import DiscreteFourierSeries from '../model/DiscreteFourierSeries.js';
import EquationForm from '../model/EquationForm.js';
import DiscreteSumEquationNode from './DiscreteSumEquationNode.js';

// Maximum number of terms per line in the expanded form
const TERMS_PER_LINE = 3;
const MAX_WIDTH = 800; // determined empirically

class ExpandedFormDialog extends Dialog {

  /**
   * @param {DiscreteFourierSeries} fourierSeries
   * @param {EnumerationDeprecatedProperty.<Domain>} domainProperty
   * @param {EnumerationDeprecatedProperty.<SeriesType>} seriesTypeProperty
   * @param {EnumerationDeprecatedProperty.<EquationForm>} equationFormProperty
   * @param {Object} [options]
   */
  constructor( fourierSeries, domainProperty, seriesTypeProperty, equationFormProperty, options ) {

    assert && assert( fourierSeries instanceof DiscreteFourierSeries );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertEnumerationPropertyOf( seriesTypeProperty, SeriesType );
    assert && AssertUtils.assertEnumerationPropertyOf( equationFormProperty, EquationForm );

    options = merge( {

      // Dialog options
      xSpacing: 30,

      // phet-io
      phetioReadOnly: true
    }, options );

    assert && assert( !options.title, 'ExpandedFormDialog sets children' );
    options.title = new Text( fourierMakingWavesStrings.expandedForm, {
      font: FMWConstants.DIALOG_TITLE_FONT,
      maxWidth: MAX_WIDTH
    } );

    const sumEquationNode = new DiscreteSumEquationNode( fourierSeries.numberOfHarmonicsProperty, domainProperty,
      seriesTypeProperty, equationFormProperty, {
        font: FMWConstants.EQUATION_FONT
      } );

    // F(...) =
    // There's a bit of CSS cleverness here that's worth explaining. Without resorting to using multiple Nodes here
    // and in DiscreteSumEquationNode, we don't want to see the 'F(..)' portion of this markup. But we need it to be present
    // in order for the '=' to align with 'F(...) =' that's at the beginning of sumEquationNode. So we're hiding the
    // 'F(...)' bit using 'color: transparent'.
    const functionEqualToNode = new RichText( '', {
      font: FMWConstants.EQUATION_FONT
    } );
    domainProperty.link( domain => {
      functionEqualToNode.text = `<span style='color: transparent'>${EquationMarkup.getFunctionOfMarkup( domain )}</span> ${MathSymbols.EQUAL_TO}`;
    } );

    const expandedSumNode = new RichText( '', {
      font: FMWConstants.EQUATION_FONT,
      leading: 11
    } );
    Property.multilink(
      [ fourierSeries.numberOfHarmonicsProperty, fourierSeries.amplitudesProperty, domainProperty, seriesTypeProperty, equationFormProperty ],
      ( numberOfHarmonics, amplitudes, domain, seriesType, equationForm ) => {
        let expandedSumMarkup = '';
        for ( let order = 1; order <= numberOfHarmonics; order++ ) {

          // Limit number of decimal places, and drop trailing zeros.
          // See https://github.com/phetsims/fourier-making-waves/issues/20
          const amplitude = Utils.toFixedNumber( amplitudes[ order - 1 ], FMWConstants.DISCRETE_AMPLITUDE_DECIMAL_PLACES );

          expandedSumMarkup += EquationMarkup.getSpecificFormMarkup( domain, seriesType, equationForm, order, amplitude );
          if ( order < numberOfHarmonics ) {
            expandedSumMarkup += ` ${MathSymbols.PLUS} `;
          }
          if ( order % TERMS_PER_LINE === 0 ) {
            expandedSumMarkup += '<br>';
          }
        }
        expandedSumNode.text = expandedSumMarkup;
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

fourierMakingWaves.register( 'ExpandedFormDialog', ExpandedFormDialog );
export default ExpandedFormDialog;