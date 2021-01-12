// Copyright 2020, University of Colorado Boulder

/**
 * PeriodToolNode is the tool used to measure the period of a specific harmonic in the 'time' domain.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import AssertUtils from '../../../../phetcommon/js/AssertUtils.js';
import FMWSymbols from '../../common/FMWSymbols.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import Domain from '../model/Domain.js';
import WidthToolNode from './WidthToolNode.js';

class PeriodToolNode extends WidthToolNode {

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

    super( FMWSymbols.T,
      chartTransform, harmonics, emphasizedHarmonics, orderProperty, dragBoundsProperty,
      harmonic => harmonic.period,
      options );

    // Visibility, unmultilink is not needed.
    Property.multilink( [ selectedProperty, domainProperty ],
      ( selected, domain ) => {
        this.interruptDrag();
        this.visible = ( selected && ( domain === Domain.TIME ) );
      } );
  }
}

fourierMakingWaves.register( 'PeriodToolNode', PeriodToolNode );
export default PeriodToolNode;