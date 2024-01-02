import { Widget, Utils } from '../../imports.js'
import { Todo } from '../../services/main.js'
// import { NavigationIndicator } from '../../misc/main.js'
import { setupCursorHover } from '../../misc/CursorHover.js'

const { Gtk } = imports.gi
const defaultTodoSelected = 'undone'

const todoListItem = (task, id, isDone) => {
  const crosser = Widget.Box({ className: 'sidebar-todo-crosser' })
  const todoContent = Widget.Box({
    className: 'sidebar-todo-item spacing-h-5',
    children: [
      Widget.Label({
        hexpand: true,
        xalign: 0,
        wrap: true,
        className: 'txt txt-small sidebar-todo-txt',
        label: task.content,
        selectable: true,
      }),
      Widget.Button({ // Check/Uncheck
        vpack: 'center',
        className: 'txt sidebar-todo-item-action',
        child: Widget.Label({ 
          vpack: 'center',
          className: 'icon-material txt-norm',
          label: `${isDone ? 'remove_done' : 'check'}`
        }),
        onClicked: () => {
          const contentWidth = todoContent.get_allocated_width()
          crosser.toggleClassName('sidebar-todo-crosser-crossed', true)
          crosser.css = `margin-left: -${contentWidth}px;`
          Utils.timeout(200, () => widgetRevealer.revealChild = false)
          Utils.timeout(350, () => {
            if (isDone) Todo.uncheck(id)
            else Todo.check(id)
          })
        }, setup: setupCursorHover,
      }),
      Widget.Button({ // Remove
        vpack: 'center',
        className: 'txt sidebar-todo-item-action',
        child: Widget.Label({
          vpack: 'center',
          label: 'delete_forever',
          className: 'icon-material txt-norm',
        }),
        onClicked: () => {
          const contentWidth = todoContent.get_allocated_width()
          crosser.toggleClassName('sidebar-todo-crosser-removed', true)
          crosser.css = `margin-left: -${contentWidth}px;`
          Utils.timeout(200, () => widgetRevealer.revealChild = false)
          Utils.timeout(350, () => Todo.remove(id))
        },
        setup: setupCursorHover,
      }), crosser,
    ]
  })
  const widgetRevealer = Widget.Revealer({
    revealChild: true,
    transition: 'slide_down',
    transitionDuration: 150,
    child: todoContent,
  })

  return widgetRevealer
}

const todoItems = isDone => Widget.Scrollable({
  child: Widget.Box({
    vertical: true,
    connections: [[
      Todo, self => {
        self.children = Todo.todo_json.map((task, i) => {
          if (task.done != isDone) return null
          return todoListItem(task, i, isDone)
        })
        if (self.children.length == 0) {
          self.homogeneous = true
          self.children = [
            Widget.Box({
              hexpand: true,
              vertical: true,
              vpack: 'center',
              className: 'txt',
              children: [
                // eslint-disable-next-line 
                FontIcon(`${isDone ? 'checklist' : 'check_circle'}`),
                Widget.Label({ label: `${isDone ? 'Finished tasks will go here' : 'Nothing here!'}` })
              ]
            })
          ]
        }
        else self.homogeneous = false
      }, 'updated'
    ]]
  }),
  setup: listContents => {
    listContents.set_policy(Gtk.PolicyType.NEVER, Gtk.PolicyType.AUTOMATIC)
    const vScrollbar = listContents.get_vscrollbar()
    vScrollbar.get_style_context().add_class('sidebar-scrollbar')
  }
})

