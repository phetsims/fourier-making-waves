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
import VBox from '../../../../scenery/js/nodes/VBox.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import FourierMakingWavesConstants from '../../common/FourierMakingWavesConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import AutoScaleCheckbox from './AutoScaleCheckbox.js';
import InfiniteHarmonicsCheckbox from './InfiniteHarmonicsCheckbox.js';

class DiscreteSumAccordionBox extends AccordionBox {

  /**
   * @param {Property.<boolean>} autoScaleProperty
   * @param {Property.<boolean>} infiniteHarmonicsVisibleProperty
   * @param {Object} [options]
   */
  constructor( autoScaleProperty, infiniteHarmonicsVisibleProperty, options ) {

    options = merge( {}, FourierMakingWavesConstants.ACCORDION_BOX_OPTIONS, options );

    assert && assert( !options.titleNode, 'DiscreteSumAccordionBox sets titleNode' );
    options.titleNode = new Text( fourierMakingWavesStrings.sum, {
      font: FourierMakingWavesConstants.TITLE_FONT
    } );

    //TODO
    const placeholder = new Rectangle( 0, 0, 700, 150, {
      stroke: 'black'
    } );

    const autoScaleCheckbox = new AutoScaleCheckbox( autoScaleProperty );

    const infiniteHarmonicsCheckbox = new InfiniteHarmonicsCheckbox( infiniteHarmonicsVisibleProperty );

    const content = new VBox( {
      spacing: 5,
      align: 'left',
      children: [
        placeholder,
        new HBox( {
          children: [ autoScaleCheckbox, infiniteHarmonicsCheckbox ],
          spacing: 25
        } )
      ]
    } );

    super( content, options );
  }
}

fourierMakingWaves.register( 'DiscreteSumAccordionBox', DiscreteSumAccordionBox );
export default DiscreteSumAccordionBox;