# Fourier: Making Waves - QA notes

@author Chris Malley (PixelZoom, Inc.)

This document contains notes that may be useful to the PhET QA team when testing this simulations.

Read or skim the following documents before testing the sim:

* [Fourier: Making Waves HTML5](https://docs.google.com/document/d/1tOpstoF6xiMcBJEvG1rJ4mVRzsO6UWzek_ntau4rbWc), the
  design document (may be out of date)
* [model.md](https://github.com/phetsims/fourier-making-waves/blob/master/doc/model.md), a high-level description of the
  model
* [implementation-notes.md](https://github.com/phetsims/fourier-making-waves/blob/master/doc/implementation-notes.md),
  notes about implementation

## General

Sim-specific query parameters (and their documentation) can be found in
[FMWQueryParameters](https://github.com/phetsims/fourier-making-waves/blob/master/js/common/FMWQueryParameters.js). The
query parameters defined as `public: true` are public-facing, and should be tested. The other query parameters are for
internal used, and you should skim them to see if any may be helpful in testing.

## Discrete screen

The only animation in the sim occurs when the "Function of" combo box is set to "space & time". Use this setting to test
the performance and responsiveness of this screen.

## Wave Game screen

When run with `?showAnswers`, the correct amplitude values for each challenge will be displayed in red under their
associated sliders. `showAnswers` is a private feature and required special steps to use it;
see [phetTeamMember.md](https://github.com/phetsims/special-ops/blob/master/doc/phetTeamMember.md).

## Wave Packet screen

This screen is much more performance-intensive that the other screens, due to the number of Fourier components that it
must plot in the Components (middle) chart. The worst-case scenario is when Component Spacing is set to π/4, which
results in 97 components. Use this setting to test the performance and responsiveness of this screen.