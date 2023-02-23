// Copyright 2021-2023, University of Colorado Boulder

/**
 * DiscreteAmplitudesChartNode is a specialization of InteractiveAmplitudesChartNode for the 'Discrete' screen.
 * It shows sliders for the relevant harmonics in a Fourier series.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import InteractiveAmplitudesChartNode from '../../common/view/InteractiveAmplitudesChartNode.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import DiscreteAmplitudesChart from '../model/DiscreteAmplitudesChart.js';

export default class DiscreteAmplitudesChartNode extends InteractiveAmplitudesChartNode {

  /**
   * @param {DiscreteAmplitudesChart} amplitudesChart
   * @param {AmplitudeKeypadDialog} amplitudeKeypadDialog - keypad for editing amplitude values
   * @param {Object} [options]
   */
  constructor( amplitudesChart, amplitudeKeypadDialog, options ) {

    assert && assert( amplitudesChart instanceof DiscreteAmplitudesChart );

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