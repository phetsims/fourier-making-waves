// Copyright 2020-2023, University of Colorado Boulder

/**
 * SeriesTypeRadioButtonGroup is used to switch between sine series and cosine series.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { RichText } from '../../../../scenery/js/imports.js';
import AquaRadioButton from '../../../../sun/js/AquaRadioButton.js';
import HorizontalAquaRadioButtonGroup from '../../../../sun/js/HorizontalAquaRadioButtonGroup.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWConstants from '../FMWConstants.js';
import FMWSymbols from '../FMWSymbols.js';
import SeriesType from '../model/SeriesType.js';

export default class SeriesTypeRadioButtonGroup extends HorizontalAquaRadioButtonGroup {

  /**
   * @param {EnumerationProperty.<SeriesType>} seriesTypeProperty
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

    assert && assert( seriesTypeProperty instanceof EnumerationProperty );

    const textOptions = {

      // Make this font a bit larger, see https://github.com/phetsims/fourier-making-waves/issues/138
      font: new PhetFont( FMWConstants.MATH_CONTROL_FONT.numericSize + 2 ),
      maxWidth: 40 // determined empirically
    };

    const items = [
      {
        value: SeriesType.SIN,
        createNode: () => new RichText( FMWSymbols.sinStringProperty, textOptions ),
        tandemName: `sin${AquaRadioButton.TANDEM_NAME_SUFFIX}`
      },
      {
        value: SeriesType.COS,
        createNode: () => new RichText( FMWSymbols.cosStringProperty, textOptions ),
        tandemName: `cos${AquaRadioButton.TANDEM_NAME_SUFFIX}`
      }
    ];

    super( seriesTypeProperty, items, options );
  }
}

fourierMakingWaves.register( 'SeriesTypeRadioButtonGroup', SeriesTypeRadioButtonGroup );