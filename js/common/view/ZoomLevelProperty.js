// Copyright 2021, University of Colorado Boulder

/**
 * ZoomLevelProperty is a NumberProperty that synchronizes itself with a Property.<AxisDescription>.
 * This sim uses AxisDescription to describe the properties of an axis at a particular zoom level.
 * NumberProperty is required by PlusMinusZoomButtonGroup, the common-code component used by this
 * sim for zoom buttons.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import AxisDescription from '../model/AxisDescription.js';

class ZoomLevelProperty extends NumberProperty {

  /**
   * @param {Property.<AxisDescription>} axisDescriptionProperty
   * @param {Object} [options]
   */
  constructor( axisDescriptionProperty, options ) {
    assert && AssertUtils.assertPropertyOf( axisDescriptionProperty, AxisDescription );

    const axisDescriptions = axisDescriptionProperty.validValues;
    assert && assert( axisDescriptions, 'axisDescriptionProperty should have been defined with validValues option' );

    super( axisDescriptions.indexOf( axisDescriptionProperty.value ), {
      range: new Range( 0, axisDescriptions.length - 1 ),
      isValidValue: value => value >= 0 && value < axisDescriptions.length
    } );

    // Keep axisDescriptionProperty and zoomLevelProperty in sync, while avoiding reentrant behavior.
    let isSynchronizing = false;
    axisDescriptionProperty.lazyLink( axisDescription => {
      if ( !isSynchronizing ) {
        isSynchronizing = true;
        this.value = axisDescriptions.indexOf( axisDescription );
        isSynchronizing = false;
      }
    } );
    this.lazyLink( zoomLevel => {
      if ( !isSynchronizing ) {
        isSynchronizing = true;
        axisDescriptionProperty.value = axisDescriptions[ zoomLevel ];
        isSynchronizing = false;
      }
    } );
  }
}

fourierMakingWaves.register( 'ZoomLevelProperty', ZoomLevelProperty );
export default ZoomLevelProperty;