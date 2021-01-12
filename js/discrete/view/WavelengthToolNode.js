// Copyright 2020, University of Colorado Boulder

/**
 * WavelengthToolNode is the tool used to measure the wavelength of a specific harmonic in the 'space' and
 * 'space & time' domains.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import Domain from '../model/Domain.js';
import WidthToolNode from './WidthToolNode.js';

class WavelengthToolNode extends WidthToolNode {

  /**
   * @param {ChartTransform} chartTransform
   * @param {Harmonic[]} harmonics
   * @param {ObservableArrayDef.<Harmonic>} emphasizedHarmonics
   * @param {Property.<number>} orderProperty - order of the harmonic to display
   * @param {Property.<Bounds2>} dragBoundsProperty
   * @param {Property.<boolean>} selectedProperty - whether the tool is selected
   * @param {EnumerationProperty.<Domain>} domainProperty
   * @param {Object} [options]
   */
  constructor( chartTransform, harmonics, emphasizedHarmonics, orderProperty, dragBoundsProperty, selectedProperty, domainProperty, options ) {

    // other args will be validated by super
    assert && AssertUtils.assertPropertyOf( selectedProperty, 'boolean' );
    assert && AssertUtils.assertEnumerationPropertyOf( domainProperty, Domain );

    super( FMWSymbols.lambda,
      chartTransform, harmonics, emphasizedHarmonics, orderProperty, dragBoundsProperty,
      harmonic => harmonic.wavelength,
      options );

    // Visibility, unmultilink is not needed.
    Property.multilink( [ selectedProperty, domainProperty ],
      ( selected, domain ) => {
        this.interruptDrag();
        this.visible = ( selected && ( domain === Domain.SPACE || domain === Domain.SPACE_AND_TIME ) );
      } );
  }
}

fourierMakingWaves.register( 'WavelengthToolNode', WavelengthToolNode );
export default WavelengthToolNode;