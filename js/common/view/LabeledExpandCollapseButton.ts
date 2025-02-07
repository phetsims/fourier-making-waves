// Copyright 2021-2024, University of Colorado Boulder

/**
 * LabeledExpandCollapseButton adds a label to the right of an ExpandCollapseButton.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import HBox, { HBoxOptions } from '../../../../scenery/js/layout/nodes/HBox.js';
import FireListener from '../../../../scenery/js/listeners/FireListener.js';
import Text, { TextOptions } from '../../../../scenery/js/nodes/Text.js';
import ExpandCollapseButton from '../../../../sun/js/ExpandCollapseButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWConstants from '../FMWConstants.js';

type SelfOptions = {
  textOptions?: StrictOmit<TextOptions, 'tandem'>;
};

type LabeledExpandCollapseButtonOptions = SelfOptions & PickRequired<HBoxOptions, 'tandem'>;

export default class LabeledExpandCollapseButton extends HBox {

  public constructor( labelStringProperty: TReadOnlyProperty<string>, expandedProperty: Property<boolean>,
                      providedOptions: LabeledExpandCollapseButtonOptions ) {

    const options = optionize<LabeledExpandCollapseButtonOptions, SelfOptions, HBoxOptions>()( {

      // SelfOptions
      textOptions: {
        font: FMWConstants.TITLE_FONT,
        maxWidth: FMWConstants.CHART_TITLE_MAX_WIDTH
      },

      // HBoxOptions
      spacing: 6,
      isDisposable: false
    }, providedOptions );

    const labelText = new Text( labelStringProperty, combineOptions<TextOptions>( {
      cursor: 'pointer'
    }, options.textOptions ) );

    const expandCollapseButton = new ExpandCollapseButton( expandedProperty, {
      sideLength: 16,
      touchAreaXDilation: 6,
      touchAreaYDilation: 6,
      tandem: options.tandem.createTandem( 'expandCollapseButton' )
    } );

    options.children = [ expandCollapseButton, labelText ];

    super( options );

    // Clicking on the label toggles expandedProperty
    labelText.addInputListener( new FireListener( {
      fire: () => {
        expandedProperty.value = !expandedProperty.value;
      },
      tandem: Tandem.OPT_OUT
    } ) );
  }
}

fourierMakingWaves.register( 'LabeledExpandCollapseButton', LabeledExpandCollapseButton );