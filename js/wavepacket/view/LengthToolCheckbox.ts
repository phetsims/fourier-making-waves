// Copyright 2021-2023, University of Colorado Boulder

/**
 * LengthToolCheckbox is the checkbox for changing visibility of the Component Spacing tool (e.g. lambda1) in the
 * 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWColors from '../../common/FMWColors.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import Domain from '../../common/model/Domain.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import CaliperCheckbox from './CaliperCheckbox.js';

export default class LengthToolCheckbox extends CaliperCheckbox {

  public constructor( visibleProperty: Property<boolean>, domainProperty: EnumerationProperty<Domain>, tandem: Tandem ) {

    const spaceSymbolStringProperty = new DerivedStringProperty( [ FMWSymbols.lambdaMarkupStringProperty ],
      lambda => `${lambda}<sub>1</sub>`, {
        tandem: Tandem.OPT_OUT
      } );

    const timeSymbolStringProperty = new DerivedStringProperty( [ FMWSymbols.TMarkupStringProperty ],
      T => `${T}<sub>1</sub>`, {
        tandem: Tandem.OPT_OUT
      } );

    super( visibleProperty, domainProperty, spaceSymbolStringProperty, timeSymbolStringProperty, {
      calipersNodeOptions: {
        pathOptions: {
          fill: FMWColors.wavePacketLengthToolFillProperty
        }
      },
      tandem: tandem
    } );
  }
}

fourierMakingWaves.register( 'LengthToolCheckbox', LengthToolCheckbox );