/**
 * Event emitter, forked from the below:
 * - original repository url: https://github.com/developit/mitt
 * - code url: https://github.com/developit/mitt/blob/master/src/index.ts
 * - author: Jason Miller (https://github.com/developit)
 * - license: MIT
 */

import {
  EventType,
  EventHandler,
  WildcardEventHandler,
  EventHandlerList,
  WildcardEventHandlerList,
  EventHandlerMap,
  Emittable
} from './emittable'

/**
 * Create a event emitter
 *
 * @returns An event emitter
 */
export function createEmitter<
  Events extends Record<EventType, unknown>
>(): Emittable<Events> {
  type GenericEventHandler =
    | EventHandler<Events[keyof Events]>
    | WildcardEventHandler<Events>
  const events = new Map() as EventHandlerMap<Events>

  const emitter = {
    events,

    on<Key extends keyof Events>(
      event: Key | '*',
      handler: GenericEventHandler
    ): void {
      const handlers: Array<GenericEventHandler> | undefined = events.get(event)
      const added = handlers && handlers.push(handler)
      if (!added) {
        events.set(event, [handler] as EventHandlerList<Events[keyof Events]>)
      }
    },

    off<Key extends keyof Events>(
      event: Key | '*',
      handler: GenericEventHandler
    ): void {
      const handlers: Array<GenericEventHandler> | undefined = events.get(event)
      if (handlers) {
        handlers.splice(handlers.indexOf(handler) >>> 0, 1)
      }
    },

    once<Key extends keyof Events>(
      event: Key,
      handler: EventHandler<Events[keyof Events]>
    ): void {
      const on = (...args: unknown[]): void => {
        emitter.off(event, on)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler.apply(emitter, args as any)
      }
      emitter.on(event, on)
    },

    emit<Key extends keyof Events>(
      event: Key,
      payload?: Events[keyof Events]
    ): void {
      ;((events.get(event) || []) as EventHandlerList<Events[keyof Events]>)
        .slice()
        .map(handler => handler(payload))
      ;((events.get('*') || []) as WildcardEventHandlerList<Events>)
        .slice()
        .map(handler => handler(event, payload))
    }
  }

  return emitter
}
