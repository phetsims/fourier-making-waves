// Copyright 2020, University of Colorado Boulder

/**
 * MathFormComboBox is the combo box for choosing the math form that is displayed in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import MathForm from '../model/MathForm.js';
import FMWComboBox from './FMWComboBox.js';

class MathFormComboBox extends FMWComboBox {

  /**
   * @param {EnumerationProperty.<MathForm>} mathFormProperty
   * @param {Node} popupParent
   * @param {Object} [options]
   */
  constructor( mathFormProperty, popupParent, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( mathFormProperty, MathForm );
    assert && assert( popupParent instanceof Node, 'invalid popupParent' );

    // {{string:string, value:MathForm}[]}
    const choices = [

      // no math form displayed
      {
        value: MathForm.NONE,
        string: fourierMakingWavesStrings.mathFormChoice.hidden
      },

      // function of space
      {
        value: MathForm.SPACE_WAVELENGTH,
        string: StringUtils.fillIn( fourierMakingWavesStrings.mathFormChoice.wavelength, {
          symbol: FMWSymbols.SMALL_LAMBDA
        } )
      },
      {
        value: MathForm.SPACE_WAVE_NUMBER,
        string: StringUtils.fillIn( fourierMakingWavesStrings.mathFormChoice.waveNumber, {
          symbol: FMWSymbols.SMALL_K
        } )
      },
      {
        value: MathForm.SPACE_MODE,
        string: StringUtils.fillIn( fourierMakingWavesStrings.mathFormChoice.mode, {
          symbol: FMWSymbols.SMALL_N
        } )
      },

      // function of time
      {
        value: MathForm.TIME_FREQUENCY,
        string: StringUtils.fillIn( fourierMakingWavesStrings.mathFormChoice.frequency, {
          symbol: FMWSymbols.CAPITAL_F
        } )
      },
      {
        value: MathForm.TIME_PERIOD,
        string: StringUtils.fillIn( fourierMakingWavesStrings.mathFormChoice.period, {
          symbol: FMWSymbols.CAPITAL_T
        } )
      },
      {
        value: MathForm.TIME_ANGULAR_FREQUENCY,
        string: StringUtils.fillIn( fourierMakingWavesStrings.mathFormChoice.angularFrequency, {
          symbol: FMWSymbols.SMALL_OMEGA
        } )
      },
      {
        value: MathForm.TIME_MODE,
        string: StringUtils.fillIn( fourierMakingWavesStrings.mathFormChoice.mode, {
          symbol: FMWSymbols.SMALL_N
        } )
      },

      // function of space & time
      {
        value: MathForm.SPACE_AND_TIME_WAVELENGTH_AND_PERIOD,
        string: StringUtils.fillIn( fourierMakingWavesStrings.mathFormChoice.wavelengthAndPeriod, {
          wavelengthSymbol: FMWSymbols.SMALL_LAMBDA,
          periodSymbol: FMWSymbols.CAPITAL_T
        } )
      },
      {
        value: MathForm.SPACE_AND_TIME_WAVE_NUMBER_AND_ANGULAR_FREQUENCY,
        string: StringUtils.fillIn( fourierMakingWavesStrings.mathFormChoice.waveNumberAndAngularFrequency, {
          waveNumberSymbol: FMWSymbols.SMALL_K,
          angularFrequencySymbol: FMWSymbols.SMALL_OMEGA
        } )
      },      {
        value: MathForm.SPACE_AND_TIME_MODE,
        string: StringUtils.fillIn( fourierMakingWavesStrings.mathFormChoice.mode, {
          symbol: FMWSymbols.SMALL_N
        } )
      }
    ];

    super( choices, mathFormProperty, popupParent, options );
  }
}

fourierMakingWaves.register( 'MathFormComboBox', MathFormComboBox );
export default MathFormComboBox;