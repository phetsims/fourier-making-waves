// Copyright 2020, University of Colorado Boulder

/**
 * MeasurementToolsBox is the 'Measurement Tools' section of the control panel in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import FourierMakingWavesConstants from '../../common/FourierMakingWavesConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';

class MeasurementToolsBox extends VBox {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {}, FourierMakingWavesConstants.VBOX_OPTIONS, options );

    const titleNode = new Text( fourierMakingWavesStrings.measurementTools, {
      font: FourierMakingWavesConstants.TITLE_FONT
    } );

    assert && assert( !options.children, 'MeasurementToolsBox sets children' );
    options.children = [ titleNode ];

    super( options );
  }
}

fourierMakingWaves.register( 'MeasurementToolsBox', MeasurementToolsBox );
export default MeasurementToolsBox;