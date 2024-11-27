// Copyright 2020-2024, University of Colorado Boulder

/**
 * SeriesTypeRadioButtonGroup is used to switch between sine series and cosine series.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { RichText } from '../../../../scenery/js/imports.js';
import { AquaRadioButtonGroupItem } from '../../../../sun/js/AquaRadioButtonGroup.js';
import HorizontalAquaRadioButtonGroup from '../../../../sun/js/HorizontalAquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import FMWConstants from '../FMWConstants.js';
import FMWSymbols from '../FMWSymbols.js';
import SeriesType from '../model/SeriesType.js';

export default class SeriesTypeRadioButtonGroup extends HorizontalAquaRadioButtonGroup<SeriesType> {

  public constructor( seriesTypeProperty: EnumerationProperty<SeriesType>, tandem: Tandem ) {

    const textOptions = {

      // Make this font a bit larger, see https://github.com/phetsims/fourier-making-waves/issues/138
      font: new PhetFont( FMWConstants.MATH_CONTROL_FONT.numericSize + 2 ),
      maxWidth: 35 // determined empirically
    };

    const items: AquaRadioButtonGroupItem<SeriesType>[] = [
      {
        value: SeriesType.SIN,
        createNode: () => new RichText( FMWSymbols.sinMarkupStringProperty, textOptions ),
        tandemName: 'sinRadioButton'
      },
      {
        value: SeriesType.COS,
        createNode: () => new RichText( FMWSymbols.cosMarkupStringProperty, textOptions ),
        tandemName: 'cosRadioButton'
      }
    ];

    super( seriesTypeProperty, items, {
      spacing: 12,
      touchAreaYDilation: 6,
      radioButtonOptions: {
        xSpacing: 6
      },
      tandem: tandem
    } );
  }
}

fourierMakingWaves.register( 'SeriesTypeRadioButtonGroup', SeriesTypeRadioButtonGroup );