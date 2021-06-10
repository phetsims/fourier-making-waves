// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketControlPanel is the control panel in the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import HSeparator from '../../../../sun/js/HSeparator.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWColorProfile from '../../common/FMWColorProfile.js';
import FWMConstants from '../../common/FMWConstants.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import WavePacketModel from '../model/WavePacketModel.js';
import ComponentSpacingLayoutBox from './ComponentSpacingLayoutBox.js';
import WavePacketGraphControlsLayoutBox from './WavePacketGraphControlsLayoutBox.js';
import WavePacketSymbolsDialog from './WavePacketSymbolsDialog.js';
import WavePacketCenterLayoutBox from './WavePacketCenterLayoutBox.js';
import WavePacketWidthLayoutBox from './WavePacketWidthLayoutBox.js';

// constants
const VERTICAL_SPACING = 8;

class WavePacketControlPanel extends Panel {

  /**
   * @param {WavePacketModel} model
   * @param {Node} popupParent
   * @param {Object} [options]
   */
  constructor( model, popupParent, options ) {

    assert && assert( model instanceof WavePacketModel );
    assert && assert( popupParent instanceof Node );

    options = merge( {}, FMWConstants.PANEL_OPTIONS, {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    const componentSpacingLayoutBox = new ComponentSpacingLayoutBox( model.domainProperty,
      model.wavePacket.componentSpacingProperty, model.wavePacket.componentSpacingIndexProperty, {
        spacing: VERTICAL_SPACING,
        tandem: options.tandem.createTandem( 'componentSpacingLayoutBox' )
      } );

    const sectionNodes = [

      // Component Spacing
      componentSpacingLayoutBox,

      // Wave Packet Center
      new WavePacketCenterLayoutBox( model.domainProperty, model.wavePacket.centerProperty, {
        spacing: VERTICAL_SPACING,
        tandem: options.tandem.createTandem( 'wavePacketCenterLayoutBox' )
      } ),

      // Wave Packet Width
      new WavePacketWidthLayoutBox( model.domainProperty, model.wavePacket.kWidthProperty, model.wavePacket.xWidthProperty, {
        spacing: VERTICAL_SPACING,
        tandem: options.tandem.createTandem( 'wavePacketWidthLayoutBox' )
      } ),

      // Graph Controls
      new WavePacketGraphControlsLayoutBox( model.domainProperty, model.seriesTypeProperty,
        model.widthIndicatorsVisibleProperty, popupParent, {
          spacing: VERTICAL_SPACING,
          tandem: options.tandem.createTandem( 'graphControlsLayoutBox' )
        } )
    ];

    // Put a separator between each logical section.
    // Use a uniform separator width, sized to fit the widest section
    const separatorWidth = _.maxBy( sectionNodes, layoutBox => layoutBox.width ).width;
    const separatorOptions = {
      stroke: FMWColorProfile.separatorStrokeProperty
    };
    const children = [];
    for ( let i = 0; i < sectionNodes.length; i++ ) {
      children.push( sectionNodes[ i ] );
      if ( i < sectionNodes.length - 1 ) {
        children.push( new HSeparator( separatorWidth, separatorOptions ) );
      }
    }

    const vBox = new VBox( merge( {}, FWMConstants.VBOX_OPTIONS, {
      children: children,
      spacing: 10
    } ) );

    // Dialog that displays a key for math symbols
    const symbolsDialog = new WavePacketSymbolsDialog();

    //TODO where should this button be located?
    // Push button to open the dialog.
    const symbolsButton = new InfoButton( {
      listener: () => symbolsDialog.show(),
      iconFill: 'rgb( 50, 145, 184 )',
      scale: 0.4,
      right: vBox.right,
      centerY: componentSpacingLayoutBox.globalToParentBounds(
        componentSpacingLayoutBox.componentSpacingText.parentToGlobalBounds( componentSpacingLayoutBox.componentSpacingText.bounds ) ).centerY

    } );

    const content = new Node( {
      children: [ vBox, symbolsButton ]
    } );

    super( content, options );

    // pdom - traversal order
    // See https://github.com/phetsims/fourier-making-waves/issues/53
    this.pdomOrder = [
      symbolsButton,
      vBox
    ];
  }
}

fourierMakingWaves.register( 'WavePacketControlPanel', WavePacketControlPanel );
export default WavePacketControlPanel;