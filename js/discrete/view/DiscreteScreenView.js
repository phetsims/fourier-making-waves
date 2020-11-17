// Copyright 2020, University of Colorado Boulder

/**
 * DiscreteScreenView is the view for the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import ExpandCollapseButton from '../../../../sun/js/ExpandCollapseButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FourierMakingWavesConstants from '../../common/FourierMakingWavesConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import DiscreteModel from '../model/DiscreteModel.js';
import AmplitudesChart from './AmplitudesChart.js';
import DiscreteControlPanel from './DiscreteControlPanel.js';
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

    // view Properties
    const harmonicsChartExpandedProperty = new BooleanProperty( true );
    const sumChartExpandedProperty = new BooleanProperty( true );
    const autoScaleProperty = new BooleanProperty( false );
    const infiniteHarmonicsProperty = new BooleanProperty( false );
    const mathFormExpandedSumProperty = new BooleanProperty( false );

    // Parent for all popups (listbox, keypad, etc.)
    const popupParent = new Node();

    const amplitudesChart = new AmplitudesChart( model.fourierSeries, {
      tandem: tandem.createTandem( 'amplitudesChart' )
    } );

    const harmonicsExpandCollapseButton = new ExpandCollapseButton( harmonicsChartExpandedProperty,
      FourierMakingWavesConstants.EXPAND_COLLAPSE_BUTTON_OPTIONS );

    const harmonicsTitleNode = new Text( fourierMakingWavesStrings.harmonics, {
      font: FourierMakingWavesConstants.TITLE_FONT
    } );

    const harmonicsChart = new HarmonicsChart( model.fourierSeries, {
      tandem: tandem.createTandem( 'harmonicsChart' )
    } );

    harmonicsChartExpandedProperty.link( harmonicsChartExpanded => {
      harmonicsChart.visible = harmonicsChartExpanded;
    } );

    const sumExpandCollapseButton = new ExpandCollapseButton( sumChartExpandedProperty,
      FourierMakingWavesConstants.EXPAND_COLLAPSE_BUTTON_OPTIONS );

    const sumTitleNode = new Text( fourierMakingWavesStrings.sum, {
      font: FourierMakingWavesConstants.TITLE_FONT
    } );

    const sumChart = new SumChart( model.fourierSeries, autoScaleProperty, infiniteHarmonicsProperty, {
      tandem: tandem.createTandem( 'sumChart' )
    } );

    sumChartExpandedProperty.link( sumChartExpanded => {
      sumChart.visible = sumChartExpanded;
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
      left: this.layoutBounds.left + FourierMakingWavesConstants.SCREEN_VIEW_X_MARGIN,
      top: this.layoutBounds.top + FourierMakingWavesConstants.SCREEN_VIEW_Y_MARGIN
    } ) );

    const controlPanel = new DiscreteControlPanel( model, mathFormExpandedSumProperty, popupParent, {
      right: this.layoutBounds.right - FourierMakingWavesConstants.SCREEN_VIEW_X_MARGIN,
      top: this.layoutBounds.top + FourierMakingWavesConstants.SCREEN_VIEW_Y_MARGIN
    } );
    this.addChild( controlPanel );

    const timeControlNode = new TimeControlNode( model.isPlayingProperty, {
      left: controlPanel.left,
      bottom: this.layoutBounds.bottom - FourierMakingWavesConstants.SCREEN_VIEW_Y_MARGIN
    } );
    this.addChild( timeControlNode );

    const resetAllButton = new ResetAllButton( {
      listener: () => this.reset(),
      right: this.layoutBounds.maxX - FourierMakingWavesConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - FourierMakingWavesConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );

    // parent for popups on top
    this.addChild( popupParent );

    // @private
    this.resetDiscreteScreenView = () => {
      this.interruptSubtreeInput(); // cancel interactions that may be in progress
      model.reset();
      harmonicsChartExpandedProperty.reset();
      sumChartExpandedProperty.reset();
      autoScaleProperty.reset();
      infiniteHarmonicsProperty.reset();
      mathFormExpandedSumProperty.reset();
    };
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
   * Resets the view.
   * @protected
   */
  reset() {
    this.resetDiscreteScreenView();
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