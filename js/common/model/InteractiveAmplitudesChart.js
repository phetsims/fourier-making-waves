// Copyright 2021, University of Colorado Boulder

/**
 * InteractiveAmplitudesChart is the model base class model for the 'Amplitudes' chart in the 'Discrete' and
 * 'Wave Game' screens, where amplitudes can be interactively adjusted using a set of bar-like sliders.
 *
 * This class is not used in the 'Wave Packet' screen, where the Amplitudes chart is not interactive, and uses
 * a much different underlying model.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

export default class InteractiveAmplitudesChart {

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

    // @public (read-only)
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

fourierMakingWaves.register( 'InteractiveAmplitudesChart', InteractiveAmplitudesChart );