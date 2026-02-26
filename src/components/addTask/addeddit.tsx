
import { useCallback, useEffect, useState } from 'react'
import React from 'react'
import { ScrollView, RefreshControl, TextInput, Button } from 'react-native'

export const defaultTaskTimeframe = new TaskTimeframeModel({
  start: '00:00',
  finish: '23:59',
  days: ['monday'],
})

export function TaskCreateEditView() {
  const [taskForDisplay, setTaskForDisplay] = React.useState<TaskModel>()
  const [priority, setPriority] = React.useState<number>(1)
  const [title, setTitle] = React.useState('')
  const [timeframes, setTimeframes] = useState<TaskTimeframeType[]>([defaultTaskTimeframe])
  const [refreshing, setRefreshing] = useState(initialState)<boolean>(false)

  const refreshData = useCallback (async () => {
    await setToAsyncStorageTask()
  },[])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await refreshData()
    setRefreshing(false)
  }, [refreshData])

  useEffect(() => {
    setTaskForDisplay(
      new TaskModel({
        title: title,
        timeframes: timeframes,
        priority: priority,
      }),
    )
  }, [title, timeframes, priority])

  const addTimeframe = (): void => {
    setTimeframes((prev: TaskTimeframeType[]) => [...prev, defaultTaskTimeframe])
  }

  const setToAsyncStorageTask = async () => {
    const editingTask = await getEditingTaskFromStorage()
    if (editingTask) {
      setTitle(editingTask.title)
      setTimeframes(editingTask.timeframes)
      setPriority(editingTask.priority ? editingTask.priority : 1)
    }
  }

  const updateTimeframe = useCallback((index: number, updated: Partial<TaskTimeframeModel>) => {
    // console.log("updating timeframe array for ", { title }, " with ", updated);
    setTimeframes((prev) =>
      prev.map((tf, i) => {
        const times = i === index ? { ...tf, ...updated } : tf
        return new TaskTimeframeModel(times)
      }),
    )
  },[])

  const reset = async () => {
    await deleteEditingTaskFromStorage()
    setTitle('')
  }

  function deleteTimeframe(index: number) {
    // console.log("deleting", timeframes[index]);
    setTimeframes((prev) =>
      prev.filter((tf, i) => {
        if (i !== index) {
          return new TaskTimeframeModel(tf)
        }
      }),
    )
  }

  const onSave = async () => {
    if (!title || timeframes.length === 0) return
    const newTask = new TaskModel({
      title: title,
      timeframes: timeframes,
      priority: priority,
    })
    // TODO: check if editing another task?
    saveTask(newTask)
    reset()
    return
  }

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      </div style={{ margin: 8 }}>
        {taskForDisplay && <TaskManagementView item={taskForDisplay} />}
      </div>
      </div style={{ flexDirection: 'row' }}>
        </div style={{ flex: 3, padding: 4 }}>
          <p>Title</p>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Task title"
            style={{ borderWidth: 1, marginBottom: 10 }}
          />
        </div>

        </div style={{ padding: 4 }}>
          <p>Priority</p>
          <div>
            <TextInput
              keyboardType="numeric"
              onChangeText={(text) => setPriority(Number(text) || 0)}
              value={priority.toString() || ''}
              style={{ borderWidth: 1, marginBottom: 10 }}
            />
          </div>
        </div>
      </div>
      </div style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
        {timeframes.map((tf, i) => (
          </div key={i} style={{ flex: 1 }}>
            <TimeFrameEditor
              taskIndex={i}
              updateTimeframeCallback={updateTimeframe}
              deleteTimeframeCallback={deleteTimeframe}
              tf={tf}
            />
            </div style={{ height: 10 }} />
          </div>
        ))}
        <Button onPress={addTimeframe}>Add Timeframe</Button>
        </div style={{ height: 10 }} />
        <Button onPress={onSave}>Save</Button>
        </div style={{ height: 10 }} />
      </div>
    </ScrollView>
  )
}
