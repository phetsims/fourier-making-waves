// Copyright 2021-2023, University of Colorado Boulder

/**
 * ComponentsEquationText is the equation that appears above the 'Fourier Components' chart in the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import merge from '../../../../phet-core/js/merge.js';
import { RichText } from '../../../../scenery/js/imports.js';
import FMWConstants from '../../common/FMWConstants.js';
import EquationMarkup from '../../common/view/EquationMarkup.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

export default class ComponentsEquationText extends RichText {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<SeriesType>} seriesTypeProperty
   * @param {Object} [options]
   */
  constructor( domainProperty, seriesTypeProperty, options ) {

    assert && assert( domainProperty instanceof EnumerationProperty );
    assert && assert( seriesTypeProperty instanceof EnumerationProperty );

    options = merge( {
      font: FMWConstants.EQUATION_FONT
    }, options );

    super( '', options );

    Multilink.multilink(
      [ domainProperty, seriesTypeProperty ],
      ( domain, seriesType ) => {
        this.string = EquationMarkup.getComponentsEquationMarkup( domain, seriesType );
      } );
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

fourierMakingWaves.register( 'ComponentsEquationText', ComponentsEquationText );