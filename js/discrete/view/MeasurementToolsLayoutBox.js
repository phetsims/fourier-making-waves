// Copyright 2020-2021, University of Colorado Boulder

/**
 * MeasurementToolsLayoutBox is the 'Measurement Tools' section of the control panel in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import AlignBox from '../../../../scenery/js/nodes/AlignBox.js';
import AlignGroup from '../../../../scenery/js/nodes/AlignGroup.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymobls from '../../common/FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import Domain from '../../common/model/Domain.js';
import MeasurementTool from '../model/MeasurementTool.js';
import OrderSpinner from './OrderSpinner.js';

class MeasurementToolsLayoutBox extends VBox {

  /**
   * @param {MeasurementTool} wavelengthTool
   * @param {MeasurementTool} periodTool
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Object} [options]
   */
  constructor( wavelengthTool, periodTool, domainProperty, options ) {

    assert && assert( wavelengthTool instanceof MeasurementTool );
    assert && assert( periodTool instanceof MeasurementTool );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, FMWConstants.VBOX_OPTIONS, options );

    // Measurement Tools
    const measurementToolsText = new Text( fourierMakingWavesStrings.measurementTools, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 200, // determined empirically
      tandem: options.tandem.createTandem( 'measurementToolsText' )
    } );

    // To make checkboxes have the same effective width
    const checkboxAlignBoxOptions = {
      group: new AlignGroup( { matchVertical: false } ),
      xAlign: 'left'
    };

    // To make spinners have the same effective width
    const spinnerAlignBoxOptions = {
      group: new AlignGroup( { matchVertical: false } ),
      xAlign: 'center'
    };

    const hBoxOptions = {
      spacing: 10
    };

    // Wavelength
    const wavelengthText = new Text( fourierMakingWavesStrings.wavelength, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 80, // determined empirically
      tandem: options.tandem.createTandem( 'wavelengthText' )
    } );
    const wavelengthCheckbox = new Checkbox( wavelengthText, wavelengthTool.isSelectedProperty,
      merge( {}, FMWConstants.CHECKBOX_OPTIONS, {
        tandem: options.tandem.createTandem( 'wavelengthCheckbox' )
      } ) );
    const wavelengthSpinner = new OrderSpinner( FMWSymobls.lambda, wavelengthTool.orderProperty, {
      tandem: options.tandem.createTandem( 'wavelengthSpinner' )
    } );
    const wavelengthBox = new HBox( merge( {}, hBoxOptions, {
      children: [
        new AlignBox( wavelengthCheckbox, checkboxAlignBoxOptions ),
        new AlignBox( wavelengthSpinner, spinnerAlignBoxOptions )
      ]
    } ) );

    // Period
    const periodText = new Text( fourierMakingWavesStrings.period, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 80, // determined empirically
      tandem: options.tandem.createTandem( 'periodText' )
    } );
    const periodCheckbox = new Checkbox( periodText, periodTool.isSelectedProperty,
      merge( {}, FMWConstants.CHECKBOX_OPTIONS, {
        tandem: options.tandem.createTandem( 'periodCheckbox' )
      } ) );
    const periodSpinner = new OrderSpinner( FMWSymobls.T, periodTool.orderProperty, {
      tandem: options.tandem.createTandem( 'periodSpinner' )
    } );
    const periodBox = new HBox( merge( {}, hBoxOptions, {
      children: [
        new AlignBox( periodCheckbox, checkboxAlignBoxOptions ),
        new AlignBox( periodSpinner, spinnerAlignBoxOptions )
      ]
    } ) );

    assert && assert( !options.children, 'MeasurementToolsLayoutBox sets children' );
    options.children = [
      measurementToolsText,
      wavelengthBox,
      periodBox
    ];

    super( options );

    // unlink is not necessary
    wavelengthTool.isSelectedProperty.link( enabled => {
      !enabled && wavelengthSpinner.interruptSubtreeInput();
    } );

    // unlink is not necessary
    periodTool.isSelectedProperty.link( enabled => {
      !enabled && periodSpinner.interruptSubtreeInput();
    } );

    // unlink is not necessary
    domainProperty.link( domain => {

      // Wavelength measurement is enabled when domain involves space.
      const hasSpace = ( domain === Domain.SPACE || domain === Domain.SPACE_AND_TIME );
      wavelengthCheckbox.enabledProperty.value = hasSpace;
      wavelengthSpinner.enabledProperty.value = hasSpace;

      // Period measurement is enabled when domain involves time.
      const hasTime = ( domain === Domain.TIME || domain === Domain.SPACE_AND_TIME );
      periodCheckbox.enabledProperty.value = hasTime;
      periodSpinner.enabledProperty.value = hasTime;
    } );

    // Interrupt input for controls that can be disabled.
    wavelengthCheckbox.enabledProperty.link( () => wavelengthCheckbox.interruptSubtreeInput() );
    wavelengthSpinner.enabledProperty.link( () => wavelengthSpinner.interruptSubtreeInput() );
    periodCheckbox.enabledProperty.link( () => periodCheckbox.interruptSubtreeInput() );
    periodSpinner.enabledProperty.link( () => periodSpinner.interruptSubtreeInput() );
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

fourierMakingWaves.register( 'MeasurementToolsLayoutBox', MeasurementToolsLayoutBox );
export default MeasurementToolsLayoutBox;