// Copyright 2020-2021, University of Colorado Boulder

/**
 * EquationComboBox is the combo box for choosing the equation form that is displayed in the 'Discrete' screen.
 * See also EquationForm enumeration.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import Domain from '../../common/model/Domain.js';
import FMWComboBox from '../../common/view/FMWComboBox.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import EquationForm from '../model/EquationForm.js';

const MATH_TEXT_OPTIONS = {
  font: FMWConstants.MATH_CONTROL_FONT,
  maxWidth: 100
};

// This format is specific to FMWComboBox.
const CHOICES = [
  {
    value: EquationForm.HIDDEN,
    string: fourierMakingWavesStrings.hidden,
    tandemName: 'hiddenItem'
  },
  {
    value: EquationForm.WAVELENGTH,
    string: FMWSymbols.lambda,
    textOptions: MATH_TEXT_OPTIONS,
    tandemName: 'wavelengthItem'
  },
  {
    value: EquationForm.SPATIAL_WAVE_NUMBER,
    string: FMWSymbols.k,
    textOptions: MATH_TEXT_OPTIONS,
    tandemName: 'spatialWaveNumberItem'
  },
  {
    value: EquationForm.FREQUENCY,
    string: FMWSymbols.f,
    textOptions: MATH_TEXT_OPTIONS,
    tandemName: 'frequencyItem'
  },
  {
    value: EquationForm.PERIOD,
    string: FMWSymbols.T,
    textOptions: MATH_TEXT_OPTIONS,
    tandemName: 'periodItem'
  },
  {
    value: EquationForm.ANGULAR_WAVE_NUMBER,
    string: FMWSymbols.omega,
    textOptions: MATH_TEXT_OPTIONS,
    tandemName: 'angularWaveNumberItem'
  },
  {
    value: EquationForm.WAVELENGTH_AND_PERIOD,
    string: StringUtils.fillIn( fourierMakingWavesStrings.symbolAndSymbol, {
      symbol1: FMWSymbols.lambda,
      symbol2: FMWSymbols.T
    } ),
    textOptions: MATH_TEXT_OPTIONS,
    tandemName: 'wavelengthAndPeriodItem'
  },
  {
    value: EquationForm.SPATIAL_WAVE_NUMBER_AND_ANGULAR_WAVE_NUMBER,
    string: StringUtils.fillIn( fourierMakingWavesStrings.symbolAndSymbol, {
      symbol1: FMWSymbols.k,
      symbol2: FMWSymbols.omega
    } ),
    textOptions: MATH_TEXT_OPTIONS,
    tandemName: 'spatialWaveNumberAndAngularWaveNumberItem'
  },
  {
    value: EquationForm.MODE,
    string: FMWSymbols.n,
    textOptions: MATH_TEXT_OPTIONS,
    tandemName: 'modeItem'
  }
];
assert && assert( _.every( CHOICES, choice => EquationForm.includes( choice.value ) ) );
assert && assert( _.every( CHOICES, choice => choice.tandemName ) );


class EquationComboBox extends FMWComboBox {

  /**
   * @param {EnumerationProperty.<EquationForm>} equationFormProperty
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Node} popupParent
   * @param {Object} [options]
   */
  constructor( equationFormProperty, domainProperty, popupParent, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( equationFormProperty, EquationForm );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && assert( popupParent instanceof Node );

    options = merge( {

      // FMWComboBox options
      textOptions: {
        maxWidth: 100 // determined empirically
      }
    }, options );

    super( CHOICES, equationFormProperty, popupParent, options );

    // Show only the choices that are appropriate for the selected Domain.
    domainProperty.link( domain => {
      assert && assert( Domain.includes( domain ) );

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

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

fourierMakingWaves.register( 'EquationComboBox', EquationComboBox );
export default EquationComboBox;