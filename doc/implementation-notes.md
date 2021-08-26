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
* [Fourier: Making Waves HTML5](https://docs.google.com/document/d/1tOpstoF6xiMcBJEvG1rJ4mVRzsO6UWzek_ntau4rbWc), the design document (which may be out of date)

## Terminology

The domain terminology that you'll need to navigate the implementation is found in [model.md](https://github.com/phetsims/fourier-making-waves/blob/master/doc/model.md). 

Additional terms used in the implementation:

## General Consideration

This section describes how this sim addresses implementation considerations that are typically encountered in PhET sims.

**Model-View Transform**

TODO

**Query Parameters**

Query parameters are used to enable sim-specific features. Sim-specific query parameters are documented in
[FourierMakingWavesQueryParameters](https://github.com/phetsims/natural-selection/blob/master/js/common/FourierMakingWavesQueryParameters.js). 

**Assertions**

The sim makes heavy use of `assert` and [AssertUtils](https://github.com/phetsims/phetcommon/blob/master/js/AssertUtils.js) 
to verify pre/post assumptions and perform type checking. This sim performs type-checking for almost all function 
arguments via `assert` (but it's not a requirement that type-checking is done everywhere). If you are making 
modifications to this sim, do so with assertions enabled via the `ea` query parameter.

**Logging**

The sim makes heavy use of logging via `phet.log`. If you are making modifications to this sim, or trying to understand 
its behavior, do so with logging enabled via the `log` query parameter.

**Memory Management** 

* **Dynamic allocation**: Most things in this sim are allocated at startup, and exist for the lifetime of the
  simulation. The exceptions to that are: Vector2, FourierComponent

* **Pooling**: TODO describe Vector2 pooling

* **Listeners**: Unless otherwise noted in the code, all used of `link`, `addListener`, etc. do not need a corresponding
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

Charts follow the MVC design pattern, and are built on the bamboo framework. The model is responsible for creating data
sets, while the view is responsible for rendering those data sets.

All 3 screens share a core set of base classes:
`DomainChart`, `DomainChartNode`, and `FMWChartNode`.

The _Discrete_ and _Wave Game_ screens share additional base classes, some of which are subclasses of the core base
classes:
`AmplitudesChart`, `HarmonicsChart`, `SumChart`,
`AmplitudesChartNode`, `HarmonicsChartNode`, and `SumChartNode`.

The model class hierarchy is:

```
AmplitudesChart
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
    ↳ AmplitudesChartNode
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

We chose a "static elements" approach, see GitHub issue [#6](https://github.com/phetsims/fourier-making-waves/issues/6).