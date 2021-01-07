// Copyright 2020, University of Colorado Boulder

/**
 * DiscreteScreenView is the view for the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import merge from '../../../../phet-core/js/merge.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import OopsDialog from '../../../../scenery-phet/js/OopsDialog.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ExpandCollapseButton from '../../../../sun/js/ExpandCollapseButton.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import AmplitudeKeypadDialog from '../../common/view/AmplitudeKeypadDialog.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import DiscreteModel from '../model/DiscreteModel.js';
import Domain from '../model/Domain.js';
import EquationForm from '../model/EquationForm.js';
import AmplitudesChart from './AmplitudesChart.js';
import DiscreteControlPanel from './DiscreteControlPanel.js';
import ExpandedFormButton from './ExpandedFormButton.js';
import ExpandedFormDialog from './ExpandedFormDialog.js';
import FourierSoundGenerator from './FourierSoundGenerator.js';
import HarmonicsChart from './HarmonicsChart.js';
import HarmonicsEquationNode from './HarmonicsEquationNode.js';
import PeriodClockNode from './PeriodClockNode.js';
import PeriodToolNode from './PeriodToolNode.js';
import SumChart from './SumChart.js';
import SumEquationNode from './SumEquationNode.js';
import WavelengthToolNode from './WavelengthToolNode.js';

// constants, determined empirically
const EXPAND_TITLE_SPACING = 6;
const CHART_TITLE_Y_SPACING = 15; // space between chart title and the chart
const CHART_SIZE = new Dimension2( 645, 123 ); // size of the chart rectangles
const X_CHART_RECTANGLES = 65; // x origin of the rectangle part of the charts, so that they are all aligned

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
      model.soundEnabledProperty, model.soundOutputLevelProperty );
    soundManager.addSoundGenerator( fourierSoundGenerator );

    // Parent for all popups
    const popupParent = new Node();

    // KeypadDialog
    const amplitudeKeypadDialog = new AmplitudeKeypadDialog( model.fourierSeries.amplitudeRange, this.layoutBounds );

    const amplitudesChart = new AmplitudesChart( model.fourierSeries, amplitudeKeypadDialog, model.waveformProperty,
      model.chartsModel.emphasizedHarmonics, {
        viewWidth: CHART_SIZE.width,
        viewHeight: CHART_SIZE.height,
        tandem: tandem.createTandem( 'amplitudesChart' )
      } );

    const harmonicsExpandCollapseButton = new ExpandCollapseButton( model.chartsModel.harmonicsChartVisibleProperty,
      merge( {
        tandem: tandem.createTandem( 'harmonicsExpandCollapseButton' )
      }, FMWConstants.EXPAND_COLLAPSE_BUTTON_OPTIONS ) );

    const harmonicsTitleNode = new Text( fourierMakingWavesStrings.harmonicsChart, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 150, // determined empirically, prevent overlap with equation,
      tandem: tandem.createTandem( 'harmonicsTitleNode' )
    } );

    const harmonicsHBox = new HBox( {
      children: [ harmonicsExpandCollapseButton, harmonicsTitleNode ],
      spacing: EXPAND_TITLE_SPACING
    } );

    const harmonicsChart = new HarmonicsChart( model.fourierSeries, model.tProperty,
      model.domainProperty, model.seriesTypeProperty, model.equationFormProperty,
      model.chartsModel.xZoomLevelProperty, model.chartsModel.xAxisDescriptionProperty,
      model.chartsModel.emphasizedHarmonics, {
        viewWidth: CHART_SIZE.width,
        viewHeight: CHART_SIZE.height,
        visibleProperty: model.chartsModel.harmonicsChartVisibleProperty,
        tandem: tandem.createTandem( 'harmonicsChart' )
      } );

    // Equation that appears above the Harmonics chart
    const harmonicsEquationNode = new HarmonicsEquationNode(
      model.domainProperty, model.seriesTypeProperty, model.equationFormProperty, {
        maxWidth: 0.5 * CHART_SIZE.width,
        tandem: tandem.createTandem( 'harmonicsEquationNode' ),
        phetioReadOnly: true
      } );

    // Visibility of the equation above the Harmonics chart
    Property.multilink(
      [ model.chartsModel.harmonicsChartVisibleProperty, model.equationFormProperty ],
      ( harmonicsChartVisible, equationForm ) => {
        harmonicsEquationNode.visible = harmonicsChartVisible && ( equationForm !== EquationForm.HIDDEN );
      } );

    const sumExpandCollapseButton = new ExpandCollapseButton( model.chartsModel.sumChartVisibleProperty,
      merge( {
        tandem: tandem.createTandem( 'sumExpandCollapseButton' )
      }, FMWConstants.EXPAND_COLLAPSE_BUTTON_OPTIONS ) );

    const sumTitleNode = new Text( fourierMakingWavesStrings.sum, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 150, // determined empirically, prevent overlap with equation
      tandem: tandem.createTandem( 'sumTitleNode' )
    } );

    const sumHBox = new HBox( {
      children: [ sumExpandCollapseButton, sumTitleNode ],
      spacing: EXPAND_TITLE_SPACING
    } );

    const sumChart = new SumChart( model.fourierSeries, harmonicsChart.sumDataSetProperty,
      model.waveformProperty, model.domainProperty, model.equationFormProperty,
      model.chartsModel.xZoomLevelProperty, model.chartsModel.xAxisDescriptionProperty,
      model.chartsModel.yZoomLevelProperty, model.chartsModel.yAxisDescriptionProperty,
      model.chartsModel.autoScaleProperty, model.chartsModel.infiniteHarmonicsProperty, {
        viewWidth: CHART_SIZE.width,
        viewHeight: CHART_SIZE.height,
        left: sumHBox.left,
        y: sumHBox.bottom + CHART_TITLE_Y_SPACING,
        visibleProperty: model.chartsModel.sumChartVisibleProperty,
        tandem: tandem.createTandem( 'sumChart' )
      } );

    // Equation that appears above the Sum chart
    const sumEquationNode = new SumEquationNode( model.fourierSeries.numberOfHarmonicsProperty, model.domainProperty,
      model.seriesTypeProperty, model.equationFormProperty, {
        maxWidth: 0.5 * CHART_SIZE.width,
        tandem: tandem.createTandem( 'sumEquationNode' ),
        phetioReadOnly: true
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
      },
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    //TODO do not reach into HarmonicsChart for chartTransform
    const harmonicsChartTransform = harmonicsChart.chartTransform;

    // For measuring the wavelength of a specific harmonic in the 'space' and 'space & time' domains.
    const wavelengthToolNode = new WavelengthToolNode( harmonicsChartTransform,
      model.fourierSeries.harmonics, model.domainProperty,
      model.wavelengthToolOrderProperty, model.wavelengthToolSelectedProperty,
      model.chartsModel.emphasizedHarmonics, this.visibleBoundsProperty );

    // For measuring the period of a specific harmonic in the 'time' domain.
    const periodToolNode = new PeriodToolNode( harmonicsChartTransform,
      model.fourierSeries.harmonics, model.domainProperty,
      model.periodToolOrderProperty, model.periodToolSelectedProperty,
      model.chartsModel.emphasizedHarmonics, this.visibleBoundsProperty );

    // For measuring the period of a specific harmonic in the 'space & time' domain.
    const periodClockNode = new PeriodClockNode( model.fourierSeries.harmonics, model.domainProperty,
      model.periodToolOrderProperty, model.periodToolSelectedProperty,
      model.tProperty, model.chartsModel.emphasizedHarmonics, this.visibleBoundsProperty );

    // Rendering order
    this.addChild( amplitudesChart );
    this.addChild( harmonicsHBox );
    this.addChild( harmonicsChart );
    this.addChild( harmonicsEquationNode );
    this.addChild( sumHBox );
    this.addChild( sumChart );
    this.addChild( sumEquationNode );
    this.addChild( expandedFormButton );
    this.addChild( controlPanel );
    this.addChild( timeControlNode );
    this.addChild( resetAllButton );
    this.addChild( wavelengthToolNode ); // Measurement Tools on top of everything else
    this.addChild( periodToolNode );
    this.addChild( periodClockNode );
    this.addChild( popupParent ); // parent for popups on top

    // Layout, spacing set empirically
    amplitudesChart.x = X_CHART_RECTANGLES;
    amplitudesChart.y = 54;
    harmonicsHBox.left = this.layoutBounds.left + FMWConstants.SCREEN_VIEW_X_MARGIN;
    harmonicsHBox.top = amplitudesChart.bottom + 15;
    harmonicsChart.x = X_CHART_RECTANGLES;
    harmonicsChart.y = harmonicsHBox.bottom + CHART_TITLE_Y_SPACING;
    harmonicsEquationNode.center = harmonicsChart.center;
    harmonicsEquationNode.bottom = harmonicsChart.top - 3;
    sumHBox.left = harmonicsHBox.left;
    sumHBox.top = harmonicsChart.bottom + 30;
    sumChart.x = X_CHART_RECTANGLES;
    sumChart.y = sumHBox.bottom + CHART_TITLE_Y_SPACING;
    controlPanel.right = this.layoutBounds.right - FMWConstants.SCREEN_VIEW_X_MARGIN;
    controlPanel.top = this.layoutBounds.top + FMWConstants.SCREEN_VIEW_Y_MARGIN;
    timeControlNode.left = controlPanel.left + 30;
    timeControlNode.bottom = this.layoutBounds.bottom - FMWConstants.SCREEN_VIEW_Y_MARGIN;
    resetAllButton.right = this.layoutBounds.maxX - FMWConstants.SCREEN_VIEW_X_MARGIN;
    resetAllButton.bottom = this.layoutBounds.maxY - FMWConstants.SCREEN_VIEW_Y_MARGIN;

    //TODO this is not working as expected with stringTest=long
    // Center equations above their respective charts
    harmonicsEquationNode.localBoundsProperty.link( () => {

      // Get the bounds of the Harmonics chart's rectangle in the proper coordinate frame.
      const chartRectangleGlobalBounds = harmonicsChart.chartRectangle.parentToGlobalBounds( harmonicsChart.chartRectangle.bounds );
      const chartRectangleLocalBounds = this.globalToLocalBounds( chartRectangleGlobalBounds );

      // Center the equation above the Harmonics chart.
      harmonicsEquationNode.centerX = chartRectangleLocalBounds.centerX;
      harmonicsEquationNode.bottom = chartRectangleLocalBounds.top - 3;
    } );
    sumEquationNode.localBoundsProperty.link( () => {

      // Ensure that expandedFormButton is always above the chart, regardless of how tall the equation is.
      const maxHeight = Math.max( sumEquationNode.height, expandedFormButton.height );

      // Get the bounds of the Sum chart's rectangle in the proper coordinate frame.
      const chartRectangleGlobalBounds = sumChart.chartRectangle.parentToGlobalBounds( sumChart.chartRectangle.bounds );
      const chartRectangleLocalBounds = this.globalToLocalBounds( chartRectangleGlobalBounds );

      // Center the equation above the Sum chart.
      sumEquationNode.centerX = chartRectangleLocalBounds.centerX;
      sumEquationNode.centerY = chartRectangleLocalBounds.top - ( maxHeight / 2 ) - 3;

      // Button to the right of the equation
      expandedFormButton.left = sumEquationNode.right + 20;
      expandedFormButton.centerY = sumEquationNode.centerY;
    } );

    //TODO Where to position tools? Should initial position be resettable?
    wavelengthToolNode.center = this.layoutBounds.center;
    periodToolNode.center = this.layoutBounds.center; //TODO This isn't working as expected.
    periodClockNode.center = this.layoutBounds.center;

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