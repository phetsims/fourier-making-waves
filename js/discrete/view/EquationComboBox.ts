// Copyright 2020-2023, University of Colorado Boulder

/**
 * EquationComboBox is the combo box for choosing the equation form that is displayed in the 'Discrete' screen.
 * See also EquationForm enumeration.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import { Node } from '../../../../scenery/js/imports.js';
import ComboBox from '../../../../sun/js/ComboBox.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import Domain from '../../common/model/Domain.js';
import FMWComboBox, { FMWComboBoxChoice } from '../../common/view/FMWComboBox.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';
import EquationForm from '../model/EquationForm.js';
import Tandem from '../../../../tandem/js/Tandem.js';

const MATH_TEXT_OPTIONS = {
  font: FMWConstants.MATH_CONTROL_FONT,
  maxWidth: 100
};

// This format is specific to FMWComboBox.
const CHOICES: FMWComboBoxChoice<EquationForm>[] = [
  {
    value: EquationForm.HIDDEN,
    stringProperty: FourierMakingWavesStrings.hiddenStringProperty,
    // This is the only choice that does not have textOptions: MATH_TEXT_OPTIONS, because it's not an equation.
    tandemName: `hidden${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
  },
  {
    value: EquationForm.WAVELENGTH,
    stringProperty: FMWSymbols.lambdaStringProperty,
    textOptions: MATH_TEXT_OPTIONS,
    tandemName: `wavelength${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
  },
  {
    value: EquationForm.SPATIAL_WAVE_NUMBER,
    stringProperty: FMWSymbols.kStringProperty,
    textOptions: MATH_TEXT_OPTIONS,
    tandemName: `spatialWaveNumber${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
  },
  {
    value: EquationForm.FREQUENCY,
    stringProperty: FMWSymbols.fStringProperty,
    textOptions: MATH_TEXT_OPTIONS,
    tandemName: `frequency${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
  },
  {
    value: EquationForm.PERIOD,
    stringProperty: FMWSymbols.TStringProperty,
    textOptions: MATH_TEXT_OPTIONS,
    tandemName: `period${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
  },
  {
    value: EquationForm.ANGULAR_WAVE_NUMBER,
    stringProperty: FMWSymbols.omegaStringProperty,
    textOptions: MATH_TEXT_OPTIONS,
    tandemName: `angularWaveNumber${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
  },
  {
    value: EquationForm.WAVELENGTH_AND_PERIOD,
    stringProperty: new PatternStringProperty( FourierMakingWavesStrings.symbolAndSymbolStringProperty, {
      symbol1: FMWSymbols.lambdaStringProperty,
      symbol2: FMWSymbols.TStringProperty
    } ),
    textOptions: MATH_TEXT_OPTIONS,
    tandemName: `wavelengthAndPeriod${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
  },
  {
    value: EquationForm.SPATIAL_WAVE_NUMBER_AND_ANGULAR_WAVE_NUMBER,
    stringProperty: new PatternStringProperty( FourierMakingWavesStrings.symbolAndSymbolStringProperty, {
      symbol1: FMWSymbols.kStringProperty,
      symbol2: FMWSymbols.omegaStringProperty
    } ),
    textOptions: MATH_TEXT_OPTIONS,
    tandemName: `spatialWaveNumberAndAngularWaveNumber${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
  },
  {
    value: EquationForm.MODE,
    stringProperty: FMWSymbols.nStringProperty,
    textOptions: MATH_TEXT_OPTIONS,
    tandemName: `mode${ComboBox.ITEM_TANDEM_NAME_SUFFIX}`
  }
];

export default class EquationComboBox extends FMWComboBox<EquationForm> {

  public constructor( equationFormProperty: EnumerationProperty<EquationForm>,
                      domainProperty: EnumerationProperty<Domain>,
                      popupParent: Node,
                      tandem: Tandem ) {

    super( equationFormProperty, CHOICES, popupParent, {
      textOptions: {
        maxWidth: 100 // determined empirically
      },
      tandem: tandem
    } );

    // Show only the choices that are appropriate for the selected Domain.
    domainProperty.link( domain => {
      assert && assert( Domain.enumeration.includes( domain ) );

      // No need to adjust EquationForm.HIDDEN or EquationForm.MODE. They are appropriate for all Domain values.

      // Domain.SPACE
      const isSpace = ( domain === Domain.SPACE );
      this.setItemVisible( EquationForm.WAVELENGTH, isSpace );
      this.setItemVisible( EquationForm.SPATIAL_WAVE_NUMBER, isSpace );

      // Domain.TIME
      const isTime = ( domain === Domain.TIME );
      this.setItemVisible( EquationForm.FREQUENCY, isTime );
      this.setItemVisible( EquationForm.PERIOD, isTime );
      this.setItemVisible( EquationForm.ANGULAR_WAVE_NUMBER, isTime );

      // Domain.SPACE_AND_TIME
      const isSpaceAmdTime = ( domain === Domain.SPACE_AND_TIME );
      this.setItemVisible( EquationForm.WAVELENGTH_AND_PERIOD, isSpaceAmdTime );
      this.setItemVisible( EquationForm.SPATIAL_WAVE_NUMBER_AND_ANGULAR_WAVE_NUMBER, isSpaceAmdTime );
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

fourierMakingWaves.register( 'EquationComboBox', EquationComboBox );