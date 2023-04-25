// Copyright 2021-2023, University of Colorado Boulder

/**
 * WaveGameHarmonicsChart is the model for the 'Harmonics' chart in the 'Wave Game' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import AxisDescription from '../../common/model/AxisDescription.js';
import HarmonicsChart from '../../common/model/HarmonicsChart.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FourierSeries from '../../common/model/FourierSeries.js';
import EmphasizedHarmonics from '../../common/model/EmphasizedHarmonics.js';
import SeriesType from '../../common/model/SeriesType.js';
import Domain from '../../common/model/Domain.js';

export default class WaveGameHarmonicsChart extends HarmonicsChart {

  public constructor( guessSeries: FourierSeries, emphasizedHarmonics: EmphasizedHarmonics, domain: Domain,
                      seriesType: SeriesType, t: number, xAxisDescription: AxisDescription,
                      yAxisDescription: AxisDescription, tandem: Tandem ) {

    super(
      guessSeries,
      emphasizedHarmonics,

      // These aspects are constant in the Wave Game screen, but the superclass supports dynamic Properties.
      // We use validValues to constrain these Properties to a single value, effectively making them constants.
      new EnumerationProperty( domain, { validValues: [ domain ] } ),
      new EnumerationProperty( seriesType, { validValues: [ seriesType ] } ),
      new NumberProperty( t, { validValues: [ t ] } ),
      new Property( xAxisDescription, { validValues: [ xAxisDescription ] } ),
      tandem
    );
  }
}

fourierMakingWaves.register( 'WaveGameHarmonicsChart', WaveGameHarmonicsChart );