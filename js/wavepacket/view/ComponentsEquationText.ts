// Copyright 2021-2023, University of Colorado Boulder

/**
 * ComponentsEquationText is the equation that appears above the 'Fourier Components' chart in the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import { RichText } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import EquationMarkup from '../../common/view/EquationMarkup.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import SeriesType from '../../common/model/SeriesType.js';
import Domain from '../../common/model/Domain.js';

export default class ComponentsEquationText extends RichText {

  public constructor( domainProperty: EnumerationProperty<Domain>,
                      seriesTypeProperty: EnumerationProperty<SeriesType>,
                      tandem: Tandem ) {

    super( '', {
      font: FMWConstants.EQUATION_FONT,
      maxWidth: 0.5 * FMWConstants.CHART_RECTANGLE_SIZE.width,
      tandem: tandem
    } );

    Multilink.multilink(
      [ domainProperty, seriesTypeProperty ],
      ( domain, seriesType ) => {
        this.string = EquationMarkup.getComponentsEquationMarkup( domain, seriesType );
      } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

fourierMakingWaves.register( 'ComponentsEquationText', ComponentsEquationText );