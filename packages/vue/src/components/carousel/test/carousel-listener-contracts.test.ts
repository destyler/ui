// Keep Vue listener arrays/null, SFC composition, and asChild child/consumer/core
// ordering on the native Chromium path, not only the happy-dom unit project.
// The local event adapter keeps the existing factory for attrs, refs and slots;
// empty asChild slots still have the inherited shared Dynamic limitation. This
// suite does not add a fallback element or change that validation contract.
import './carousel-listener-values.cases'
import './carousel-consumer-composition.cases'
import './carousel-attrs-preservation.cases'
import './carousel-template-listeners.cases'
import './carousel-slot-boundaries.cases'
import './carousel-slot-fallback.cases'
