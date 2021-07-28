// Copyright 2021, University of Colorado Boulder

/**
 * AmplitudesChart is the model base class model for the 'Amplitudes' chart.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class AmplitudesChart extends PhetioObject {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {EmphasizedHarmonics} emphasizedHarmonics
   * @param {Object} [options]
   */
  constructor( fourierSeries, emphasizedHarmonics, options ) {

    super( options );

    // @public
    this.fourierSeries = fourierSeries;
    this.emphasizedHarmonics = emphasizedHarmonics;
  }
}

fourierMakingWaves.register( 'AmplitudesChart', AmplitudesChart );
export default AmplitudesChart;