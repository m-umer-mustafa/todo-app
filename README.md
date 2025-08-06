```markdown
# 🎯 Todo Web Application  
> A fast, beautiful, and fully-featured task manager built with React + TypeScript + Zustand.

---

## ✨ Features

| Feature | Description |
| --- | --- |
| 🏠 **Home / Inbox** | View all pending tasks in one place. |
| 🌟 **Today** | Auto-filter tasks due today. |
| 📅 **Upcoming** | See tasks due within the next 7 days. |
| ✅ **Completed** | Review finished tasks (and mark them incomplete again). |
| ⚠️ **Overdue** | Spot tasks that are past their due date. |
| 🔍 **Real-time Search** | Global search across title, description, and category. |
| 🏷️ **Categories** | Create, edit, and assign color-coded categories. |
| 📝 **Rich Task Details** | Title, description, due date, category, completion toggle. |
| 🎨 **Light / Dark Mode** | One-click toggle using CSS variables. |
| 📱 **Responsive** | Works on desktop, tablet, and mobile. |
| 💾 **Persistent Storage** | Data survives page refreshes via `localStorage`. |

---

## 📁 Directory Overview


src/
├── components/          # Reusable UI pieces (TaskList, Header, Dialogs…)
├── pages/               # Route-level pages (Today, Upcoming…)
├── stores/              # Zustand state slices (tasks, categories, theme)
├── hooks/               # Custom hooks (useTodos, useTheme…)
├── lib/                 # Utilities & helpers
├── styles/              # Tailwind + CSS variables
└── App.tsx              # Router + ThemeProvider


---

## 🚀 How to Use

### 1. Add a Task
- Click **“Add Task”** (top-left sidebar).
- Fill title, description *(optional)*, **due date**, and **category**.
- Hit **Create Task**.

### 2. Edit / Delete / Toggle
- **Toggle** completion with the checkbox.
- **Edit** via pencil icon (opens `EditTaskDialog`).
- **Delete** via trash icon.

### 3. Filter & Search
- Use the sidebar links to switch views (`Today`, `Upcoming`, etc.).
- Type in the search bar to instantly filter tasks by title/description.

### 4. Manage Categories
- Inside **Add Task** → click **“Create Category”**.
- Or open the **Add Category** dialog from any page.

---

## 🛠️ Tech Stack

| Layer | Tech |
| --- | --- |
| **UI Library** | React 18 |
| **Styling** | Tailwind CSS + CSS Variables |
| **State** | Zustand (persisted) |
| **Icons** | Lucide |
| **Router** | React Router |
| **Date Handling** | date-fns |
| **Build Tool** | Vite |

---

## ⚙️ Quick Start

```bash
# Clone
git clone https://github.com//m-umer-mustafa/todo-app/
cd todo-app

# Install
npm install

# Dev
npm run dev
```

---

## 🧪 API (Store Hooks)

| Hook | Return |
| --- | --- |
| `getAllTasks()` | All tasks |
| `getPendingTasks()` | Only incomplete |
| `getTodayTasks()` | Due today |
| `getUpcomingTasks()` | Next 7 days |
| `getCompletedTasks()` | Completed |
| `getOverdueTasks()` | Past due date |
| `searchTodos(tasks, query)` | Filtered by query |

---

## 🎨 Theme Customization

Edit `src/styles/globals.css` → `:root` or `.dark` variables to change colors, gradients, shadows, etc.

---

## 🤝 Contributing

1. Fork the repo  
2. Create a feature branch  
3. Push & open a pull request  

---

## 📄 License

MIT © 2024 Muhammad Omer Mustafa

