// Copyright 2020, University of Colorado Boulder

/**
 * DiscreteHarmonicsAccordionBox is the 'Harmonics' accordion box in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import FourierMakingWavesConstants from '../../common/FourierMakingWavesConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';

class DiscreteHarmonicsAccordionBox extends AccordionBox {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {}, FourierMakingWavesConstants.ACCORDION_BOX_OPTIONS, options );

    assert && assert( !options.titleNode, 'DiscreteHarmonicsAccordionBox sets titleNode' );
    options.titleNode = new Text( fourierMakingWavesStrings.harmonics, {
      font: FourierMakingWavesConstants.TITLE_FONT
    } );

    //TODO
    const content = new Rectangle( 0, 0, 718, 150, {
      stroke: 'black'
    } );

    super( content, options );
  }
}

fourierMakingWaves.register( 'DiscreteHarmonicsAccordionBox', DiscreteHarmonicsAccordionBox );
export default DiscreteHarmonicsAccordionBox;