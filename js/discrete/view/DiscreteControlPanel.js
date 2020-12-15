// Copyright 2020, University of Colorado Boulder

/**
 * DiscreteControlPanel is the control panel for the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import HSeparator from '../../../../sun/js/HSeparator.js';
import Panel from '../../../../sun/js/Panel.js';
import FMWColorProfile from '../../common/FMWColorProfile.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import DiscreteModel from '../model/DiscreteModel.js';
import DiscreteViewProperties from './DiscreteViewProperties.js';
import FourierSeriesLayoutBox from './FourierSeriesLayoutBox.js';
import GraphControlsLayoutBox from './GraphControlsLayoutBox.js';
import MathFormLayoutBox from './MathFormLayoutBox.js';
import MeasurementToolsLayoutBox from './MeasurementToolsLayoutBox.js';
import SoundLayoutBox from './SoundLayoutBox.js';

class DiscreteControlPanel extends Panel {

  /**
   * @param {DiscreteModel} model
   * @param {DiscreteViewProperties} viewProperties
   * @param {Node} popupParent
   * @param {Object} [options]
   */
  constructor( model, viewProperties, popupParent, options ) {

    assert && assert( model instanceof DiscreteModel, 'invalid model' );
    assert && assert( viewProperties instanceof DiscreteViewProperties, 'invalid viewProperties' );
    assert && assert( popupParent instanceof Node, 'invalid popupParent' );

    options = merge( {}, FMWConstants.PANEL_OPTIONS, {
      xMargin: 15,
      yMargin: 15
    }, options );

    // {Node[]} logical sections of the control panel
    const sectionNodes = [
      new FourierSeriesLayoutBox( model.waveformProperty, model.fourierSeries.numberOfHarmonicsProperty, popupParent ),
      new GraphControlsLayoutBox( model.domainProperty, model.waveTypeProperty, popupParent ),
      new MeasurementToolsLayoutBox(
        viewProperties.wavelengthToolSelectedProperty, viewProperties.wavelengthToolOrderProperty,
        viewProperties.periodToolSelectedProperty, viewProperties.periodToolOrderProperty,
        model.fourierSeries.numberOfHarmonicsProperty, model.domainProperty ),
      new MathFormLayoutBox( model.fourierSeries, model.mathFormProperty, model.domainProperty, popupParent ),
      new SoundLayoutBox( viewProperties.soundEnabledProperty, viewProperties.soundOutputLevelProperty )
    ];

    // Separate width is 
    const separatorWidth = _.maxBy( sectionNodes, layoutBox => layoutBox.width ).width;
    const separatorOptions = {
      stroke: FMWColorProfile.separatorStrokeProperty
    };

    // Put a separator between each logical section
    const children = [];
    for ( let i = 0; i < sectionNodes.length; i++ ) {
      children.push( sectionNodes[ i ] );
      if ( i < sectionNodes.length - 1 ) {
        children.push( new HSeparator( separatorWidth, separatorOptions ) );
      }
    }

    const content = new VBox( {
      align: 'left',
      spacing: 15,
      children: children
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