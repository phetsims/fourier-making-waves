// Copyright 2021, University of Colorado Boulder

/**
 * ComponentSpacingToolNode is the tool for measuring component spacing in the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import KeyboardDragListener from '../../../../scenery/js/listeners/KeyboardDragListener.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import Domain from '../../common/model/Domain.js';
import CalipersNode from '../../common/view/CalipersNode.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';

class ComponentSpacingToolNode extends CalipersNode {

  /**
   * @param {Property.<number>} componentSpacingProperty
   * @param {ChartTransform} chartTransform
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Object} [options]
   */
  constructor( componentSpacingProperty, chartTransform, domainProperty, options ) {

    assert && AssertUtils.assertPropertyOf( componentSpacingProperty, 'number' );
    assert && assert( chartTransform instanceof ChartTransform );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );

    options = merge( {
      position: new Vector2( 0, 0 ),
      dragBounds: null, // {Bounds2|null}
      cursor: 'pointer',
      pathOptions: {
        fill: 'yellow'
      },
      richTextOptions: {
        font: FMWConstants.TOOL_LABEL_FONT
      },

      // pdom
      tagName: 'div',
      focusable: true,

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    super( options );

    Property.multilink(
      [ componentSpacingProperty, domainProperty ],
      ( componentSpacing, domain ) => {
        assert && assert( componentSpacing >= 0 );

        // Update width
        this.setMeasuredWidth( chartTransform.modelToViewDeltaX( componentSpacing ) );

        // Update label
        const wavelengthSymbol = ( domain === Domain.SPACE ) ? FMWSymbols.k : FMWSymbols.omega;
        const componentSpacingSymbol = `${wavelengthSymbol}<sub>1</sub>`;
        if ( componentSpacing === 0 ) {

          // Show 'symbol = 0' to make it explicit that the caliper jaws are fully closed.
          this.setLabel( `${componentSpacingSymbol} = 0` );
        }
        else {
          this.setLabel( componentSpacingSymbol );
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
}

fourierMakingWaves.register( 'ComponentSpacingToolNode', ComponentSpacingToolNode );
export default ComponentSpacingToolNode;