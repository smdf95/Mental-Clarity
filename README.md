# 🧘 Mental Clarity: A Personal Wellness Application

> A multi-page web tool built to help users manage daily tasks, reflect on their thoughts through a dedicated journal, and find peace through meditation.

## [🚀 Try the Live Demo!](https://smdf95.github.io/Mental-Clarity/)

---

## ✨ Features

### 1. 📝 To-Do List (`index.html`)
The core task management interface, offering real-time task control.

* **Real-time Task Management:** Seamlessly **Add**, **check off**, and **delete** tasks.
* **Persistence:** All tasks are saved and retrieved using **`localStorage`**.
* **Aesthetics:** Modern, clean styling with clear visual feedback (e.g., strike-through) for completed tasks.
* **Design:** Optimized, **responsive layout** for both desktop and mobile viewing.

### 2. 📔 Digital Journal (`journal.html`)
A private space for reflection and thought organization.

* **Entry Creation:** Easily add new journal entries via a **modal interface**.
* **Management:** Users can **edit or permanently delete** existing entries.
* **Current Storage Note:** Entries are currently saved using **`localStorage`**.
* **Design:** Entries are displayed in a clean, card-based grid layout.

### 3. 🌐 Navigation
A consistent header provides easy access to the application's core pages:

* **Home** (`index.html`)
* **To Do List** (`todo.html`)
* **Journal** (`journal.html`)
* **Meditation** (`meditation.html`)
* **Benefits** (`Benefits`)

---

## 🛠️ Technology Stack

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3, JavaScript | Structure and core application logic. |
| **Styling** | Custom CSS & Material Symbols | Aesthetic design, responsiveness, and clean iconography. |
| **Primary DB** | `localStorage` | Temporary storage currently used for To Do List tasks and Journal entries |

---

## 📂 File Structure

| Filepath | Description | Used By |
| :--- | :--- | :--- |
| `index.html` | Main Page: Contains the structure for the **To-Do List**. | To-Do List |
| `todo.html` | To Do List Page: Contains the structure for the **To Do List**. | To Do List |
| `journal.html` | Journal Page: Contains the structure for the **Digital Journal**. | Digital Journal |
| `meditation.html` | Meditation Page: Contains the structure for the **Meditations**. | Meditation |
| `benefits.html` | Benefits Page: Contains the structure for the **Benefits of To Do Lists**. | Benefits |
| `script.js` | **Core Logic:** Contains all JavaScript functions. | All pages |
| `style.css` | To-Do Styles: Complete CSS all pages | All Pages |

---


