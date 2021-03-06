// Copyright 2020-2021, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';

class InfiniteHarmonicsCheckbox extends Checkbox {

  /**
   * @param {Property.<boolean>} infiniteHarmonicsVisibleProperty
   * @param {Object} [options]
   */
  constructor( infiniteHarmonicsVisibleProperty, options ) {

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, FMWConstants.CHECKBOX_OPTIONS, options );

    const infiniteHarmonicsText = new Text( fourierMakingWavesStrings.infiniteHarmonics, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 200, // determined empirically,
      tandem: options.tandem.createTandem( 'infiniteHarmonicsText' )
    } );

    super( infiniteHarmonicsText, infiniteHarmonicsVisibleProperty, options );

    // pointer areas
    this.touchArea = this.localBounds.dilatedXY( 6, 6 );
    this.mouseArea = this.localBounds.dilatedXY( 1, 1 );
  }
}

fourierMakingWaves.register( 'InfiniteHarmonicsCheckbox', InfiniteHarmonicsCheckbox );
export default InfiniteHarmonicsCheckbox;