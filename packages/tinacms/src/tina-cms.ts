/**

 Copyright 2019 Forestry.io Inc

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

 */

import { CMS, CMSConfig, PluginType, Subscribable } from '@tinacms/core'
import { FieldPlugin } from '@tinacms/form-builder'
import { ScreenPlugin } from './plugins/screen-plugin'
import {
  TextFieldPlugin,
  TextareaFieldPlugin,
  ImageFieldPlugin,
  ColorFieldPlugin,
  NumberFieldPlugin,
  ToggleFieldPlugin,
  SelectFieldPlugin,
  GroupFieldPlugin,
  GroupListFieldPlugin,
  BlocksFieldPlugin,
} from '@tinacms/fields'
import DateFieldPlugin from './plugins/fields/DateFieldPlugin'
import HtmlFieldPlugin from './plugins/fields/HtmlFieldPlugin'
import MarkdownFieldPlugin from './plugins/fields/MarkdownFieldPlugin'
import { Form } from '@tinacms/forms'
import { MediaManager, MediaStore, MediaUploadOptions } from './media'
import { Alerts } from './tina-cms/alerts'

export declare type SidebarPosition = 'fixed' | 'float' | 'displace' | 'overlay'

export interface TinaCMSConfig extends CMSConfig {
  sidebar?: SidebarStateOptions
  media?: {
    store: MediaStore
  }
}

export class TinaCMS extends CMS {
  sidebar: SidebarState
  media: MediaManager
  alerts = new Alerts()

  constructor({ sidebar, media, ...config }: TinaCMSConfig = {}) {
    super(config)

    const mediaStore = media?.store || new DummyMediaStore()
    this.media = new MediaManager(mediaStore)

    this.sidebar = new SidebarState(sidebar)
    this.fields.add(TextFieldPlugin)
    this.fields.add(TextareaFieldPlugin)
    this.fields.add(DateFieldPlugin)
    this.fields.add(ImageFieldPlugin)
    this.fields.add(ColorFieldPlugin)
    this.fields.add(NumberFieldPlugin)
    this.fields.add(ToggleFieldPlugin)
    this.fields.add(SelectFieldPlugin)
    this.fields.add(MarkdownFieldPlugin)
    this.fields.add(HtmlFieldPlugin)
    this.fields.add(GroupFieldPlugin)
    this.fields.add(GroupListFieldPlugin)
    this.fields.add(BlocksFieldPlugin)
  }

  get forms() {
    return this.plugins.findOrCreateMap<Form & { __type: string }>('form')
  }

  get fields(): PluginType<FieldPlugin> {
    return this.plugins.findOrCreateMap('field')
  }

  get screens(): PluginType<ScreenPlugin> {
    return this.plugins.findOrCreateMap('screen')
  }
}

interface SidebarStateOptions {
  hidden?: boolean
  position?: SidebarPosition
  buttons?: SidebarButtons
}

interface SidebarButtons {
  save: string
  reset: string
}

export class SidebarState extends Subscribable {
  private _isOpen: boolean = false

  position: SidebarPosition = 'displace'
  _hidden: boolean = false
  buttons: SidebarButtons = {
    save: 'Save',
    reset: 'Reset',
  }

  constructor(options: SidebarStateOptions = {}) {
    super()
    this.position = options.position || 'displace'
    this._hidden = !!options.hidden

    if (options.buttons?.save) {
      this.buttons.save = options.buttons.save
    }
    if (options.buttons?.reset) {
      this.buttons.reset = options.buttons.reset
    }
  }

  get isOpen() {
    return this._isOpen
  }

  set isOpen(nextValue: boolean) {
    this._isOpen = nextValue
    this.notifiySubscribers()
  }

  get hidden() {
    return this._hidden
  }

  set hidden(nextValue: boolean) {
    this._hidden = nextValue
    this.notifiySubscribers()
  }
}

class DummyMediaStore implements MediaStore {
  accept = '*'
  async persist(files: MediaUploadOptions[]) {
    alert('UPLOADING FILES')
    console.log(files)
    return files.map(({ directory, file }) => ({
      directory,
      filename: file.name,
    }))
  }
}
