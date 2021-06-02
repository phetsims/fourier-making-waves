// Copyright 2020-2021, University of Colorado Boulder

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
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWColorProfile from '../../common/FMWColorProfile.js';
import FWMConstants from '../../common/FMWConstants.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import DiscreteModel from '../model/DiscreteModel.js';
import DiscreteSymbolsDialog from './DiscreteSymbolsDialog.js';
import FourierSeriesLayoutBox from './FourierSeriesLayoutBox.js';
import DiscreteGraphControlsLayoutBox from './DiscreteGraphControlsLayoutBox.js';
import MeasurementToolsLayoutBox from './MeasurementToolsLayoutBox.js';
import SoundLayoutBox from './SoundLayoutBox.js';

class DiscreteControlPanel extends Panel {

  /**
   * @param {DiscreteModel} model
   * @param {Node} popupParent
   * @param {Object} [options]
   */
  constructor( model, popupParent, options ) {

    assert && assert( model instanceof DiscreteModel );
    assert && assert( popupParent instanceof Node );

    options = merge( {}, FMWConstants.PANEL_OPTIONS, {

      // Panel options
      xMargin: 15,
      yMargin: 15,

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    const fourierSeriesLayoutBox = new FourierSeriesLayoutBox( model.waveformProperty,
      model.fourierSeries.numberOfHarmonicsProperty, popupParent, {
        tandem: options.tandem.createTandem( 'fourierSeriesLayoutBox' )
      } );

    // {Node[]} logical sections of the control panel
    const sectionNodes = [
      fourierSeriesLayoutBox,
      new DiscreteGraphControlsLayoutBox( model.domainProperty, model.seriesTypeProperty, model.equationFormProperty, popupParent, {
        tandem: options.tandem.createTandem( 'graphControlsLayoutBox' )
      } ),
      new MeasurementToolsLayoutBox( model.wavelengthTool, model.periodTool, model.domainProperty, {
        tandem: options.tandem.createTandem( 'measurementToolsLayoutBox' )
      } ),
      new SoundLayoutBox( model.fourierSeriesSoundEnabledProperty, model.fourierSeriesSoundOutputLevelProperty, {
        tandem: options.tandem.createTandem( 'soundLayoutBox' )
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
      children: children
    } ) );

    // Dialog that displays a key for math symbols
    const symbolsDialog = new DiscreteSymbolsDialog();

    // Push button to open the dialog, vertically centered on the 'Fourier Series' title.
    const symbolsButton = new InfoButton( {
      listener: () => symbolsDialog.show(),
      iconFill: 'rgb( 50, 145, 184 )',
      scale: 0.4,
      right: vBox.right,
      centerY: fourierSeriesLayoutBox.globalToParentBounds(
        fourierSeriesLayoutBox.fourierSeriesText.parentToGlobalBounds( fourierSeriesLayoutBox.fourierSeriesText.bounds ) ).centerY
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