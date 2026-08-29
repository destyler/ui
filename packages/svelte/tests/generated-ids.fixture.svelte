<script lang="ts">
  import {
    AspectRatio,
    Avatar,
    Breadcrumbs,
    Calendar,
    Carousel,
    Checkbox,
    Clipboard,
    Collapse,
    Collapsible,
    ColorPicker,
    Combobox,
    Dialog,
    Dynamic,
    Edit,
    Field,
    Fieldset,
    FileUpload,
    FloatingPanel,
    HoverCard,
    Menu,
    NavigationMenu,
    NumberInput,
    OtpInput,
    Pagination,
    Popover,
    Progress,
    QrCode,
    Radio,
    ScrollArea,
    Select,
    Separator,
    Signature,
    Slider,
    Splitter,
    Steps,
    Switch,
    Tabs,
    Timer,
    ToggleGroup,
    Tooltip,
    Tree,
    createListCollection,
    createTreeCollection,
  } from '$lib'
  import LabelIdFixture from './label-id.fixture.svelte'
  import TourIdFixture from './tour-id.fixture.svelte'

  const listCollection = createListCollection({ items: ['item'] })
  const breadcrumbsItems = [{ id: 'home', label: 'Home', href: '/' }]

  const collection = createTreeCollection({
    nodeToValue: node => node.id,
    nodeToString: node => node.name,
    rootNode: {
      id: 'ROOT',
      name: '',
      children: [],
    },
  })

  const splitterSize = [
    { id: 'a', size: 50 },
    { id: 'b', size: 50 },
  ]
</script>

{#each [0, 1] as instance}
  <AspectRatio.Root ratio={4 / 3} data-id-contract="aspect-ratio" data-instance={instance} />
  <Avatar.Root data-id-contract="avatar" data-instance={instance} />
  <Breadcrumbs.Root items={breadcrumbsItems} data-id-contract="breadcrumbs" data-instance={instance} />
  <Calendar.Root data-id-contract="calendar" data-instance={instance} />
  <Carousel.Root data-id-contract="carousel" data-instance={instance}>
    <Carousel.ItemGroup>
      <Carousel.Item index={0} />
    </Carousel.ItemGroup>
  </Carousel.Root>
  <Checkbox.Root data-id-contract="checkbox" data-instance={instance} />
  <Clipboard.Root value="value" data-id-contract="clipboard" data-instance={instance} />
  <Collapse.Root data-id-contract="collapse" data-instance={instance} />
  <Collapsible.Root data-id-contract="collapsible" data-instance={instance} />
  <ColorPicker.Root data-id-contract="color-picker" data-instance={instance} />
  <Combobox.Root collection={listCollection} data-id-contract="combobox" data-instance={instance} />
  <Dialog.Root>
    <Dialog.Trigger data-id-contract="dialog" data-instance={instance}>Dialog</Dialog.Trigger>
  </Dialog.Root>
  <Dynamic.Root data-id-contract="dynamic" data-instance={instance} />
  <Edit.Root data-id-contract="edit" data-instance={instance} />
  <Field.Root data-id-contract="field" data-instance={instance} />
  <Fieldset.Root>
    <Fieldset.HelperText data-id-contract="fieldset" data-instance={instance}>Fieldset</Fieldset.HelperText>
  </Fieldset.Root>
  <FileUpload.Root data-id-contract="file-upload" data-instance={instance} />
  <FloatingPanel.Root>
    <FloatingPanel.Trigger data-id-contract="floating-panel" data-instance={instance}>Floating panel</FloatingPanel.Trigger>
  </FloatingPanel.Root>
  <HoverCard.Root>
    <HoverCard.Trigger data-id-contract="hover-card" data-instance={instance}>Hover card</HoverCard.Trigger>
  </HoverCard.Root>
  <LabelIdFixture {instance} />
  <Menu.Root>
    <Menu.Trigger data-id-contract="menu" data-instance={instance}>Menu</Menu.Trigger>
  </Menu.Root>
  <NavigationMenu.Root data-id-contract="navigation-menu" data-instance={instance} />
  <NumberInput.Root data-id-contract="number-input" data-instance={instance} />
  <OtpInput.Root data-id-contract="otp-input" data-instance={instance} />
  <Pagination.Root count={10} data-id-contract="pagination" data-instance={instance} />
  <Popover.Root>
    <Popover.Trigger data-id-contract="popover" data-instance={instance}>Popover</Popover.Trigger>
  </Popover.Root>
  <Progress.Root data-id-contract="progress" data-instance={instance} />
  <QrCode.Root data-id-contract="qr-code" data-instance={instance} />
  <Radio.Root data-id-contract="radio" data-instance={instance} />
  <ScrollArea.Root data-id-contract="scroll-area" data-instance={instance} />
  <Select.Root collection={listCollection} data-id-contract="select" data-instance={instance} />
  <Separator.Root data-id-contract="separator" data-instance={instance} />
  <Signature.Root data-id-contract="signature" data-instance={instance} />
  <Slider.Root data-id-contract="slider" data-instance={instance} />
  <Splitter.Root defaultSize={splitterSize} data-id-contract="splitter" data-instance={instance} />
  <Steps.Root count={2} data-id-contract="steps" data-instance={instance} />
  <Switch.Root data-id-contract="switch" data-instance={instance} />
  <Tabs.Root data-id-contract="tabs" data-instance={instance} />
  <Timer.Root data-id-contract="timer" data-instance={instance} />
  <ToggleGroup.Root data-id-contract="toggle-group" data-instance={instance} />
  <Tooltip.Root>
    <Tooltip.Trigger data-id-contract="tooltip" data-instance={instance}>Tooltip</Tooltip.Trigger>
  </Tooltip.Root>
  <TourIdFixture {instance} />
  <Tree.Root {collection} data-id-contract="tree" data-instance={instance} />
{/each}

<NumberInput.Root id="provided-number-input" data-testid="explicit-number-input" />
<Tree.Root id="provided-tree" {collection} data-testid="explicit-tree" />
<Dynamic.Root id="provided-dynamic" data-testid="explicit-dynamic" />
<Field.Root id="provided-field" data-testid="explicit-field" />
<Fieldset.Root id="provided-fieldset">
  <Fieldset.HelperText data-testid="explicit-fieldset">Explicit fieldset</Fieldset.HelperText>
</Fieldset.Root>
<Splitter.Root id="provided-splitter" defaultSize={splitterSize} data-testid="explicit-splitter" />
