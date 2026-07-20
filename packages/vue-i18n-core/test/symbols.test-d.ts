import {
  CoreContextSymbol,
  DatetimePartsSymbol,
  DisableEmitter,
  DisposeSymbol,
  EnableEmitter,
  NumberPartsSymbol,
  TranslateVNodeSymbol
} from '../src/symbols'

import type { CoreContext } from '@intlify/core-base'
import type { VueDevToolsEmitter } from '@intlify/devtools-types'
import type { VNodeArrayChildren } from 'vue'
import type { ComposerInternal, ComposerInternalInstance, VueMessageType } from '../src/composer'

type IsUniqueSymbol<T extends symbol> = symbol extends T ? false : true
type LegacyComposerInternalKeys =
  | '__translateVNode'
  | '__numberParts'
  | '__datetimeParts'
  | '__enableEmitter'
  | '__disableEmitter'

test('uses unique symbols for the internal protocol', () => {
  expectTypeOf<IsUniqueSymbol<typeof CoreContextSymbol>>().toEqualTypeOf<true>()
  expectTypeOf<IsUniqueSymbol<typeof TranslateVNodeSymbol>>().toEqualTypeOf<true>()
  expectTypeOf<IsUniqueSymbol<typeof NumberPartsSymbol>>().toEqualTypeOf<true>()
  expectTypeOf<IsUniqueSymbol<typeof DatetimePartsSymbol>>().toEqualTypeOf<true>()
  expectTypeOf<IsUniqueSymbol<typeof EnableEmitter>>().toEqualTypeOf<true>()
  expectTypeOf<IsUniqueSymbol<typeof DisableEmitter>>().toEqualTypeOf<true>()
  expectTypeOf<IsUniqueSymbol<typeof DisposeSymbol>>().toEqualTypeOf<true>()
})

test('describes Composer internals with computed symbol keys', () => {
  expectTypeOf<Extract<keyof ComposerInternal, LegacyComposerInternalKeys>>().toEqualTypeOf<never>()
  expectTypeOf<ComposerInternal[typeof CoreContextSymbol]>().toEqualTypeOf<
    CoreContext<VueMessageType>
  >()
  expectTypeOf<ComposerInternal[typeof TranslateVNodeSymbol]>().toEqualTypeOf<
    (...args: unknown[]) => VNodeArrayChildren
  >()
  expectTypeOf<ComposerInternal[typeof NumberPartsSymbol]>().toEqualTypeOf<
    (...args: unknown[]) => string | Intl.NumberFormatPart[]
  >()
  expectTypeOf<ComposerInternal[typeof DatetimePartsSymbol]>().toEqualTypeOf<
    (...args: unknown[]) => string | Intl.DateTimeFormatPart[]
  >()
  expectTypeOf<ComposerInternal[typeof EnableEmitter]>().toEqualTypeOf<
    ((emitter: VueDevToolsEmitter) => void) | undefined
  >()
  expectTypeOf<ComposerInternal[typeof DisableEmitter]>().toEqualTypeOf<(() => void) | undefined>()
  expectTypeOf<ComposerInternal[typeof DisposeSymbol]>().toEqualTypeOf<(() => void) | undefined>()
  expectTypeOf<ComposerInternalInstance>().toMatchTypeOf<ComposerInternal>()
})
