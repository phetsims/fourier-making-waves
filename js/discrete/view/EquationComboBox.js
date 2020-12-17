// Copyright 2020, University of Colorado Boulder

/**
 * EquationComboBox is the combo box for choosing the equation form that is displayed in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import Domain from '../model/Domain.js';
import MathForm from '../model/MathForm.js';
import FMWComboBox from './FMWComboBox.js';

class EquationComboBox extends FMWComboBox {

  /**
   * @param {EnumerationProperty.<MathForm>} mathFormProperty
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Node} popupParent
   * @param {Object} [options]
   */
  constructor( mathFormProperty, domainProperty, popupParent, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( mathFormProperty, MathForm );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && assert( popupParent instanceof Node, 'invalid popupParent' );

    options = merge( {
      textOptions: {
        maxWidth: 180 // determined empirically
      }
    }, options );

    // {{string:string, value:MathForm}[]}
    const choices = [
      {
        value: MathForm.HIDDEN,
        string: fourierMakingWavesStrings.hidden
      },
      {
        value: MathForm.WAVELENGTH,
        string: FMWSymbols.lambda
      },
      {
        value: MathForm.WAVE_NUMBER,
        string: FMWSymbols.k
      },
      {
        value: MathForm.FREQUENCY,
        string: FMWSymbols.F
      },
      {
        value: MathForm.PERIOD,
        string: FMWSymbols.T
      },
      {
        value: MathForm.ANGULAR_FREQUENCY,
        string: FMWSymbols.omega
      },
      {
        value: MathForm.WAVELENGTH_AND_PERIOD,
        string: FMWSymbols.T
      },
      {
        value: MathForm.WAVE_NUMBER_AND_ANGULAR_FREQUENCY,
        string: `${FMWSymbols.k} & ${FMWSymbols.omega}` //TODO i18n
      },
      {
        value: MathForm.MODE,
        string: FMWSymbols.n
      }
    ];

    super( choices, mathFormProperty, popupParent, options );

    // Show only the choices that are appropriate for the selected domain. unlink is not needed.
    domainProperty.link( domain => {
      assert && assert( Domain.includes( domain ), `invalid domain: ${domain}` );

      // No need to adjust MathForm.HIDDEN or MathForm.MODE. They are appropriate for all Domain values.

      // Domain.SPACE
      const isSpace = ( domain === Domain.SPACE );
      this.setItemVisible( MathForm.WAVELENGTH, isSpace );
      this.setItemVisible( MathForm.WAVE_NUMBER, isSpace );

      // Domain.TIME
      const isTime = ( domain === Domain.TIME );
      this.setItemVisible( MathForm.FREQUENCY, isTime );
      this.setItemVisible( MathForm.PERIOD, isTime );
      this.setItemVisible( MathForm.ANGULAR_FREQUENCY, isTime );

      // Domain.SPACE_AND_TIME
      const isSpaceAmdTime = ( domain === Domain.SPACE_AND_TIME );
      this.setItemVisible( MathForm.WAVELENGTH_AND_PERIOD, isSpaceAmdTime );
      this.setItemVisible( MathForm.WAVE_NUMBER_AND_ANGULAR_FREQUENCY, isSpaceAmdTime );
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