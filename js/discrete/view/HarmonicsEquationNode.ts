// Copyright 2020-2023, University of Colorado Boulder

/**
 * HarmonicsEquationNode is the equation that appears above the 'Harmonics' chart in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import merge from '../../../../phet-core/js/merge.js';
import { Node, RichText } from '../../../../scenery/js/imports.js';
import FMWConstants from '../../common/FMWConstants.js';
import EquationMarkup from '../../common/view/EquationMarkup.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

export default class HarmonicsEquationNode extends Node {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<SeriesType>} seriesTypeProperty
   * @param {EnumerationProperty.<EquationForm>} equationFormProperty
   * @param {Object} [options]
   */
  constructor( domainProperty, seriesTypeProperty, equationFormProperty, options ) {

    assert && assert( domainProperty instanceof EnumerationProperty );
    assert && assert( seriesTypeProperty instanceof EnumerationProperty );
    assert && assert( equationFormProperty instanceof EnumerationProperty );

    options = merge( {
      textOptions: {
        font: FMWConstants.EQUATION_FONT
      }
    }, options );

    // text is set in multilink below
    const richText = new RichText( '', options.textOptions );

    assert && assert( !options.children, 'HarmonicsEquationNode sets children' );
    options.children = [ richText ];

    super( options );

    Multilink.multilink(
      [ domainProperty, seriesTypeProperty, equationFormProperty ],
      ( domain, seriesType, equationForm ) => {
        richText.string = EquationMarkup.getGeneralFormMarkup( domain, seriesType, equationForm );
      }
    );
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

fourierMakingWaves.register( 'HarmonicsEquationNode', HarmonicsEquationNode );