// Copyright 2020-2023, University of Colorado Boulder

/**
 * PeriodClockNode is the tool for measuring a harmonic's period in the 'space & time' Domain. It looks like a clock,
 * with a portion of the clock face filled in with the harmonic's color.  The portion filled in represents the portion
 * of the harmonic's period that has elapsed.  The origin is at the center of the clock face.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import { Circle, Color, Node, Path, Rectangle, RichText } from '../../../../scenery/js/imports.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import Domain from '../../common/model/Domain.js';
import Harmonic from '../../common/model/Harmonic.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import DiscreteModel from '../model/DiscreteModel.js';
import DiscreteMeasurementToolNode from './DiscreteMeasurementToolNode.js';

// Margins for the translucent background behind the label
const BACKGROUND_X_MARGIN = 2;
const BACKGROUND_Y_MARGIN = 2;

export default class PeriodClockNode extends DiscreteMeasurementToolNode {

  /**
   * @param {DiscreteModel} model
   * @param {Object} [options]
   */
  constructor( model, options ) {

    assert && assert( model instanceof DiscreteModel );

    options = merge( {

      // DiscreteMeasurementToolNode options
      debugName: 'periodClock'
    }, options );

    // Model properties that we'll be using.
    const tool = model.periodTool;
    const harmonics = model.fourierSeries.harmonics;
    const emphasizedHarmonics = model.harmonicsChart.emphasizedHarmonics;
    const tProperty = model.tProperty;
    const domainProperty = model.domainProperty;

    // The harmonic associated with this tool.
    const harmonicProperty = new DerivedProperty( [ tool.orderProperty ], order => harmonics[ order - 1 ] );

    const clockFaceNode = new ClockFaceNode( harmonicProperty, tProperty );

    const labelStringProperty = new DerivedProperty( [ FMWSymbols.TStringProperty, harmonicProperty ],
      ( T, harmonic ) => `${T}<sub>${harmonic.order}</sub>` );

    const labelNode = new RichText( labelStringProperty, {
      font: FMWConstants.TOOL_LABEL_FONT,
      maxWidth: 50
    } );

    // Translucent background for the label
    const backgroundNode = new Rectangle( 0, 0, 1, 1, {
      fill: Color.grayColor( 255, 0.75 )
    } );

    assert && assert( !options.children, 'PeriodClockNode sets children' );
    options.children = [ clockFaceNode, backgroundNode, labelNode ];

    const relevantDomains = [ Domain.SPACE_AND_TIME ];

    super( tool, harmonicProperty, emphasizedHarmonics, domainProperty, relevantDomains, options );

    // Synchronize visibility of the clock face, so we can short-circuit updates while it's invisible.
    clockFaceNode.setVisibleProperty( this.visibleProperty );

    labelNode.boundsProperty.link( bounds => {

      // Center the label in the clock face.
      labelNode.left = clockFaceNode.right + BACKGROUND_X_MARGIN + 2;
      labelNode.centerY = clockFaceNode.centerY;

      // Resize the background to fit the label, and keep the label centered in the background.
      backgroundNode.setRect( 0, 0, labelNode.width + 2 * BACKGROUND_X_MARGIN, labelNode.height + 2 * BACKGROUND_Y_MARGIN );
      backgroundNode.center = labelNode.center;
    } );

    // Pointer areas
    this.localBoundsProperty.link( localBounds => {
      this.mouseArea = localBounds;
      this.touchArea = localBounds.dilated( 5 );
    } );
  }
}

/**
 * ClockFaceNode displays a clock face, with a portion of the clock face filled in with a harmonic's color.
 * The portion filled in represents the portion of the harmonic's period that has elapsed.
 */
class ClockFaceNode extends Node {

  /**
   * @param {ReadOnlyProperty.<Harmonic>} harmonicProperty
   * @param {Property.<number>} tProperty
   * @param {Object} [options]
   */
  constructor( harmonicProperty, tProperty, options ) {

    assert && AssertUtils.assertAbstractPropertyOf( harmonicProperty, Harmonic );
    assert && AssertUtils.assertPropertyOf( tProperty, 'number' );

    options = merge( {
      radius: 15
    }, options );

    // White background circle
    const backgroundNode = new Circle( options.radius, {
      fill: 'white'
    } );

    // Partial circle filled with the harmonic's color
    const elapsedTimeNode = new Path( null, {
      fill: harmonicProperty.value.colorProperty,
      stroke: 'black',
      lineWidth: 0.5
    } );

    // Black rim in the foreground, to hide any seams
    const rimNode = new Circle( options.radius, {
      stroke: 'black',
      lineWidth: 2
    } );

    assert && assert( !options.children, 'ClockFaceNode sets children' );
    options.children = [ backgroundNode, elapsedTimeNode, rimNode ];

    super( options );

    // When the harmonic changes, update the color used to fill in the elapsed time, and
    // update the elapsed time to correspond to the new harmonic's period at the current time t.
    harmonicProperty.link( harmonic => {
      elapsedTimeNode.fill = harmonic.colorProperty;
      if ( this.visible ) {
        elapsedTimeNode.shape = createElapsedTimeShape( harmonic, tProperty.value, options.radius );
      }
    } );

    // When the time changes while the tool is visible, update the elapsed time to correspond to the harmonic's period
    // at the current time t.
    tProperty.link( t => {
      if ( this.visible ) {
        elapsedTimeNode.shape = createElapsedTimeShape( harmonicProperty.value, t, options.radius );
      }
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

/**
 * Creates a partially filled clock face, which represents the portion of a harmonic's period that has elapsed.
 * @param {Harmonic} harmonic
 * @param {number} t
 * @param {number} radius
 * @returns {Shape}
 */
function createElapsedTimeShape( harmonic, t, radius ) {

  assert && assert( harmonic instanceof Harmonic );
  assert && AssertUtils.assertNonNegativeNumber( t );
  assert && AssertUtils.assertPositiveNumber( radius );

  const percentTime = ( t % harmonic.period ) / harmonic.period;
  const startAngle = -Math.PI / 2; // 12:00
  const endAngle = startAngle + ( percentTime * 2 * Math.PI );
  return new Shape()
    .moveTo( 0, 0 )
    .arc( 0, 0, radius, startAngle, endAngle )
    .close();
}

fourierMakingWaves.register( 'PeriodClockNode', PeriodClockNode );