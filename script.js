// =================================================================
// ===================== GLOBAL UTILITIES ==========================
// =================================================================

window.addEventListener('scroll', reveal);
window.addEventListener('load', reveal);

function reveal() {
    var reveals = document.querySelectorAll('.reveal');

    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementBottom = reveals[i].getBoundingClientRect().bottom;
        var elementVisible = 100;

        // 1. Logic for adding the 'active' class (Element is visible)
        // Keeps 'active' as long as its top is below the reveal line
        // AND its bottom is below the scroll-past line (150px from top).
        if (elementTop < windowHeight - elementVisible && elementBottom > elementVisible) {
            reveals[i].classList.add('active');
            reveals[i].classList.remove('scrolled-past'); // Remove 'scrolled-past' if it comes back into view
        }

        // 2. Logic for elements that are NOT active
        else {
            reveals[i].classList.remove('active');

            // 3. New Logic: Check if the element is above the viewport
            // This condition is true when the entire element is above the top edge of the window.
            if (elementBottom <= 100) {
                reveals[i].classList.add('scrolled-past');
            } else {
                // This 'else' covers elements that are below the viewport but haven't been revealed yet.
                reveals[i].classList.remove('scrolled-past');
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const sliderContainer = document.querySelector('.testimonial-slider-container'); // You'll need to target the main container
    let currentSlide = 0;
    const intervalTime = 8000; // Change slide every 8 seconds

    // Variables for tracking touch/swipe
    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 50; // Minimum distance in pixels for a valid swipe

    // --- Core Slider Functions ---

    function showSlide(index) {
        // Remove 'active' class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Wrap around to the beginning if index goes past the end
        if (index >= slides.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = index;
        }

        // Add 'active' class to the current slide and dot
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // --- Automatic Rotation ---

    let sliderInterval = setInterval(nextSlide, intervalTime);

    function resetInterval() {
        clearInterval(sliderInterval);
        sliderInterval = setInterval(nextSlide, intervalTime);
    }

    // --- Manual Control (Dots) ---

    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const slideIndex = parseInt(this.getAttribute('data-slide'));
            showSlide(slideIndex);
            
            // Reset the interval timer on manual click
            resetInterval();
        });
    });

    // --- Swipe Functionality ---

    if (sliderContainer) {
        sliderContainer.addEventListener('touchstart', (e) => {
            // Record the starting X position of the touch
            touchStartX = e.touches[0].clientX;
        });

        sliderContainer.addEventListener('touchmove', (e) => {
            // Prevent default scrolling during a horizontal swipe
            // (Optional, but often desirable for a better slider experience)
            // e.preventDefault();
        });

        sliderContainer.addEventListener('touchend', (e) => {
            // Record the ending X position of the touch
            touchEndX = e.changedTouches[0].clientX;

            // Calculate the distance and direction
            const distance = touchStartX - touchEndX;

            if (Math.abs(distance) > minSwipeDistance) {
                // It's a valid swipe
                if (distance > 0) {
                    // Swiped Left (Touch started on the left, ended on the right) -> Go to Next slide
                    nextSlide();
                } else {
                    // Swiped Right (Touch started on the right, ended on the left) -> Go to Previous slide
                    prevSlide();
                }
                
                // Reset the interval timer on manual swipe
                resetInterval();
            }
        });
    }


    // Initialize the slider (show the first slide)
    showSlide(0);
});

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('#header-nav'); // Use the new ID from step 1

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            // Toggle 'open' class on the navigation
            nav.classList.toggle('open');
            
            // Toggle 'open' class on the button itself (to switch icons)
            menuToggle.classList.toggle('open');
            
            // For accessibility: update aria-expanded attribute
            const isExpanded = menuToggle.classList.contains('open');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });
    }
});

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

let draggedItem = null;

// --- Drag and Drop Handlers---

function handleDragStart(e) {
    draggedItem = this;
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => this.classList.add('dragging'), 0);
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    draggedItem = null;
    saveTaskData();
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(e) {
    this.classList.add('drag-over');
}

