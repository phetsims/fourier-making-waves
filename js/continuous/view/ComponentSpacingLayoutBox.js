// Copyright 2021, University of Colorado Boulder

/**
 * ComponentSpacingLayoutBox is the 'Component Spacing' section of the control panel in the 'Continuous' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import Domain from '../../common/model/Domain.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import ComponentSpacingControl from './ComponentSpacingControl.js';

class ComponentSpacingLayoutBox extends VBox {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {DerivedProperty} componentSpacingProperty
   * @param {Property.<number>} componentSpacingIndexProperty
   * @param {Property.<boolean>} continuousWaveformVisibleProperty
   * @param {Object} [options]
   */
  constructor( domainProperty, componentSpacingProperty, componentSpacingIndexProperty, continuousWaveformVisibleProperty, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && assert( componentSpacingProperty instanceof DerivedProperty );
    assert && AssertUtils.assertPropertyOf( componentSpacingIndexProperty, 'number' );
    assert && AssertUtils.assertPropertyOf( continuousWaveformVisibleProperty, 'boolean' );

    options = merge( {}, FMWConstants.VBOX_OPTIONS, {

      // VBox options
      spacing: 8,

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // Component Spacing
    const componentSpacingText = new Text( fourierMakingWavesStrings.componentSpacing, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 200, // determined empirically
      tandem: options.tandem.createTandem( 'componentSpacingText' )
    } );

    // Value display and slider
    const componentSpacingControl = new ComponentSpacingControl( domainProperty, componentSpacingProperty,
      componentSpacingIndexProperty, {
        tandem: options.tandem.createTandem( 'componentSpacingControl' )
      } );

    const continuousWaveformCheckbox = new Checkbox(
      new Text( fourierMakingWavesStrings.continuousWaveform, {
        font: FMWConstants.CONTROL_FONT
      } ),
      continuousWaveformVisibleProperty,
      merge( {}, FMWConstants.CHECKBOX_OPTIONS, {
        tandem: options.tandem.createTandem( 'continuousWaveformCheckbox' )
      } )
    );

    assert && assert( !options.children, 'ComponentSpacingLayoutBox sets children' );
    options.children = [
      componentSpacingText,
      componentSpacingControl,
      continuousWaveformCheckbox
    ];

    super( options );
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

fourierMakingWaves.register( 'ComponentSpacingLayoutBox', ComponentSpacingLayoutBox );
export default ComponentSpacingLayoutBox;