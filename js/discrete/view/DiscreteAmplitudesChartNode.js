// Copyright 2021, University of Colorado Boulder

/**
 * DiscreteAmplitudesChartNode is a specialization of AmplitudesChartNode for the 'Discrete' screen.
 * It shows sliders for the relevant harmonics in a Fourier series.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AmplitudesChartNode from '../../common/view/AmplitudesChartNode.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class DiscreteAmplitudesChartNode extends AmplitudesChartNode {

  /**
   * @param {AmplitudesChart} amplitudesChart
   * @param {AmplitudeKeypadDialog} amplitudeKeypadDialog - keypad for editing amplitude values
   * @param {Object} [options]
   */
  constructor( amplitudesChart, amplitudeKeypadDialog, options ) {

    super( amplitudesChart, amplitudeKeypadDialog, options );

    // Hide sliders and number displays that are not part of the series.
    // Note that it's the model's responsibility to set the amplitude for hidden harmonics to zero.
    amplitudesChart.fourierSeries.numberOfHarmonicsProperty.link( numberOfHarmonics => {
      assert && assert( numberOfHarmonics > 0 && numberOfHarmonics <= this.sliders.length,
        `unsupported numberOfHarmonics: ${numberOfHarmonics}` );

      for ( let i = 0; i < this.sliders.length; i++ ) {
        const visible = ( i < numberOfHarmonics );
        this.sliders[ i ].visible = visible;
        this.numberDisplays[ i ].visible = visible;
      }
    } );
  }
}

fourierMakingWaves.register( 'DiscreteAmplitudesChartNode', DiscreteAmplitudesChartNode );
export default DiscreteAmplitudesChartNode;