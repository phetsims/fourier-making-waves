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
import VSeparator from '../../../../sun/js/VSeparator.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWColorProfile from '../../common/FMWColorProfile.js';
import FMWConstants from '../../common/FMWConstants.js';
import AmplitudeKeypadDialog from '../../common/view/AmplitudeKeypadDialog.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import DiscreteModel from '../model/DiscreteModel.js';
import Domain from '../model/Domain.js';
import AmplitudesChart from './AmplitudesChart.js';
import DiscreteControlPanel from './DiscreteControlPanel.js';
import FourierSoundGenerator from './FourierSoundGenerator.js';
import HarmonicsChart from './HarmonicsChart.js';
import PeriodClockNode from './PeriodClockNode.js';
import PeriodToolNode from './PeriodToolNode.js';
import SumChart from './SumChart.js';
import WavelengthToolNode from './WavelengthToolNode.js';

const EXPAND_TITLE_SPACING = 6;
const LEADER_LINE_SPACING = 10;

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

    // Chart dimensions, determined empirically as a function of layoutBounds
    const chartViewWidth = 0.62 * this.layoutBounds.width;
    const chartViewHeight = 0.2 * this.layoutBounds.height;

    const amplitudesChart = new AmplitudesChart( model.fourierSeries, amplitudeKeypadDialog, model.waveformProperty,
      model.chartsModel.emphasizedHarmonics, {
        viewWidth: chartViewWidth,
        viewHeight: chartViewHeight,
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
        viewWidth: chartViewWidth,
        viewHeight: chartViewHeight,
        left: harmonicsHBox.left,
        y: harmonicsHBox.bottom + 15,
        tandem: tandem.createTandem( 'harmonicsChart' )
      } );

    const harmonicsParent = new Node( {
      children: [ harmonicsHBox, harmonicsChart ]
    } );

    //TODO pass directly to HarmonicsChart via visibleProperty?
    model.chartsModel.harmonicsChartVisibleProperty.link( harmonicsChartVisible => {
      harmonicsChart.visible = harmonicsChartVisible;
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
      model.waveformProperty, model.domainProperty, model.seriesTypeProperty, model.equationFormProperty,
      model.chartsModel.xZoomLevelProperty, model.chartsModel.xAxisDescriptionProperty,
      model.chartsModel.yZoomLevelProperty, model.chartsModel.yAxisDescriptionProperty,
      model.chartsModel.autoScaleProperty, model.chartsModel.infiniteHarmonicsProperty, {
        viewWidth: chartViewWidth,
        viewHeight: chartViewHeight,
        left: sumHBox.left,
        y: sumHBox.bottom + 15,
        tandem: tandem.createTandem( 'sumChart' )
      } );

    const sumParent = new Node( {
      children: [ sumHBox, sumChart ]
    } );

    //TODO pass directly to SumChart via visibleProperty?
    model.chartsModel.sumChartVisibleProperty.link( sumChartVisible => {
      sumChart.visible = sumChartVisible;
    } );

    // Leader lines to tie together the pieces of the Harmonics and Sum charts,
    // see https://github.com/phetsims/fourier-making-waves/issues/37
    const leaderLineWidth = 3;
    const harmonicsLeaderLine = new VSeparator( harmonicsParent.height, {
      stroke: FMWColorProfile.harmnonicsLeaderLineStrokeProperty,
      lineWidth: leaderLineWidth
    } );
    const sumLeaderLine = new VSeparator( sumParent.visibleBounds.height, {
      stroke: FMWColorProfile.sumLeaderLineStrokeProperty,
      lineWidth: leaderLineWidth
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
    this.addChild( harmonicsLeaderLine );
    this.addChild( harmonicsParent );
    this.addChild( sumLeaderLine );
    this.addChild( sumParent );
    this.addChild( controlPanel );
    this.addChild( timeControlNode );
    this.addChild( resetAllButton );
    this.addChild( wavelengthToolNode ); // Measurement Tools on top of everything else
    this.addChild( periodToolNode );
    this.addChild( periodClockNode );
    this.addChild( popupParent ); // parent for popups on top

    // Layout
    // amplitudesChart.left will be set later, to left-align with other charts
    amplitudesChart.top = this.layoutBounds.top + FMWConstants.SCREEN_VIEW_Y_MARGIN - 8;
    harmonicsLeaderLine.left = this.layoutBounds.left + FMWConstants.SCREEN_VIEW_X_MARGIN;
    harmonicsLeaderLine.top = amplitudesChart.bottom + 15;
    harmonicsParent.left = harmonicsLeaderLine.right + LEADER_LINE_SPACING;
    harmonicsParent.top = amplitudesChart.bottom + 15;
    sumLeaderLine.left = harmonicsLeaderLine.left;
    sumParent.left = sumLeaderLine.right + LEADER_LINE_SPACING;
    sumParent.top = harmonicsParent.bottom + 10;
    sumLeaderLine.bottom = sumParent.bottom;
    controlPanel.right = this.layoutBounds.right - FMWConstants.SCREEN_VIEW_X_MARGIN;
    controlPanel.top = this.layoutBounds.top + FMWConstants.SCREEN_VIEW_Y_MARGIN;
    amplitudesChart.left = harmonicsParent.left;
    timeControlNode.left = controlPanel.left + 30;
    timeControlNode.bottom = this.layoutBounds.bottom - FMWConstants.SCREEN_VIEW_Y_MARGIN;
    resetAllButton.right = this.layoutBounds.maxX - FMWConstants.SCREEN_VIEW_X_MARGIN;
    resetAllButton.bottom = this.layoutBounds.maxY - FMWConstants.SCREEN_VIEW_Y_MARGIN;

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