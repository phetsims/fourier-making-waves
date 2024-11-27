// Copyright 2020-2024, University of Colorado Boulder

/**
 * HarmonicsEquationNode is the equation that appears above the 'Harmonics' chart in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import { Node, RichText } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import Domain from '../../common/model/Domain.js';
import SeriesType from '../../common/model/SeriesType.js';
import EquationMarkup from '../../common/view/EquationMarkup.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import EquationForm from '../model/EquationForm.js';

export default class HarmonicsEquationNode extends Node {

  public constructor( domainProperty: EnumerationProperty<Domain>,
                      seriesTypeProperty: EnumerationProperty<SeriesType>,
                      equationFormProperty: EnumerationProperty<EquationForm>,
                      tandem: Tandem ) {

    // Because we are using one of the EquationMarkup functions, our dependencies must include EquationMarkup.STRING_PROPERTY_DEPENDENCIES.
    const stringProperty = DerivedStringProperty.deriveAny(
      [ domainProperty, seriesTypeProperty, equationFormProperty, ...EquationMarkup.STRING_PROPERTY_DEPENDENCIES ],
      () => EquationMarkup.getGeneralFormMarkup( domainProperty.value, seriesTypeProperty.value, equationFormProperty.value )
    );

    const richText = new RichText( stringProperty, {
      font: FMWConstants.EQUATION_FONT
    } );

    super( {
      children: [ richText ],
      maxWidth: 0.5 * FMWConstants.CHART_RECTANGLE_SIZE.width,
      visiblePropertyOptions: { phetioReadOnly: true },
      isDisposable: false,
      tandem: tandem
    } );
  }
}

fourierMakingWaves.register( 'HarmonicsEquationNode', HarmonicsEquationNode );