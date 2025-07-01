// JavaScript moved from Index.html
let menuItemCount = 0;
let uploadedFiles = [];

// Navigation
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });

    // Show selected section
    document.getElementById(sectionName).classList.remove('hidden');
    document.getElementById(sectionName).classList.add('fade-in');

    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('text-indigo-600', 'font-bold');
        btn.classList.add('text-gray-700');
    });
    event.target.classList.add('text-indigo-600', 'font-bold');

    // Typewriter effect for section headings
    if (sectionName === 'scanner') {
        runTypewriterOnce('typewriter-scanner', 'Connect Your WhatsApp');
    } else if (sectionName === 'builder') {
        runTypewriterOnce('typewriter-builder', 'Build Your WhatsApp Bot');
    } else if (sectionName === 'dashboard') {
        runTypewriterOnce('typewriter-dashboard', 'Bot Dashboard');
    }
}

// QR Code Generation
function generateQR() {
    const qrCode = document.getElementById('qr-code');
    qrCode.innerHTML = '⏳';

    setTimeout(() => {
        qrCode.innerHTML = `
            <div class="bg-white p-4 rounded-lg">
                <div class="grid grid-cols-8 gap-1">
                    ${Array(64).fill().map(() =>
            `<div class="w-2 h-2 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}"></div>`
        ).join('')}
                </div>
            </div>
        `;

        // Simulate connection after 3 seconds
        setTimeout(() => {
            document.getElementById('connection-status').classList.remove('hidden');
        }, 3000);
    }, 1000);
}

// Menu Item Management
function addMenuItem() {
    menuItemCount++;
    const menuItems = document.getElementById('menu-items');

    const menuItem = document.createElement('div');
    menuItem.className = 'p-4 border border-gray-200 rounded-lg fade-in';
    menuItem.id = `menu-item-${menuItemCount}`;

    menuItem.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <h4 class="text-lg font-medium">Menu Item ${menuItemCount}</h4>
            <button onclick="removeMenuItem(${menuItemCount})" class="text-red-600 hover:text-red-800">
                ✕
            </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Trigger Keywords</label>
                <input type="text" placeholder="e.g., pricing, help, support" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <p class="text-xs text-gray-500 mt-1">Comma-separated keywords</p>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Response Type</label>
                <select class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" onchange="toggleResponseType(this, ${menuItemCount})">
                    <option value="text">Text Response</option>
                    <option value="file">File Response</option>
                    <option value="menu">Sub-menu</option>
                </select>
            </div>
        </div>
        
        <div class="mt-4">
            <div id="text-response-${menuItemCount}">
                <label class="block text-sm font-medium text-gray-700 mb-2">Response Message</label>
                <textarea placeholder="Enter your response message here..." class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 h-20"></textarea>
            </div>
            
            <div id="file-response-${menuItemCount}" class="hidden">
                <label class="block text-sm font-medium text-gray-700 mb-2">Select File to Send</label>
                <select class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">Choose a file...</option>
                </select>
            </div>
            
            <div id="menu-response-${menuItemCount}" class="hidden">
                <label class="block text-sm font-medium text-gray-700 mb-2">Sub-menu Options</label>
                <textarea placeholder="1. Option One&#10;2. Option Two&#10;3. Option Three" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 h-20"></textarea>
            </div>
        </div>
    `;

    menuItems.appendChild(menuItem);
}

function removeMenuItem(id) {
    document.getElementById(`menu-item-${id}`).remove();
}

function toggleResponseType(select, id) {
    const textDiv = document.getElementById(`text-response-${id}`);
    const fileDiv = document.getElementById(`file-response-${id}`);
    const menuDiv = document.getElementById(`menu-response-${id}`);

    // Hide all
    textDiv.classList.add('hidden');
    fileDiv.classList.add('hidden');
    menuDiv.classList.add('hidden');

    // Show selected
    if (select.value === 'text') {
        textDiv.classList.remove('hidden');
    } else if (select.value === 'file') {
        fileDiv.classList.remove('hidden');
    } else if (select.value === 'menu') {
        menuDiv.classList.remove('hidden');
    }
}

// File Management
document.getElementById('bot-files').addEventListener('change', function (e) {
    const files = Array.from(e.target.files);
    const uploadedFilesDiv = document.getElementById('uploaded-files');

    files.forEach(file => {
        uploadedFiles.push(file);

        const fileDiv = document.createElement('div');
        fileDiv.className = 'bg-white p-3 rounded-lg border text-center fade-in';

        const fileIcon = getFileIcon(file.type);
        fileDiv.innerHTML = `
            <div class="text-2xl mb-2">${fileIcon}</div>
            <p class="text-xs text-gray-600 truncate">${file.name}</p>
            <p class="text-xs text-gray-400">${(file.size / 1024).toFixed(1)} KB</p>
        `;

        uploadedFilesDiv.appendChild(fileDiv);
    });

    // Update file selects in menu items
    updateFileSelects();
});

function getFileIcon(fileType) {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType.startsWith('video/')) return '🎥';
    if (fileType.startsWith('audio/')) return '🎵';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('document') || fileType.includes('word')) return '📝';
    return '📁';
}

function updateFileSelects() {
    const selects = document.querySelectorAll('select[class*="w-full px-3 py-2 border border-gray-300 rounded-md"]');
    selects.forEach(select => {
        if (select.previousElementSibling && select.previousElementSibling.textContent === 'Select File to Send') {
            select.innerHTML = '<option value="">Choose a file...</option>';
            uploadedFiles.forEach((file, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = file.name;
                select.appendChild(option);
            });
        }
    });
}

// Save Bot
function saveBot() {
    const botName = document.getElementById('bot-name').value;
    const welcomeMessage = document.getElementById('welcome-message').value;
    const defaultResponse = document.getElementById('default-response').value;

    if (!botName || !welcomeMessage) {
        alert('Please fill in the bot name and welcome message.');
        return;
    }

    // Simulate saving
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Saving...';
    button.disabled = true;

    setTimeout(() => {
        button.textContent = 'Saved!';
        button.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
        button.classList.add('bg-green-600');

        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
            button.classList.remove('bg-green-600');
            button.classList.add('bg-indigo-600', 'hover:bg-indigo-700');
        }, 2000);
    }, 1000);
}

// Initialize with one menu item
document.addEventListener('DOMContentLoaded', function () {
    addMenuItem();
});

document.addEventListener('DOMContentLoaded', function () {
    runTypewriterOnce('typewriter', 'Digital Marketing Redefined...');
});

// Helper to run typewriter effect only once per section
const typewriterRan = {};
function runTypewriterOnce(id, text) {
    if (typewriterRan[id]) return;
    typewriterRan[id] = true;
    const el = document.getElementById(id);
    if (!el) return;
    let i = 0;
    function type() {
        if (i <= text.length) {
            el.innerHTML = text.substring(0, i) + '<span class="type-cursor">|</span>';
            i++;
            setTimeout(type, 60);
        } else {
            el.innerHTML = text + '<span class="type-cursor blink">|</span>';
        }
    }
    type();
}
