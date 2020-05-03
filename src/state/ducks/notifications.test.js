/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { UserNotification } from '../../utils/notifications';
import reducer, { actionCreators } from './notifications';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const notification = new UserNotification('You have been muted.');
const other_notification = new UserNotification('Nobody is listening!');

describe('reducer', () => {
  it('handles NOTIFICATION_SHOW', () => {
    const action = actionCreators.show(notification);
    expect(reducer([], action)).toEqual([notification]);
  });

  it('handles NOTIFICATION_CLOSE', () => {
    const action = actionCreators.close(notification.id);
    expect(reducer([other_notification, notification], action)).toEqual([other_notification]);
  });
});

describe('action creators', () => {
  jest.useFakeTimers();

  const event = {
    type: 'muted',
    data: { cause: 'request', source: { id: 1, display: 'Jane' } }
  };

  describe('notifyEvent', () => {
    it('adds a message and removes it after a timeout', () => {
      const store = mockStore({ notifications: [] });
      store.dispatch(actionCreators.notifyEvent(event));

      expect(store.getActions()).toEqual([
        expect.objectContaining({ type: 'jangouts/notification/SHOW' })
      ]);

      jest.runAllTimers();
      expect(store.getActions()).toEqual([
        expect.objectContaining({ type: 'jangouts/notification/SHOW' }),
        expect.objectContaining({ type: 'jangouts/notification/CLOSE' })
      ]);
    });
  });
});
