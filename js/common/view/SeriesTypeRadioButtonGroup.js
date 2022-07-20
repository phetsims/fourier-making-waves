// Copyright 2020-2022, University of Colorado Boulder

/**
 * SeriesTypeRadioButtonGroup is used to switch between sine series and cosine series.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { RichText } from '../../../../scenery/js/imports.js';
import HorizontalAquaRadioButtonGroup from '../../../../sun/js/HorizontalAquaRadioButtonGroup.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWConstants from '../FMWConstants.js';
import FMWSymbols from '../FMWSymbols.js';
import SeriesType from '../model/SeriesType.js';

class SeriesTypeRadioButtonGroup extends HorizontalAquaRadioButtonGroup {

  /**
   * @param {EnumerationDeprecatedProperty.<SeriesType>} seriesTypeProperty
   * @param {Object} [options]
   */
  constructor( seriesTypeProperty, options ) {

    options = merge( {

      // HorizontalAquaRadioButtonGroup options
      spacing: 12,
      touchAreaYDilation: 6,
      radioButtonOptions: {
        xSpacing: 6
      }
    }, options );

    assert && AssertUtils.assertEnumerationPropertyOf( seriesTypeProperty, SeriesType );

    const textOptions = {

      // Make this font a bit larger, see https://github.com/phetsims/fourier-making-waves/issues/138
      font: new PhetFont( FMWConstants.MATH_CONTROL_FONT.numericSize + 2 ),
      maxWidth: 40 // determined empirically
    };

    const items = [
      { value: SeriesType.SIN, node: new RichText( FMWSymbols.sin, textOptions ), tandemName: 'sinRadioButton' },
      { value: SeriesType.COS, node: new RichText( FMWSymbols.cos, textOptions ), tandemName: 'cosRadioButton' }
    ];

    super( seriesTypeProperty, items, options );
  }
}

fourierMakingWaves.register( 'SeriesTypeRadioButtonGroup', SeriesTypeRadioButtonGroup );
export default SeriesTypeRadioButtonGroup;