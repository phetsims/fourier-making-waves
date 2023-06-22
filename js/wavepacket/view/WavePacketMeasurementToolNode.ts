// Copyright 2021-2023, University of Colorado Boulder

/**
 * WavePacketMeasurementToolNode is the base class for measurement tools in the 'Wave Packet' screen.
 * Origin is at the tip of the caliper's left jaw.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Disposable from '../../../../axon/js/Disposable.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import BackgroundNode from '../../../../scenery-phet/js/BackgroundNode.js';
import { Circle, DragListener, KeyboardDragListener, Node, NodeOptions, RichText, TPaint } from '../../../../scenery/js/imports.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWQueryParameters from '../../common/FMWQueryParameters.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import Domain from '../../common/model/Domain.js';
import CalipersNode from '../../common/view/CalipersNode.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';

const RICH_TEXT_OPTIONS = {
  font: FMWConstants.TOOL_LABEL_FONT,
  maxWidth: 75
};

type SelfOptions = {
  fill?: TPaint;
  position?: Vector2;
  dragBounds?: Bounds2 | null;
  spaceSymbolStringProperty: TReadOnlyProperty<string>;
  timeSymbolStringProperty: TReadOnlyProperty<string>;
};

export type WavePacketMeasurementToolNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem' | 'visibleProperty'>;

export default class WavePacketMeasurementToolNode extends Node {

  private readonly positionProperty: Property<Vector2>;

  protected constructor( property: TReadOnlyProperty<number>,
                         chartTransform: ChartTransform,
                         domainProperty: EnumerationProperty<Domain>,
                         providedOptions: WavePacketMeasurementToolNodeOptions ) {

    const options = optionize<WavePacketMeasurementToolNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      fill: 'black',
      position: new Vector2( 0, 0 ),
      dragBounds: null,

      // NodeOptions
      cursor: 'pointer',
      tagName: 'div',
      focusable: true
    }, providedOptions );

    // Calipers, shown when the value is not Infinity.
    const calipersNode = new CalipersNode( {
      pathOptions: {
        fill: options.fill
      },
      richTextOptions: RICH_TEXT_OPTIONS
    } );

    // Shown when the value is Infinity.
    const infinityText = new RichText( '', RICH_TEXT_OPTIONS );
    const infinityBackgroundNode = new BackgroundNode( infinityText, {
      xMargin: 5,
      yMargin: 2,
      rectangleOptions: {
        cornerRadius: 3,
        fill: options.fill
      }
    } );

    options.children = [ infinityBackgroundNode, calipersNode ];

    // Show a red dot at the tool's origin.
    if ( FMWQueryParameters.debugTools ) {
      options.children.push( new Circle( 2, { fill: 'red' } ) );
    }

    super( options );

    const update = () => {

      // Doing StringProperty.value is OK here, because we're observing these StringProperties via Multilink below.
      const symbol = ( domainProperty.value === Domain.SPACE ) ?
                     options.spaceSymbolStringProperty.value :
                     options.timeSymbolStringProperty.value;

      if ( property.value === Infinity ) {

        // Make the calipers invisible, and as small as possible,
        // see https://github.com/phetsims/fourier-making-waves/issues/181
        calipersNode.visible = false;
        calipersNode.setMeasuredWidth( 0 );
        infinityBackgroundNode.visible = true;
        infinityText.string = `${symbol} = ${FMWSymbols.infinityMarkup}`;
      }
      else {
        calipersNode.visible = true;
        calipersNode.setMeasuredWidth( chartTransform.modelToViewDeltaX( property.value ) );
        infinityBackgroundNode.visible = false;
        if ( property.value === 0 ) {
          calipersNode.setLabel( `${symbol} = 0` ); // ... so there is no question that the caliper jaws are fully closed.
        }
        else {
          calipersNode.setLabel( symbol );
        }
      }

      // Locate infinity display at the capliper's origin.
      infinityBackgroundNode.centerX = calipersNode.x;
      infinityBackgroundNode.bottom = calipersNode.y;
    };

    chartTransform.changedEmitter.addListener( () => update() );
    Multilink.multilink(
      [ property, domainProperty, options.spaceSymbolStringProperty, options.timeSymbolStringProperty ],
      () => update() );

    const positionProperty = new Vector2Property( options.position, {
      tandem: options.tandem.createTandem( 'positionProperty' ),
      phetioDocumentation: 'position of this tool, in view coordinates'
    } );
    positionProperty.link( position => {
      this.translation = position;
    } );

    // This is a fixed value, but DragListener requires a Property.
    const dragBoundsProperty = new Property( options.dragBounds, {
      validValues: [ options.dragBounds ]
    } );

    // Dragging, constrained to bounds.
    this.addInputListener( new DragListener( {
      positionProperty: positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      tandem: options.tandem.createTandem( 'dragListener' ),
      phetioEnabledPropertyInstrumented: true
    } ) );

    // pdom - dragging using the keyboard
    const keyboardDragListener = new KeyboardDragListener( {
      positionProperty: positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      dragVelocity: 100, // velocity - change in position per second
      shiftDragVelocity: 20, // finer-grained
      tandem: options.tandem.createTandem( 'keyboardDragListener' )
    } );
    this.addInputListener( keyboardDragListener );

    this.positionProperty = positionProperty;
  }

  public reset(): void {
    this.positionProperty.reset();
  }

  public override dispose(): void {
    Disposable.assertNotDisposable();
    super.dispose();
  }
}

fourierMakingWaves.register( 'WavePacketMeasurementToolNode', WavePacketMeasurementToolNode );