// Copyright 2020-2025, University of Colorado Boulder

/**
 * EquationComboBox is the combo box for choosing the equation form that is displayed in the 'Discrete' screen.
 * See also EquationForm enumeration.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWDerivedStrings from '../../common/FMWDerivedStrings.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import Domain from '../../common/model/Domain.js';
import FMWComboBox, { FMWComboBoxChoice } from '../../common/view/FMWComboBox.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierMakingWavesStrings from '../../FourierMakingWavesStrings.js';
import EquationForm from '../model/EquationForm.js';

const TEXT_MAX_WIDTH = 70;

const MATH_TEXT_OPTIONS = {
  font: FMWConstants.MATH_CONTROL_FONT,
  maxWidth: TEXT_MAX_WIDTH
};

// This format is specific to FMWComboBox.
const CHOICES: FMWComboBoxChoice<EquationForm>[] = [
  {
    value: EquationForm.HIDDEN,
    stringProperty: FourierMakingWavesStrings.hiddenStringProperty,
    textOptions: {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: TEXT_MAX_WIDTH
    },
    // This is the only choice that does not have textOptions: MATH_TEXT_OPTIONS, because it's not an equation.
    tandemName: 'hiddenItem'
  },
  {
    value: EquationForm.WAVELENGTH,
    stringProperty: FMWSymbols.lambdaMarkupStringProperty,
    textOptions: MATH_TEXT_OPTIONS,
    tandemName: 'wavelengthItem'
  },
  {
    value: EquationForm.SPATIAL_WAVE_NUMBER,
    stringProperty: FMWSymbols.kMarkupStringProperty,
    textOptions: MATH_TEXT_OPTIONS,
    tandemName: 'spatialWaveNumberItem'
  },
  {
    value: EquationForm.FREQUENCY,
    stringProperty: FMWSymbols.fMarkupStringProperty,
    textOptions: MATH_TEXT_OPTIONS,
    tandemName: 'frequencyItem'
  },
  {
    value: EquationForm.PERIOD,
    stringProperty: FMWSymbols.TMarkupStringProperty,
    textOptions: MATH_TEXT_OPTIONS,
    tandemName: 'periodItem'
  },
  {
    value: EquationForm.ANGULAR_WAVE_NUMBER,
    stringProperty: FMWSymbols.omegaMarkupStringProperty,
    textOptions: MATH_TEXT_OPTIONS,
    tandemName: 'angularWaveNumberItem'
  },
  {
    value: EquationForm.WAVELENGTH_AND_PERIOD,
    stringProperty: FMWDerivedStrings.lambdaAndTStringProperty,
    textOptions: MATH_TEXT_OPTIONS,
    tandemName: 'wavelengthAndPeriodItem'
  },
  {
    value: EquationForm.SPATIAL_WAVE_NUMBER_AND_ANGULAR_WAVE_NUMBER,
    stringProperty: FMWDerivedStrings.kAndOmegaStringProperty,
    textOptions: MATH_TEXT_OPTIONS,
    tandemName: 'spatialWaveNumberAndAngularWaveNumberItem'
  },
  {
    value: EquationForm.MODE,
    stringProperty: FMWSymbols.nMarkupStringProperty,
    textOptions: MATH_TEXT_OPTIONS,
    tandemName: 'modeItem'
  }
];

export default class EquationComboBox extends FMWComboBox<EquationForm> {

  public constructor( equationFormProperty: EnumerationProperty<EquationForm>,
                      domainProperty: EnumerationProperty<Domain>,
                      popupParent: Node,
                      tandem: Tandem ) {

    super( equationFormProperty, CHOICES, popupParent, {
      isDisposable: false,
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
}

fourierMakingWaves.register( 'EquationComboBox', EquationComboBox );