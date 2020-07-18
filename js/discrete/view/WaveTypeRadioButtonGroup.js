// Copyright 2020, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import HorizontalAquaRadioButtonGroup from '../../../../sun/js/HorizontalAquaRadioButtonGroup.js';
import FourierMakingWavesConstants from '../../common/FourierMakingWavesConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import WaveType from '../model/WaveType.js';

class WaveTypeRadioButtonGroup extends HorizontalAquaRadioButtonGroup {

  /**
   * @param {EnumerationProperty.<WaveType>} waveTypeProperty
   * @param {Object} [options]
   */
  constructor( waveTypeProperty, options ) {

    options = merge( {
      spacing: 12,
      radioButtonOptions: {
        xSpacing: 6
      }
    }, options );

    assert && AssertUtils.assertEnumerationPropertyOf( waveTypeProperty, WaveType );

    const textOptions = {
      font: FourierMakingWavesConstants.CONTROL_FONT
    };

    const items = [
      { value: WaveType.SINE, node: new Text( fourierMakingWavesStrings.sine, textOptions ) },
      { value: WaveType.COSINE, node: new Text( fourierMakingWavesStrings.cosine, textOptions ) }
    ];

    super( waveTypeProperty, items, options );
  }
}

fourierMakingWaves.register( 'WaveTypeRadioButtonGroup', WaveTypeRadioButtonGroup );
export default WaveTypeRadioButtonGroup;