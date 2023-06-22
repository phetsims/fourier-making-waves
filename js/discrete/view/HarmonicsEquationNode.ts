// Copyright 2020-2023, University of Colorado Boulder

/**
 * HarmonicsEquationNode is the equation that appears above the 'Harmonics' chart in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Disposable from '../../../../axon/js/Disposable.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import { Node, RichText } from '../../../../scenery/js/imports.js';
import FMWConstants from '../../common/FMWConstants.js';
import EquationMarkup from '../../common/view/EquationMarkup.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import Domain from '../../common/model/Domain.js';
import SeriesType from '../../common/model/SeriesType.js';
import EquationForm from '../model/EquationForm.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class HarmonicsEquationNode extends Node {

  public constructor( domainProperty: EnumerationProperty<Domain>,
                      seriesTypeProperty: EnumerationProperty<SeriesType>,
                      equationFormProperty: EnumerationProperty<EquationForm>,
                      tandem: Tandem ) {

    // text is set in multilink below
    const richText = new RichText( '', {
      font: FMWConstants.EQUATION_FONT
    } );

    super( {
      children: [ richText ],
      maxWidth: 0.5 * FMWConstants.CHART_RECTANGLE_SIZE.width,
      visiblePropertyOptions: { phetioReadOnly: true },
      tandem: tandem
    } );

    Multilink.multilink(
      [ domainProperty, seriesTypeProperty, equationFormProperty ],
      ( domain, seriesType, equationForm ) => {
        richText.string = EquationMarkup.getGeneralFormMarkup( domain, seriesType, equationForm );
      }
    );
  }

  public override dispose(): void {
    Disposable.assertNotDisposable();
    super.dispose();
  }
}

fourierMakingWaves.register( 'HarmonicsEquationNode', HarmonicsEquationNode );