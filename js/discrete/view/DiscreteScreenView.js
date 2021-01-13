// Copyright 2020, University of Colorado Boulder

/**
 * DiscreteScreenView is the view for the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import OopsDialog from '../../../../scenery-phet/js/OopsDialog.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import AmplitudeKeypadDialog from '../../common/view/AmplitudeKeypadDialog.js';
import LabeledExpandCollapseButton from '../../common/view/LabeledExpandCollapseButton.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import DiscreteModel from '../model/DiscreteModel.js';
import Domain from '../model/Domain.js';
import EquationForm from '../model/EquationForm.js';
import AmplitudesChartNode from './AmplitudesChartNode.js';
import DiscreteControlPanel from './DiscreteControlPanel.js';
import ExpandedFormButton from './ExpandedFormButton.js';
import ExpandedFormDialog from './ExpandedFormDialog.js';
import FourierSoundGenerator from './FourierSoundGenerator.js';
import HarmonicsChartNode from './HarmonicsChartNode.js';
import HarmonicsEquationNode from './HarmonicsEquationNode.js';
import PeriodClockNode from './PeriodClockNode.js';
import PeriodCalipersNode from './PeriodCalipersNode.js';
import SumChartNode from './SumChartNode.js';
import SumEquationNode from './SumEquationNode.js';
import WavelengthCalipersNode from './WavelengthCalipersNode.js';

// constants, in view coordinates, determined empirically
const CHART_RECTANGLE_SIZE = new Dimension2( 645, 123 ); // size of the chart rectangles
const X_CHART_RECTANGLES = 65; // x origin of the rectangle part of the charts, so that they are all aligned
const CHART_TITLE_Y_SPACING = 15; // space between chart title and the chart

class DiscreteScreenView extends ScreenView {

  /**
   * @param {DiscreteModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {
    assert && assert( model instanceof DiscreteModel, 'invalid model' );
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( {
      tandem: tandem
    } );

    // Sound for the Fourier series
    const fourierSoundGenerator = new FourierSoundGenerator( model.fourierSeries,
      model.fourierSeriesSoundEnabledProperty, model.fourierSeriesSoundOutputLevelProperty );
    soundManager.addSoundGenerator( fourierSoundGenerator );

    // Parent for all popups
    const popupParent = new Node();

    // KeypadDialog
    const amplitudeKeypadDialog = new AmplitudeKeypadDialog( model.fourierSeries.amplitudeRange, this.layoutBounds );

    const amplitudesChartNode = new AmplitudesChartNode( model.fourierSeries, model.waveformProperty,
      model.chartsModel.emphasizedHarmonics, amplitudeKeypadDialog, {
        viewWidth: CHART_RECTANGLE_SIZE.width,
        viewHeight: CHART_RECTANGLE_SIZE.height,
        tandem: tandem.createTandem( 'amplitudesChartNode' )
      } );

    const harmonicsExpandCollapseButton = new LabeledExpandCollapseButton(
      fourierMakingWavesStrings.harmonicsChart, model.chartsModel.harmonicsChartVisibleProperty, {
        textOptions: { maxWidth: 150 }, // determined empirically
        tandem: tandem.createTandem( 'harmonicsExpandCollapseButton' )
      } );

    const harmonicsChartNode = new HarmonicsChartNode( model, {
      viewWidth: CHART_RECTANGLE_SIZE.width,
      viewHeight: CHART_RECTANGLE_SIZE.height,
      visibleProperty: model.chartsModel.harmonicsChartVisibleProperty,
      tandem: tandem.createTandem( 'harmonicsChartNode' )
    } );

    // Equation that appears above the Harmonics chart, with wrapper Node to handle centering
    const harmonicsEquationNode = new HarmonicsEquationNode(
      model.domainProperty, model.seriesTypeProperty, model.equationFormProperty, {
        maxWidth: 0.5 * CHART_RECTANGLE_SIZE.width,
        tandem: tandem.createTandem( 'harmonicsEquationNode' ),
        phetioReadOnly: true
      } );
    const harmonicsEquationWrapperNode = new Node( {
      children: [ harmonicsEquationNode ]
    } );

    // Visibility of the equation above the Harmonics chart
    Property.multilink(
      [ model.chartsModel.harmonicsChartVisibleProperty, model.equationFormProperty ],
      ( harmonicsChartVisible, equationForm ) => {
        harmonicsEquationNode.visible = harmonicsChartVisible && ( equationForm !== EquationForm.HIDDEN );
      } );

    const sumExpandCollapseButton = new LabeledExpandCollapseButton(
      fourierMakingWavesStrings.sum, model.chartsModel.sumChartVisibleProperty, {
        textOptions: { maxWidth: 150 }, // determined empirically
        tandem: tandem.createTandem( 'sumExpandCollapseButton' )
      } );

    //TODO move sumDataSetProperty to model.chartsModel?
    const sumChartNode = new SumChartNode( model, harmonicsChartNode.sumDataSetProperty, {
      viewWidth: CHART_RECTANGLE_SIZE.width,
      viewHeight: CHART_RECTANGLE_SIZE.height,
      left: sumExpandCollapseButton.left,
      y: sumExpandCollapseButton.bottom + CHART_TITLE_Y_SPACING,
      visibleProperty: model.chartsModel.sumChartVisibleProperty,
      tandem: tandem.createTandem( 'sumChartNode' )
    } );

    // Equation that appears above the Sum chart, with wrapper Node to handle centering
    const sumEquationNode = new SumEquationNode( model.fourierSeries.numberOfHarmonicsProperty, model.domainProperty,
      model.seriesTypeProperty, model.equationFormProperty, {
        maxWidth: 0.5 * CHART_RECTANGLE_SIZE.width,
        tandem: tandem.createTandem( 'sumEquationNode' ),
        phetioReadOnly: true
      } );
    const sumEquationWrapperNode = new Node( {
      children: [ sumEquationNode ]
    } );

    // Push button that opens the 'Expanded Sum' dialog
    const expandedFormButton = new ExpandedFormButton( {
      scale: 0.45,
      listener: () => {
        const dialog = new ExpandedFormDialog(
          model.fourierSeries, model.domainProperty, model.seriesTypeProperty, model.equationFormProperty, {
            hideCallback: () => dialog.dispose()
          } );
        dialog.show();
      },
      tandem: tandem.createTandem( 'expandedFormButton' ),
      phetioReadOnly: true
    } );

    // Visibility of the equation and push button above the Sum chart
    Property.multilink(
      [ model.chartsModel.sumChartVisibleProperty, model.equationFormProperty ],
      ( sumChartVisible, equationForm ) => {
        const visible = sumChartVisible && ( equationForm !== EquationForm.HIDDEN );
        sumEquationNode.visible = visible;
        expandedFormButton.interruptSubtreeInput();
        expandedFormButton.visible = visible;
      } );

    const controlPanel = new DiscreteControlPanel( model, model.chartsModel, popupParent, {
      tandem: tandem.createTandem( 'controlPanel' )
    } );

    const timeControlNode = new TimeControlNode( model.isPlayingProperty, {
      playPauseStepButtonOptions: {
        stepForwardButtonOptions: {
          listener: () => {
            if ( model.domainProperty.value === Domain.SPACE_AND_TIME ) {
              model.tProperty.value += FMWConstants.STEP_DT;
            }
          }
        }
      },
      tandem: tandem.createTandem( 'timeControlNode' )
    } );

    // Enabled time controls only when there is the possibility of animation.
    model.domainProperty.link( domain => {
      timeControlNode.enabled = ( domain === Domain.SPACE_AND_TIME );
    } );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        resetMeasurementToolPositions();
      },
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    // For measuring a harmonic's wavelength in the 'space' and 'space & time' domains.
    const wavelengthCalipersNode = new WavelengthCalipersNode( model, harmonicsChartNode.chartTransform, this.visibleBoundsProperty );

    // For measuring a harmonic's period in the 'time' domain.
    const periodCalipersNode = new PeriodCalipersNode( model, harmonicsChartNode.chartTransform, this.visibleBoundsProperty );

    // For measuring a harmonic's period in the 'space & time' domain.
    const periodClockNode = new PeriodClockNode( model, this.visibleBoundsProperty );

    // Rendering order
    this.addChild( amplitudesChartNode );
    this.addChild( harmonicsExpandCollapseButton );
    this.addChild( harmonicsChartNode );
    this.addChild( harmonicsEquationWrapperNode );
    this.addChild( sumExpandCollapseButton );
    this.addChild( sumChartNode );
    this.addChild( sumEquationWrapperNode );
    this.addChild( expandedFormButton );
    this.addChild( controlPanel );
    this.addChild( timeControlNode );
    this.addChild( resetAllButton );
    this.addChild( wavelengthCalipersNode ); // Measurement Tools on top of everything else
    this.addChild( periodCalipersNode );
    this.addChild( periodClockNode );
    this.addChild( popupParent ); // parent for popups on top

    // Layout, spacing set empirically
    amplitudesChartNode.x = X_CHART_RECTANGLES;
    amplitudesChartNode.y = 54;
    harmonicsExpandCollapseButton.left = this.layoutBounds.left + FMWConstants.SCREEN_VIEW_X_MARGIN;
    harmonicsExpandCollapseButton.top = amplitudesChartNode.bottom + 15;
    harmonicsChartNode.x = X_CHART_RECTANGLES;
    harmonicsChartNode.y = harmonicsExpandCollapseButton.bottom + CHART_TITLE_Y_SPACING;
    sumExpandCollapseButton.left = harmonicsExpandCollapseButton.left;
    sumExpandCollapseButton.top = harmonicsChartNode.bottom + 30;
    sumChartNode.x = X_CHART_RECTANGLES;
    sumChartNode.y = sumExpandCollapseButton.bottom + CHART_TITLE_Y_SPACING;
    controlPanel.right = this.layoutBounds.right - FMWConstants.SCREEN_VIEW_X_MARGIN;
    controlPanel.top = this.layoutBounds.top + FMWConstants.SCREEN_VIEW_Y_MARGIN;
    timeControlNode.left = controlPanel.left + 30;
    timeControlNode.bottom = this.layoutBounds.bottom - FMWConstants.SCREEN_VIEW_Y_MARGIN;
    resetAllButton.right = this.layoutBounds.maxX - FMWConstants.SCREEN_VIEW_X_MARGIN;
    resetAllButton.bottom = this.layoutBounds.maxY - FMWConstants.SCREEN_VIEW_Y_MARGIN;

    // Get the bounds of the chart rectangles in this coordinate frame, used for layout.
    const harmonicsChartRectangleLocalBounds = this.globalToLocalBounds( harmonicsChartNode.chartRectangle.parentToGlobalBounds( harmonicsChartNode.chartRectangle.bounds ) );
    const sumChartRectangleLocalBounds = this.globalToLocalBounds( sumChartNode.chartRectangle.parentToGlobalBounds( sumChartNode.chartRectangle.bounds ) );

    // Center equations above their respective charts.
    // Since we need to listen to the bounds of these equations in order to respect their maxWidth, wrapper Nodes are
    // transformed. See https://github.com/phetsims/fourier-making-waves/issues/40
    harmonicsEquationNode.boundsProperty.link( () => {

      // Center the equation above the Harmonics chart.
      harmonicsEquationWrapperNode.centerX = harmonicsChartRectangleLocalBounds.centerX;
      harmonicsEquationWrapperNode.bottom = harmonicsChartRectangleLocalBounds.top - 3;
    } );

    sumEquationNode.boundsProperty.link( () => {

      // Ensure that expandedFormButton is always above the chart, regardless of how tall the equation is.
      const maxHeight = Math.max( sumEquationNode.height, expandedFormButton.height );

      // Center the equation above the Sum chart.
      sumEquationWrapperNode.centerX = sumChartRectangleLocalBounds.centerX;
      sumEquationWrapperNode.centerY = sumChartRectangleLocalBounds.top - ( maxHeight / 2 ) - 3;

      // Button to the right of the equation
      expandedFormButton.left = sumEquationWrapperNode.right + 20;
      expandedFormButton.centerY = sumEquationWrapperNode.centerY;
    } );

    // Position the measurement tools.
    function resetMeasurementToolPositions() {

      // Caliper-like tools are positioned on the Harmonics chart.
      wavelengthCalipersNode.x = harmonicsChartRectangleLocalBounds.left;
      wavelengthCalipersNode.bottom = harmonicsChartRectangleLocalBounds.centerY;
      periodCalipersNode.x = harmonicsChartRectangleLocalBounds.left;
      periodCalipersNode.bottom = harmonicsChartRectangleLocalBounds.centerY;

      // Clock-like tool is in the space between the Harmonics and Sum chart, right justified.
      periodClockNode.right = harmonicsChartRectangleLocalBounds.right;
      periodClockNode.centerY = harmonicsChartRectangleLocalBounds.maxY + ( sumChartRectangleLocalBounds.minY - harmonicsChartRectangleLocalBounds.maxY ) / 2;
    }

    // Call this after layout has been done, since tool positions are relative to other Nodes.
    resetMeasurementToolPositions();

    // Creating a sawtooth wave using cosines is impossible because it is asymmetric. Display a dialog if the user
    // attempts this.  The model is responsible for other adjustments. This dialog is created eagerly because it's
    // highly likely that this situation will be encountered.
    const oopsSawtoothWithCosinesDialog = new OopsDialog( fourierMakingWavesStrings.sawtoothWithCosines );
    model.oopsSawtoothWithCosinesEmitter.addListener( () => oopsSawtoothWithCosinesDialog.show() );
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

fourierMakingWaves.register( 'DiscreteScreenView', DiscreteScreenView );
export default DiscreteScreenView;