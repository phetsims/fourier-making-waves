// Copyright 2020, University of Colorado Boulder

/**
 * DiscreteControlPanel is the control panel for the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import HSeparator from '../../../../sun/js/HSeparator.js';
import FourierMakingWavesColors from '../../common/FourierMakingWavesColors.js';
import FourierMakingWavesConstants from '../../common/FourierMakingWavesConstants.js';
import FourierMakingWavesPanel from '../../common/view/FourierMakingWavesPanel.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import GraphControlsBox from './GraphControlsBox.js';
import MathFormBox from './MathFormBox.js';
import MeasurementToolsBox from './MeasurementToolsBox.js';
import PresetFunctionBox from './PresetFunctionBox.js';

class DiscreteControlPanel extends FourierMakingWavesPanel {

  /**
   * @param {DiscreteModel} model
   * @param {Node} popupParent
   * @param {Object} [options]
   */
  constructor( model, popupParent, options ) {

    options = merge( {}, FourierMakingWavesConstants.PANEL_OPTIONS, {
      fixedWidth: FourierMakingWavesConstants.CONTROL_PANEL_WIDTH,
      align: 'center'
    }, options );

    const separatorWidth = options.fixedWidth - ( 2 * options.xMargin );

    const separatorOptions = {
      stroke: FourierMakingWavesColors.SEPARATOR_STROKE
    };

    const content = new VBox( merge( {}, FourierMakingWavesConstants.VBOX_OPTIONS, {
      children: [
        new PresetFunctionBox( model.presetFunctionProperty, model.numberOfHarmonicsProperty, popupParent ),
        new HSeparator( separatorWidth, separatorOptions ),
        new GraphControlsBox( model.domainProperty, model.waveTypeProperty, popupParent ),
        new HSeparator( separatorWidth, separatorOptions ),
        new MeasurementToolsBox( model.wavelengthToolEnabledProperty, model.selectedWavelengthProperty,
          model.periodToolEnabledProperty, model.selectedPeriodProperty,
          model.numberOfHarmonicsProperty, model.domainProperty ),
        new HSeparator( separatorWidth, separatorOptions ),
        new MathFormBox( model.mathFormProperty, model.sumExpandedProperty, popupParent )
      ]
    } ) );

    super( content, options );
  }
}

fourierMakingWaves.register( 'DiscreteControlPanel', DiscreteControlPanel );
export default DiscreteControlPanel;