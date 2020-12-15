// Copyright 2020, University of Colorado Boulder

/**
 * WavelengthToolNode is the tool used to measure the wavelength of a specific harmonic in the 'Discrete' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import Domain from '../model/Domain.js';

class WavelengthToolNode extends VBox {

  /**
   * @param {ChartTransform} chartTransform
   * @param {Harmonic[]} harmonics
   * @param {Property.<number>} orderProperty
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Property.<boolean>} visibleProperty
   * @param {Bounds2} dragBounds
   * @param {Object} [options]
   */
  constructor( chartTransform, harmonics, orderProperty, domainProperty, visibleProperty, dragBounds, options ) {

    options = merge( {
      spacing: 2, // between label and tool
      cursor: 'pointer'
    }, options );

    super();

    // @private
    this.chartTransform = chartTransform;
    this.harmonic = harmonics[ orderProperty.value ];
    this.viewWavelength = 0;

    // Initialize
    this.update();

    // mutate after initializing, so that transform options work correctly
    this.mutate( options );

    // Update when the range of the associated axis changes. removeListener is not needed.
    chartTransform.changedEmitter.addListener( () => this.update() );

    // Display the wavelength for the selected harmonic
    orderProperty.link( order => {
      this.harmonic = harmonics[ order - 1 ];
      this.viewWavelength = 0; // to force an update, in case 2 harmonics had the same wavelength but different colors
      this.update();
    } );

    // Visibility
    Property.multilink( [ domainProperty, visibleProperty ],
      ( domain, visible ) => {
        this.visible = ( domain !== Domain.TIME ) && visible;
      } );

    // removeInputListener is not needed.
    this.addInputListener( new DragListener( {
      dragBoundsProperty: new Property( dragBounds ),
      translateNode: true
    } ) );
  }

  // @private
  update() {

    // Compute the wavelength in view coordinates
    const modelWavelength = FMWConstants.L / this.harmonic.order;
    const viewWavelength = this.chartTransform.modelToViewDeltaX( modelWavelength );

    // Update if the change is visually noticeable.
    if ( Math.abs( viewWavelength - this.viewWavelength ) > 0.25 ) {

      // Clockwise from upper left.
      const toolShape = new Shape()
        .moveTo( 0, 0 )
        .lineTo( viewWavelength, 0 )
        .lineTo( viewWavelength, 20 )
        .lineTo( viewWavelength - 5, 5 )
        .lineTo( 5, 5 )
        .lineTo( 0, 20 )
        .close();
      const toolNode = new Path( toolShape, {
        fill: this.harmonic.colorProperty,
        stroke: 'black'
      } );

      const labelNode = new RichText( `${FMWSymbols.lambda}<sub>${this.harmonic.order}</sub>`, {
        font: FMWConstants.TOOL_LABEL_FONT
      } );

      this.children = [ labelNode, toolNode ];
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

fourierMakingWaves.register( 'WavelengthToolNode', WavelengthToolNode );
export default WavelengthToolNode;