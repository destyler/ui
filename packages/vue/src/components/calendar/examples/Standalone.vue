<script setup lang="ts">
import { Calendar } from '~/index'
</script>

<template>
  <Calendar.Root open>
    <Calendar.View view="day">
      <Calendar.Context v-slot="api">
        <Calendar.ViewControl>
          <Calendar.PrevTrigger>Prev</Calendar.PrevTrigger>
          <Calendar.ViewTrigger>
            <Calendar.RangeText />
          </Calendar.ViewTrigger>
          <Calendar.NextTrigger>Next</Calendar.NextTrigger>
        </Calendar.ViewControl>
        <Calendar.Table>
          <Calendar.TableHead>
            <Calendar.TableRow>
              <Calendar.TableHeader v-for="(weekDay, id) in api.weekDays" :key="id">
                {{ weekDay.short }}
              </Calendar.TableHeader>
            </Calendar.TableRow>
          </Calendar.TableHead>
          <Calendar.TableBody>
            <Calendar.TableRow v-for="(week, id) in api.weeks" :key="id">
              <Calendar.TableCell v-for="(day, id) in week" :key="id" :value="day">
                <Calendar.TableCellTrigger>{{ day.day }}</Calendar.TableCellTrigger>
              </Calendar.TableCell>
            </Calendar.TableRow>
          </Calendar.TableBody>
        </Calendar.Table>
      </Calendar.Context>
    </Calendar.View>
    <Calendar.View view="month">
      <Calendar.Context v-slot="api">
        <Calendar.ViewControl>
          <Calendar.PrevTrigger>Prev</Calendar.PrevTrigger>
          <Calendar.ViewTrigger>
            <Calendar.RangeText />
          </Calendar.ViewTrigger>
          <Calendar.NextTrigger>Next</Calendar.NextTrigger>
        </Calendar.ViewControl>
        <Calendar.Table>
          <Calendar.TableBody>
            <Calendar.TableRow v-for="(months, id) in api.getMonthsGrid({ columns: 4, format: 'short' })" :key="id">
              <Calendar.TableCell v-for="(month, id) in months" :key="id" :value="month.value">
                <Calendar.TableCellTrigger>{{ month.label }}</Calendar.TableCellTrigger>
              </Calendar.TableCell>
            </Calendar.TableRow>
          </Calendar.TableBody>
        </Calendar.Table>
      </Calendar.Context>
    </Calendar.View>
    <Calendar.View view="year">
      <Calendar.Context v-slot="api">
        <Calendar.ViewControl>
          <Calendar.PrevTrigger>Prev</Calendar.PrevTrigger>
          <Calendar.ViewTrigger>
            <Calendar.RangeText />
          </Calendar.ViewTrigger>
          <Calendar.NextTrigger>Next</Calendar.NextTrigger>
        </Calendar.ViewControl>
        <Calendar.Table>
          <Calendar.TableBody>
            <Calendar.TableRow v-for="(years, id) in api.getYearsGrid({ columns: 4 })" :key="id">
              <Calendar.TableCell v-for="(year, id) in years" :key="id" :value="year.value">
                <Calendar.TableCellTrigger>{{ year.label }}</Calendar.TableCellTrigger>
              </Calendar.TableCell>
            </Calendar.TableRow>
          </Calendar.TableBody>
        </Calendar.Table>
      </Calendar.Context>
    </Calendar.View>
  </Calendar.Root>
</template>
