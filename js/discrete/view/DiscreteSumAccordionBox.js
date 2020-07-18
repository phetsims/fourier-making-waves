// Copyright 2020, University of Colorado Boulder

/**
 * DiscreteSumAccordionBox is the 'Sum' accordion box in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import FourierMakingWavesConstants from '../../common/FourierMakingWavesConstants.js';
import FourierMakingWavesPanel from '../../common/view/FourierMakingWavesPanel.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';

//TODO extends AccordionBox
class DiscreteSumAccordionBox extends FourierMakingWavesPanel {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {}, FourierMakingWavesConstants.PANEL_OPTIONS, {
      align: 'left',
      fixedWidth: 100,
      fixedHeight: 100
    }, options );

    const titleText = new Text( fourierMakingWavesStrings.sum, {
      font: FourierMakingWavesConstants.TITLE_FONT,
      rotation: -Math.PI / 2
    } );

    //TODO
    const placeholder = new Rectangle( 0, 0, 600, options.fixedHeight - ( 2 * options.yMargin ), {
      left: titleText.left + 30,
      top: titleText.top
    } );

    const content = new HBox( {
      align: 'center',
      spacing: 20,
      children: [ titleText, placeholder ]
    } );

    super( content, options );
  }
}

fourierMakingWaves.register( 'DiscreteSumAccordionBox', DiscreteSumAccordionBox );
export default DiscreteSumAccordionBox;