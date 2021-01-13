// Copyright 2020, University of Colorado Boulder

/**
 * CalipersNode is the base class for tools used to measure a horizontal dimension of a harmonic.
 * Origin is at the left tip.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import ObservableArrayDef from '../../../../axon/js/ObservableArrayDef.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Shape from '../../../../kite/js/Shape.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
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

    assert && assert( !options.children, 'CalipersNode sets children' );
    options.children = [ beamNode, backgroundNode, labelNode ];

    /**
     * Updates this tool to match the selected harmonic
     */
    function update() {

      const harmonic = harmonicProperty.value;

      // Compute the value in view coordinates
      const modelValue = getModelValue( harmonic );
      const viewValue = chartTransform.modelToViewDeltaX( modelValue );

      // The horizontal beam has ends that are caliper-like.
      // The Shape is described clockwise from the origin (the left tip).
      const barThickness = 5;
      const caliperThickness = 5;
      const caliperLength = 20;
      beamNode.shape = new Shape()
        .moveTo( 0, 0 )
        .lineTo( -caliperThickness, -( caliperLength - barThickness ) )
        .lineTo( -caliperThickness, -caliperLength )
        .lineTo( viewValue + caliperThickness, -caliperLength )
        .lineTo( viewValue + caliperThickness, -( caliperLength - barThickness ) )
        .lineTo( viewValue, 0 )
        .lineTo( viewValue, -( caliperLength - barThickness ) )
        .lineTo( 0, -( caliperLength - barThickness ) )
        .close();
      beamNode.fill = harmonic.colorProperty;

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

    /**
     * Creates the drag bounds for this tool.
     * Calipers are constrained to be mostly in bounds in the x dimension, and fully in bounds in the y dimension.
     * @param {Bounds2} visibleBounds - visible bounds of the associated ScreenView
     * @param {Bounds2} thisLocalBounds - local bounds of this Node
     */
    function createDragBounds( visibleBounds, thisLocalBounds ) {
      const erodeX = 50;
      return visibleBounds.copy().setMinMax(
        visibleBounds.minX - thisLocalBounds.width + erodeX,
        visibleBounds.minY + thisLocalBounds.height,
        visibleBounds.maxX - erodeX,
        visibleBounds.maxY
      );
    }

    // Initialize
    update();

    super( harmonicProperty, emphasizedHarmonics, visibleBoundsProperty, update, createDragBounds, options );

    // Update when the range of the associated axis changes. removeListener is not needed.
    chartTransform.changedEmitter.addListener( update );
  }
}

fourierMakingWaves.register( 'CalipersNode', CalipersNode );
export default CalipersNode;