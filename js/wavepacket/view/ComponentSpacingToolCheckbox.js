// Copyright 2021, University of Colorado Boulder

/**
 * ComponentSpacingToolCheckbox is the checkbox for changing visibility of the Component Spacing tool in the
 * 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import FMWColors from '../../common/FMWColors.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import CaliperCheckbox from './CaliperCheckbox.js';

class ComponentSpacingToolCheckbox extends CaliperCheckbox {

  /**
   * @param {Property.<boolean>} visibleProperty
   * @param {Property.<Domain>} domainProperty
   * @param {Object} [options]
   */
  constructor( visibleProperty, domainProperty, options ) {

    options = merge( {
      calipersNodeOptions: {
        pathOptions: {
          fill: FMWColors.componentSpacingToolFillProperty
        }
      }
    }, options );

    const spaceSymbol = `${FMWSymbols.kStringProperty.value}<sub>1</sub>`;
    const timeSymbol = `${FMWSymbols.omega}<sub>1</sub>`;

    super( visibleProperty, domainProperty, spaceSymbol, timeSymbol, options );
  }
}

fourierMakingWaves.register( 'ComponentSpacingToolCheckbox', ComponentSpacingToolCheckbox );
export default ComponentSpacingToolCheckbox;