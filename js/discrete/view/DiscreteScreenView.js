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
import Node from '../../../../scenery/js/nodes/Node.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FourierMakingWavesConstants from '../../common/FourierMakingWavesConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import DiscreteModel from '../model/DiscreteModel.js';
import AmplitudesChart from './AmplitudesChart.js';
import DiscreteControlPanel from './DiscreteControlPanel.js';
import HarmonicsAccordionBox from './HarmonicsAccordionBox.js';
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

    const panelWidth = this.layoutBounds.width - controlPanel.width -
                       ( 2 * FourierMakingWavesConstants.SCREEN_VIEW_X_MARGIN ) -
                       FourierMakingWavesConstants.SCREEN_VIEW_X_SPACING;
    const panelHeight = ( this.layoutBounds.height -
                          ( 2 * FourierMakingWavesConstants.SCREEN_VIEW_Y_MARGIN ) -
                          ( 2 * FourierMakingWavesConstants.SCREEN_VIEW_Y_SPACING ) ) / 3;

    const amplitudesChart = new AmplitudesChart( model.fourierSeries, {
      fixedWidth: panelWidth,
      fixedHeight: panelHeight,
      tandem: tandem.createTandem( 'amplitudesChart' )
    } );

    const harmonicsAccordionBox = new HarmonicsAccordionBox();

    const sumAccordionBox = new SumAccordionBox( autoScaleProperty, infiniteHarmonicsProperty );

    this.addChild( new VBox( {
      children: [ amplitudesChart, harmonicsAccordionBox, sumAccordionBox ],
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