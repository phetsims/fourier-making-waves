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
import BackgroundNode from '../../../../scenery-phet/js/BackgroundNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, NodeOptions, RichText } from '../../../../scenery/js/imports.js';
import FMWColors from '../../common/FMWColors.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import Domain from '../../common/model/Domain.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import HorizontalDimensionalArrowsNode from './HorizontalDimensionalArrowsNode.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = {
  spaceSymbolStringProperty: TReadOnlyProperty<string>; // symbol for the space Domain
  timeSymbolStringProperty: TReadOnlyProperty<string>; // symbol for the time Domain
};

type WidthIndicatorPlotOptions = SelfOptions & PickRequired<NodeOptions, 'visibleProperty'>;

export default class WidthIndicatorPlot extends Node {

  /**
   * @param chartTransform - transform for the chart that renders this plot
   * @param widthProperty - width of the indicator, in model coordinates
   * @param positionProperty - position of the indicator, in model coordinates
   * @param domainProperty - the Domain, space or time
   * @param providedOptions
   */
  public constructor( chartTransform: ChartTransform,
                      widthProperty: TReadOnlyProperty<number>,
                      positionProperty: TReadOnlyProperty<Vector2>,
                      domainProperty: EnumerationProperty<Domain>,
                      providedOptions: WidthIndicatorPlotOptions ) {

    const options = optionize<WidthIndicatorPlotOptions, SelfOptions, NodeOptions>()( {}, providedOptions );

    // Dimensional arrows
    const dimensionalArrowsNode = new HorizontalDimensionalArrowsNode( {
      color: FMWColors.widthIndicatorsColorProperty
    } );

    const labelStringProperty = new DerivedProperty(
      [ domainProperty, FMWSymbols.sigmaStringProperty, options.spaceSymbolStringProperty, options.timeSymbolStringProperty ],
      ( domain, sigma, spaceSymbol, timeSymbol ) => {
        const waveNumberSymbol = ( domain === Domain.SPACE ) ? spaceSymbol : timeSymbol;
        return `2${sigma}<sub>${waveNumberSymbol}</sub>`;
      } );

    // Label on a translucent background that resizes to fit the label.
    const labelNode = new RichText( labelStringProperty, {
      font: new PhetFont( 16 ),
      stroke: FMWColors.widthIndicatorsColorProperty,
      maxWidth: 150
    } );
    const backgroundNode = new BackgroundNode( labelNode, {
      xMargin: 5,
      rectangleOptions: {
        cornerRadius: 2
      }
    } );

    options.children = [ dimensionalArrowsNode, backgroundNode ];

    super( options );

    // Center the label BELOW the dimensional arrows, so that it doesn't get clipped by the charts.
    function updateLabelPosition(): void {
      backgroundNode.centerX = dimensionalArrowsNode.centerX;
      backgroundNode.top = dimensionalArrowsNode.bottom;
    }

    backgroundNode.boundsProperty.link( bounds => updateLabelPosition() );

    // Resize the dimensional arrows, and center them on the position.
    function updateDimensionalArrows(): void {
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