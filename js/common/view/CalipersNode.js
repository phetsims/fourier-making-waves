// Copyright 2020-2021, University of Colorado Boulder

/**
 * CalipersNode is a tool used to measure a horizontal dimension. It consists of a horizontal "beam" with a pair of
 * "jaws" at the ends of the beam. The horizontal distance between the jaws is the measured dimension.
 * Origin is at the tip of the left jaw.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import BackgroundNode from '../../../../scenery-phet/js/BackgroundNode.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

// These constants determine the shape of the beam and jaws.
const BEAM_THICKNESS = 5;
const JAWS_THICKNESS = 5;
const JAWS_LENGTH = 20;

class CalipersNode extends Node {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      measuredWidth: 100,

      // Path options, for the beamNode subcomponent
      pathOptions: {
        fill: 'black',
        stroke: 'black'
      },

      // RichText options
      richTextOptions: {
        font: FMWConstants.TOOL_LABEL_FONT,
        maxWidth: 50
      },

      // BackgroundNode options
      backgroundNodeOptions: {
        xMargin: 2,
        yMargin: 2
      }
    }, options );

    // Beam, with jaws at ends.
    const beamAndJawsNode = new Path( null, options.pathOptions );

    //TODO is this necessary if we set rectangular point areas?
    // Transparent rectangle that covers beamAndJawsNode, so you can drag by clicking in the space between the calipers
    const transparentRectangle = new Rectangle( 0, 0, 1, 1, {
      fill: 'transparent'
    } );

    // Label above the beam
    const labelNode = new RichText( '', options.richTextOptions );

    // Translucent background for the label
    const backgroundNode = new BackgroundNode( labelNode, options.backgroundNodeOptions );

    const parentNode = new Node( {
      children: [ transparentRectangle, beamAndJawsNode, backgroundNode ]
    } );

    assert && assert( !options.children, 'CalipersNode sets children' );
    options.children = [ parentNode ];

    super( options );

    // @private
    this.beamAndJawsNode = beamAndJawsNode;
    this.transparentRectangle = transparentRectangle;
    this.labelNode = labelNode;
    this.backgroundNode = backgroundNode;

    this.setMeasuredWidth( options.measuredWidth );
  }

  /**
   * Sets width being measured by the calipers, the horizontal space between the left and right tips of the calipers.
   * @param {number} measuredWidth - in view coordinates
   * @public
   */
  setMeasuredWidth( measuredWidth ) {

    // The horizontal beam has ends that are caliper-like.
    // The Shape is described clockwise from the origin (the tip of the left caliper).
    this.beamAndJawsNode.shape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( -JAWS_THICKNESS, -( JAWS_LENGTH - BEAM_THICKNESS ) )
      .lineTo( -JAWS_THICKNESS, -JAWS_LENGTH )
      .lineTo( measuredWidth + JAWS_THICKNESS, -JAWS_LENGTH )
      .lineTo( measuredWidth + JAWS_THICKNESS, -( JAWS_LENGTH - BEAM_THICKNESS ) )
      .lineTo( measuredWidth, 0 )
      .lineTo( measuredWidth, -( JAWS_LENGTH - BEAM_THICKNESS ) )
      .lineTo( 0, -( JAWS_LENGTH - BEAM_THICKNESS ) )
      .close();

    // Cover the beam with a transparent rectangle, so you can drag by clicking in the space between the calipers.
    this.transparentRectangle.setRect( 0, 0, this.beamAndJawsNode.width, this.beamAndJawsNode.height );
    this.transparentRectangle.center = this.beamAndJawsNode.center;

    this.updateLabelPosition();
  }

  /**
   * Sets the fill for the beam and jaws.
   * @param {ColorDef} fill
   * @public
   */
  setBeamAndJawsFill( fill ) {
    this.beamAndJawsNode.fill = fill;
  }

  /**
   * Sets the text for the label.
   * @param {string} text - string for RichText
   * @public
   */
  setLabel( text ) {
    this.labelNode.text = text;
    this.updateLabelPosition();
  }

  /**
   * Centers the label on the horizontal beam.
   * @private
   */
  updateLabelPosition() {
    this.backgroundNode.centerX = this.beamAndJawsNode.centerX;
    this.backgroundNode.bottom = this.beamAndJawsNode.top - 2;
  }
}

fourierMakingWaves.register( 'CalipersNode', CalipersNode );
export default CalipersNode;