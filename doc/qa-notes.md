# Fourier: Making Waves - QA notes

@author Chris Malley (PixelZoom, Inc.)

This document contains notes that may be useful to the PhET QA team when testing this simulation.

## Prerequisites

It is _highly recommended_ that you skim these 2 documents before testing the sim:

* [model.md](https://github.com/phetsims/fourier-making-waves/blob/master/doc/model.md), a high-level description of the
  model
* [implementation-notes.md](https://github.com/phetsims/fourier-making-waves/blob/master/doc/implementation-notes.md),
  notes about the implementation, and how some things are expected to behave

Optionally, skim these documents:

* [Fourier: Making Waves HTML5 design document](https://docs.google.com/document/d/1tOpstoF6xiMcBJEvG1rJ4mVRzsO6UWzek_ntau4rbWc) may clarify features and behavior. Note that the design document may not be completely up-to-date. (The section for
the _Wave Packet_ screen is especially lacking.)
* [Fourier: Making Waves
Interactive Description Design
](https://docs.google.com/document/d/1wOdmPMD704u4OLl9avI9tl2jpTvsAAcZwMaNfnr0qSs/edit) describes some of design aspects that are related to a11y.

## General notes

Sim-specific query parameters (and their documentation) can be found in
[FMWQueryParameters](https://github.com/phetsims/fourier-making-waves/blob/master/js/common/FMWQueryParameters.js).
Query parameters defined as `public: true` are public-facing, and should be tested. Other query parameters are for
internal use, and you should skim them to see if any may be helpful in testing.

Running the simulation with `?log` will print the complete list of query parameters (and their values) to the browser
console, grouped as follows:

* `phet.chipper.queryParmeters` for common-code
* `phet.preloads.phetio.queryParameters` for PhET-iO (`null` unless `?brand=phet-io`)
* `phet.fourierMakingWaves.FMWQueryParameters` are sim-specific

## Discrete screen

The only animation in the sim occurs when the "Function of" combo box is set to "space & time". Use this setting to test
the performance and responsiveness of this screen.

## Wave Game screen

Using the `showAnswers` query parameter will make it easier to test the game. When run with `?showAnswers`, the correct
amplitude values for each challenge will be displayed in red under their associated sliders. Note that `showAnswers` is
a private feature and requires special steps to use it;
see [phetTeamMember.md](https://github.com/phetsims/special-ops/blob/master/doc/phetTeamMember.md).

## Wave Packet screen

This screen is much more performance-intensive that the other screens, due to the number of Fourier components that it
must plot in the Components (middle) chart. The worst-case scenario is when "Component Spacing" is set to π/4, which
results in 97 components. Use that worst-case setting to test the performance and responsiveness of this screen.

Sliders in this screen have interactive tick labels. If you want to quickly (and precisely) move the slider to one of
the tick-label values, click on the label.
