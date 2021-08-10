// Copyright 2021, University of Colorado Boulder

/**
 * ComponentSpacingToolNode is the tool for measuring component spacing in the 'Wave Packet' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
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
      pathOptions: {
        fill: 'yellow'
      },
      richTextOptions: {
        font: FMWConstants.TOOL_LABEL_FONT
      }
    }, options );

    super( options );

    Property.multilink(
      [ componentSpacingProperty, domainProperty ],
      ( componentSpacing, domain ) => {
        assert && assert( componentSpacing >= 0 );
        this.setMeasuredWidth( chartTransform.modelToViewDeltaX( componentSpacing ) );
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

    // Dragging, constrained to bounds.
    this.addInputListener( new DragListener( {
      translateNode: true,
      dragBoundsProperty: dragBoundsProperty
    } ) );
  }
}

fourierMakingWaves.register( 'ComponentSpacingToolNode', ComponentSpacingToolNode );
export default ComponentSpacingToolNode;