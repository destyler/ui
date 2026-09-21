import { Carousel } from '@destyler-ui/solid/carousel'
import { Index } from 'solid-js'

const images = Array.from({ length: 5 }, (_, i) => `https://picsum.photos/seed/${i + 1}/500/300`)

export function InitialPage() {
  return (
    <Carousel.Root defaultPage={2}>
