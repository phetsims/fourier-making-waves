// Copyright 2020, University of Colorado Boulder

/**
 * DiscreteScreenView is the view for the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

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
import AmplitudesChart from './AmplitudesChart.js';
import DiscreteControlPanel from './DiscreteControlPanel.js';
import DiscreteViewProperties from './DiscreteViewProperties.js';
import FourierSoundGenerator from './FourierSoundGenerator.js';
import HarmonicsChart from './HarmonicsChart.js';
import PeriodToolNode from './PeriodToolNode.js';
import SumChart from './SumChart.js';
import WavelengthToolNode from './WavelengthToolNode.js';

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

    // Properties that are specific to the view
    const viewProperties = new DiscreteViewProperties( model.fourierSeries.numberOfHarmonicsProperty );

    // Sound for the Fourier series
    const fourierSoundGenerator = new FourierSoundGenerator( model.fourierSeries,
      viewProperties.soundEnabledProperty, viewProperties.soundOutputLevelProperty );
    soundManager.addSoundGenerator( fourierSoundGenerator );

    // Parent for all popups
    const popupParent = new Node();

    // KeypadDialog
    const amplitudeKeypadDialog = new AmplitudeKeypadDialog( model.fourierSeries.amplitudeRange, this.layoutBounds );

    // Chart dimensions, determined empirically as a function of layoutBounds
    const chartViewWidth = 0.6 * this.layoutBounds.width;
    const chartViewHeight = 0.2 * this.layoutBounds.height;

    const amplitudesChart = new AmplitudesChart( model.fourierSeries, amplitudeKeypadDialog, model.waveformProperty, {
      viewWidth: chartViewWidth + 30, // a bit wider than the other charts
      viewHeight: chartViewHeight,
      tandem: tandem.createTandem( 'amplitudesChart' )
    } );

    const harmonicsExpandCollapseButton = new ExpandCollapseButton( viewProperties.harmonicsChartVisibleProperty,
      merge( {
        tandem: tandem.createTandem( 'harmonicsExpandCollapseButton' )
      }, FMWConstants.EXPAND_COLLAPSE_BUTTON_OPTIONS ) );

    const harmonicsTitleNode = new Text( fourierMakingWavesStrings.harmonics, {
      font: FMWConstants.TITLE_FONT,
      maxWidth: 150, // determined empirically, prevent overlap with equation,
      tandem: tandem.createTandem( 'harmonicsTitleNode' )
    } );

    const harmonicsHBox = new HBox( {
      children: [ harmonicsExpandCollapseButton, harmonicsTitleNode ],
      spacing: 5
    } );

    const harmonicsChart = new HarmonicsChart( model.fourierSeries, model.tProperty,
      model.domainProperty, model.waveTypeProperty, model.mathFormProperty,
      viewProperties.xZoomLevelProperty, viewProperties.xAxisDescriptionProperty, {
        viewWidth: chartViewWidth,
        viewHeight: chartViewHeight,
        left: harmonicsHBox.left,
        y: harmonicsHBox.bottom + 15,
        tandem: tandem.createTandem( 'harmonicsChart' )
      } );

    const harmonicsParent = new Node( {
      children: [ harmonicsHBox, harmonicsChart ],
      left: amplitudesChart.left,
      top: amplitudesChart.bottom + 15
    } );

    viewProperties.harmonicsChartVisibleProperty.link( harmonicsChartVisible => {
      harmonicsChart.visible = harmonicsChartVisible;
    } );

    const sumExpandCollapseButton = new ExpandCollapseButton( viewProperties.sumChartVisibleProperty,
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
      spacing: 5
    } );

    const sumChart = new SumChart( model.fourierSeries, harmonicsChart.sumDataSetProperty,
      model.domainProperty, model.waveTypeProperty, model.mathFormProperty,
      viewProperties.xZoomLevelProperty, viewProperties.xAxisDescriptionProperty,
      viewProperties.yZoomLevelProperty, viewProperties.yAxisDescriptionProperty,
      viewProperties.autoScaleProperty, viewProperties.infiniteHarmonicsProperty, {
        viewWidth: chartViewWidth,
        viewHeight: chartViewHeight,
        left: sumHBox.left,
        y: sumHBox.bottom + 15,
        tandem: tandem.createTandem( 'sumChart' )
      } );

    const sumParent = new Node( {
      children: [ sumHBox, sumChart ],
      left: harmonicsParent.left,
      top: harmonicsParent.bottom + 10
    } );

    viewProperties.sumChartVisibleProperty.link( sumChartVisible => {
      sumChart.visible = sumChartVisible;
    } );

    this.addChild( new Node( {
      children: [ amplitudesChart, harmonicsParent, sumParent ],
      left: this.layoutBounds.left + FMWConstants.SCREEN_VIEW_X_MARGIN,
      top: this.layoutBounds.top + FMWConstants.SCREEN_VIEW_Y_MARGIN
    } ) );

    const controlPanel = new DiscreteControlPanel( model, viewProperties, popupParent, {
      right: this.layoutBounds.right - FMWConstants.SCREEN_VIEW_X_MARGIN,
      top: this.layoutBounds.top + FMWConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: tandem.createTandem( 'controlPanel' )
    } );
    this.addChild( controlPanel );

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
      left: controlPanel.left,
      bottom: this.layoutBounds.bottom - FMWConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: tandem.createTandem( 'timeControlNode' )
    } );
    this.addChild( timeControlNode );

    // Enabled time controls only when there is the possibility of animation.
    model.domainProperty.link( domain => {
      timeControlNode.enabled = ( domain === Domain.SPACE_AND_TIME );
    } );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        viewProperties.reset();
      },
      right: this.layoutBounds.maxX - FMWConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - FMWConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );

    //TODO do not reach into HarmonicsChart for chartTransform
    // For measuring the wavelength of a specific harmonic in the 'space' and 'space & time' domains.
    const wavelengthToolNode = new WavelengthToolNode( harmonicsChart.chartTransform,
      model.fourierSeries.harmonics, model.domainProperty,
      viewProperties.wavelengthToolOrderProperty, viewProperties.wavelengthToolSelectedProperty,
      this.visibleBoundsProperty );
    this.addChild( wavelengthToolNode );

    //TODO use harmonicsChart.chartTransform to position on harmonicsChart
    wavelengthToolNode.center = this.layoutBounds.center;

    //TODO do not reach into HarmonicsChart for chartTransform
    // For measuring the period of a specific harmonic in the 'time' domain.
    const periodToolNode = new PeriodToolNode( harmonicsChart.chartTransform,
      model.fourierSeries.harmonics, model.domainProperty,
      viewProperties.periodToolOrderProperty, viewProperties.periodToolSelectedProperty,
      this.visibleBoundsProperty );
    this.addChild( periodToolNode );

    //TODO use harmonicsChart.chartTransform to position on harmonicsChart
    periodToolNode.center = this.layoutBounds.center;

    // parent for popups on top
    this.addChild( popupParent );

    // Creating a sawtooth wave using cosines is impossible because it is asymmetric. Display a dialog if the user
    // attempts this.  The model is responsible for other adjustments. This dialog is created eagerly because it's
    // highly likely that this situation will be encountered.
    const oopsSawtoothWithCosinesDialog = new OopsDialog( fourierMakingWavesStrings.sawtoothWithCosines );
    model.oopsSawtoothWithCosinesEmitter.addListener( () => {
      oopsSawtoothWithCosinesDialog.show();
    } );
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