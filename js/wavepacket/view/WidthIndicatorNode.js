// Copyright 2021, University of Colorado Boulder

/**
 * WidthIndicatorNode shows the width of the wave packet.
 * It's a horizontal dimensional indicator, with a label centered above it.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import BackgroundNode from '../../../../scenery-phet/js/BackgroundNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import FMWColors from '../../common/FMWColors.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import Domain from '../../common/model/Domain.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import HorizontalDimensionalArrowsNode from './HorizontalDimensionalArrowNode.js';

class WidthIndicatorNode extends Node {

  /**
   * @param {ChartTransform} chartTransform
   * @param {Property.<number>} widthProperty
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {string} spaceSymbol
   * @param {string} timeSymbol
   * @param {Object} [options]
   */
  constructor( chartTransform, widthProperty, domainProperty, spaceSymbol, timeSymbol, options ) {

    assert && assert( chartTransform instanceof ChartTransform );
    assert && AssertUtils.assertPropertyOf( widthProperty, 'number' );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && assert( typeof spaceSymbol === 'string' );
    assert && assert( typeof timeSymbol === 'string' );

    options = merge( {
      dimensionalArrowsNodeOptions: {
        color: FMWColors.widthIndicatorsColorProperty
      },
      richTextOptions: {
        font: new PhetFont( 16 ),
        stroke: FMWColors.widthIndicatorsColorProperty
      }
    }, options );

    // Dimensional arrows
    const dimensionalArrowsNode = new HorizontalDimensionalArrowsNode( options.dimensionalArrowsNodeOptions );

    // Label
    const labelNode = new RichText( '', options.richTextOptions );

    // Label on a translucent background that resizes to fit the label.
    const backgroundNode = new BackgroundNode( labelNode );

    assert && assert( !options.children, 'DimensionalArrowsNode sets children' );
    options = merge( {
      children: [ dimensionalArrowsNode, backgroundNode ]
    }, options );

    super( options );

    // Make the line grow from the center out, and reposition left arrow and vertical line.
    widthProperty.link( width => {
      const viewWidth = chartTransform.modelToViewX( width );
      const x1 = -viewWidth / 2;
      const x2 = viewWidth / 2;
      dimensionalArrowsNode.setLine( x1, x2 );
    } );

    // Update the label to match the domain
    domainProperty.link( domain => {
      const waveNumberSymbol = ( domain === Domain.TIME ) ? timeSymbol : spaceSymbol;
      labelNode.text = `2${FMWSymbols.sigma}<sub>${waveNumberSymbol}</sub>`;
    } );

    // Horizontally center the label.
    Property.multilink(
      [ backgroundNode.boundsProperty, dimensionalArrowsNode.boundsProperty ],
      () => {
        backgroundNode.centerX = dimensionalArrowsNode.centerX;
        backgroundNode.bottom = dimensionalArrowsNode.top - 1;
      } );
  }
}

fourierMakingWaves.register( 'WidthIndicatorNode', WidthIndicatorNode );
export default WidthIndicatorNode;