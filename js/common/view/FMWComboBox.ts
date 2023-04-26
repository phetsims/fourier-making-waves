// Copyright 2020-2023, University of Colorado Boulder

/**
 * FMWComboBox is a specialization of ComboBox that provides an API for specifying combo box items that is more
 * suited to this simulation. Items are specified as a set of value/string choices, and FMWComboBox generates
 * the ComboBoxItems needed by ComboBox.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { Node, RichText, RichTextOptions } from '../../../../scenery/js/imports.js';
import ComboBox, { ComboBoxItem, ComboBoxOptions } from '../../../../sun/js/ComboBox.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWConstants from '../FMWConstants.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

type SelfOptions = {
  textOptions?: RichTextOptions;
};

type FMWComboBoxOptions = SelfOptions & ComboBoxOptions & PickRequired<ComboBoxOptions, 'tandem'>;

export type FMWComboBoxChoice<T> = {
  value: T;
  stringProperty: TReadOnlyProperty<string>; // string label for the choice
  textOptions?: RichTextOptions;
  tandemName: string;
};

export default class FMWComboBox<T> extends ComboBox<T> {

  protected constructor( property: Property<T>, choices: FMWComboBoxChoice<T>[], listboxParent: Node, providedOptions: FMWComboBoxOptions ) {

    const options = optionize<FMWComboBoxOptions, SelfOptions, ComboBoxOptions>()( {

      // SelfOptions
      textOptions: {
        font: FMWConstants.CONTROL_FONT
      },

      // ComboBoxOptions
      xMargin: 12,
      yMargin: 5
    }, providedOptions );

    const items: ComboBoxItem<T>[] = choices.map( choice => {
      return {
        value: choice.value,
        tandemName: choice.tandemName,

        // The majority of strings in this sim contain RichText markup, used to display symbols in MathSymbolFont.
        // And there is negligible performance impact for using RichText for the strings that don't contain markup.
        createNode: () => new RichText( choice.stringProperty, choice.textOptions || options.textOptions )
      };
    } );

    super( property, items, listboxParent, options );
  }
}

fourierMakingWaves.register( 'FMWComboBox', FMWComboBox );