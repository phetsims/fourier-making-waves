// Copyright 2020, University of Colorado Boulder

/**
 * DiscreteControlPanel is the control panel for the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import HSeparator from '../../../../sun/js/HSeparator.js';
import Panel from '../../../../sun/js/Panel.js';
import FMWColorProfile from '../../common/FMWColorProfile.js';
import FWMConstants from '../../common/FMWConstants.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import DiscreteModel from '../model/DiscreteModel.js';
import DiscreteSymbolsDialog from './DiscreteSymbolsDialog.js';
import FourierSeriesLayoutBox from './FourierSeriesLayoutBox.js';
import GraphControlsLayoutBox from './GraphControlsLayoutBox.js';
import MeasurementToolsLayoutBox from './MeasurementToolsLayoutBox.js';
import SoundLayoutBox from './SoundLayoutBox.js';

class DiscreteControlPanel extends Panel {

  /**
   * @param {DiscreteModel} model
   * @param {Node} popupParent
   * @param {Object} [options]
   */
  constructor( model, popupParent, options ) {

    assert && assert( model instanceof DiscreteModel, 'invalid model' );
    assert && assert( popupParent instanceof Node, 'invalid popupParent' );

    options = merge( {}, FMWConstants.PANEL_OPTIONS, {
      xMargin: 15,
      yMargin: 15
    }, options );

    const fourierSeriesLayoutBox =
      new FourierSeriesLayoutBox( model.waveformProperty, model.fourierSeries.numberOfHarmonicsProperty, popupParent );

    // {Node[]} logical sections of the control panel
    const sectionNodes = [
      fourierSeriesLayoutBox,
      new GraphControlsLayoutBox( model.domainProperty, model.seriesTypeProperty, model.equationFormProperty, popupParent ),
      new MeasurementToolsLayoutBox( model.wavelengthTool, model.periodTool, model.domainProperty ),
      new SoundLayoutBox( model.fourierSeriesSoundEnabledProperty, model.fourierSeriesSoundOutputLevelProperty )
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
      children: children
    } ) );

    // Dialog that displays a key for math symbols
    const symbolsDialog = new DiscreteSymbolsDialog();

    // Push button to open the dialog, vertically centered on the 'Fourier Series' title.
    const symbolsButton = new InfoButton( {
      iconFill: 'rgb( 50, 145, 184 )',
      listener: () => {
        symbolsDialog.show();
      },
      scale: 0.4,
      right: vBox.right,
      centerY: fourierSeriesLayoutBox.globalToParentBounds(
        fourierSeriesLayoutBox.titleText.parentToGlobalBounds( fourierSeriesLayoutBox.titleText.bounds ) ).centerY
    } );

    const content = new Node( {
      children: [ vBox, symbolsButton ]
    } );

    super( content, options );
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

fourierMakingWaves.register( 'DiscreteControlPanel', DiscreteControlPanel );
export default DiscreteControlPanel;