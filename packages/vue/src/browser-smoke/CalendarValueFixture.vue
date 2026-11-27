<script setup lang="ts">
import type { CalendarFixtureMode } from '../../../../utils/test/browser-smoke/suite'
import { ref, shallowRef } from 'vue'
import { Calendar, parseDate } from '../components/calendar'

const props = defineProps<{ mode: CalendarFixtureMode }>()
const seed = [parseDate('2026-01-15')]
const value = shallowRef<Calendar.DateValue[]>(seed)
const events = ref<string[]>([])
const inline = props.mode.startsWith('inline')
const controlled = props.mode === 'inline-controlled'
const modeProps = props.mode === 'popup-default' ? {} : { inline }
function onValueChange(details: Calendar.ValueChangeDetails) {
  events.value.push(details.value.map(date => date.toString()).join(','))
}
function updateValue(next: Calendar.DateValue[]) {
  if (controlled)
    value.value = next
}
</script>

<template>
  <Calendar.Root v-bind="modeProps" :default-value="seed" :model-value="controlled ? value : undefined" @value-change="onValueChange" @update:model-value="updateValue">
    <output data-testid="calendar-events">{{ JSON.stringify(events) }}</output>
    <output v-if="controlled" data-testid="calendar-model">{{ value.map(date => date.toString()).join(',') }}</output>
    <Calendar.ClearTrigger v-if="inline">
      Clear
    </Calendar.ClearTrigger>
    <template v-else>
      <Calendar.Label>Date</Calendar.Label>
      <Calendar.Control>
        <Calendar.Input />
        <Calendar.Trigger>Open calendar</Calendar.Trigger>
      </Calendar.Control>
    </template>
    <component :is="inline ? 'div' : Calendar.Positioner">
      <component :is="inline ? 'div' : Calendar.Content">
        <Calendar.View view="day">
          <Calendar.Context v-slot="api">
            <Calendar.Table>
              <Calendar.TableHead>
                <Calendar.TableRow>
                  <Calendar.TableHeader v-for="(day, index) in api.weekDays" :key="index">
                    {{ day.short }}
                  </Calendar.TableHeader>
                </Calendar.TableRow>
              </Calendar.TableHead>
              <Calendar.TableBody>
                <Calendar.TableRow v-for="(week, index) in api.weeks" :key="index">
                  <Calendar.TableCell v-for="day in week" :key="day.toString()" :value="day">
                    <Calendar.TableCellTrigger>{{ day.day }}</Calendar.TableCellTrigger>
                  </Calendar.TableCell>
                </Calendar.TableRow>
              </Calendar.TableBody>
            </Calendar.Table>
            <output data-testid="calendar-value">{{ api.value.map(date => date.toString()).join(',') }}</output>
          </Calendar.Context>
        </Calendar.View>
      </component>
    </component>
  </Calendar.Root>
</template>
