// Copyright 2020, University of Colorado Boulder

/**
 * DiscreteAmplitudePanel is the 'Amplitude' panel in the 'Discrete' screen.
 * This is where the user can adjust the amplitudes of each harmonic.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import FourierMakingWavesConstants from '../../common/FourierMakingWavesConstants.js';
import AmplitudeSlider from '../../common/view/AmplitudeSlider.js';
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

    //TODO a test of AmplitudeSlider
    const amplitudeRange = new Range( -1.27, 1.27 );
    const amplitudeColors = [ 'red', 'orange', 'yellow', 'green' ];
    const sliders = _.map( amplitudeColors, color =>
      new AmplitudeSlider( new NumberProperty( 0, { range: amplitudeRange } ), { color: color } )
    );
    const slidersLayoutBox = new HBox( {
      spacing: 20,
      children: sliders,
      center: placeholder.center
    } );

    //TODO
    const placeholder = new Rectangle( 0, 0, 600, options.fixedHeight - ( 2 * options.yMargin ), {
      left: titleText.left + 30,
      top: titleText.top
    } );

    const content = new HBox( {
      align: 'center',
      spacing: 20,
      children: [ titleText, slidersLayoutBox, placeholder ]
    } );

    super( content, options );
  }
}

fourierMakingWaves.register( 'DiscreteAmplitudesPanel', DiscreteAmplitudesPanel );
export default DiscreteAmplitudesPanel;