// Copyright 2020, University of Colorado Boulder

/**
 * MeasurementToolsLayoutBox is the 'Measurement Tools' section of the control panel in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import AlignBox from '../../../../scenery/js/nodes/AlignBox.js';
import AlignGroup from '../../../../scenery/js/nodes/AlignGroup.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import Domain from '../model/Domain.js';

// constants
const NUMBER_SPINNER_OPTIONS = {
  arrowsPosition: 'leftRight',
  arrowsScale: 0.85,
  numberDisplayOptions: {
    useRichText: true,
    cornerRadius: 3,
    textOptions: {
      font: FMWConstants.CONTROL_FONT
    }
  }
};

class MeasurementToolsLayoutBox extends VBox {

  /**
   * @param {Property.<boolean>} wavelengthToolEnabledProperty
   * @param {NumberProperty} selectedWavelengthProperty
   * @param {Property.<boolean>} periodToolEnabledProperty
   * @param {NumberProperty} selectedPeriodProperty
   * @param {NumberProperty} numberOfHarmonicsProperty
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Object} [options]
   */
  constructor( wavelengthToolEnabledProperty, selectedWavelengthProperty,
               periodToolEnabledProperty, selectedPeriodProperty,
               numberOfHarmonicsProperty, domainProperty, options ) {

    assert && AssertUtils.assertPropertyOf( wavelengthToolEnabledProperty, 'boolean' );
    assert && assert( selectedWavelengthProperty instanceof NumberProperty, 'invalid selectedWavelengthProperty' );
    assert && AssertUtils.assertPropertyOf( periodToolEnabledProperty, 'boolean' );
    assert && assert( selectedPeriodProperty instanceof NumberProperty, 'invalid selectedPeriodProperty' );
    assert && assert( numberOfHarmonicsProperty instanceof NumberProperty, 'invalid numberOfHarmonicsProperty' );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );

    options = merge( {}, FMWConstants.VBOX_OPTIONS, options );

    // Measurement Tools
    const titleText = new Text( fourierMakingWavesStrings.measurementTools, {
      font: FMWConstants.TITLE_FONT
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
      font: FMWConstants.CONTROL_FONT
    } );
    const wavelengthCheckbox = new Checkbox( wavelengthText, wavelengthToolEnabledProperty, FMWConstants.CHECKBOX_OPTIONS );
    const wavelengthSpinner = new NumberSpinner( selectedWavelengthProperty, selectedWavelengthProperty.rangeProperty, merge( {}, {
      numberDisplayOptions: {
        numberFormatter: order => StringUtils.fillIn( fourierMakingWavesStrings.wavelengthOrder, {
          symbol: FMWSymbols.SMALL_LAMBDA,
          order: order
        } )
      }
    }, NUMBER_SPINNER_OPTIONS ) );
    const wavelengthBox = new HBox( merge( {}, hBoxOptions, {
      children: [
        new AlignBox( wavelengthCheckbox, checkboxAlignBoxOptions ),
        new AlignBox( wavelengthSpinner, spinnerAlignBoxOptions )
      ]
    } ) );

    // Period
    const periodText = new Text( fourierMakingWavesStrings.period, {
      font: FMWConstants.CONTROL_FONT
    } );
    const periodCheckbox = new Checkbox( periodText, periodToolEnabledProperty, FMWConstants.CHECKBOX_OPTIONS );
    const periodSpinner = new NumberSpinner( selectedPeriodProperty, selectedPeriodProperty.rangeProperty, merge( {}, {
      numberDisplayOptions: {
        numberFormatter: order => StringUtils.fillIn( fourierMakingWavesStrings.periodOrder, {
          symbol: FMWSymbols.CAPITAL_T,
          order: order
        } )
      }
    }, NUMBER_SPINNER_OPTIONS ) );
    const periodBox = new HBox( merge( {}, hBoxOptions, {
      children: [
        new AlignBox( periodCheckbox, checkboxAlignBoxOptions ),
        new AlignBox( periodSpinner, spinnerAlignBoxOptions )
      ]
    } ) );

    assert && assert( !options.children, 'MeasurementToolsLayoutBox sets children' );
    options.children = [
      titleText,
      wavelengthBox,
      periodBox
    ];

    super( options );

    // unlink is not necessary
    wavelengthToolEnabledProperty.link( enabled => {
      !enabled && wavelengthSpinner.interruptSubtreeInput();
    } );

    // unlink is not necessary
    periodToolEnabledProperty.link( enabled => {
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