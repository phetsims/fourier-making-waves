// Copyright 2020, University of Colorado Boulder

/**
 * DiscreteScreenView is the view for the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import OopsDialog from '../../../../scenery-phet/js/OopsDialog.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import ExpandCollapseButton from '../../../../sun/js/ExpandCollapseButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import AmplitudeKeypadDialog from '../../common/view/AmplitudeKeypadDialog.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import DiscreteModel from '../model/DiscreteModel.js';
import AmplitudesChart from './AmplitudesChart.js';
import DiscreteControlPanel from './DiscreteControlPanel.js';
import DiscreteViewProperties from './DiscreteViewProperties.js';
import HarmonicsChart from './HarmonicsChart.js';
import SumChart from './SumChart.js';

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
    const viewProperties = new DiscreteViewProperties();

    // Parent for all popups (listbox, keypad, etc.)
    const popupParent = new Node();

    // KeypadDialog
    const amplitudeKeypadDialog = new AmplitudeKeypadDialog( model.fourierSeries.amplitudeRange, this.layoutBounds );

    const amplitudesChart = new AmplitudesChart( model.fourierSeries, amplitudeKeypadDialog, model.presetFunctionProperty, {
      tandem: tandem.createTandem( 'amplitudesChart' )
    } );

    const harmonicsExpandCollapseButton = new ExpandCollapseButton( viewProperties.harmonicsChartVisibleProperty,
      FMWConstants.EXPAND_COLLAPSE_BUTTON_OPTIONS );

    const harmonicsTitleNode = new Text( fourierMakingWavesStrings.harmonics, {
      font: FMWConstants.TITLE_FONT
    } );

    const harmonicsChart = new HarmonicsChart( model.fourierSeries, {
      tandem: tandem.createTandem( 'harmonicsChart' )
    } );

    viewProperties.harmonicsChartVisibleProperty.link( harmonicsChartVisible => {
      harmonicsChart.visible = harmonicsChartVisible;
    } );

    const sumExpandCollapseButton = new ExpandCollapseButton( viewProperties.sumChartVisibleProperty,
      FMWConstants.EXPAND_COLLAPSE_BUTTON_OPTIONS );

    const sumTitleNode = new Text( fourierMakingWavesStrings.sum, {
      font: FMWConstants.TITLE_FONT
    } );

    const sumChart = new SumChart( model.fourierSeries, viewProperties.autoScaleProperty, viewProperties.infiniteHarmonicsProperty, {
      tandem: tandem.createTandem( 'sumChart' )
    } );

    viewProperties.sumChartVisibleProperty.link( sumChartVisible => {
      sumChart.visible = sumChartVisible;
    } );

    this.addChild( new VBox( {
      excludeInvisibleChildrenFromBounds: false,
      align: 'left',
      spacing: 15,
      children: [

        // Amplitudes
        amplitudesChart,

        // Harmonics
        new VBox( {
          excludeInvisibleChildrenFromBounds: false,
          align: 'left',
          spacing: 5,
          children: [
            new HBox( {
              children: [ harmonicsExpandCollapseButton, harmonicsTitleNode ],
              spacing: 5
            } ),
            harmonicsChart
          ]
        } ),

        // Sum
        new VBox( {
          excludeInvisibleChildrenFromBounds: false,
          align: 'left',
          spacing: 5,
          children: [
            new HBox( {
              children: [ sumExpandCollapseButton, sumTitleNode ],
              spacing: 5
            } ),
            sumChart
          ]
        } )
      ],
      left: this.layoutBounds.left + FMWConstants.SCREEN_VIEW_X_MARGIN,
      top: this.layoutBounds.top + FMWConstants.SCREEN_VIEW_Y_MARGIN
    } ) );

    const controlPanel = new DiscreteControlPanel( model, viewProperties.mathFormExpandedSumProperty,
      viewProperties.soundEnabledProperty, viewProperties.soundVolumeProperty, popupParent, {
        right: this.layoutBounds.right - FMWConstants.SCREEN_VIEW_X_MARGIN,
        top: this.layoutBounds.top + FMWConstants.SCREEN_VIEW_Y_MARGIN
      } );
    this.addChild( controlPanel );

    const timeControlNode = new TimeControlNode( model.isPlayingProperty, {
      left: controlPanel.left,
      bottom: this.layoutBounds.bottom - FMWConstants.SCREEN_VIEW_Y_MARGIN
    } );
    this.addChild( timeControlNode );

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

  /**
   * Steps the view.
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {
    //TODO
  }
}

fourierMakingWaves.register( 'DiscreteScreenView', DiscreteScreenView );
export default DiscreteScreenView;