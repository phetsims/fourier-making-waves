// Copyright 2020, University of Colorado Boulder

/**
 * HarmonicsEquationNode is the equation that appears above the 'Harmonics' chart in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import Domain from '../model/Domain.js';
import MathForm from '../model/MathForm.js';
import WaveType from '../model/WaveType.js';
import EquationMarkup from './EquationMarkup.js';

class HarmonicsEquationNode extends Node {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {EnumerationProperty.<WaveType>} waveTypeProperty
   * @param {EnumerationProperty.<MathForm>} mathFormProperty
   * @param {Object} [options]
   */
  constructor( domainProperty, waveTypeProperty, mathFormProperty, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertEnumerationPropertyOf( waveTypeProperty, WaveType );
    assert && AssertUtils.assertEnumerationPropertyOf( mathFormProperty, MathForm );

    options = merge( {
      font: FMWConstants.EQUATION_FONT
    }, options );

    // text is set in multilink below
    const richText = new RichText( '', {
      font: options.font
    } );

    assert && assert( !options.children, 'HarmonicsEquationNode sets children' );
    options.children = [ richText ];

    super( options );

    // unmultilink is not needed.
    Property.multilink(
      [ domainProperty, waveTypeProperty, mathFormProperty ],
      ( domain, waveType, mathForm ) => {
        this.visible = ( mathForm !== MathForm.HIDDEN );
        richText.text = EquationMarkup.getGeneralFormMarkup( domain, waveType, mathForm );
      }
    );
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

fourierMakingWaves.register( 'HarmonicsEquationNode', HarmonicsEquationNode );
export default HarmonicsEquationNode;