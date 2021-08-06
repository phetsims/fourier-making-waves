// Copyright 2021, University of Colorado Boulder

/**
 * WidthIndicatorPlot plots width on a chart, using dimensional arrows.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Vector2 from '../../../../dot/js/Vector2.js';
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

class WidthIndicatorPlot extends Node {

  /**
   * @param {ChartTransform} chartTransform - transform for the chart that renders this plot
   * @param {Property.<number>} widthProperty - width of the indicator, in model coordinates
   * @param {Property.<Vector2>} positionProperty - position of the indicator, in model coordinates
   * @param {EnumerationProperty.<Domain>} domainProperty - the domain, space or time
   * @param {string} spaceSymbol - symbol for the space domain
   * @param {string} timeSymbol - symbol for the time domain
   * @param {Object} [options]
   */
  constructor( chartTransform, widthProperty, positionProperty, domainProperty, spaceSymbol, timeSymbol, options ) {

    assert && assert( chartTransform instanceof ChartTransform );
    assert && AssertUtils.assertPropertyOf( widthProperty, 'number' );
    assert && AssertUtils.assertPropertyOf( positionProperty, Vector2 );
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

    function updateWidthIndicatorPlot() {

      // Resize the dimensional arrows
      const viewWidth = chartTransform.modelToViewX( widthProperty.value );
      dimensionalArrowsNode.setLine( 0, viewWidth );

      // Center the dimensional arrows
      dimensionalArrowsNode.center = chartTransform.modelToViewPosition( positionProperty.value );
    }

    chartTransform.changedEmitter.addListener( updateWidthIndicatorPlot );
    widthProperty.link( updateWidthIndicatorPlot );
    positionProperty.link( updateWidthIndicatorPlot );

    // Update the label to match the domain
    domainProperty.link( domain => {
      const waveNumberSymbol = ( domain === Domain.SPACE ) ? spaceSymbol : timeSymbol;
      labelNode.text = `2${FMWSymbols.sigma}<sub>${waveNumberSymbol}</sub>`;
    } );

    // Horizontally center the label.
    Property.multilink(
      [ backgroundNode.boundsProperty, dimensionalArrowsNode.boundsProperty ],
      () => {
        backgroundNode.centerX = dimensionalArrowsNode.centerX;
        backgroundNode.bottom = dimensionalArrowsNode.top;
      } );
  }
}

fourierMakingWaves.register( 'WidthIndicatorPlot', WidthIndicatorPlot );
export default WidthIndicatorPlot;