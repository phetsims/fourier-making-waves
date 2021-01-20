// Copyright 2020, University of Colorado Boulder

/**
 * CalipersNode is the base class for tools used to measure a horizontal dimension of a harmonic.
 * Origin is at the tip of the left caliper.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import ObservableArrayDef from '../../../../axon/js/ObservableArrayDef.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Shape from '../../../../kite/js/Shape.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Color from '../../../../scenery/js/util/Color.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import MeasurementToolNode from './MeasurementToolNode.js';

// Margins for the translucent background behind the label
const BACKGROUND_X_MARGIN = 2;
const BACKGROUND_Y_MARGIN = 2;

// Caliper properties
const BAR_THICKNESS = 5;
const CALIPER_THICKNESS = 5;
const CALIPER_LENGTH = 20;

class CalipersNode extends MeasurementToolNode {

  /**
   * @param {string} symbol
   * @param {Harmonic[]} harmonics
   * @param {ObservableArrayDef.<Harmonic>} emphasizedHarmonics
   * @param {Property.<number>} orderProperty - order of the harmonic to be measured
   * @param {ChartTransform} chartTransform - transform for the Harmonics chart
   * @param {Property.<Bounds2>} visibleBoundsProperty - visible bounds of the associated ScreenView
   * @param {function(harmonic:Harmonic):number} getModelValue - gets the quantity of the harmonic that is being measured
   * @param {Object} [options]
   */
  constructor( symbol, harmonics, emphasizedHarmonics, orderProperty, chartTransform, visibleBoundsProperty, getModelValue, options ) {

    assert && assert( typeof symbol === 'string', 'invalid symbol' );
    assert && assert( Array.isArray( harmonics ), 'invalid harmonics' );
    assert && assert( ObservableArrayDef.isObservableArray( emphasizedHarmonics ), 'invalid emphasizedHarmonics' );
    assert && AssertUtils.assertPropertyOf( orderProperty, 'number' );
    assert && assert( chartTransform instanceof ChartTransform, 'invalid chartTransform' );
    assert && AssertUtils.assertPropertyOf( visibleBoundsProperty, Bounds2 );
    assert && assert( typeof getModelValue === 'function', 'invalid getModelValue' );

    options = options || {};

    // The harmonic associated with this tool. dispose is not needed.
    const harmonicProperty = new DerivedProperty( [ orderProperty ], order => harmonics[ order - 1 ] );

    // Horizontal beam
    const beamNode = new Path( null, {
      stroke: 'black'
    } );

    // Transparent rectangle that covers beamNode, so you can drag by clicking in the space between the calipers
    const transparentRectangle = new Rectangle( 0, 0, 1, 1, {
      fill: 'transparent'
    } );

    // Label above the beam
    const labelNode = new RichText( '', {
      font: FMWConstants.TOOL_LABEL_FONT,
      maxWidth: 50
    } );

    // Translucent background for the label
    const backgroundNode = new Rectangle( 0, 0, 1, 1, {
      fill: Color.grayColor( 255, 0.75 ),
      center: labelNode.center
    } );

    const parentNode = new Node( {
      children: [ transparentRectangle, beamNode, backgroundNode, labelNode ]
    } );

    assert && assert( !options.children, 'CalipersNode sets children' );
    options.children = [ parentNode ];

    /**
     * Updates this tool's child Nodes to match the selected harmonic
     */
    function updateNodes() {

      const harmonic = harmonicProperty.value;

      // Compute the value in view coordinates
      const modelValue = getModelValue( harmonic );
      const viewValue = chartTransform.modelToViewDeltaX( modelValue );

      // The horizontal beam has ends that are caliper-like.
      // The Shape is described clockwise from the origin (the tip of the left caliper).
      beamNode.shape = new Shape()
        .moveTo( 0, 0 )
        .lineTo( -CALIPER_THICKNESS, -( CALIPER_LENGTH - BAR_THICKNESS ) )
        .lineTo( -CALIPER_THICKNESS, -CALIPER_LENGTH )
        .lineTo( viewValue + CALIPER_THICKNESS, -CALIPER_LENGTH )
        .lineTo( viewValue + CALIPER_THICKNESS, -( CALIPER_LENGTH - BAR_THICKNESS ) )
        .lineTo( viewValue, 0 )
        .lineTo( viewValue, -( CALIPER_LENGTH - BAR_THICKNESS ) )
        .lineTo( 0, -( CALIPER_LENGTH - BAR_THICKNESS ) )
        .close();
      beamNode.fill = harmonic.colorProperty;

      // Cover the beam with a transparent rectangle, so you can drag by clicking in the space between the calipers.
      transparentRectangle.setRect( 0, 0, beamNode.width, beamNode.height );
      transparentRectangle.center = beamNode.center;

      // Label is the symbol with harmonic order subscript
      labelNode.text = `${symbol}<sub>${harmonic.order}</sub>`;
      labelNode.centerX = beamNode.centerX;
      labelNode.bottom = beamNode.top - BACKGROUND_Y_MARGIN - 1;

      // Resize the translucent background and center it on the label
      backgroundNode.setRect( 0, 0, labelNode.width + 2 * BACKGROUND_X_MARGIN, labelNode.height + 2 * BACKGROUND_Y_MARGIN );
      backgroundNode.center = labelNode.center;

      // Do not adjust position. We want the left edge of the tool to remain where it was, since that is
      // the edge that the user should be positioning in order to measure the width of something.
    }

    // Initialize child Nodes before calling super
    updateNodes();

    // Derives the drag bounds. Calipers may be wider than the ScreenView, so the tip of the left caliper is
    // constrained to be inside the visible bounds of the ScreenView, minus some margin.
    assert && assert( !options.dragBoundsProperty, 'CalipersNode defines dragBoundsProperty' );
    options.dragBoundsProperty = new DerivedProperty(
      [ visibleBoundsProperty ],
      visibleBounds => {
        const yOffset = parentNode.height / 2;
        return visibleBounds.erodedXY( 40, yOffset ).shiftedY( yOffset );
      }
    );

    super( harmonicProperty, emphasizedHarmonics, visibleBoundsProperty, updateNodes, options );

    // Update when the range of the associated axis changes. removeListener is not needed.
    chartTransform.changedEmitter.addListener( updateNodes );

    // Pointer areas
    this.localBoundsProperty.link( localBounds => {
      this.mouseArea = beamNode.bounds.dilatedY( 1 );
      this.touchArea = beamNode.bounds.dilatedY( 6 );
    } );
  }
}

fourierMakingWaves.register( 'CalipersNode', CalipersNode );
export default CalipersNode;