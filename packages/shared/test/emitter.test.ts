import { createEmitter } from '../src/emitter'

test('basic', () => {
  const handler = jest.fn()

  const emitter = createEmitter<{ foo: number }>()
  emitter.on('foo', handler)
  emitter.emit('foo', 1)

  expect(handler).toBeCalledTimes(1)
  expect(handler.mock.calls[0][0]).toEqual(1)

  emitter.off('foo', handler)
  emitter.emit('foo', 1)
  expect(handler).toBeCalledTimes(1)
})

test('mlutiple reigster', () => {
  const handler1 = jest.fn()
  const handler2 = jest.fn()

  const emitter = createEmitter<{ foo: string }>()
  emitter.on('foo', handler1)
  emitter.on('foo', handler2)
  emitter.emit('foo', 'hello')

  expect(handler1).toBeCalledTimes(1)
  expect(handler1.mock.calls[0][0]).toEqual('hello')
  expect(handler2).toBeCalledTimes(1)
  expect(handler2.mock.calls[0][0]).toEqual('hello')

  emitter.off('foo', handler1)
  emitter.emit('foo', 'world')

  expect(handler1).toBeCalledTimes(1)
  expect(handler2).toBeCalledTimes(2)
  expect(handler2.mock.calls[1][0]).toEqual('world')
})

test('multiple event', () => {
  const handler1 = jest.fn()
  const handler2 = jest.fn()

  const emitter = createEmitter<{ foo: string; bar: { greeting: string } }>()
  emitter.on('foo', handler1)
  emitter.on('bar', handler2)
  emitter.emit('foo', 'hello')
  emitter.emit('bar', { greeting: 'hello' })

  expect(handler1).toBeCalledTimes(1)
  expect(handler1.mock.calls[0][0]).toEqual('hello')
  expect(handler2).toBeCalledTimes(1)
  expect(handler2.mock.calls[0][0]).toEqual({ greeting: 'hello' })

  emitter.off('foo', handler1)
  emitter.emit('foo', 'hello')
  emitter.emit('bar', { greeting: 'world' })

  expect(handler1).toBeCalledTimes(1)
  expect(handler2).toBeCalledTimes(2)
  expect(handler2.mock.calls[1][0]).toEqual({ greeting: 'world' })
})

test('* event', () => {
  const handler1 = jest.fn()

  const emitter = createEmitter<{ foo: string; bar: number }>()
  emitter.on('*', handler1)
  emitter.emit('foo', 'hello')
  emitter.emit('bar', 1)

  expect(handler1).toBeCalledTimes(2)
  expect(handler1.mock.calls[0][0]).toEqual('foo')
  expect(handler1.mock.calls[0][1]).toEqual('hello')
  expect(handler1.mock.calls[1][0]).toEqual('bar')
  expect(handler1.mock.calls[1][1]).toEqual(1)

  emitter.off('*', handler1)
  emitter.emit('foo', 'hello')
  emitter.emit('bar', 1)

  expect(handler1).toBeCalledTimes(2)
})

test('events', () => {
  enum NamespaceEvents {
    NAME1_EVENT1 = 'name1:event1'
  }

  const handler1 = jest.fn()
  const handler2 = jest.fn()
  const handler3 = jest.fn()

  const emitter = createEmitter<{
    foo: number
    [NamespaceEvents.NAME1_EVENT1]: string
  }>()
  emitter.on('foo', handler1)
  emitter.on(NamespaceEvents.NAME1_EVENT1, handler2)
  emitter.on('*', handler3)

  expect(emitter.events.size).toEqual(3)

  emitter.events.clear()
  emitter.emit('foo', 'hello')
  emitter.emit(NamespaceEvents.NAME1_EVENT1, 1)

  expect(handler1).not.toBeCalled()
  expect(handler2).not.toBeCalled()
  expect(handler3).not.toBeCalled()
})
