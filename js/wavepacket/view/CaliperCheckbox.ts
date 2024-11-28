// Copyright 2021-2024, University of Colorado Boulder

/**
 * CaliperCheckbox is a checkbox for changing the visibility of measurement tools that look like calipers.
 * It shows a small calipers icon, and a label changes dynamically to match the Domain.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { optionize4 } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import FMWConstants from '../../common/FMWConstants.js';
import Domain from '../../common/model/Domain.js';
import CalipersNode, { CalipersNodeOptions } from '../../common/view/CalipersNode.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

type SelfOptions = {
  calipersNodeOptions?: CalipersNodeOptions;
};

type CaliperCheckboxOptions = SelfOptions & PickRequired<CheckboxOptions, 'tandem'>;

export default class CaliperCheckbox extends Checkbox {

  public constructor( visibleProperty: Property<boolean>,
                      domainProperty: EnumerationProperty<Domain>,
                      spaceSymbolStringProperty: TReadOnlyProperty<string>,
                      timeSymbolStringProperty: TReadOnlyProperty<string>,
                      providedOptions: CaliperCheckboxOptions ) {

    const options = optionize4<CaliperCheckboxOptions, SelfOptions, CheckboxOptions>()(
      {}, FMWConstants.CHECKBOX_OPTIONS, {
        calipersNodeOptions: {
          measuredWidth: 65,
          labelPosition: 'left', // put label to left of caliper, to minimize vertical space
          scale: 0.5,
          richTextOptions: {
            font: new PhetFont( 25 )
          }
        }
      }, providedOptions );

    const caliperNode = new CalipersNode( options.calipersNodeOptions );

    Multilink.multilink(
      [ domainProperty, spaceSymbolStringProperty, timeSymbolStringProperty ],
      ( domain, spaceSymbol, timeSymbol ) =>
        caliperNode.setLabel( ( domain === Domain.SPACE ) ? spaceSymbol : timeSymbol )
    );

    super( visibleProperty, caliperNode, options );
  }
}

fourierMakingWaves.register( 'CaliperCheckbox', CaliperCheckbox );