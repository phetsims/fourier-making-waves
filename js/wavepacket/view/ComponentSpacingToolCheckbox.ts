// Copyright 2021-2023, University of Colorado Boulder

/**
 * ComponentSpacingToolCheckbox is the checkbox for changing visibility of the Component Spacing tool (e.g. k1) in the
 * 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import FMWColors from '../../common/FMWColors.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import CaliperCheckbox from './CaliperCheckbox.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Domain from '../../common/model/Domain.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class ComponentSpacingToolCheckbox extends CaliperCheckbox {

  public constructor( visibleProperty: Property<boolean>, domainProperty: EnumerationProperty<Domain>, tandem: Tandem ) {

    const spaceSymbolStringProperty = new DerivedProperty( [ FMWSymbols.kStringProperty ],
      k => `${k}<sub>1</sub>` );

    const timeSymbolStringProperty = new DerivedProperty( [ FMWSymbols.omegaStringProperty ],
      omega => `${omega}<sub>1</sub>` );

    super( visibleProperty, domainProperty, spaceSymbolStringProperty, timeSymbolStringProperty, {
      calipersNodeOptions: {
        pathOptions: {
          fill: FMWColors.componentSpacingToolFillProperty
        }
      },
      tandem: tandem
    } );
  }
}

fourierMakingWaves.register( 'ComponentSpacingToolCheckbox', ComponentSpacingToolCheckbox );