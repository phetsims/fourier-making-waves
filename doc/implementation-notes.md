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

The domain terminology and math symbols that you'll need to navigate the implementation can be found
in [model.md](https://github.com/phetsims/fourier-making-waves/blob/master/doc/model.md).

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

# Charts

The most complicate part of this implementation is the charts. This section provides a high-level roadmap for
understanding how to navigate the implementations. See source-code documentation for more details.

Charts follow the MVC design pattern, and are built on the bamboo framework. The model is responsible for creating data
sets (arrays of Vector2), while the view is responsible for rendering those data sets. A bamboo
[ChartTransform](https://github.com/phetsims/bamboo/blob/master/js/ChartTransform.js) handles the tranform between model
and view coordinate frames.

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

For each concrete chart class, the class name is prefixed with the screen name. For example `DiscreteAmplitudeChart`
, `WaveGameHarmonicsChart`, `WavePacketSumChart`.

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

# PhET-iO

While version 1.0 of this simulation was not released with PhET-iO support, the implementation does have a significant
amount of PhET-iO instrumentation. More importantly, the future needs of PhET-iO heavily influenced the implementation.
Most significantly, we tried to have as little
"dynamic instantiation" as possible, and instead chose a "static elements" approach. See GitHub
issue [#6](https://github.com/phetsims/fourier-making-waves/issues/6) for more details.

# A11y

This simulation implements some aspects of a11y.

Keyboard navigation is implemented, and there are a couple of things to look for:

* option `pdomOrder` specifies traversal order, the order that UI elements are visited as you press the Tab key.
* `KeyboardDragListener`, along with options `tagName` and `focusable`, adds keyboard-based dragging to sim-specific UI
  elements like the measurement tools.
* If all else fails, search for `// pdom`, which generally appears before code that is specific to a11y.

User-interface sounds are implemented, and most of that sound comes from common-code components. As of this writing, the
amplitude sliders have temporary sound support (see
[AudibleSlider.js](https://github.com/phetsims/fourier-making-waves/blob/master/js/common/view/AudibleSlider.js)), but
other Sliders do not support sound.

Voicing and screen reader support are not implemented as of this writing.