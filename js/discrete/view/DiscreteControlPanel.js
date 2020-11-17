// Copyright 2020, University of Colorado Boulder

/**
 * DiscreteControlPanel is the control panel for the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import HSeparator from '../../../../sun/js/HSeparator.js';
import FMWColorProfile from '../../common/FMWColorProfile.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWPanel from '../../common/view/FMWPanel.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import GraphControlsLayoutBox from './GraphControlsLayoutBox.js';
import MathFormLayoutBox from './MathFormLayoutBox.js';
import MeasurementToolsLayoutBox from './MeasurementToolsLayoutBox.js';
import PresetFunctionLayoutBox from './PresetFunctionLayoutBox.js';

class DiscreteControlPanel extends FMWPanel {

  /**
   * @param {DiscreteModel} model
   * @param {Property.<boolean>} mathFormExpandedSumProperty
   * @param {Node} popupParent
   * @param {Object} [options]
   */
  constructor( model, mathFormExpandedSumProperty, popupParent, options ) {

    options = merge( {}, FMWConstants.PANEL_OPTIONS, {
      fixedWidth: FMWConstants.CONTROL_PANEL_WIDTH,
      align: 'center'
    }, options );

    const separatorWidth = options.fixedWidth - ( 2 * options.xMargin );

    const separatorOptions = {
      stroke: FMWColorProfile.separatorStrokeProperty
    };

    const content = new VBox( merge( {}, FMWConstants.VBOX_OPTIONS, {
      children: [
        new PresetFunctionLayoutBox( model.presetFunctionProperty, model.fourierSeries.numberOfHarmonicsProperty, popupParent ),
        new HSeparator( separatorWidth, separatorOptions ),
        new GraphControlsLayoutBox( model.domainProperty, model.waveTypeProperty, popupParent ),
        new HSeparator( separatorWidth, separatorOptions ),
        new MeasurementToolsLayoutBox( model.wavelengthToolEnabledProperty, model.selectedWavelengthProperty,
          model.periodToolEnabledProperty, model.selectedPeriodProperty,
          model.fourierSeries.numberOfHarmonicsProperty, model.domainProperty ),
        new HSeparator( separatorWidth, separatorOptions ),
        new MathFormLayoutBox( model.fourierSeries, model.mathFormProperty, mathFormExpandedSumProperty, popupParent )
      ]
    } ) );

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