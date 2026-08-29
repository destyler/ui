<script lang="ts">
  import ComboboxWithField from '$lib/components/combobox/examples/WithField.svelte'
  import DynamicWithField from '$lib/components/dynamic/examples/WithField.svelte'
  import EditWithField from '$lib/components/edit/examples/WithField.svelte'
  import FileUploadWithField from '$lib/components/file-upload/examples/WithField.svelte'
  import OtpInputWithField from '$lib/components/otp-input/examples/WithField.svelte'
  import SelectWithField from '$lib/components/select/examples/WithField.svelte'
  import SignatureWithField from '$lib/components/signature/examples/WithField.svelte'
  import SwitchWithField from '$lib/components/switch/examples/WithField.svelte'
</script>

<section data-field-contract="combobox"><ComboboxWithField /></section>
<section data-field-contract="dynamic"><DynamicWithField /></section>
<section data-field-contract="edit"><EditWithField /></section>
<section data-field-contract="file-upload"><FileUploadWithField /></section>
<section data-field-contract="otp-input"><OtpInputWithField /></section>
<section data-field-contract="select"><SelectWithField /></section>
<section data-field-contract="signature"><SignatureWithField /></section>
<section data-field-contract="switch"><SwitchWithField /></section>
