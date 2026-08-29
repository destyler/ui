<script lang="ts">
  import { Field } from '../index'
</script>

<Field.Root invalid required>
  <Field.Label>
    Label
    <Field.RequiredIndicator />
  </Field.Label>
  <Field.Input />
  <Field.Select>
    <option value="1">Option 1</option>
  </Field.Select>
  <Field.Textarea />
  <Field.HelperText>Some additional Info</Field.HelperText>
  <Field.ErrorText>Error Info</Field.ErrorText>
</Field.Root>
