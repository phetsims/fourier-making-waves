// Copyright 2021, University of Colorado Boulder

/**
 * WaveGameAmplitudesChartNode is a specialization of AmplitudesChartNode that allows the client to
 * show and hide the amplitude controls for each harmonic.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import AmplitudesChartNode from '../../common/view/AmplitudesChartNode.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WaveGameAmplitudesChart from '../model/WaveGameAmplitudesChart.js';

class WaveGameAmplitudesChartNode extends AmplitudesChartNode {

  /**
   * @param {WaveGameAmplitudesChart} amplitudesChart
   * @param {AmplitudeKeypadDialog} amplitudeKeypadDialog - keypad for editing amplitude values
   * @param {Object} [options]
   */
  constructor( amplitudesChart, amplitudeKeypadDialog, options ) {
    assert && assert( amplitudesChart instanceof WaveGameAmplitudesChart );

    super( amplitudesChart, amplitudeKeypadDialog, options );

    // Fields of interest in amplitudesChart
    const challengeProperty = amplitudesChart.challengeProperty;
    const numberOfAmplitudeControlsProperty = amplitudesChart.numberOfAmplitudeControlsProperty;

    // @private
    this.amplitudeKeypadDialog = amplitudeKeypadDialog;

    //TODO better name for this
    // {Harmonic[]} harmonics with non-zero amplitude are first, followed by randomly-ordered harmonics with
    // zero amplitude. This makes amplitude controls appear and disappear in the same order as
    // numberOfAmplitudeControlsProperty changes.
    let harmonics;

    // Update the visibility of amplitude controls.
    const updateAmplitudeControlsVisibility = numberOfAmplitudeControls => {
      for ( let i = 0; i < harmonics.length; i++ ) {
        const harmonic = harmonics[ i ];
        const visible = ( i < numberOfAmplitudeControls );
        assert && assert( !( harmonic.amplitudeProperty.value !== 0 && !visible ),
          'programming error, tried to the control for a non-zero harmonic invisible' );
        this.setAmplitudeVisible( harmonic.order, visible );
      }
    };

    // When the challenge changes, adjust visibility of amplitude controls.
    challengeProperty.link( challenge => {
      const nonZeroHarmonics = challenge.getNonZeroHarmonics();
      const zeroHarmonics = challenge.getZeroHarmonics();
      harmonics = [ ...nonZeroHarmonics, ...dotRandom.shuffle( zeroHarmonics ) ];
      updateAmplitudeControlsVisibility( numberOfAmplitudeControlsProperty.value );
    } );

    // Adjust number of amplitude controls that are visible.
    numberOfAmplitudeControlsProperty.lazyLink( updateAmplitudeControlsVisibility );
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