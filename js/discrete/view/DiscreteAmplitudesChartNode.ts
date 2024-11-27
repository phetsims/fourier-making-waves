// Copyright 2021-2023, University of Colorado Boulder

/**
 * DiscreteAmplitudesChartNode is a specialization of InteractiveAmplitudesChartNode for the 'Discrete' screen.
 * It shows sliders for the relevant harmonics in a Fourier series.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import AmplitudeKeypadDialog from '../../common/view/AmplitudeKeypadDialog.js';
import InteractiveAmplitudesChartNode from '../../common/view/InteractiveAmplitudesChartNode.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import DiscreteAmplitudesChart from '../model/DiscreteAmplitudesChart.js';
import Waveform from '../model/Waveform.js';

export default class DiscreteAmplitudesChartNode extends InteractiveAmplitudesChartNode {

  public constructor( amplitudesChart: DiscreteAmplitudesChart, waveformProperty: Property<Waveform>,
                      amplitudeKeypadDialog: AmplitudeKeypadDialog, tandem: Tandem ) {

    super( amplitudesChart, amplitudeKeypadDialog, {

      // Changing any amplitude switches the waveform to 'custom'.
      onEdit: () => { waveformProperty.value = Waveform.CUSTOM; },
      tandem: tandem
    } );

    // Hide sliders and number displays that are not part of the series.
    // Note that it's the model's responsibility to set the amplitude for hidden harmonics to zero.
    amplitudesChart.numberOfHarmonicsProperty.link( numberOfHarmonics => {
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