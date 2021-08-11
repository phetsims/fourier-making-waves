// Copyright 2020-2021, University of Colorado Boulder

/**
 * InfiniteHarmonicsCheckbox is the 'Infinite Harmonics' checkbox associated with the Sum chart on the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWCheckbox from '../../common/view/FMWCheckbox.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';

class InfiniteHarmonicsCheckbox extends FMWCheckbox {

  /**
   * @param {Property.<boolean>} infiniteHarmonicsVisibleProperty
   * @param {Object} [options]
   */
  constructor( infiniteHarmonicsVisibleProperty, options ) {

    options = merge( {
      tandem: Tandem.REQUIRED
    }, options );

    const infiniteHarmonicsText = new Text( fourierMakingWavesStrings.infiniteHarmonics, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 200, // determined empirically,
      tandem: options.tandem.createTandem( 'infiniteHarmonicsText' )
    } );

    super( infiniteHarmonicsText, infiniteHarmonicsVisibleProperty, options );
  }
}

fourierMakingWaves.register( 'InfiniteHarmonicsCheckbox', InfiniteHarmonicsCheckbox );
export default InfiniteHarmonicsCheckbox;