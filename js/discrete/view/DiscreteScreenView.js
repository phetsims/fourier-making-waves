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
import SumAccordionBox from './SumAccordionBox.js';

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
    const harmonicsExpandedProperty = new BooleanProperty( true );
    const autoScaleProperty = new BooleanProperty( true );
    const infiniteHarmonicsProperty = new BooleanProperty( true );
    const sumExpandedProperty = new BooleanProperty( false );

    // Parent for all popups (listbox, keypad, etc.)
    const popupParent = new Node();

    const controlPanel = new DiscreteControlPanel( model, sumExpandedProperty, popupParent, {
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

    const amplitudesChart = new AmplitudesChart( model.fourierSeries, {
      tandem: tandem.createTandem( 'amplitudesChart' )
    } );

    const harmonicsTitleNode = new Text( fourierMakingWavesStrings.harmonics, {
      font: FourierMakingWavesConstants.TITLE_FONT
    } );

    const harmonicsExpandCollapseButton = new ExpandCollapseButton( harmonicsExpandedProperty,
      FourierMakingWavesConstants.EXPAND_COLLAPSE_BUTTON_OPTIONS );

    const harmonicsChart = new HarmonicsChart( {
      tandem: tandem.createTandem( 'harmonicsChart' )
    } );

    harmonicsExpandedProperty.link( harmonicsExpanded => {
      harmonicsChart.visible = harmonicsExpanded;
    } );

    const sumAccordionBox = new SumAccordionBox( autoScaleProperty, infiniteHarmonicsProperty );

    this.addChild( new VBox( {
      excludeInvisibleChildrenFromBounds: false,
      children: [
        amplitudesChart,
        new HBox( {
          children: [ harmonicsExpandCollapseButton, harmonicsTitleNode ],
          spacing: 5
        } ),
        harmonicsChart,
        sumAccordionBox
      ],
      align: 'left',
      spacing: 5,
      left: this.layoutBounds.left + FourierMakingWavesConstants.SCREEN_VIEW_X_MARGIN,
      top: this.layoutBounds.top + FourierMakingWavesConstants.SCREEN_VIEW_Y_MARGIN
    } ) );

    // parent for popups on top
    this.addChild( popupParent );

    // @private
    this.resetDiscreteScreenView = () => {
      this.interruptSubtreeInput(); // cancel interactions that may be in progress
      model.reset();
      harmonicsExpandedProperty.reset();
      autoScaleProperty.reset();
      infiniteHarmonicsProperty.reset();
      sumExpandedProperty.reset();
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