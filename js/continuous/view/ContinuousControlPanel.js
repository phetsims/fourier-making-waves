// Copyright 2021, University of Colorado Boulder

/**
 * ContinuousControlPanel is the control panel in the 'Continuous' screen.
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
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import ContinuousModel from '../model/ContinuousModel.js';
import ComponentSpacingLayoutBox from './ComponentSpacingLayoutBox.js';
import ContinuousGraphControlsLayoutBox from './ContinuousGraphControlsLayoutBox.js';
import ContinuousSymbolsDialog from './ContinuousSymbolsDialog.js';
import WavePacketCenterLayoutBox from './WavePacketCenterLayoutBox.js';
import WavePacketWidthLayoutBox from './WavePacketWidthLayoutBox.js';

class ContinuousControlPanel extends Panel {

  /**
   * @param {ContinuousModel} model
   * @param {Node} popupParent
   * @param {Object} [options]
   */
  constructor( model, popupParent, options ) {

    assert && assert( model instanceof ContinuousModel );
    assert && assert( popupParent instanceof Node );

    options = merge( {}, FMWConstants.PANEL_OPTIONS, {

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    const sectionNodes = [

      // Component Spacing
      new ComponentSpacingLayoutBox( model.domainProperty, model.componentSpacingProperty,
        model.componentSpacingIndexProperty, model.continuousWaveformVisibleProperty ),

      // Wave Packet Center
      new WavePacketCenterLayoutBox( model.wavePacketCenterProperty ),

      // Wave Packet Width
      new WavePacketWidthLayoutBox( model.kWidthProperty, model.xWidthProperty ),

      // Graph Controls
      new ContinuousGraphControlsLayoutBox( model.domainProperty, model.seriesTypeProperty,
        model.envelopeVisibleProperty, model.widthIndicatorsVisibleProperty, popupParent, {
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

    // Dialog that displays a key for math symbols
    const symbolsDialog = new ContinuousSymbolsDialog();

    //TODO where should this button be located?
    // Push button to open the dialog.
    const symbolsButton = new InfoButton( {
      listener: () => symbolsDialog.show(),
      iconFill: 'rgb( 50, 145, 184 )',
      scale: 0.4
    } );
    children.push( new HSeparator( separatorWidth, separatorOptions ) );
    children.push( symbolsButton );

    const content = new VBox( {
      align: 'left',
      spacing: 10,
      children: children
    } );

    super( content, options );
  }
}

fourierMakingWaves.register( 'ContinuousControlPanel', ContinuousControlPanel );
export default ContinuousControlPanel;