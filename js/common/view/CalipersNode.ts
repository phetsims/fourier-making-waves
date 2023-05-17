// Copyright 2021-2023, University of Colorado Boulder

/**
 * CalipersNode is a tool used to measure a horizontal dimension. It consists of a horizontal "beam" with a pair of
 * "jaws" at the ends of the beam. The horizontal distance between the jaws is the measured dimension. It also has
 * a label whose position is (somewhat) customizable. The origin of CalipersNode is at the tip of the left jaw.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Shape } from '../../../../kite/js/imports.js';
import BackgroundNode, { BackgroundNodeOptions } from '../../../../scenery-phet/js/BackgroundNode.js';
import { Node, NodeOptions, Path, PathOptions, Rectangle, RichText, RichTextOptions, TPaint } from '../../../../scenery/js/imports.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import optionize from '../../../../phet-core/js/optionize.js';

// These constants determine the shape of the beam and jaws.
const BEAM_THICKNESS = 5;
const JAWS_THICKNESS = 5;
const JAWS_LENGTH = 20;

// 'above' is used for the interactive tools.
// 'left' is used for icons in control panels, where we need to conserve vertical space
type LabelPosition = 'above' | 'left';

type SelfOptions = {
  measuredWidth?: number;
  labelPosition?: LabelPosition;
  scale?: number;

  // Path options, for the beamNode subcomponent
  pathOptions?: StrictOmit<PathOptions, 'tandem'>;

  // RichText options
  richTextOptions?: StrictOmit<RichTextOptions, 'tandem'>;

  // BackgroundNode options
  backgroundNodeOptions?: StrictOmit<BackgroundNodeOptions, 'tandem'>;
};

export type CalipersNodeOptions = SelfOptions;

export default class CalipersNode extends Node {

  private readonly beamAndJawsNode: Path;
  private readonly transparentRectangle: Rectangle;
  private readonly labelText: RichText;
  private readonly backgroundNode: BackgroundNode;
  private readonly labelPosition: LabelPosition;

  public constructor( providedOptions?: CalipersNodeOptions ) {

    const options = optionize<CalipersNodeOptions, SelfOptions, NodeOptions>()( {

      measuredWidth: 100,
      labelPosition: 'above',
      scale: 1,

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
      }
    }, providedOptions );

    // Beam, with jaws at ends.
    const beamAndJawsNode = new Path( null, options.pathOptions );

    // Transparent rectangle that covers beamAndJawsNode, so you can drag by clicking in the space between the calipers.
    // We do this instead of setting pointer areas, so that interactive calipers are also draggable by their label.
    const transparentRectangle = new Rectangle( 0, 0, 1, 1, {
      fill: 'transparent'
    } );

    // Label above the beam
    const labelText = new RichText( '', options.richTextOptions );

    // Translucent background for the label
    const backgroundNode = new BackgroundNode( labelText, options.backgroundNodeOptions );

    const parentNode = new Node( {
      children: [ transparentRectangle, beamAndJawsNode, backgroundNode ]
    } );

    options.children = [ parentNode ];

    super( options );

    this.beamAndJawsNode = beamAndJawsNode;
    this.transparentRectangle = transparentRectangle;
    this.labelText = labelText;
    this.backgroundNode = backgroundNode;
    this.labelPosition = options.labelPosition;

    this.setMeasuredWidth( options.measuredWidth );
  }

  /**
   * Sets width being measured by the calipers, the horizontal space between the left and right tips of the calipers.
   * @param measuredWidth - in view coordinates
   */
  public setMeasuredWidth( measuredWidth: number ): void {

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
   */
  public setBeamAndJawsFill( fill: TPaint ): void {
    this.beamAndJawsNode.fill = fill;
  }

  /**
   * Sets the text for the label.
   */
  public setLabel( text: string ): void {
    this.labelText.string = text;
    this.updateLabelPosition();
  }

  /**
   * Centers the label on the horizontal beam.
   */
  private updateLabelPosition(): void {
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