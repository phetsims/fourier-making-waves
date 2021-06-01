// Copyright 2021, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import HSeparator from '../../../../sun/js/HSeparator.js';
import Panel from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWColorProfile from '../../common/FMWColorProfile.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import ContinuousModel from '../model/ContinuousModel.js';

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

      // Panel options
      xMargin: 15,
      yMargin: 15,

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    const titleOptions = {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 250 // determined empirically
    };

    const spacingBetweenFourierComponentsText = new Text( fourierMakingWavesStrings.spacingBetweenFourierComponents, titleOptions );
    const wavePacketCenterText = new Text( fourierMakingWavesStrings.wavePacketCenter, titleOptions );
    const wavePacketWidthText = new Text( fourierMakingWavesStrings.wavePacketWidthText, titleOptions );
    const graphControlsText = new Text( fourierMakingWavesStrings.graphControls, titleOptions );
    const sectionNodes = [
      spacingBetweenFourierComponentsText,
      wavePacketCenterText,
      wavePacketWidthText,
      graphControlsText
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

    // Push button to open the dialog.
    const symbolsButton = new InfoButton( {
      iconFill: 'rgb( 50, 145, 184 )',
      listener: () => {
        //TODO
      },
      scale: 0.4
    } );
    children.push( new HSeparator( separatorWidth, separatorOptions ) );
    children.push( symbolsButton );

    const vBox = new VBox( {
      align: 'left',
      spacing: 10,
      children: children
    } );

    const content = new Node( {
      children: [ vBox, symbolsButton ]
    } );

    super( content, options );
  }
}

fourierMakingWaves.register( 'ContinuousControlPanel', ContinuousControlPanel );
export default ContinuousControlPanel;