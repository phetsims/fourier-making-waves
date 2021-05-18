// Copyright 2021, University of Colorado Boulder

/**
 * FMWZoomButtonGroup is a zoom button group for this sim. This sim describes zoom levels as {AxisDescription[]},
 * while the superclass PlusMinusZoomButtonGroup needs a NumberProperty.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import PlusMinusZoomButtonGroup from '../../../../scenery-phet/js/PlusMinusZoomButtonGroup.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import AxisDescription from '../model/AxisDescription.js';

class FMWZoomButtonGroup extends PlusMinusZoomButtonGroup {

  /**
   * @param {Property.<AxisDescription>} axisDescriptionProperty
   * @param {Object} [options]
   */
  constructor( axisDescriptionProperty, options ) {
    assert && AssertUtils.assertPropertyOf( axisDescriptionProperty, AxisDescription );

    const axisDescriptions = axisDescriptionProperty.validValues;
    assert && assert( axisDescriptions, 'axisDescriptionProperty should have been defined with validValues option' );

    // PlusMinusZoomButtonGroup needs a NumberProperty, create it here. Its value is an index into axisDescriptions.
    const zoomLevelProperty = new NumberProperty( axisDescriptions.indexOf( axisDescriptionProperty.value ), {
      range: new Range( 0, axisDescriptions.length - 1 ),
      isValidValue: value => value >= 0 && value < axisDescriptions.length
    } );

    // Keep axisDescriptionProperty and zoomLevelProperty in sync.
    axisDescriptionProperty.lazyLink( axisDescription => {
      zoomLevelProperty.value = axisDescriptions.indexOf( axisDescription );
    } );
    zoomLevelProperty.lazyLink( zoomLevel => {
      axisDescriptionProperty.value = axisDescriptions[ zoomLevel ];
    } );

    super( zoomLevelProperty, options );
  }
}

fourierMakingWaves.register( 'FMWZoomButtonGroup', FMWZoomButtonGroup );
export default FMWZoomButtonGroup;