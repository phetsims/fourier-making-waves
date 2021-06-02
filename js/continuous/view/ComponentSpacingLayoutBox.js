// Copyright 2020-2021, University of Colorado Boulder

/**
 * ComponentSpacingLayoutBox is the 'Component Spacing' section of the control panel in the 'Continuous' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import Domain from '../../common/model/Domain.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import ComponentSpacingSlider from './ComponentSpacingSlider.js';

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

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, FMWConstants.VBOX_OPTIONS, options );

    // Component Spacing
    const componentSpacingText = new Text( fourierMakingWavesStrings.componentSpacing, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 200, // determined empirically
      tandem: options.tandem.createTandem( 'componentSpacingText' )
    } );

    const componentSpacingValueNode = new RichText( '', {
      font: FMWConstants.CONTROL_FONT,
      tandem: options.tandem.createTandem( 'componentSpacingValueNode' )
    } );

    const componentSpacingSlider = new ComponentSpacingSlider( componentSpacingIndexProperty, {
      tandem: options.tandem.createTandem( 'componentSpacingSlider' )
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
      componentSpacingValueNode,
      componentSpacingSlider,
      continuousWaveformCheckbox
    ];

    super( options );

    // Update the displayed value for component spacing.
    Property.multilink(
      [ domainProperty, componentSpacingProperty ],
      ( domain, componentSpacing ) => {
        const value = Utils.roundToInterval( componentSpacing, 0.01 );
        if ( domain === Domain.SPACE ) {
          componentSpacingValueNode.text = StringUtils.fillIn( fourierMakingWavesStrings.k1EqualsValue, {
            k: FMWSymbols.k,
            value: value
          } );
        }
        else {
          componentSpacingValueNode.text = StringUtils.fillIn( fourierMakingWavesStrings.omega1EqualsValue, {
            omega: FMWSymbols.omega,
            value: value
          } );
        }
      } );
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