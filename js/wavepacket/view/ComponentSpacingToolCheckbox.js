// Copyright 2021, University of Colorado Boulder

/**
 * ComponentSpacingToolCheckbox is the checkbox for changing visibility of the Component Spacing tool in the
 * 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import FMWColors from '../../common/FMWColors.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import CaliperCheckbox from './CaliperCheckbox.js';

class ComponentSpacingToolCheckbox extends CaliperCheckbox {

  /**
   * @param {Property.<boolean>} visibleProperty
   * @param {EnumerationDeprecatedProperty.<Domain>} domainProperty
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

    const spaceSymbolStringProperty = new DerivedProperty( [ FMWSymbols.kStringProperty ],
      k => `${k}<sub>1</sub>` );

    const timeSymbolStringProperty = new DerivedProperty( [ FMWSymbols.omegaStringProperty ],
      omega => `${omega}<sub>1</sub>` );

    super( visibleProperty, domainProperty, spaceSymbolStringProperty, timeSymbolStringProperty, options );
  }
}

fourierMakingWaves.register( 'ComponentSpacingToolCheckbox', ComponentSpacingToolCheckbox );
export default ComponentSpacingToolCheckbox;