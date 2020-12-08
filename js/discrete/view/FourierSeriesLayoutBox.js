// Copyright 2020, University of Colorado Boulder

/**
 * FourierSeriesLayoutBox is the 'Fourier Series' section of the control panel in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import NumberPicker from '../../../../scenery-phet/js/NumberPicker.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import Waveform from '../model/Waveform.js';
import WaveformComboBox from './WaveformComboBox.js';

class FourierSeriesLayoutBox extends VBox {

  /**
   * @param {EnumerationProperty.<Waveform>} waveformProperty
   * @param {NumberProperty} numberOfHarmonicsProperty
   * @param {Node} popupParent
   * @param {Object} [options]
   */
  constructor( waveformProperty, numberOfHarmonicsProperty, popupParent, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( waveformProperty, Waveform );
    assert && assert( numberOfHarmonicsProperty instanceof NumberProperty, 'invalid numberOfHarmonicsProperty' );
    assert && assert( popupParent instanceof Node, 'invalid popupParent' );

    options = merge( {}, FMWConstants.LAYOUT_BOX_OPTIONS, options );

    const titleText = new Text( fourierMakingWavesStrings.fourierSeries, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 200 // determined empirically
    } );

    const waveformText = new Text( fourierMakingWavesStrings.waveform, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 70 // determined empirically
    } );

    const waveformComboBox = new WaveformComboBox( waveformProperty, popupParent );

    const waveformBox = new HBox( {
      spacing: 3,
      children: [ waveformText, waveformComboBox ]
    } );

    const harmonicsText = new Text( fourierMakingWavesStrings.harmonics, {
      font: FMWConstants.CONTROL_FONT,
      maxWidth: 150 // determined empirically
    } );

    const harmonicsPicker = new NumberPicker( numberOfHarmonicsProperty, numberOfHarmonicsProperty.rangeProperty, {
      font: new PhetFont( 16 ),
      cornerRadius: 3,
      color: 'black'
    } );

    const harmonicsBox = new HBox( {
      spacing: 5,
      children: [ harmonicsText, harmonicsPicker ]
    } );

    assert && assert( !options.children, 'FourierSeriesLayoutBox sets children' );
    options.children = [ titleText, waveformBox, harmonicsBox ];

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

fourierMakingWaves.register( 'FourierSeriesLayoutBox', FourierSeriesLayoutBox );
export default FourierSeriesLayoutBox;