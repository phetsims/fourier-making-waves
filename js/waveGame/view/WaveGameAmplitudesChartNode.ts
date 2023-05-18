// Copyright 2021-2023, University of Colorado Boulder

/**
 * WaveGameAmplitudesChartNode is a specialization of InteractiveAmplitudesChartNode that allows the client to
 * show and hide the amplitude controls for each harmonic.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import FMWConstants from '../../common/FMWConstants.js';
import InteractiveAmplitudesChartNode from '../../common/view/InteractiveAmplitudesChartNode.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WaveGameAmplitudesChart from '../model/WaveGameAmplitudesChart.js';
import AmplitudeKeypadDialog from '../../common/view/AmplitudeKeypadDialog.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Harmonic from '../../common/model/Harmonic.js';

export default class WaveGameAmplitudesChartNode extends InteractiveAmplitudesChartNode {

  private readonly amplitudeKeypadDialog: AmplitudeKeypadDialog;

  public constructor( amplitudesChart: WaveGameAmplitudesChart, amplitudeKeypadDialog: AmplitudeKeypadDialog, tandem: Tandem ) {

    super( amplitudesChart, amplitudeKeypadDialog, {

      // For the Wave Game, we make it easier to match the pink waveform by using a larger interval and fewer
      // decimals places for the amplitude sliders and keypad.
      // See https://github.com/phetsims/fourier-making-waves/issues/97
      amplitudeSliderOptions: {
        mouseTouchStep: FMWConstants.WAVE_GAME_AMPLITUDE_STEP,
        keyboardStep: FMWConstants.WAVE_GAME_AMPLITUDE_KEYBOARD_STEP,
        shiftKeyboardStep: FMWConstants.WAVE_GAME_AMPLITUDE_SHIFT_KEYBOARD_STEP,
        pageKeyboardStep: FMWConstants.WAVE_GAME_AMPLITUDE_PAGE_KEYBOARD_STEP
      },
      amplitudeNumberDisplayOptions: {
        numberDisplayOptions: {
          decimalPlaces: FMWConstants.WAVE_GAME_AMPLITUDE_DECIMAL_PLACES
        }
      },
      tandem: tandem
    } );

    // Fields of interest in amplitudesChart
    const answerSeries = amplitudesChart.answerSeries;
    const guessSeries = amplitudesChart.guessSeries;
    const numberOfAmplitudeControlsProperty = amplitudesChart.numberOfAmplitudeControlsProperty;

    this.amplitudeKeypadDialog = amplitudeKeypadDialog;

    // {Harmonic[]} harmonics with non-zero amplitude are first, followed by randomly-ordered harmonics with
    // zero amplitude. This makes amplitude controls appear and disappear in the same order as
    // numberOfAmplitudeControlsProperty changes.  If numberOfAmplitudeControlsProperty.value is N, then
    // the first N harmonics in this array will have their amplitude control made visible.
    let harmonics: Harmonic[];

    // Update the visibility of amplitude controls.
    const updateAmplitudeControlsVisibility = ( numberOfAmplitudeControls: number ) => {
      for ( let i = 0; i < harmonics.length; i++ ) {
        const harmonic = harmonics[ i ];
        const visible = ( i < numberOfAmplitudeControls );
        this.setAmplitudeVisible( harmonic.order, visible );

        // If a harmonic's slider is not visible, its amplitude must be zero in the guess.
        if ( !visible ) {
          guessSeries.harmonics[ harmonic.order - 1 ].amplitudeProperty.value = 0;
        }
      }
    };

    // When the challenge changes, adjust visibility of amplitude controls. A challenge changes by calling
    // FourierSeries.setAmplitudes, and setAmplitudes defers notification of listeners until all harmonic
    // amplitudes are changed. So we can rely on this listener being called once when a challenge changes.
    answerSeries.amplitudesProperty.link( answerAmplitudes => {
      const nonZeroHarmonics = answerSeries.getNonZeroHarmonics();
      const zeroHarmonics = answerSeries.getZeroHarmonics();
      harmonics = [ ...nonZeroHarmonics, ...dotRandom.shuffle( zeroHarmonics ) ];
      updateAmplitudeControlsVisibility( numberOfAmplitudeControlsProperty.value );
    } );

    // Adjust number of amplitude controls that are visible.
    numberOfAmplitudeControlsProperty.lazyLink( updateAmplitudeControlsVisibility );
  }

  /**
   * Sets the visibility of an amplitude slider and its associated NumberDisplay.
   * @param order - order of the harmonic associated with the amplitude
   * @param visible
   */
  public setAmplitudeVisible( order: number, visible: boolean ): void {
    assert && assert( Number.isInteger( order ) && order > 0 );
    assert && assert( order <= this.sliders.length, `invalid order: ${order}` );

    const index = order - 1;

    // Slider
    const slider = this.sliders[ index ];
    slider.interruptSubtreeInput();
    slider.visible = visible;

    // NumberDisplay
    const numberDisplay = this.numberDisplays[ index ];
    numberDisplay.interruptSubtreeInput();
    numberDisplay.visible = visible;

    // If the keypad is visible, hide it.
    if ( this.amplitudeKeypadDialog.isShowingProperty.value ) {
      this.amplitudeKeypadDialog.hide();
    }
  }
}

fourierMakingWaves.register( 'WaveGameAmplitudesChartNode', WaveGameAmplitudesChartNode );