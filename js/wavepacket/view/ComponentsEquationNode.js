// Copyright 2021, University of Colorado Boulder

/**
 * ComponentsEquationNode is the equation that appears above the 'Fourier Components' chart in the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import FMWConstants from '../../common/FMWConstants.js';
import Domain from '../../common/model/Domain.js';
import SeriesType from '../../common/model/SeriesType.js';
import EquationMarkup from '../../common/view/EquationMarkup.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class ComponentsEquationNode extends RichText {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<SeriesType>} seriesTypeProperty
   *
   * @param {Object} [options]
   */
  constructor( domainProperty, seriesTypeProperty, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertEnumerationPropertyOf( seriesTypeProperty, SeriesType );

    options = merge( {
      font: FMWConstants.EQUATION_FONT
    }, options );

    super( '', options );

    Property.multilink(
      [ domainProperty, seriesTypeProperty ],
      ( domain, seriesType ) => {
        this.text = EquationMarkup.getComponentsEquationMarkup( domain, seriesType );
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

fourierMakingWaves.register( 'ComponentsEquationNode', ComponentsEquationNode );
export default ComponentsEquationNode;