// Copyright 2021, University of Colorado Boulder

/**
 * AmplitudesChart is the model base class model for the 'Amplitudes' chart in the 'Discrete' and 'Wave Game' screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class AmplitudesChart {

  /**
   * @param {FourierSeries} fourierSeries
   * @param {EmphasizedHarmonics} emphasizedHarmonics
   * @param {Object} [options]
   */
  constructor( fourierSeries, emphasizedHarmonics, options ) {

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // @public
    this.fourierSeries = fourierSeries;
    this.emphasizedHarmonics = emphasizedHarmonics;

    // @public whether this chart is expanded
    this.chartExpandedProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'chartExpandedProperty' )
    } );
  }

  /**
   * @public
   */
  reset() {
    this.chartExpandedProperty.reset();
  }
}

fourierMakingWaves.register( 'AmplitudesChart', AmplitudesChart );
export default AmplitudesChart;