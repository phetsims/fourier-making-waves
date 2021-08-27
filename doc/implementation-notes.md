# Fourier: Making Waves - implementation notes

@author Chris Malley (PixelZoom, Inc.)

This document contains notes related to the implementation of Fourier: Making Waves. 
This is not an exhaustive description of the implementation.  The intention is 
to provide a high-level overview, and to supplement the internal documentation 
(source code comments) and external documentation (design documents). 

Before reading this document, please read:
* [model.md](https://github.com/phetsims/fourier-making-waves/blob/master/doc/model.md), a high-level description of the simulation model

In addition to this document, you are encouraged to read:

* [PhET Development Overview](https://github.com/phetsims/phet-info/blob/master/doc/phet-development-overview.md)
* [PhET Software Design Patterns](https://github.com/phetsims/phet-info/blob/master/doc/phet-software-design-patterns.md)
* [Fourier: Making Waves HTML5](https://docs.google.com/document/d/1tOpstoF6xiMcBJEvG1rJ4mVRzsO6UWzek_ntau4rbWc), the
  design document (which may be out of date)

## Terminology & Symbols

The terminology and math symbols that you'll need to navigate the implementation can be found
in [model.md](https://github.com/phetsims/fourier-making-waves/blob/master/doc/model.md).

_Domain_ refers to the independent variables in the equations that drive the model. The domains in this sim are '
space', 'time', and 'space & time'. See
also [Domain.js](https://github.com/phetsims/fourier-making-waves/blob/master/js/common/model/Domain.js).

_Series type_ refers to where we have a _sine series_ or a _cosine series_. See
also [SeriesType.js](https://github.com/phetsims/fourier-making-waves/blob/master/js/common/model/SeriesType.js).

In the **Wave Game** screen, the user is attempting to solved _challenges_. Each challenge has 2 Fourier series:

* _answer series_ or _answer_ - the pink waveform, the Fourier series that the user is trying to match
* _guess series_ or _guess_ - the Fourier series for the user's guess

Some of the charts in this simulation are not labeled, and some of them have verbose titles. So rather than refer to
charts by their exact titles, we use these names:

* Amplitudes chart - the top chart in all 3 screens
* Harmonics chart - the middle chart in the **Discrete** and **Wave Game** screens
* Components chart - the middle chart in the **Wave Packet** screen
* Sum chart - the bottom chart in all 3 screens

## General Consideration

This section describes how this sim addresses implementation considerations that are typically encountered in PhET sims.

**Model-View Transform**

Every chart in this simulation has a model-view transform, implement using bamboo's
[ChartTransform](https://github.com/phetsims/bamboo/blob/master/js/ChartTransform.js).

The more typical ModelViewTransform that is found in most PhET simulations is not used in this simulation.

**Query Parameters**

Query parameters are used to enable sim-specific features. Sim-specific query parameters are documented in
[FMWQueryParameters](https://github.com/phetsims/fourier-making-waves/blob/master/js/common/FMWQueryParameters.js).

**Assertions**

The sim makes heavy use of `assert`
and [AssertUtils](https://github.com/phetsims/phetcommon/blob/master/js/AssertUtils.js)
to verify pre/post assumptions and perform type checking. This sim performs type-checking for almost all function
arguments via `assert` (but it's not a requirement that type-checking is done everywhere). If you are making 
modifications to this sim, do so with assertions enabled via the `ea` query parameter.

**Logging**

The sim makes heavy use of logging via `phet.log`. If you are making modifications to this sim, or trying to understand 
its behavior, do so with logging enabled via the `log` query parameter.

**Memory Management**

* **Dynamic allocation**: Most things in this sim are allocated at startup, and exist for the lifetime of the
  simulation. The exceptions to that are: `Vector2`
  and [FourierComponent](https://github.com/phetsims/fourier-making-waves/blob/master/js/wavepacket/model/FourierComponent.js)
  .

* **Listeners**: Unless otherwise noted in the code, all uses of `link`, `addListener`, etc. do NOT need a corresponding
  `unlink`, `removeListener`, etc.

* **dispose:** All classes have a `dispose` method. Sim-specific classes whose instances exist for the lifetime of the
  sim are not intended to be disposed, and their `dispose` implementation looks like this:

```js
/**
 * @public
 * @override
 */
dispose()
{
  assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  super.dispose();
}
```

## Discrete screen

The main model elements of this screen are
[FourierSeries](https://github.com/phetsims/fourier-making-waves/blob/master/js/common/model/FourierSeries.js)
and [Harmonic](https://github.com/phetsims/fourier-making-waves/blob/master/js/common/model/Harmonic.js). To avoid
PhET-iO issues related to creating dynamic elements, a single `FourierSeries` is created with the maximum (11) number
of `Harmonic` instances. The "Harmonics" spinner determines how many of the Harmonics are relevant. Those that are not
relevant have their amplitudes set to zero, and are ignored.

Some useful code references:

* [getAmplitudeFunction.js](https://github.com/phetsims/fourier-making-waves/blob/master/js/common/model/getAmplitudeFunction.js)
  - the equations for computing amplitude values
* [Harmonic](https://github.com/phetsims/fourier-making-waves/blob/master/js/common/model/Harmonic.js) `createDataSetStatic`
  - creates a data set for plotting a harmonic
* [FourierSeries](https://github.com/phetsims/fourier-making-waves/blob/master/js/common/model/FourierSeries.js) `createSumDataSet`
  - create a data set for the sum of the harmonics
* [Waveform.js](https://github.com/phetsims/fourier-making-waves/blob/master/js/discrete/model/Waveform.js) -
  approximations and actual waveforms for presets

A quick walkthrough of the control panel:

The combo box labeled "Waveform:" selects a preset waveform, which corresponds to a Fourier series whose harmonics have
amplitudes that match that waveform. Changing any amplitude while a preset is selected results in the combo box
selection changing to "custom". Note that the
"Infinite Harmonics" feature is not available for the "wave packet" selection, so its checkbox is disabled below the Sum
chart.

Changing the "Harmonics" spinner in the control panel changes the number of harmonics in the Fourier series. More
harmonics results in a better approximation of the desired waveform (or a preset waveform, if one is selected).

The **Fourier Series** section of the control panel also has controls (checkbox and slider) for the sound that is
associated with the Fourier series. While this control is on, other sounds in this screen will be "ducked" - their
perceived volume will be reduced by ~50%. If you switch to another screen while this control is on, the Fourier series
sound will stop; it will resume when you switch back to this screen. This entire control will be disabled when sound is
turned off in the navigation bar. The sound generator can be found in
[FourierSoundGenerator.js](https://github.com/phetsims/fourier-making-waves/blob/master/js/discrete/view/FourierSoundGenerator.js)
.

The combo box labeled "Function of:" selects the domain. The **Discrete** screen is the only screen that supports the '
space & time' domain, which results in animation of waveforms.

The radio button group labeled "Series:" selects the series type, which determines whether the underlying model
equations use `sin` or `cos`.

In the **Measurement Tools** section of the control panel, controls are enabled/disabled in relation to the selected
domain. Wavelength is relevant for 'space' and 'space & time', while Period is relevant for 'time' and 'space & time'.

## Wave Game screen

The **Wave Game** screen is built on the same model and view components as the **Discrete**
screen.

Some differences include:

* It adds an additional FourierSeries to the model, for the user's guess (the "guess series").
* Domain is fixed at 'space'.
* The x-axis scale is fixed; there are no x-axis zoom buttons.

The UI for selecting a level is implemented in
[WaveGameLevelSelectionNode](https://github.com/phetsims/fourier-making-waves/blob/master/js/waveGame/view/WaveGameLevelSelectionNode.js)
.

Each game level
has [WaveGameLevel](https://github.com/phetsims/fourier-making-waves/blob/master/js/waveGame/model/WaveGameLevel.js)
and [WaveGameLevelNode](https://github.com/phetsims/fourier-making-waves/blob/master/js/waveGame/view/WaveGameLevelNode.js)
.

A challenge is a set of harmonic amplitudes that describe a waveform. Amplitudes for a challenge are randomly generated
by [AmplitudesGenerator](https://github.com/phetsims/fourier-making-waves/blob/master/js/waveGame/model/AmplitudesGenerator.js)
. These amplitudes are then used to populate the Harmonic amplitudes in the answer series. The amplitudes in the guess
series are set to zero. As the user changes amplitude sliders, they are changing the guess series. If they press the "
Check Answer" while the amplitudes of the answer and guess are the same, they will have solved the challenge.

After a challenge has been solved (or the "Show Answer" button has been pressed), the user can continue to experiment
with the challenge. Whenever the guess matches the answer, a smiley face will be shown.

Pressing the "New Waveform" button moves to a new challenge.

## Wave Packet screen

At it's core, the model for the **Wave Packet** screen relies on the same code used by the other screens to compute
component (harmonic) waveforms: `Harmonic.createDataSetStatic`.

But this screen has performance issues not found in the other 2 screens. In the worst case (with Component Spacing set
to π/4) there are 97 Fourier components. So this screen needed a lightweight model, not the richer model
of `FourierSeries` and `Harmonic`
used in the other screens.

The main model elements in this screen are:

* [FourierComponent](https://github.com/phetsims/fourier-making-waves/blob/master/js/wavepacket/model/FourierComponent.js)
  , a lightweight data structure that describes each component's wave number and amplitude (similar to Vector2)
* [Wave Packet](https://github.com/phetsims/fourier-making-waves/blob/master/js/wavepacket/model/WavePacket.js) - has
  Properties that correspond to what you see in the control panel, and an associated array of `FourierComponent`

## Charts

The most complicate part of this implementation is the charts. This section provides a high-level roadmap for
understanding how to navigate the implementations. See source-code documentation for more details.

Charts follow the MVC design pattern, and are built on the bamboo framework. The model is responsible for creating data
sets (arrays of Vector2), while the view is responsible for rendering those data sets. A bamboo
[ChartTransform](https://github.com/phetsims/bamboo/blob/master/js/ChartTransform.js) handles the tranform between model
and view coordinate frames.

Each chart has a model class, and a corresponding view class. The model class contains all information that is needed by
the view class. For each concrete class, the class name is prefixed with the screen name. For
example `DiscreteAmplitudeChart` , `WaveGameHarmonicsChart`,
`WavePacketSumChart`.

With the exception of the Amplitudes chart in the **Discrete** and **Wave Game** screen, all charts share the same "
core" base
classes: [DomainChart](https://github.com/phetsims/fourier-making-waves/blob/master/js/common/model/DomainChart.js)
(model)
and [DomainChartNode](https://github.com/phetsims/fourier-making-waves/blob/master/js/common/view/DomainChartNode.js)
(view).

The **Discrete** and **Wave Game** screens share additional (model and view) subclasses:

* [InteractiveAmplitudesChart](https://github.com/phetsims/fourier-making-waves/blob/master/js/common/model/InteractiveAmplitudesChart.js)
  and
  [InteractiveAmplitudesChartNode](https://github.com/phetsims/fourier-making-waves/blob/master/js/common/view/InteractiveAmplitudesChartNode.js)
* [HarmonicsChart](https://github.com/phetsims/fourier-making-waves/blob/master/js/common/model/HarmonicsChart.js) and
  [HarmonicsChartNode](https://github.com/phetsims/fourier-making-waves/blob/master/js/common/view/HarmonicsChartNode.js)
* [SumChart](https://github.com/phetsims/fourier-making-waves/blob/master/js/common/model/SumChart.js) and
  [SumChartNode](https://github.com/phetsims/fourier-making-waves/blob/master/js/common/view/SumChartNode.js)

The **Wave Packet** screen is quite different from the other screens. It shares the core base classes with the other
screens, but does not use the above subclasses.

To summarize, the model class hierarchy is:

```
InteractiveAmplitudesChart
    ↳ DiscreteAmplitudesChart
    ↳ WaveGameAmplitudesChart

DomainChart
    ↳ HarmonicsChart
        ↳ DiscreteHarmonicsChart
        ↳ WaveGameHarmonicsChart
    ↳ SumChart
        ↳ DiscreteSumChart
        ↳ WaveGameSumChart
    ↳ WavePacketAmplitudesChart
    ↳ WavePacketComponentsChart
    ↳ WavePacketSumChart
```

The view class hierarchy is:

```
Node
    ↳ InteractiveAmplitudesChartNode
        ↳ DiscreteAmplitudesChartNode
        ↳ WaveGameAmplitudesChartNode
    ↳ DomainChartNode
        ↳ HarmonicsChartNode
            ↳ DiscreteHarmonicsChartNode
            ↳ WaveGameHarmonicsChartNode
        ↳ SumChartNode
            ↳ DiscreteSumChartNode
            ↳ WaveGameSumChartNode
        ↳ WavePacketAmplitudesChartNode
        ↳ WavePacketComponentsChartNode
        ↳ WavePacketSumChartNode
```

## PhET-iO

While version 1.0 of this simulation was not released with PhET-iO support, the implementation does have a significant
amount of PhET-iO instrumentation. More importantly, the future needs of PhET-iO heavily influenced the implementation.
Most significantly, we avoided "dynamic elements" where possible, and instead favored a "static elements"
approach. See GitHub issue [#6](https://github.com/phetsims/fourier-making-waves/issues/6) for more details.

## A11y

This simulation implements some aspects of a11y.

Keyboard navigation is implemented, and there are a couple of things to look for:

* option `pdomOrder` specifies traversal order, the order that UI elements are visited as you press the Tab key.
* `KeyboardDragListener`, along with options `tagName` and `focusable`, adds keyboard-based dragging to sim-specific UI
  elements like the measurement tools.
* Classes with "KeyboardHelpContent" in their name implement keyboard-help control, displayed by pressing the keyboard
  button in the navigation bar.
* If all else fails, search for `// pdom`, which generally appears before code that is specific to a11y.

User-interface sounds are implemented, and most of that sound comes from common-code components. As of this writing, the
amplitude sliders have temporary sound support (see
[AudibleSlider.js](https://github.com/phetsims/fourier-making-waves/blob/master/js/common/view/AudibleSlider.js)), but
other Sliders do not support sound.

Voicing and screen reader support are not implemented as of this writing.