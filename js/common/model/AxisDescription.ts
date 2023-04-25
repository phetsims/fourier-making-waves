// Copyright 2020-2023, University of Colorado Boulder

/**
 * AxisDescription is a data structure used to describe the range, grid lines, and ticks for an axis.
 * An array of AxisDescription can be used to describe the zoom levels for an axis, where a zoom level is an index
 * into the array.
 *
 * Units for the fields in an AxisDescription are specific to the axis.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../../dot/js/Range.js';
import fourierMakingWaves from '../../fourierMakingWaves.js';
import Domain from './Domain.js';

type SelfOptions = {
  range: Range; // range of the axis
  gridLineSpacing: number; // spacing between grid lines
  tickMarkSpacing: number; // spacing between tick marks
  tickLabelSpacing: number; // spacing between tick labels
};

type AxisDescriptionOptions = SelfOptions;

export default class AxisDescription {

  public readonly range: Range;
  public readonly gridLineSpacing: number;
  public readonly tickMarkSpacing: number;
  public readonly tickLabelSpacing: number;

  public constructor( providedOptions: AxisDescriptionOptions ) {
    this.range = providedOptions.range;
    this.gridLineSpacing = providedOptions.gridLineSpacing;
    this.tickMarkSpacing = providedOptions.tickMarkSpacing;
    this.tickLabelSpacing = providedOptions.tickLabelSpacing;
  }

  /**
   * Determines whether the range is symmetric about zero. This is a requirement for many of the axes in this sim.
   */
  public hasSymmetricRange(): boolean {
    return this.range.getCenter() === 0;
  }

  /**
   * Gets AxisDescription that is the best-fit for a specified axis range.
   * This is the first entry in axisDescriptions such that range.max >= axisDescription.range.max.
   */
  public static getBestFit( range: Range, axisDescriptions: AxisDescription[] ): AxisDescription {
    const axisDescription = _.find( axisDescriptions, axisDescription => range.max >= axisDescription.range.max );
    assert && assert( axisDescription );
    return axisDescription!;
  }

  /**
   * Determines whether an array of AxisDescription is sorted by descending range length, from most 'zoomed out' to
   * most 'zoomed in'.
   */
  public static isSortedDescending( axisDescriptions: AxisDescription[] ): boolean {
    return _.every( axisDescriptions,
      ( axisDescription, index, axisDescriptions ) =>
        ( index === 0 || axisDescriptions[ index - 1 ].range.getLength() > axisDescription.range.getLength() )
    );
  }

  /**
   * Creates a range for a specified Domain. This is used wherever the AxisDescriptions for the x-axis contain
   * coefficients to be applied to some constant (L, T, PI), depending on which Domain (space or time) is being plotted.
   */
  public createRangeForDomain( domain: Domain, spaceMultiplier: number, timeMultiplier: number ): Range {
    const value = ( domain === Domain.TIME ) ? timeMultiplier : spaceMultiplier;
    const xMin = value * this.range.min;
    const xMax = value * this.range.max;
    return new Range( xMin, xMax );
  }
}

fourierMakingWaves.register( 'AxisDescription', AxisDescription );