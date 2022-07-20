// Copyright 2020-2022, University of Colorado Boulder

/**
 * HarmonicsEquationNode is the equation that appears above the 'Harmonics' chart in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import { Node, RichText } from '../../../../scenery/js/imports.js';
import FMWConstants from '../../common/FMWConstants.js';
import Domain from '../../common/model/Domain.js';
import SeriesType from '../../common/model/SeriesType.js';
import EquationMarkup from '../../common/view/EquationMarkup.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import EquationForm from '../model/EquationForm.js';

class HarmonicsEquationNode extends Node {

  /**
   * @param {EnumerationDeprecatedProperty.<Domain>} domainProperty
   * @param {EnumerationDeprecatedProperty.<SeriesType>} seriesTypeProperty
   * @param {EnumerationDeprecatedProperty.<EquationForm>} equationFormProperty
   * @param {Object} [options]
   */
  constructor( domainProperty, seriesTypeProperty, equationFormProperty, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertEnumerationPropertyOf( seriesTypeProperty, SeriesType );
    assert && AssertUtils.assertEnumerationPropertyOf( equationFormProperty, EquationForm );

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
        richText.text = EquationMarkup.getGeneralFormMarkup( domain, seriesType, equationForm );
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
export default HarmonicsEquationNode;