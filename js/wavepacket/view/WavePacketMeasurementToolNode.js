// Copyright 2021-2022, University of Colorado Boulder

/**
 * WavePacketMeasurementToolNode is the base class for measurement tools in the 'Wave Packet' screen.
 * Origin is at the tip of the caliper's left jaw.
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
import { DragListener } from '../../../../scenery/js/imports.js';
import { KeyboardDragListener } from '../../../../scenery/js/imports.js';
import { Circle } from '../../../../scenery/js/imports.js';
import { Node } from '../../../../scenery/js/imports.js';
import { RichText } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWQueryParameters from '../../common/FMWQueryParameters.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import Domain from '../../common/model/Domain.js';
import CalipersNode from '../../common/view/CalipersNode.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class WavePacketMeasurementToolNode extends Node {

  /**
   * @param {Property.<number>} property - the Property of the wave packet that we're measuring
   * @param {ChartTransform} chartTransform
   * @param {EnumerationDeprecatedProperty.<Domain>} domainProperty
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
          font: FMWConstants.TOOL_LABEL_FONT,
          maxWidth: 75
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

    // Show a red dot at the tool's origin.
    if ( FMWQueryParameters.debugTools ) {
      options.children.push( new Circle( 2, { fill: 'red' } ) );
    }

    super( options );

    const update = ( value, domain ) => {

      const symbol = ( domain === Domain.SPACE ) ? spaceSymbol : timeSymbol;

      if ( value === Infinity ) {

        // Make the calipers invisible, and as small as possible,
        // see https://github.com/phetsims/fourier-making-waves/issues/181
        calipersNode.visible = false;
        calipersNode.setMeasuredWidth( 0 );
        infinityBackgroundNode.visible = true;
        infinityText.text = `${symbol} = ${FMWSymbols.infinity}`;
      }
      else {
        calipersNode.visible = true;
        calipersNode.setMeasuredWidth( chartTransform.modelToViewDeltaX( value ) );
        infinityBackgroundNode.visible = false;
        if ( value === 0 ) {
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

    chartTransform.changedEmitter.addListener( () => update( property.value, domainProperty.value ) );
    Property.multilink( [ property, domainProperty ], update );

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
      shiftDragVelocity: 20 // finer-grained
    } );
    this.addInputListener( keyboardDragListener );

    // @private
    this.positionProperty = positionProperty; // {Property.<Vector2>}
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