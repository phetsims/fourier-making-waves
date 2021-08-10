// Copyright 2021, University of Colorado Boulder

/**
 * WavePacketMeasurementToolNode is the tool for measuring component spacing in the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import BackgroundNode from '../../../../scenery-phet/js/BackgroundNode.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import KeyboardDragListener from '../../../../scenery/js/listeners/KeyboardDragListener.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import Domain from '../../common/model/Domain.js';
import CalipersNode from '../../common/view/CalipersNode.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class WavePacketMeasurementToolNode extends Node {

  /**
   * @param {Property.<number>} property - the Property of the wave packet that we're measuring
   * @param {ChartTransform} chartTransform
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {string} spaceSymbol
   * @param {string} timeSymbol
   * @param {Object} [options]
   */
  constructor( property, chartTransform, domainProperty, spaceSymbol, timeSymbol, options ) {

    assert && AssertUtils.assertPropertyOf( property, 'number' );
    assert && assert( chartTransform instanceof ChartTransform );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && assert( typeof spaceSymbol === 'string' );
    assert && assert( typeof timeSymbol === 'string' );

    options = merge( {
      position: new Vector2( 0, 0 ),
      dragBounds: null, // {Bounds2|null}
      cursor: 'pointer',

      // CalipersNode options
      calipersNodeOptions: {
        pathOptions: {
          fill: 'white'
        },
        richTextOptions: {
          font: FMWConstants.TOOL_LABEL_FONT
        }
      },

      // pdom
      tagName: 'div',
      focusable: true,

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    // Calipers, shown when the value is not Infinity.
    const calipersNode = new CalipersNode( options.calipersNodeOptions );

    // Shown when the value is Infinity.
    const infinityText = new RichText( '', options.calipersNodeOptions.richTextOptions );
    const infinityBackgroundNode = new BackgroundNode( infinityText, {
      xMargin: 5,
      yMargin: 2,
      rectangleOptions: {
        cornerRadius: 3,
        fill: options.calipersNodeOptions.pathOptions.fill
      }
    } );

    assert && assert( !options.children );
    options.children = [ infinityBackgroundNode, calipersNode ];

    super( options );

    Property.multilink(
      [ property, domainProperty ],
      ( value, domain ) => {

        const symbol = ( domain === Domain.SPACE ) ? spaceSymbol : timeSymbol;

        if ( value === Infinity ) {
          calipersNode.visible = false;
          infinityBackgroundNode.visible = true;
          infinityText.text = `${symbol} = ${FMWSymbols.infinity}`;
          calipersNode.center = infinityBackgroundNode.center;
        }
        else {
          infinityBackgroundNode.visible = false;
          calipersNode.visible = true;
          calipersNode.setMeasuredWidth( chartTransform.modelToViewDeltaX( value ) );
          if ( value === 0 ) {
            calipersNode.setLabel( `${symbol} = 0` ); // ... so there is no question that the caliper jaws are fully closed.
          }
          else {
            calipersNode.setLabel( symbol );
          }
          infinityBackgroundNode.center = calipersNode.center;
        }
      } );

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
      dragBoundsProperty: dragBoundsProperty
    } ) );

    // pdom - dragging using the keyboard
    const keyboardDragListener = new KeyboardDragListener( {
      positionProperty: positionProperty,
      dragBounds: dragBoundsProperty.value,
      dragVelocity: 100, // velocity - change in position per second
      shiftDragVelocity: 20 // finer-grained
    } );
    this.addInputListener( keyboardDragListener );

    // @private
    this.positionProperty = positionProperty;
  }

  /**
   * @public
   */
  reset() {
    this.positionProperty.reset();
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

fourierMakingWaves.register( 'WavePacketMeasurementToolNode', WavePacketMeasurementToolNode );
export default WavePacketMeasurementToolNode;