// Copyright 2021-2023, University of Colorado Boulder

/**
 * CalipersNode is a tool used to measure a horizontal dimension. It consists of a horizontal "beam" with a pair of
 * "jaws" at the ends of the beam. The horizontal distance between the jaws is the measured dimension. It also has
 * a label whose position is (somewhat) customizable. The origin of CalipersNode is at the tip of the left jaw.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import BackgroundNode from '../../../../scenery-phet/js/BackgroundNode.js';
import { Node, Path, Rectangle, RichText } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

// These constants determine the shape of the beam and jaws.
const BEAM_THICKNESS = 5;
const JAWS_THICKNESS = 5;
const JAWS_LENGTH = 20;

// Positions for the label, relative to the calipers.
const VALID_LABEL_POSITIONS = [
  'above', // used for the interactive tools
  'left' // used for icons in control panels, where we need to conserve vertical space
];

export default class CalipersNode extends Node {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      measuredWidth: 100,
      labelPosition: 'above',

      // Path options, for the beamNode subcomponent
      pathOptions: {
        fill: 'white',
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
      },

      // phet-io options
      tandem: Tandem.OPTIONAL
    }, options );

    assert && assert( VALID_LABEL_POSITIONS.includes( options.labelPosition ) );

    // Beam, with jaws at ends.
    const beamAndJawsNode = new Path( null, options.pathOptions );

    // Transparent rectangle that covers beamAndJawsNode, so you can drag by clicking in the space between the calipers.
    // We do this instead of setting pointer areas, so that interactive calipers are also draggable by their label.
    const transparentRectangle = new Rectangle( 0, 0, 1, 1, {
      fill: 'transparent'
    } );

    // Label above the beam
    const labelText = new RichText( '', merge( {
      tandem: options.tandem.createTandem( 'labelText' )
    }, options.richTextOptions ) );

    // Translucent background for the label
    const backgroundNode = new BackgroundNode( labelText, options.backgroundNodeOptions );

    const parentNode = new Node( {
      children: [ transparentRectangle, beamAndJawsNode, backgroundNode ]
    } );

    assert && assert( !options.children, 'CalipersNode sets children' );
    options.children = [ parentNode ];

    super( options );

    // @private
    this.beamAndJawsNode = beamAndJawsNode; // {Path}
    this.transparentRectangle = transparentRectangle; // {Rectangle}
    this.labelText = labelText; // {RichText}
    this.backgroundNode = backgroundNode; // {BackgroundNode}
    this.labelPosition = options.labelPosition; // {string}

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
    this.labelText.string = text;
    this.updateLabelPosition();
  }

  /**
   * Centers the label on the horizontal beam.
   * @private
   */
  updateLabelPosition() {
    if ( this.labelPosition === 'above' ) {
      this.backgroundNode.centerX = this.beamAndJawsNode.centerX;
      this.backgroundNode.bottom = this.beamAndJawsNode.top - 2;
    }
    else {
      this.backgroundNode.right = this.beamAndJawsNode.left - 5;
      this.backgroundNode.centerY = this.beamAndJawsNode.centerY;
    }
  }
}

fourierMakingWaves.register( 'CalipersNode', CalipersNode );