const UndoneTodoList = () => {
  const newTaskButton = Widget.Revealer({
    transition: 'slide_left',
    transitionDuration: 200,
    revealChild: true,
    child: Widget.Button({
      className: 'txt-small sidebar-todo-new',
      halign: 'end',
      vpack: 'center',
      label: '+ New task',
      setup: setupCursorHover,
      onClicked: () => {
        newTaskButton.revealChild = false
        newTaskEntryRevealer.revealChild = true
        confirmAddTask.revealChild = true
        cancelAddTask.revealChild = true
        newTaskEntry.grab_focus()
      }
    })
  })
  const cancelAddTask = Widget.Revealer({
    transition: 'slide_right',
    transitionDuration: 200,
    revealChild: false,
    child: Widget.Button({
      className: 'txt-norm icon-material sidebar-todo-add',
      halign: 'end',
      vpack: 'center',
      label: 'close',
      setup: setupCursorHover,
      onClicked: () => {
        newTaskEntryRevealer.revealChild = false
        confirmAddTask.revealChild = false
        cancelAddTask.revealChild = false
        newTaskButton.revealChild = true
        newTaskEntry.text = ''
      }
    })
  })
  const newTaskEntry = Widget.Entry({
    // hexpand: true,
    vpack: 'center',
    className: 'txt-small sidebar-todo-entry',
    placeholderText: 'Add a task...',
    onAccept: ({ text }) => {
      if (text == '') return
      Todo.add(text)
      newTaskEntry.text = ''
    },
    onChange: ({ text }) => confirmAddTask.child.toggleClassName('sidebar-todo-add-available', text != ''),
  })
  const newTaskEntryRevealer = Widget.Revealer({
    transition: 'slide_right',
    transitionDuration: 200,
    revealChild: false,
    child: newTaskEntry,
  })
  const confirmAddTask = Widget.Revealer({
    transition: 'slide_right',
    transitionDuration: 200,
    revealChild: false,
    child: Widget.Button({
      className: 'txt-norm icon-material sidebar-todo-add',
      halign: 'end',
      vpack: 'center',
      label: 'arrow_upward',
      setup: setupCursorHover,
      onClicked: () => {
        if (newTaskEntry.text == '') return
        Todo.add(newTaskEntry.text)
        newTaskEntry.text = ''
      }
    })
  })

  return Widget.Box({ // The list, with a New button
    vertical: true,
    className: 'spacing-v-5',
    setup: (box) => {
      box.pack_start(todoItems(false), true, true, 0)
      box.pack_start(Widget.Box({
        setup: self => {
          self.pack_start(cancelAddTask, false, false, 0)
          self.pack_start(newTaskEntryRevealer, true, true, 0)
          self.pack_start(confirmAddTask, false, false, 0)
          self.pack_start(newTaskButton, false, false, 0)
        }
      }), false, false, 0)
    },
  })
}

const todoItemsBox = Widget.Stack({
  vpack: 'fill',
  transition: 'slide_left_right',
  items: [
    ['undone', UndoneTodoList()],
    ['done', todoItems(true)],
  ],
})

export const TodoWidget = () => {
  const TodoTabButton = (isDone, navIndex) => Widget.Button({
    hexpand: true,
    className: 'sidebar-selector-tab',
    onClicked: btn => {
      todoItemsBox.shown = `${isDone ? 'done' : 'undone'}`
      const kids = btn.get_parent().get_children()
      kids.forEach(kid => {
        if (kid != btn) 
          kid.toggleClassName('sidebar-selector-tab-active', false)
        else 
          btn.toggleClassName('sidebar-selector-tab-active', true)
      })
      // Fancy highlighter line width
      const buttonWidth = btn.get_allocated_width()
      const highlightWidth = btn.get_children()[0].get_allocated_width()
      // navIndicator.css = `
      //   font-size: ${navIndex}px; 
      //   padding: 0px ${(buttonWidth - highlightWidth) / 2}px;
      // `
    },
    child: Widget.Box({
      hpack: 'center',
      className: 'spacing-h-5',
      children: [
        // eslint-disable-next-line 
        FontIcon(`${isDone ? 'task_alt' : 'format_list_bulleted'}`),
        Widget.Label({ className: 'txt txt-smallie', label: `${isDone ? 'Done' : 'Unfinished'}` })
      ]
    }),
    setup: btn => Utils.timeout(1, () => {
      setupCursorHover(btn)
      btn.toggleClassName('sidebar-selector-tab-active', defaultTodoSelected === `${isDone ? 'done' : 'undone'}`)
    }),
  })
  
  const undoneButton = TodoTabButton(false, 0)
  const doneButton = TodoTabButton(true, 1)
  // const navIndicator = NavigationIndicator(2, false, { // The line thing
  //   className: 'sidebar-selector-highlight',
  //   css: 'font-size: 0px; padding: 0rem 1.636rem;', // Shush
  // })

  return Widget.Box({
    hexpand: true,
    vertical: true,
    className: 'spacing-v-10',
    setup: box => {     // undone/done selector rail
      box.pack_start(Widget.Box({
        vertical: true,
        children: [
          Widget.Box({
            className: 'sidebar-selectors spacing-h-5',
            homogeneous: true,
            setup: box => {
              box.pack_start(undoneButton, false, true, 0)
              box.pack_start(doneButton, false, true, 0)
            }
          }),
          // Widget.Box({
          //   homogeneous: true,
          //   children: [navIndicator],
          //   className: 'sidebar-selector-highlight-offset',
          // })
        ]
      }), false, false, 0)
      box.pack_end(todoItemsBox, true, true, 0)
    },
  })
}