function handleDragLeave(e) {
    const relatedTarget = e.relatedTarget;

    if (this !== relatedTarget && !this.contains(relatedTarget)) {
        this.classList.remove('drag-over');
    }
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');

    const targetItem = this;

    if (draggedItem !== targetItem) {
        const list = document.querySelector('.list');
        const items = Array.from(list.querySelectorAll('li'));
        const draggedIndex = items.indexOf(draggedItem);
        const targetIndex = items.indexOf(targetItem);

        if (draggedIndex > targetIndex) {
            list.insertBefore(draggedItem, targetItem);
        } else {
            list.insertBefore(draggedItem, targetItem.nextSibling);
        }
        saveTaskData(); // Save after successful reorder
    }
}

// --- Function to Attach Listeners to a Single Item ---
function attachDragListeners(li) {
    li.draggable = true;
    li.addEventListener('dragstart', handleDragStart);
    li.addEventListener('dragover', handleDragOver);
    li.addEventListener('dragenter', handleDragEnter);
    li.addEventListener('dragleave', handleDragLeave);
    li.addEventListener('dragend', handleDragEnd);
    li.addEventListener('drop', handleDrop);
}


// --- Function to Create and Add a New Task Element ---
function createTaskElement(taskText) {
    let li = document.createElement('li');
    attachDragListeners(li); // Attach listeners here

    let dragHandle = document.createElement('img');
    dragHandle.src = "images/drag_handle.png";
    dragHandle.alt = "Drag Handle";
    dragHandle.classList.add('drag-handle'); 
    li.appendChild(dragHandle);
    
    let taskTextDiv = document.createElement('div');
    taskTextDiv.classList.add('task-text');
    taskTextDiv.innerHTML = taskText;
    li.appendChild(taskTextDiv);


    let span = document.createElement('span');
    span.classList.add('material-symbols-outlined', 'delete-icon');
    span.innerHTML = "close";
    li.appendChild(span);
    
    return li;
}


// --- Function to Handle Adding a Task via Input ---
function addTask() {
    const list = document.querySelector('.list');
    const newTaskInput = document.getElementById('newTask');
    const errorDisplay = document.getElementById('taskError');

    if (!list || !newTaskInput || !errorDisplay) return;

    if(newTaskInput.value.trim() === ''){
        errorDisplay.textContent = 'Please enter a task.';
        errorDisplay.classList.add('shake-animation');
        setTimeout(() => {
            errorDisplay.classList.remove('shake-animation');
        }, 500);
        return;
    }
    
    const newTaskElement = createTaskElement(newTaskInput.value);
    list.appendChild(newTaskElement);
    
    errorDisplay.textContent = '';
    newTaskInput.value = "";
    saveTaskData();
}


document.addEventListener('DOMContentLoaded', function() {
    
    const list = document.querySelector('.list');
    const newTask = document.getElementById('newTask');
    
    if (list && newTask) {
        
        // --- Revised showTasks function ---
        function showTasks(){
            // Load saved HTML string
            const savedData = localStorage.getItem("data") || '';
            list.innerHTML = savedData;

            // CRITICAL STEP: Re-attach listeners to the loaded elements
            const existingItems = list.querySelectorAll('li');
            existingItems.forEach(item => {
                attachDragListeners(item);
            });
        }
        
        newTask.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                addTask();
            }
        });

        list.addEventListener("click", function(e){
            let targetElement = e.target;
            let listItem = targetElement.closest('li');
            
            if (targetElement.tagName === "LI" || targetElement.classList.contains('task-text')) {
                if (listItem) {
                    listItem.classList.toggle("checked");
                    saveTaskData();
                }
            }
            else if(targetElement.tagName === "SPAN"){
                if (listItem) {
                    listItem.remove();
                    saveTaskData();
                }
            }
        }, false);
        
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
                        <div class="journal-entry-card reveal active">
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