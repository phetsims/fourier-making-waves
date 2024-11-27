// Copyright 2020-2024, University of Colorado Boulder

/**
 * ExpandedFormDialog is a modal dialog that displays the expanded sum of a Fourier series.
 * This dialog is designed so that 1 instance can be used, and the expand form that is displayed
 * will remain synchronized to the model.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import { HBox, RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import Dialog from '../../../../sun/js/Dialog.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import Domain from '../../common/model/Domain.js';
import SeriesType from '../../common/model/SeriesType.js';
import EquationMarkup from '../../common/view/EquationMarkup.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';
import DiscreteFourierSeries from '../model/DiscreteFourierSeries.js';
import EquationForm from '../model/EquationForm.js';
import DiscreteSumEquationNode from './DiscreteSumEquationNode.js';

// Maximum number of terms per line in the expanded form
const TERMS_PER_LINE = 3;
const MAX_WIDTH = 800; // determined empirically

export default class ExpandedFormDialog extends Dialog {

  public constructor( fourierSeries: DiscreteFourierSeries,
                      domainProperty: EnumerationProperty<Domain>,
                      seriesTypeProperty: EnumerationProperty<SeriesType>,
                      equationFormProperty: EnumerationProperty<EquationForm>,
                      tandem: Tandem ) {

    const titleText = new Text( FourierMakingWavesStrings.expandedFormStringProperty, {
      font: FMWConstants.DIALOG_TITLE_FONT,
      maxWidth: MAX_WIDTH
    } );

    const sumEquationNode = new DiscreteSumEquationNode( fourierSeries.numberOfHarmonicsProperty, domainProperty,
      seriesTypeProperty, equationFormProperty, {
        tandem: Tandem.OPT_OUT
      } );

    // F(...) =
    // There's a bit of CSS cleverness here that's worth explaining. Without resorting to using multiple Nodes here
    // and in DiscreteSumEquationNode, we don't want to see the 'F(..)' portion of this markup. But we need it to be present
    // in order for the '=' to align with 'F(...) =' that's at the beginning of sumEquationNode. So we're hiding the
    // 'F(...)' bit using 'color: transparent'.
    // Because we are using one of the EquationMarkup functions, our dependencies must include EquationMarkup.STRING_PROPERTY_DEPENDENCIES.
    const functionEqualToStringProperty = DerivedStringProperty.deriveAny(
      [ domainProperty, ...EquationMarkup.STRING_PROPERTY_DEPENDENCIES ],
      () => `<span style='color: transparent'>${EquationMarkup.getFunctionOfMarkup( domainProperty.value )}</span> ${MathSymbols.EQUAL_TO}`
    );
    const functionEqualToNode = new RichText( functionEqualToStringProperty, {
      font: FMWConstants.EQUATION_FONT
    } );

    // Because we are using one of the EquationMarkup functions, our dependencies must include EquationMarkup.STRING_PROPERTY_DEPENDENCIES.
    const expandedSumStringProperty = DerivedStringProperty.deriveAny( [
        fourierSeries.numberOfHarmonicsProperty, fourierSeries.amplitudesProperty, domainProperty, seriesTypeProperty,
        equationFormProperty, ...EquationMarkup.STRING_PROPERTY_DEPENDENCIES
      ],
      () => {

        const numberOfHarmonics = fourierSeries.numberOfHarmonicsProperty.value;
        const amplitudes = fourierSeries.amplitudesProperty.value;
        const domain = domainProperty.value;
        const seriesType = seriesTypeProperty.value;
        const equationForm = equationFormProperty.value;

        let expandedSumString = '';
        for ( let order = 1; order <= numberOfHarmonics; order++ ) {

          // Limit number of decimal places, and drop trailing zeros.
          // See https://github.com/phetsims/fourier-making-waves/issues/20
          const amplitude = Utils.toFixedNumber( amplitudes[ order - 1 ], FMWConstants.DISCRETE_AMPLITUDE_DECIMAL_PLACES );

          expandedSumString += EquationMarkup.getSpecificFormMarkup( domain, seriesType, equationForm, order, amplitude );
          if ( order < numberOfHarmonics ) {
            expandedSumString += ` ${MathSymbols.PLUS} `;
          }
          if ( order % TERMS_PER_LINE === 0 ) {
            expandedSumString += '<br>';
          }
        }
        return expandedSumString;
      } );
    const expandedSumNode = new RichText( expandedSumStringProperty, {
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

    super( content, {

      // DialogOptions
      title: titleText,
      xSpacing: 30,
      isDisposable: false,
      tandem: tandem,
      phetioReadOnly: true,
      phetioDocumentation: 'This dialog shows the expanded form of the Sum equation.'
    } );
  }
}

fourierMakingWaves.register( 'ExpandedFormDialog', ExpandedFormDialog );