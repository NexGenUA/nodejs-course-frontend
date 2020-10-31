import { taskActionType, TaskState } from '../../state.model';
import { LoadTasksAction, TaskActions } from '../../actions/task.action';

const initialState: TaskState = {
  items: []
};

export const taskReducer = (
  state: TaskState = initialState,
  action: TaskActions
) => {
  switch (action.type) {
    case taskActionType.loadTasks:
      return {
        ...state,
        items: (action as LoadTasksAction).payload.items
      };
    default:
      return {
        ...state
      };
  }
};
