// Copyright 2021-2023, University of Colorado Boulder

/**
 * DiscreteFourierSeries is a specialization of FourierSeries that determines how many of the harmonics are 'relevant'.
 *
 * This approach was chosen to simplify the PhET-iO API.  Rather than have a dynamic collection of harmonics, we
 * have a static number of harmonics, for the maximum number of harmonics needed. This was a fundamental team decision,
 * based on anticipated PhET-iO requirements. See https://github.com/phetsims/fourier-making-waves/issues/6.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import FMWConstants from '../../common/FMWConstants.js';
import FourierSeries, { FourierSeriesOptions } from '../../common/model/FourierSeries.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

type SelfOptions = EmptySelfOptions;

type DiscreteFourierSeriesOptions = SelfOptions & FourierSeriesOptions;

export default class DiscreteFourierSeries extends FourierSeries {

  // the number of harmonics that are relevant in this series
  public readonly numberOfHarmonicsProperty: NumberProperty;

  public constructor( providedOptions: DiscreteFourierSeriesOptions ) {

    super( providedOptions );

    this.numberOfHarmonicsProperty = new NumberProperty( FMWConstants.MAX_HARMONICS, {
      numberType: 'Integer',
      range: new Range( 1, FMWConstants.MAX_HARMONICS ),
      tandem: providedOptions.tandem.createTandem( 'numberOfHarmonicsProperty' )
    } );

    // Zero out amplitudes that are not relevant. Since this causes amplitudesProperty to go through intermediate
    // states, notification of amplitudesProperty listeners is deferred until all harmonics have been updated.
    this.numberOfHarmonicsProperty.link( numberOfHarmonics => {
      this.amplitudesProperty.setDeferred( true );
      for ( let i = numberOfHarmonics; i < this.numberOfHarmonicsProperty.range.max; i++ ) {
        this.harmonics[ i ].amplitudeProperty.value = 0;
      }
      const notifyListeners = this.amplitudesProperty.setDeferred( false );
      notifyListeners && notifyListeners();
    } );
  }

  public override reset(): void {
    super.reset();
    this.numberOfHarmonicsProperty.reset();
  }
}

fourierMakingWaves.register( 'DiscreteFourierSeries', DiscreteFourierSeries );