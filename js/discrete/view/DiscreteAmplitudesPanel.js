// Copyright 2020, University of Colorado Boulder

/**
 * DiscreteAmplitudePanel is the 'Amplitude' panel in the 'Discrete' screen.
 * This is where the user can adjust the amplitudes of each harmonic.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import FourierMakingWavesConstants from '../../common/FourierMakingWavesConstants.js';
import FourierMakingWavesPanel from '../../common/view/FourierMakingWavesPanel.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';

class DiscreteAmplitudesPanel extends FourierMakingWavesPanel {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {}, FourierMakingWavesConstants.PANEL_OPTIONS, {
      align: 'left',
      fixedWidth: 100,
      fixedHeight: 100
    }, options );

    const titleText = new Text( fourierMakingWavesStrings.amplitudes, {
      font: FourierMakingWavesConstants.TITLE_FONT,
      rotation: -Math.PI / 2
    } );

    //TODO
    const placeholder = new Rectangle( 0, 0, 600, options.fixedHeight, {
      left: titleText.left + 30,
      top: titleText.top
    } );

    const content = new HBox( {
      align: 'center',
      spacing: 20,
      children: [ titleText, placeholder ]
    } );

    super( content, options );
  }
}

fourierMakingWaves.register( 'DiscreteAmplitudesPanel', DiscreteAmplitudesPanel );
export default DiscreteAmplitudesPanel;