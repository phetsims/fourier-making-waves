// Copyright 2021, University of Colorado Boulder

/**
 * WidthIndicatorPlot plots a general width on a chart, using dimensional arrows.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

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

      // HorizontalDimensionalArrowsNode options
      dimensionalArrowsNodeOptions: {
        color: FMWColors.widthIndicatorsColorProperty
      },

      // RichText options
      richTextOptions: {
        font: new PhetFont( 16 ),
        stroke: FMWColors.widthIndicatorsColorProperty
      }
    }, options );

    // Dimensional arrows
    const dimensionalArrowsNode = new HorizontalDimensionalArrowsNode( options.dimensionalArrowsNodeOptions );

    // Label on a translucent background that resizes to fit the label.
    const labelNode = new RichText( '', options.richTextOptions );
    const backgroundNode = new BackgroundNode( labelNode, {
      xMargin: 5,
      rectangleOptions: {
        cornerRadius: 2
      }
    } );

    assert && assert( !options.children, 'DimensionalArrowsNode sets children' );
    options = merge( {
      children: [ dimensionalArrowsNode, backgroundNode ]
    }, options );

    super( options );

    // Center the label BELOW the dimensional arrows, so that it doesn't get clipped by the charts.
    function updateLabelPosition() {
      backgroundNode.centerX = dimensionalArrowsNode.centerX;
      backgroundNode.top = dimensionalArrowsNode.bottom;
    }

    // Resize the dimensional arrows, and center them on the position.
    function updateDimensionalArrows() {
      const viewWidth = chartTransform.modelToViewDeltaX( widthProperty.value );
      dimensionalArrowsNode.setLine( 0, viewWidth );
      dimensionalArrowsNode.center = chartTransform.modelToViewPosition( positionProperty.value );
      updateLabelPosition();
    }

    chartTransform.changedEmitter.addListener( updateDimensionalArrows );
    widthProperty.link( updateDimensionalArrows );
    positionProperty.link( updateDimensionalArrows );

    // Update the label to match the domain
    domainProperty.link( domain => {
      const waveNumberSymbol = ( domain === Domain.SPACE ) ? spaceSymbol : timeSymbol;
      labelNode.text = `2${FMWSymbols.sigma}<sub>${waveNumberSymbol}</sub>`;
      updateLabelPosition();
    } );
  }
}

fourierMakingWaves.register( 'WidthIndicatorPlot', WidthIndicatorPlot );
export default WidthIndicatorPlot;