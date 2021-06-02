// Copyright 2021, University of Colorado Boulder

/**
 * ComponentSpacingControl displays the component spacing value, and allows it to be changed via a slider.
 * We are unable to use NumberControl here because the display format needs to change to match the domain
 * (space vs time).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FMWConstants from '../../common/FMWConstants.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import Domain from '../../common/model/Domain.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import fourierMakingWavesStrings from '../../fourierMakingWavesStrings.js';
import ComponentSpacingSlider from './ComponentSpacingSlider.js';

class ComponentSpacingControl extends VBox {

  /**
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {DerivedProperty} componentSpacingProperty
   * @param {Property.<number>} componentSpacingIndexProperty
   * @param {Object} [options]
   */
  constructor( domainProperty, componentSpacingProperty, componentSpacingIndexProperty, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );
    assert && assert( componentSpacingProperty instanceof DerivedProperty );
    assert && AssertUtils.assertPropertyOf( componentSpacingIndexProperty, 'number' );

    options = merge( {

      // VBox options
      spacing: 5,
      align: 'left',

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    const valueNode = new RichText( '', {
      font: FMWConstants.CONTROL_FONT,
      tandem: options.tandem.createTandem( 'valueNode' )
    } );

    const slider = new ComponentSpacingSlider( componentSpacingIndexProperty, {
      tandem: options.tandem.createTandem( 'slider' )
    } );

    assert && assert( !options.children );
    options.children = [ valueNode, slider ];

    super( options );

    // Update the displayed value for component spacing.
    Property.multilink(
      [ domainProperty, componentSpacingProperty ],
      ( domain, componentSpacing ) => {
        const value = Utils.roundToInterval( componentSpacing, 0.01 );
        if ( domain === Domain.SPACE ) {
          valueNode.text = StringUtils.fillIn( fourierMakingWavesStrings.k1EqualsValue, {
            k: FMWSymbols.k,
            value: value
          } );
        }
        else {
          valueNode.text = StringUtils.fillIn( fourierMakingWavesStrings.omega1EqualsValue, {
            omega: FMWSymbols.omega,
            value: value
          } );
        }
      } );
  }
}

fourierMakingWaves.register( 'ComponentSpacingControl', ComponentSpacingControl );
export default ComponentSpacingControl;