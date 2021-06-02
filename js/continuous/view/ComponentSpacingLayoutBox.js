// Copyright 2020-2021, University of Colorado Boulder

/**
 * ComponentSpacingLayoutBox is the 'Component Spacing' section of the control panel in the 'Continuous' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import ComponentSpacingSlider from './ComponentSpacingSlider.js';

class ComponentSpacingLayoutBox extends VBox {

  /**
   * @param {Property.<number>} spacingBetweenComponentsIndexProperty
   * @param {Property.<boolean>} continuousWaveformVisibleProperty
   * @param {Object} [options]
   */
  constructor( spacingBetweenComponentsIndexProperty, continuousWaveformVisibleProperty, options ) {

    assert && AssertUtils.assertPropertyOf( spacingBetweenComponentsIndexProperty, 'number' );
    assert && AssertUtils.assertPropertyOf( continuousWaveformVisibleProperty, 'boolean' );

    options = merge( {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, FMWConstants.VBOX_OPTIONS, options );

    // Component Spacing
    const componentSpacingText = new Text( fourierMakingWavesStrings.componentSpacing, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 200, // determined empirically
      tandem: options.tandem.createTandem( 'componentSpacingText' )
    } );

    const componentSpacingSlider = new ComponentSpacingSlider( spacingBetweenComponentsIndexProperty, {
      tandem: options.tandem.createTandem( 'componentSpacingSlider' )
    } );

    //TODO 'Continuous Waveform' checkbox

    assert && assert( !options.children, 'ComponentSpacingLayoutBox sets children' );
    options.children = [
      componentSpacingText,
      componentSpacingSlider
    ];

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

fourierMakingWaves.register( 'ComponentSpacingLayoutBox', ComponentSpacingLayoutBox );
export default ComponentSpacingLayoutBox;