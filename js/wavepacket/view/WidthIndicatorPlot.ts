// Copyright 2021-2023, University of Colorado Boulder

/**
 * WidthIndicatorPlot plots a general width on a chart, using dimensional arrows.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import BackgroundNode from '../../../../scenery-phet/js/BackgroundNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, RichText } from '../../../../scenery/js/imports.js';
import FMWColors from '../../common/FMWColors.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import Domain from '../../common/model/Domain.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import HorizontalDimensionalArrowsNode from './HorizontalDimensionalArrowsNode.js';

export default class WidthIndicatorPlot extends Node {

  /**
   * @param {ChartTransform} chartTransform - transform for the chart that renders this plot
   * @param {ReadOnlyProperty.<number>} widthProperty - width of the indicator, in model coordinates
   * @param {ReadOnlyProperty.<Vector2>} positionProperty - position of the indicator, in model coordinates
   * @param {EnumerationProperty.<Domain>} domainProperty - the Domain, space or time
   * @param {TReadOnlyProperty.<string>} spaceSymbolStringProperty - symbol for the space Domain
   * @param {TReadOnlyProperty.<string>} timeSymbolStringProperty - symbol for the time Domain
   * @param {Object} [options]
   */
  constructor( chartTransform, widthProperty, positionProperty, domainProperty,
               spaceSymbolStringProperty, timeSymbolStringProperty, options ) {

    assert && assert( chartTransform instanceof ChartTransform );
    assert && AssertUtils.assertAbstractPropertyOf( widthProperty, 'number' );
    assert && AssertUtils.assertAbstractPropertyOf( positionProperty, Vector2 );
    assert && assert( domainProperty instanceof EnumerationProperty );

    options = merge( {

      // HorizontalDimensionalArrowsNode options
      dimensionalArrowsNodeOptions: {
        color: FMWColors.widthIndicatorsColorProperty
      },

      // RichText options
      richTextOptions: {
        font: new PhetFont( 16 ),
        stroke: FMWColors.widthIndicatorsColorProperty,
        maxWidth: 150
      }
    }, options );

    // Dimensional arrows
    const dimensionalArrowsNode = new HorizontalDimensionalArrowsNode( options.dimensionalArrowsNodeOptions );

    const labelStringProperty = new DerivedProperty(
      [ domainProperty, FMWSymbols.sigmaStringProperty, spaceSymbolStringProperty, timeSymbolStringProperty ],
      ( domain, sigma, spaceSymbol, timeSymbol ) => {
        const waveNumberSymbol = ( domain === Domain.SPACE ) ? spaceSymbol : timeSymbol;
        return `2${sigma}<sub>${waveNumberSymbol}</sub>`;
      } );

    // Label on a translucent background that resizes to fit the label.
    const labelNode = new RichText( labelStringProperty, options.richTextOptions );
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

    backgroundNode.boundsProperty.link( bounds => updateLabelPosition() );

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
  }
}

fourierMakingWaves.register( 'WidthIndicatorPlot', WidthIndicatorPlot );