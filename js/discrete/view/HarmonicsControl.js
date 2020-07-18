// Copyright 2020, University of Colorado Boulder

/**
 * HarmonicSpinner is the picker for choosing the number of harmonics in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import NumberPicker from '../../../../scenery-phet/js/NumberPicker.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import FourierMakingWavesConstants from '../../common/FourierMakingWavesConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';

class HarmonicsControl extends HBox {

  /**
   * @param {NumberProperty} numberOfHarmonicsProperty
   * @param {Object} [options]
   */
  constructor( numberOfHarmonicsProperty, options ) {

    assert && assert( numberOfHarmonicsProperty instanceof NumberProperty, 'invalid numberOfHarmonicsProperty' );

    options = merge( {
      spacing: 8
    }, options );

    const picker = new NumberPicker( numberOfHarmonicsProperty, numberOfHarmonicsProperty.rangeProperty, {
      font: FourierMakingWavesConstants.CONTROL_FONT,
      cornerRadius: 3,
      color: 'black'
    } );

    const labelNode = new Text( fourierMakingWavesStrings.harmonics, {
      font: FourierMakingWavesConstants.CONTROL_FONT
    } );

    assert && assert( !options.children, 'HarmonicSpinner sets children' );
    options.children = [ picker, labelNode ];

    super( options );
  }
}

fourierMakingWaves.register( 'HarmonicsControl', HarmonicsControl );
export default HarmonicsControl;