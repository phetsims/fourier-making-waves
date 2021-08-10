// Copyright 2021, University of Colorado Boulder

/**
 * ComponentSpacingToolNode is the tool for measuring component spacing in the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import BackgroundNode from '../../../../scenery-phet/js/BackgroundNode.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import Domain from '../../common/model/Domain.js';
import CalipersNode from '../../common/view/CalipersNode.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class ComponentSpacingToolNode extends Node {

  /**
   * @param {Property.<number>} componentSpacingProperty
   * @param {ChartTransform} chartTransform
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Property.<Bounds2>} dragBoundsProperty
   * @param {Object} [options]
   */
  constructor( componentSpacingProperty, chartTransform, domainProperty, dragBoundsProperty, options ) {

    assert && AssertUtils.assertPropertyOf( componentSpacingProperty, 'number' );
    assert && assert( chartTransform instanceof ChartTransform );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertPropertyOf( dragBoundsProperty, Bounds2 );

    options = merge( {
      cursor: 'pointer',
      font: FMWConstants.TOOL_LABEL_FONT,
      fill: 'yellow'
    }, options );

    const calipersNode = new CalipersNode( {
      pathOptions: {
        fill: options.fill
      },
      richTextOptions: {
        font: options.font
      }
    } );

    const zeroSpacingNode = new RichText( '', {
      font: options.font
    } );
    const zeroSpacingBackgroundNode = new BackgroundNode( zeroSpacingNode, {
      xMargin: 5,
      yMargin: 2,
      rectangleOptions: {
        cornerRadius: 3,
        fill: options.fill
      }
    } );

    assert && assert( !options.children );
    options.children = [ zeroSpacingBackgroundNode, calipersNode ];

    super( options );

    calipersNode.boundsProperty.link( bounds => {
      zeroSpacingBackgroundNode.center = calipersNode.center;
    } );

    // Update the width of the calipers to match the component spacing.
    componentSpacingProperty.link( componentSpacing => {
      assert && assert( componentSpacing >= 0 );
      calipersNode.setMeasuredWidth( chartTransform.modelToViewDeltaX( componentSpacing ) );
      calipersNode.visible = ( componentSpacing !== 0 );
      zeroSpacingBackgroundNode.visible = ( componentSpacing === 0 );
    } );

    // Update the labels to match the domain.
    domainProperty.link( domain => {
      const wavelengthSymbol = ( domain === Domain.SPACE ) ? FMWSymbols.k : FMWSymbols.omega;
      const wavelengthSymbolSub1 = `${wavelengthSymbol}<sub>1</sub>`;
      calipersNode.setLabel( wavelengthSymbolSub1 );
      zeroSpacingNode.text = `${wavelengthSymbolSub1} = 0`;
    } );

    // Dragging, constrained to bounds.
    this.addInputListener( new DragListener( {
      dragBoundsProperty: dragBoundsProperty
    } ) );
  }
}

fourierMakingWaves.register( 'ComponentSpacingToolNode', ComponentSpacingToolNode );
export default ComponentSpacingToolNode;