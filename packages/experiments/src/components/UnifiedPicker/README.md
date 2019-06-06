# Unified Pickers

This experimental pickers package takes a different approach to managing heavily-stateful components.

Rather than provide a hybrid component that can act as either stateful or non-stateful, it breaks up components into controlled & uncontrolled complements. This avoids edge-cases around a component changing between uncontrolled / controlled over the course of its lifetime, and also avoids issues around unclear calling conventions in the API (e.g. what callbacks can the consumer expect to receive when using the component in a given mode?)

This has a few other benefits

- Users only pay for what they use -- if I'm consuming a controlled component directly or indirectly, I shouldn't have to take the data-weight of the class
- By removing dependencies between expected callbacks & internal state manipulatins, sharing sharing state between components via hooks becomes a lot more straightforward

## UnifiedPickerView and Composing UI.

In order to allow for ~ maximum customizability ~ under the same state management logic, the UnifiedPicker is written to allow any consumer to specify a view component, so long as it adheres to the API that the UnifiedPicker is expecting.

This is a little intense for most use cases. We want most users to have a sensible default going in. To this end, a default view (DefaultUnifiedPickerView) is provided, as well as a few pre-composed examples of how to use it (see UnifiedPeoplePicker, UnifiedTagPicker for examples)
