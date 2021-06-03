// Copyright 2021, University of Colorado Boulder

/**
 * ComponentsEquationNode is the equation that appears above the 'Components' chart in the 'Continuous' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import Domain from '../../common/model/Domain.js';
import SeriesType from '../../common/model/SeriesType.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class ComponentsEquationNode extends RichText {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<SeriesType>} seriesTypeProperty
   * @param {Object} [options]
   */
  constructor( domainProperty, seriesTypeProperty, options ) {

    options = merge( {
      font: FMWConstants.EQUATION_FONT
    }, options );

    super( '', options );

    Property.multilink(
      [ domainProperty, seriesTypeProperty ],
      ( domain, seriesType ) => {
        const domainSymbol = ( domain === Domain.SPACE ) ? FMWSymbols.x : FMWSymbols.t;
        const componentSymbol = ( domain === Domain.SPACE ) ? FMWSymbols.k : FMWSymbols.omega;
        const seriesTypeString = ( seriesType === SeriesType.SINE ) ? FMWSymbols.sin : FMWSymbols.cos;
        this.text = `${FMWSymbols.A}<sub>${FMWSymbols.n}</sub> ` +
                    `${seriesTypeString}( ${componentSymbol}<sub>${FMWSymbols.n}</sub>${domainSymbol} )`;
      } );
  }
}

fourierMakingWaves.register( 'ComponentsEquationNode', ComponentsEquationNode );
export default ComponentsEquationNode;