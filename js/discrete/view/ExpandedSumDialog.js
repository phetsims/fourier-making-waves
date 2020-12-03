// Copyright 2020, University of Colorado Boulder

/**
 * ExpandedSumDialog is a modal dialog that displays the expanded sum of a Fourier series.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Dialog from '../../../../sun/js/Dialog.js';
import FourierSeries from '../../common/model/FourierSeries.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import Domain from '../model/Domain.js';
import MathForm from '../model/MathForm.js';
import SumEquationNode from './SumEquationNode.js';

class ExpandedSumDialog extends Dialog {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<MathForm>} mathFormProperty
   * @param {Object} [options]
   */
  constructor( fourierSeries, domainProperty, mathFormProperty, options ) {

    assert && assert( fourierSeries instanceof FourierSeries, 'invalid fourierSeries' );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertEnumerationPropertyOf( mathFormProperty, MathForm );

    options = merge( {
      xSpacing: 30
    }, options );

    const sumEquationNode = new SumEquationNode( fourierSeries.numberOfHarmonicsProperty, domainProperty, mathFormProperty );

    super( sumEquationNode, options );

    // @private
    this.disposeExpandedSumDialog = () => {
      sumEquationNode.dispose();
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeExpandedSumDialog();
    super.dispose();
  }
}

fourierMakingWaves.register( 'ExpandedSumDialog', ExpandedSumDialog );
export default ExpandedSumDialog;