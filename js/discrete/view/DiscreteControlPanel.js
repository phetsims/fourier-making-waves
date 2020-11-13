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
import GraphControlsLayoutBox from './GraphControlsLayoutBox.js';
import MathFormLayoutBox from './MathFormLayoutBox.js';
import MeasurementToolsLayoutBox from './MeasurementToolsLayoutBox.js';
import PresetFunctionLayoutBox from './PresetFunctionLayoutBox.js';

class DiscreteControlPanel extends FourierMakingWavesPanel {

  /**
   * @param {DiscreteModel} model
   * @param {Property.<boolean>} sumExpandedProperty
   * @param {Node} popupParent
   * @param {Object} [options]
   */
  constructor( model, sumExpandedProperty, popupParent, options ) {

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
        new PresetFunctionLayoutBox( model.presetFunctionProperty, model.numberOfHarmonicsProperty, popupParent ),
        new HSeparator( separatorWidth, separatorOptions ),
        new GraphControlsLayoutBox( model.domainProperty, model.waveTypeProperty, popupParent ),
        new HSeparator( separatorWidth, separatorOptions ),
        new MeasurementToolsLayoutBox( model.wavelengthToolEnabledProperty, model.selectedWavelengthProperty,
          model.periodToolEnabledProperty, model.selectedPeriodProperty,
          model.numberOfHarmonicsProperty, model.domainProperty ),
        new HSeparator( separatorWidth, separatorOptions ),
        new MathFormLayoutBox( model.fourierSeries, model.mathFormProperty, sumExpandedProperty, popupParent )
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