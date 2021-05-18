// Copyright 2021, University of Colorado Boulder

/**
 * WaveGameAmplitudesChartNode is a specialization of AmplitudesChartNode that allows the client to
 * show and hide the amplitude controls for each harmonic.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AmplitudesChartNode from '../../common/view/AmplitudesChartNode.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class WaveGameAmplitudesChartNode extends AmplitudesChartNode {

  /**
   * @param {AmplitudesChart} amplitudesChart
   * @param {AmplitudeKeypadDialog} amplitudeKeypadDialog - keypad for editing amplitude values
   * @param {Object} [options]
   */
  constructor( amplitudesChart, amplitudeKeypadDialog, options ) {

    super( amplitudesChart, amplitudeKeypadDialog, options );

    // @private
    this.amplitudeKeypadDialog = amplitudeKeypadDialog;
  }

  /**
   * Sets the visibility of an amplitude slider and its associated NumberDisplay.
   * @param {number} order - order of the harmonic associated with the amplitude
   * @param {boolean} visible
   * @public
   */
  setAmplitudeVisible( order, visible ) {
    assert && assert( typeof order === 'number' && order > 0 && order <= this.sliders.length, `invalid order: ${order}` );
    assert && assert( typeof visible === 'boolean' );

    const index = order - 1;

    // Slider
    const slider = this.sliders[ index ];
    slider.interruptSubtreeInput();
    slider.visible = visible;

    // NumberDisplay
    const numberDisplay = this.numberDisplays[ index ];
    numberDisplay.interruptSubtreeInput();
    numberDisplay.visible = visible;

    // If the keypad associated with the NumberDisplay is visible, hide it.
    if ( this.amplitudeKeypadDialog.isShowingProperty.value && this.amplitudeKeypadDialog.order === order ) {
      this.amplitudeKeypadDialog.hide();
    }
  }
}

fourierMakingWaves.register( 'WaveGameAmplitudesChartNode', WaveGameAmplitudesChartNode );
export default WaveGameAmplitudesChartNode;