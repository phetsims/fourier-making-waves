// Copyright 2020, University of Colorado Boulder

/**
 * SeriesTypeRadioButtonGroup is used to switch the type of the Fourier series between sine and cosine.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import HorizontalAquaRadioButtonGroup from '../../../../sun/js/HorizontalAquaRadioButtonGroup.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import SeriesType from '../model/SeriesType.js';

class SeriesTypeRadioButtonGroup extends HorizontalAquaRadioButtonGroup {

  /**
   * @param {EnumerationProperty.<SeriesType>} seriesTypeProperty
   * @param {Object} [options]
   */
  constructor( seriesTypeProperty, options ) {

    options = merge( {
      spacing: 12,
      touchAreaYDilation: 6,
      radioButtonOptions: {
        xSpacing: 6
      }
    }, options );

    assert && AssertUtils.assertEnumerationPropertyOf( seriesTypeProperty, SeriesType );

    const textOptions = {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 40 // determined empirically
    };

    const items = [
      { value: SeriesType.SINE, node: new RichText( FMWSymbols.sin, textOptions ) },
      { value: SeriesType.COSINE, node: new RichText( FMWSymbols.cos, textOptions ) }
    ];

    super( seriesTypeProperty, items, options );
  }
}

fourierMakingWaves.register( 'SeriesTypeRadioButtonGroup', SeriesTypeRadioButtonGroup );
export default SeriesTypeRadioButtonGroup;