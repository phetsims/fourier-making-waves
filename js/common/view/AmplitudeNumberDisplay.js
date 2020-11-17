// Copyright 2020, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import FourierMakingWavesConstants from '../FourierMakingWavesConstants.js';
import Harmonic from '../model/Harmonic.js';
import Symbols from '../Symbols.js';

// constants
const DEFAULT_FONT = new PhetFont( 12 );

class AmplitudeNumberDisplay extends VBox {

  /**
   * @param {Harmonic} harmonic
   * @param {Object} [options]
   */
  constructor( harmonic, options ) {

    assert && assert( harmonic instanceof Harmonic, 'invalid harmonic' );

    options = merge( {

      // VBox options
      spacing: FourierMakingWavesConstants.AMPLITUDE_DECIMAL_PLACES,
      align: 'center',

      // NumberDisplay options
      numberDisplayOptions: {
        align: 'center',
        decimalPlaces: 2,
        textOptions: {
          font: DEFAULT_FONT
        }
      }
    }, options );

    const labelNode = new RichText( StringUtils.fillIn( fourierMakingWavesStrings.amplitudeSymbolOrder, {
      symbol: Symbols.CAPITAL_A,
      order: harmonic.order
    } ), {
      font: DEFAULT_FONT
    } );

    const numberDisplay = new NumberDisplay( harmonic.amplitudeProperty, harmonic.amplitudeProperty.range,
      options.numberDisplayOptions );

    assert && assert( !options.children, 'NAME sets children' );
    options.children = [ labelNode, numberDisplay ];

    super( options );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

fourierMakingWaves.register( 'AmplitudeNumberDisplay', AmplitudeNumberDisplay );
export default AmplitudeNumberDisplay;