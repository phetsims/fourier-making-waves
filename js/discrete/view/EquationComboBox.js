// Copyright 2020-2021, University of Colorado Boulder

/**
 * EquationComboBox is the combo box for choosing the equation form that is displayed in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import Domain from '../../common/model/Domain.js';
import EquationForm from '../model/EquationForm.js';
import FMWComboBox from '../../common/view/FMWComboBox.js';

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

    const mathTextOptions = {
      font: FMWConstants.MATH_CONTROL_FONT,
      maxWidth: 100
    };

    // {{string:string, value:EquationForm}[]}
    const choices = [
      {
        value: EquationForm.HIDDEN,
        string: fourierMakingWavesStrings.hidden
      },
      {
        value: EquationForm.WAVELENGTH,
        string: FMWSymbols.lambda,
        textOptions: mathTextOptions
      },
      {
        value: EquationForm.WAVE_NUMBER,
        string: FMWSymbols.k,
        textOptions: mathTextOptions
      },
      {
        value: EquationForm.FREQUENCY,
        string: FMWSymbols.F,
        textOptions: mathTextOptions
      },
      {
        value: EquationForm.PERIOD,
        string: FMWSymbols.T,
        textOptions: mathTextOptions
      },
      {
        value: EquationForm.ANGULAR_FREQUENCY,
        string: FMWSymbols.omega,
        textOptions: mathTextOptions
      },
      {
        value: EquationForm.WAVELENGTH_AND_PERIOD,
        string: FMWSymbols.T,
        textOptions: mathTextOptions
      },
      {
        value: EquationForm.WAVE_NUMBER_AND_ANGULAR_FREQUENCY,
        string: StringUtils.fillIn( fourierMakingWavesStrings.kAndOmega, {
          k: FMWSymbols.k,
          omega: FMWSymbols.omega
        } ),
        textOptions: mathTextOptions
      },
      {
        value: EquationForm.MODE,
        string: FMWSymbols.n,
        textOptions: mathTextOptions
      }
    ];

    super( choices, equationFormProperty, popupParent, options );

    // Show only the choices that are appropriate for the selected domain. unlink is not needed.
    domainProperty.link( domain => {
      assert && assert( Domain.includes( domain ) );

      // No need to adjust EquationForm.HIDDEN or EquationForm.MODE. They are appropriate for all Domain values.

      // Domain.SPACE
      const isSpace = ( domain === Domain.SPACE );
      this.setItemVisible( EquationForm.WAVELENGTH, isSpace );
      this.setItemVisible( EquationForm.WAVE_NUMBER, isSpace );

      // Domain.TIME
      const isTime = ( domain === Domain.TIME );
      this.setItemVisible( EquationForm.FREQUENCY, isTime );
      this.setItemVisible( EquationForm.PERIOD, isTime );
      this.setItemVisible( EquationForm.ANGULAR_FREQUENCY, isTime );

      // Domain.SPACE_AND_TIME
      const isSpaceAmdTime = ( domain === Domain.SPACE_AND_TIME );
      this.setItemVisible( EquationForm.WAVELENGTH_AND_PERIOD, isSpaceAmdTime );
      this.setItemVisible( EquationForm.WAVE_NUMBER_AND_ANGULAR_FREQUENCY, isSpaceAmdTime );
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