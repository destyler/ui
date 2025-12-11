// Re-export only namespace objects to avoid naming conflicts
// Use subpath imports for individual components, e.g.:
// import { MenuArrow } from '@destyler-ui/vue/menu'

// Anatomy exports
export { avatarAnatomy } from './avatar'
// Composable exports
export { useAvatar, useAvatarContext } from './avatar'
export type { AvatarStatusChangeDetails, UseAvatarContext, UseAvatarProps, UseAvatarReturn } from './avatar'
// Namespace exports
export * as Avatar from './avatar/namespace'
export { calendarAnatomy } from './calendar'
export { useCalendar, useCalendarContext } from './calendar'
export type { UseCalendarContext, UseCalendarProps, UseCalendarReturn } from './calendar'
export * as Calendar from './calendar/namespace'
export { carouselAnatomy } from './carousel'
export { useCarousel, useCarouselContext } from './carousel'
export type { CarouselAutoplayStatusDetails, CarouselDragStatusDetails, CarouselPageChangeDetails, UseCarouselContext, UseCarouselProps, UseCarouselReturn } from './carousel'
export * as Carousel from './carousel/namespace'
export { checkboxAnatomy } from './checkbox'
export { useCheckbox, useCheckboxContext } from './checkbox'
export type { CheckboxCheckedChangeDetails, UseCheckboxContext, UseCheckboxProps, UseCheckboxReturn } from './checkbox'
export * as Checkbox from './checkbox/namespace'

export { clipboardAnatomy } from './clipboard'
export { useClipboard, useClipboardContext } from './clipboard'

export type { UseClipboardContext, UseClipboardProps, UseClipboardReturn } from './clipboard'
export * as Clipboard from './clipboard/namespace'
export { collapseAnatomy } from './collapse'
export { useCollapse, useCollapseContext, useCollapseItemContext } from './collapse'
export type { CollapseValueChangeDetails, UseCollapseContext, UseCollapseItemContext, UseCollapseProps, UseCollapseReturn } from './collapse'
export * as Collapse from './collapse/namespace'
export { collapsibleAnatomy } from './collapsible'
export { useCollapsible, useCollapsibleContext } from './collapsible'
export type { CollapsibleOpenChangeDetails, UseCollapsibleContext, UseCollapsibleProps, UseCollapsibleReturn } from './collapsible'
export * as Collapsible from './collapsible/namespace'
export { colorPickerAnatomy } from './color-picker'
export { useColorPicker, useColorPickerContext } from './color-picker'
export type { ColorPickerFormatChangeDetails, ColorPickerOpenChangeDetails, ColorPickerValueChangeDetails, UseColorPickerContext, UseColorPickerProps, UseColorPickerReturn } from './color-picker'
export * as ColorPicker from './color-picker/namespace'
export { comboboxAnatomy } from './combobox'
export { useCombobox, useComboboxContext, useComboboxItemContext } from './combobox'

export type { ComboboxHighlightChangeDetails, ComboboxInputValueChangeDetails, ComboboxOpenChangeDetails, ComboboxValueChangeDetails, UseComboboxContext, UseComboboxItemContext, UseComboboxProps, UseComboboxReturn } from './combobox'
export * as Combobox from './combobox/namespace'

export { dialogAnatomy } from './dialog'
export { useDialog, useDialogContext } from './dialog'

export type { DialogOpenChangeDetails, UseDialogContext, UseDialogProps, UseDialogReturn } from './dialog'
export * as Dialog from './dialog/namespace'

export { editAnatomy } from './edit'
export { useEdit, useEditContext } from './edit'

export type { EditChangeDetails, EditValueChangeDetails, UseEditContext, UseEditProps, UseEditReturn } from './edit'
export * as Edit from './edit/namespace'

export { fieldAnatomy } from './field'
export { useFieldContext } from './field'

export type { UseFieldContext } from './field'
export * as Field from './field/namespace'

export { fieldsetAnatomy } from './fieldset'
export { useFieldsetContext } from './fieldset'

export type { UseFieldsetContext } from './fieldset'
export * as Fieldset from './fieldset/namespace'

export { fileUploadAnatomy } from './file-upload'
export { useFileUpload, useFileUploadContext } from './file-upload'

export type { FileUploadFileAcceptDetails, FileUploadFileChangeDetails, FileUploadFileRejectDetails, UseFileUploadContext, UseFileUploadProps, UseFileUploadReturn } from './file-upload'
export * as FileUpload from './file-upload/namespace'

export { hoverCardAnatomy } from './hover-card'
export { useHoverCard, useHoverCardContext } from './hover-card'

export type { HoverCardOpenChangeDetails, UseHoverCardContext, UseHoverCardProps, UseHoverCardReturn } from './hover-card'
export * as HoverCard from './hover-card/namespace'

export { menuAnatomy } from './menu'
export { useMenu, useMenuContext, useMenuItemContext } from './menu'

export type { MenuHighlightChangeDetails, MenuOpenChangeDetails, MenuSelectionDetails, MenuValueChangeDetails, UseMenuContext, UseMenuItemContext, UseMenuProps, UseMenuReturn } from './menu'
export * as Menu from './menu/namespace'

// Presence (no namespace, export directly)
export { Presence, PresenceProvider, usePresence, usePresenceContext } from './presence'
export type { PresenceEmits, PresenceProps, UsePresenceContext, UsePresenceProps, UsePresenceReturn } from './presence'
