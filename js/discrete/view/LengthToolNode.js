// Copyright 2020, University of Colorado Boulder

/**
 * LengthToolNode is the base class for tools used to measure a quantity of a harmonic that has a length.
 * Responsible for synchronizing with the selected harmonic, and for its own visibility.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import FMWConstants from '../../common/FMWConstants.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import Domain from '../model/Domain.js';

class LengthToolNode extends VBox {

  /**
   * @param {ChartTransform} chartTransform
   * @param {string} symbol
   * @param {Harmonic[]} harmonics
   * @param {Property.<number>} orderProperty - order of the harmonic to display
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Property.<boolean>} visibleProperty
   * @param {Bounds2} dragBounds
   * @param {function(harmonic:Harmonic):number} getModelValue
   * @param {function(domain:Domain, visible:boolean)} getVisible
   * @param {Object} [options]
   */
  constructor( chartTransform, symbol, harmonics, orderProperty, domainProperty, visibleProperty, dragBounds,
               getModelValue, getVisible, options ) {

    assert && assert( chartTransform instanceof ChartTransform, 'invalid chartTransform' );
    assert && assert( Array.isArray( harmonics ), 'invalid harmonics' );
    assert && AssertUtils.assertPropertyOf( orderProperty, 'number' );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && AssertUtils.assertPropertyOf( visibleProperty, 'boolean' );
    assert && assert( dragBounds instanceof Bounds2, 'invalid dragBounds' );
    assert && assert( typeof getModelValue === 'function', 'invalid getModelValue' );
    assert && assert( typeof getVisible === 'function', 'invalid getVisible' );

    options = merge( {
      spacing: 2, // between label and tool
      cursor: 'pointer'
    }, options );

    super();

    // @private
    this.chartTransform = chartTransform;
    this.symbol = symbol;
    this.getModelValue = getModelValue;
    this.harmonic = harmonics[ orderProperty.value ];
    this.viewValue = 0;

    // Initialize
    this.update();

    // mutate after initializing, so that transform options work correctly
    this.mutate( options );

    // Update when the range of the associated axis changes. removeListener is not needed.
    chartTransform.changedEmitter.addListener( () => this.update() );

    // Display the wavelength for the selected harmonic. unlink is not needed.
    orderProperty.link( order => {
      this.harmonic = harmonics[ order - 1 ];
      this.viewValue = 0; // to force an update, in case 2 harmonics had the same value but different colors
      this.update();
    } );

    // Visibility, unmultilink is not needed.
    Property.multilink( [ domainProperty, visibleProperty ],
      ( domain, visible ) => {
        this.interruptSubtreeInput();
        this.visible = getVisible( domain, visible );
      } );

    // removeInputListener is not needed.
    this.addInputListener( new DragListener( {
      dragBoundsProperty: new Property( dragBounds ),
      translateNode: true
    } ) );
  }

  // @private
  update() {

    // Compute the value in view coordinates
    const modelValue = this.getModelValue( this.harmonic );
    const viewValue = this.chartTransform.modelToViewDeltaX( modelValue );

    // Update if the change is visually noticeable.
    if ( Math.abs( viewValue - this.viewValue ) > 0.25 ) {

      // Clockwise from upper left.
      const toolShape = new Shape()
        .moveTo( 0, 0 )
        .lineTo( viewValue, 0 )
        .lineTo( viewValue, 20 )
        .lineTo( viewValue - 5, 5 )
        .lineTo( 5, 5 )
        .lineTo( 0, 20 )
        .close();
      const toolNode = new Path( toolShape, {
        fill: this.harmonic.colorProperty,
        stroke: 'black'
      } );

      const labelNode = new RichText( `${this.symbol}<sub>${this.harmonic.order}</sub>`, {
        font: FMWConstants.TOOL_LABEL_FONT
      } );

      this.children = [ labelNode, toolNode ];

      //TODO does position need to be adjusted?
    }
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

fourierMakingWaves.register( 'LengthToolNode', LengthToolNode );
export default LengthToolNode;