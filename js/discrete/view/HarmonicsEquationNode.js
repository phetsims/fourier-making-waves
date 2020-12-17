// Copyright 2020, University of Colorado Boulder

/**
 * HarmonicsEquationNode is the equation that appears above the 'Harmonics' chart in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import Domain from '../model/Domain.js';
import EquationForm from '../model/EquationForm.js';
import SeriesType from '../model/SeriesType.js';
import EquationMarkup from './EquationMarkup.js';

class HarmonicsEquationNode extends Node {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<SeriesType>} seriesTypeProperty
   * @param {EnumerationProperty.<EquationForm>} equationFormProperty
   * @param {Object} [options]
   */
  constructor( domainProperty, seriesTypeProperty, equationFormProperty, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertEnumerationPropertyOf( seriesTypeProperty, SeriesType );
    assert && AssertUtils.assertEnumerationPropertyOf( equationFormProperty, EquationForm );

    options = merge( {
      font: FMWConstants.EQUATION_FONT
    }, options );

    // text is set in multilink below
    const richText = new RichText( '', {
      font: options.font
    } );

    assert && assert( !options.children, 'HarmonicsEquationNode sets children' );
    options.children = [ richText ];

    super( options );

    // unmultilink is not needed.
    Property.multilink(
      [ domainProperty, seriesTypeProperty, equationFormProperty ],
      ( domain, seriesType, equationForm ) => {
        this.visible = ( equationForm !== EquationForm.HIDDEN );
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