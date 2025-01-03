// Copyright 2021-2024, University of Colorado Boulder

/**
 * ComponentSpacingToolCheckbox is the checkbox for changing visibility of the Component Spacing tool (e.g. k1) in the
 * 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWColors from '../../common/FMWColors.js';
import FMWDerivedStrings from '../../common/FMWDerivedStrings.js';
import Domain from '../../common/model/Domain.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import CaliperCheckbox from './CaliperCheckbox.js';

export default class ComponentSpacingToolCheckbox extends CaliperCheckbox {

  public constructor( visibleProperty: Property<boolean>, domainProperty: EnumerationProperty<Domain>, tandem: Tandem ) {

    super( visibleProperty, domainProperty, FMWDerivedStrings.k1StringProperty, FMWDerivedStrings.omega1StringProperty, {
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