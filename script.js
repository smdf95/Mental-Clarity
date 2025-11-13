// =================================================================
// ===================== GLOBAL UTILITIES ==========================
// =================================================================

// Global variable to hold the reference to the card being edited
let currentEditingCard = null;

// Opens the Journal dialog
function openDialog(isEditMode = false, content = '') {
    const dialog = document.getElementById('journalDialog');
    const contentInput = document.getElementById('journalContent');
    const dialogTitle = document.getElementById('dialogTitle');
    
    // Ensure dialog elements exist
    if (dialog && contentInput && dialogTitle) {
        if (isEditMode) {
            dialogTitle.textContent = 'Edit Journal Entry';
            contentInput.value = content;
        } else {
            dialogTitle.textContent = 'Add New Journal Entry';
            contentInput.value = '';
            currentEditingCard = null;
        }
        dialog.showModal();
        contentInput.focus();
    }
}

// Closes the Journal dialog
function closeDialog() {
    const dialog = document.getElementById('journalDialog');
    if (dialog) {
        dialog.close();
        currentEditingCard = null;
    }
}

// Function called by the 'Delete' button on Journal entries
function deleteJournalEntry(buttonElement) {
    const cardToRemove = buttonElement.closest('.journal-entry-card');
    if (cardToRemove) {
        cardToRemove.remove();

        const entryContainer = document.getElementById('journal');
        if (entryContainer) {
            localStorage.setItem("journalData", entryContainer.innerHTML);
        }
    }
}

// Function called by the 'Edit' button
function editJournalEntry(buttonElement) {
    // Find the content and the card reference
    const card = buttonElement.closest('.journal-entry-card');
    const contentParagraph = card.querySelector('.card-content');
    
    // Store the card reference and the current data
    currentEditingCard = card;
    const currentContent = contentParagraph ? contentParagraph.textContent.trim() : '';

    // Open the dialog in edit mode with the current content
    openDialog(true, currentContent);
}

function saveTaskData(){
    const list = document.querySelector('.list');
    if (list) {
        localStorage.setItem("data", list.innerHTML);
    }
}

function addTask() {
    const list = document.querySelector('.list');
    const newTaskInput = document.getElementById('newTask');
    const errorDisplay = document.getElementById('taskError');

    // Ensure elements exist and input isn't empty
    if (!list || !newTaskInput || !errorDisplay) return;

    if(newTaskInput.value.trim() === ''){
        errorDisplay.textContent = 'Please enter a task.';
        errorDisplay.classList.add('shake-animation');
        
        // 3. Remove the shake class after 0.5s 
        //    (matching the CSS animation duration)
        setTimeout(() => {
            errorDisplay.classList.remove('shake-animation');
        }, 500); // 500 milliseconds = 0.5 seconds
        
        // 4. Stop execution
        return;
    }
    
    let li = document.createElement('li');
    
    let taskTextDiv = document.createElement('div');
    taskTextDiv.classList.add('task-text');
    taskTextDiv.innerHTML = newTaskInput.value;
    li.appendChild(taskTextDiv);

    let span = document.createElement('span');
    span.classList.add('material-symbols-outlined')
    span.innerHTML = "delete_forever";
    li.appendChild(span);

    list.appendChild(li);
    
    errorDisplay.textContent = '';
    newTaskInput.value = "";
    saveTaskData(); // Use the global/accessible save function
}


document.addEventListener('DOMContentLoaded', function() {

    // =================================================================
    // ===================== TO-DO LIST LOGIC ==========================
    // =================================================================
    
    const list = document.querySelector('.list');
    const newTask = document.getElementById('newTask');
    
    // Check if the unique To-Do list elements exist
    if (list && newTask) {
                
        // Retrieve and display data
        function showTasks(){
            list.innerHTML = localStorage.getItem("data") || '';
        }
        
        // The event listener for 'Enter' now calls the global addTask
        newTask.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                // Call the globally defined addTask
                addTask(); 
            }
        });

        // Event listener for task checking and deletion
        list.addEventListener("click", function(e){
            let targetElement = e.target;
            let listItem;

            listItem = targetElement.closest('li');
            
            // Check/Uncheck: If LI itself OR the task-text DIV is clicked
            if (targetElement.tagName === "LI" || targetElement.classList.contains('task-text')) {
                if (listItem) {
                    listItem.classList.toggle("checked");
                    saveTaskData(); // Use global/accessible save function
                }
            }
            // Delete: If the SPAN (icon) is clicked
            else if(targetElement.tagName === "SPAN"){
                if (listItem) {
                    listItem.remove();
                    saveTaskData(); // Use global/accessible save function
                }
            }
        }, false);
        
        // Load saved tasks when DOM is ready
        showTasks();
    }


    // =================================================================
    // ======================= JOURNAL LOGIC ===========================
    // =================================================================
    
    const dialog = document.getElementById('journalDialog');
    const entryContainer = document.getElementById('journal');

    // Check if the unique Journal elements exist
    if (dialog && entryContainer) {
        
        // --- Data Management ---

        function saveJournalData(){
            // Saves the entire HTML content of the journal container
            localStorage.setItem("journalData", entryContainer.innerHTML);
        }
        
        function showEntries(){
            // Loads and displays the saved HTML content
            entryContainer.innerHTML = localStorage.getItem("journalData") || '';
        }

        // --- Action Functions ---

        function createEntryHTML(content, existingDate = null) {
            // Generates the card HTML with date, and edit/delete buttons
            const date = existingDate || new Date().toLocaleDateString(undefined, { 
                        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' 
                    });
                    
                    return `
                        <div class="journal-entry-card">
                            <p class="card-date">${date}</p>
                            <p class="card-content">${content}</p>
                            <div class="card-actions">
                                <button class="edit-card-btn" onclick="editJournalEntry(this)" aria-label="Edit Entry">
                                    <span class="material-symbols-outlined">edit</span>
                                </button>
                                <button class="delete-card-btn" onclick="deleteJournalEntry(this)" aria-label="Delete Entry">
                                    <span class="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                        </div>
                    `;
        }

        function saveForm(event) {
            event.preventDefault();

            const entryContent = document.getElementById('journalContent').value.trim();
            
            if (entryContent) {
                
                if (currentEditingCard) {
                    // --- EDIT MODE ---
                    // 1. Update the content of the existing card
                    const contentParagraph = currentEditingCard.querySelector('.card-content');
                    
                    if (contentParagraph) {
                        contentParagraph.textContent = entryContent; // Update content
                    }
                    
                    // Clear editing state
                    currentEditingCard = null;
                } else {
                    // --- NEW ENTRY MODE ---
                    // 1. Create the new HTML card
                    const newCardHTML = createEntryHTML(entryContent);
                    
                    // 2. Prepend the new card to the container
                    entryContainer.insertAdjacentHTML('afterbegin', newCardHTML);
                }
                
                // 3. Save the updated container HTML to localStorage
                saveJournalData();
                
                // 4. Clear form and close dialog
                document.getElementById('journalContent').value = '';
                closeDialog();
            }
        }
        
        // --- Event Listeners ---

        // Load entries immediately when the Journal page is ready
        showEntries();

        // Attach the working backdrop click listener
        dialog.addEventListener('click', function(event) {
            if(event.target === this) {
                closeDialog();
            }
        });

        // Attach the form submission listener
        const form = document.getElementById('dialogForm');
        if (form) {
             form.addEventListener('submit', saveForm);
        }
    }
});