// ========================================
// Python Junior Course - Interactive Learning
// ========================================

// State management
const state = {
    dragdrop: { completed: new Set() },
    coding: { completed: new Set() },
    quiz: { answers: {}, submitted: false }
};

// ========================================
// COURSE PROGRESS SYSTEM
// ========================================

// Lesson order for unlocking
const LESSON_ORDER = [
    'introduction',
    'variables',
    'datatypes',
    'operators',
    'userinput',
    'syntax-errors',
    'conditionals',
    'forloops',
    'whileloops',
    'strings',
    'lists',
    'tuples',
    'dictionaries',
    'sets',
    'comprehensions',
    'functions',
    'advanced-functions',
    'modules',
    'error-handling',
    'files',
    'classes',
    'capstone'
];

// Get current lesson name from URL
function getCurrentLessonName() {
    const path = window.location.pathname;
    const match = path.match(/lessons\/([^.]+)\.html/);
    return match ? match[1] : null;
}

// Get progress from localStorage
function getProgress() {
    const saved = localStorage.getItem('pythonJrProgress');
    return saved ? JSON.parse(saved) : { completedLessons: ['introduction'] };
}

// Save progress to localStorage
function saveProgress(progress) {
    localStorage.setItem('pythonJrProgress', JSON.stringify(progress));
}

// Check if a lesson is unlocked
function isLessonUnlocked(lessonName) {
    const progress = getProgress();
    const lessonIndex = LESSON_ORDER.indexOf(lessonName);
    
    // First lesson is always unlocked
    if (lessonIndex === 0) return true;
    
    // Check if previous lesson is completed
    const previousLesson = LESSON_ORDER[lessonIndex - 1];
    return progress.completedLessons.includes(previousLesson);
}

// Check if a lesson is completed
function isLessonCompleted(lessonName) {
    const progress = getProgress();
    return progress.completedLessons.includes(lessonName);
}

// Mark a lesson as completed
function completeLesson(lessonName) {
    const progress = getProgress();
    if (!progress.completedLessons.includes(lessonName)) {
        progress.completedLessons.push(lessonName);
        saveProgress(progress);
        
        // Show completion notification
        showCompletionNotification(lessonName);
        
        return true;
    }
    return false;
}

// Show completion notification
function showCompletionNotification(lessonName) {
    const notification = document.createElement('div');
    notification.className = 'lesson-complete-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">🎉</span>
            <div class="notification-text">
                <strong>Lesson Complete!</strong>
                <p>You've unlocked the next lesson!</p>
            </div>
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Check if all practice sections are completed
function checkAllPracticeCompleted() {
    const currentLesson = getCurrentLessonName();
    if (!currentLesson) return;
    
    // Get total required completions for each section
    const dragdropChallenges = document.querySelectorAll('.drag-challenge').length;
    const codingChallenges = document.querySelectorAll('.coding-challenge').length;
    const hasQuiz = document.querySelector('.submit-quiz-btn') !== null;
    
    // Check if all are done
    const dragdropDone = state.dragdrop.completed.size >= dragdropChallenges || dragdropChallenges === 0;
    const codingDone = state.coding.completed.size >= codingChallenges || codingChallenges === 0;
    const quizDone = state.quiz.submitted || !hasQuiz;
    
    // If all practice is done, mark lesson as complete
    if (dragdropDone && codingDone && quizDone) {
        if (!isLessonCompleted(currentLesson)) {
            completeLesson(currentLesson);
        }
    }
}

// Manual complete lesson button (for lessons without full practice)
function manualCompleteLesson() {
    const currentLesson = getCurrentLessonName();
    if (!currentLesson) return;
    
    if (confirm('Are you sure you have completed this lesson?')) {
        completeLesson(currentLesson);
    }
}

// Add completion button to lessons
function addCompletionButton() {
    const currentLesson = getCurrentLessonName();
    if (!currentLesson) return;
    
    // Don't add if already completed
    if (isLessonCompleted(currentLesson)) {
        // Show completed badge
        const badge = document.createElement('div');
        badge.className = 'lesson-completed-badge';
        badge.innerHTML = '✅ Lesson Completed!';
        const header = document.querySelector('header');
        if (header) {
            header.appendChild(badge);
        }
        return;
    }
    
    // Check if lesson has practice sections
    const hasPractice = document.querySelector('.drag-challenge') || 
                        document.querySelector('.coding-challenge') || 
                        document.querySelector('.submit-quiz-btn');
    
    // If no practice, show manual complete button
    if (!hasPractice) {
        const btn = document.createElement('button');
        btn.className = 'manual-complete-btn';
        btn.innerHTML = '✅ Mark Lesson as Complete';
        btn.onclick = manualCompleteLesson;
        
        const footer = document.querySelector('footer');
        if (footer) {
            footer.insertBefore(btn, footer.firstChild);
        }
    }
}

// Get completion percentage
function getCompletionPercentage() {
    const progress = getProgress();
    return Math.round((progress.completedLessons.length / LESSON_ORDER.length) * 100);
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initMainTabs();
    initPracticeTabs();
    initDemoInputs();
    initDragAndDrop();
    initCodeEditors();
    
    // Check if on roadmap page
    if (window.location.pathname.includes('roadmap.html')) {
        initRoadmapProgress();
    }
    
    // Check if on a lesson page
    if (window.location.pathname.includes('lessons/')) {
        addCompletionButton();
    }
});

// Main Tab Navigation
function initMainTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const tabId = btn.dataset.tab;
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Practice Sub-Tab Navigation
function initPracticeTabs() {
    const practiceBtns = document.querySelectorAll('.practice-tab-btn');
    const practiceContents = document.querySelectorAll('.practice-content');

    practiceBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            practiceBtns.forEach(b => b.classList.remove('active'));
            practiceContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const practiceId = btn.dataset.practice;
            document.getElementById(practiceId).classList.add('active');
        });
    });
}

function initDemoInputs() {
    const ifInput = document.getElementById('if-demo-input');
    if (ifInput) {
        ifInput.addEventListener('input', () => {
            document.getElementById('if-demo-value').textContent = ifInput.value;
        });
    }
}

// ========================================
// COPY CODE FUNCTION
// ========================================

function copyCode(button) {
    const codeBlock = button.closest('.code-block');
    const code = codeBlock.querySelector('code').textContent;
    
    navigator.clipboard.writeText(code).then(() => {
        const originalText = button.textContent;
        button.textContent = '✓ Copied!';
        button.style.color = 'var(--accent-green)';
        button.style.borderColor = 'var(--accent-green)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.color = '';
            button.style.borderColor = '';
        }, 2000);
    });
}

// ========================================
// INTERACTIVE DEMOS
// ========================================

function runIfDemo() {
    const input = document.getElementById('if-demo-input');
    const output = document.getElementById('if-demo-output');
    const displayValue = document.getElementById('if-demo-value');
    
    const number = parseInt(input.value);
    displayValue.textContent = number;
    
    output.classList.remove('error');
    output.classList.add('success');
    
    if (isNaN(number)) {
        output.classList.add('error');
        output.textContent = '❌ Please enter a valid number!';
        return;
    }
    
    if (number > 0) {
        output.innerHTML = `<strong>Output:</strong> Positive number! ➕<br><br>` +
            `<span style="color: var(--text-muted)">📝 Explanation: ${number} > 0 is <span style="color: var(--accent-green)">True</span>, so the first branch executes.</span>`;
    } else {
        output.innerHTML = `<strong>Output:</strong> Zero or negative! ➖<br><br>` +
            `<span style="color: var(--text-muted)">📝 Explanation: ${number} > 0 is <span style="color: var(--accent-red)">False</span>, so the else branch executes.</span>`;
    }
}

function runElifDemo() {
    const input = document.getElementById('elif-demo-input');
    const output = document.getElementById('elif-demo-output');
    const gradeFill = document.getElementById('grade-fill');
    const gradeMarker = document.getElementById('grade-marker');
    
    const score = parseInt(input.value);
    
    output.classList.remove('error');
    output.classList.add('success');
    
    if (isNaN(score) || score < 0 || score > 100) {
        output.classList.add('error');
        output.textContent = '❌ Please enter a valid score between 0 and 100!';
        return;
    }
    
    let grade, message, emoji, color;
    
    if (score >= 90) {
        grade = 'A'; message = 'Excellent!'; emoji = '🌟'; color = 'var(--accent-teal)';
    } else if (score >= 80) {
        grade = 'B'; message = 'Great job!'; emoji = '👍'; color = 'var(--accent-green)';
    } else if (score >= 70) {
        grade = 'C'; message = 'Good effort!'; emoji = '💪'; color = 'var(--accent-yellow)';
    } else if (score >= 60) {
        grade = 'D'; message = 'Keep trying!'; emoji = '📚'; color = 'var(--accent-orange)';
    } else {
        grade = 'F'; message = 'Need improvement'; emoji = '😢'; color = 'var(--accent-red)';
    }
    
    output.innerHTML = `
        <div style="font-size: 2rem; margin-bottom: 0.5rem; color: ${color}">${emoji} Grade: ${grade}</div>
        <div style="color: var(--text-secondary)">${message}</div>
    `;
    
    const percentage = score;
    gradeMarker.style.left = `calc(${percentage}% - 2px)`;
    gradeFill.style.width = `${100 - percentage}%`;
    gradeFill.style.left = `${percentage}%`;
}

function runNestedDemo() {
    const age = parseInt(document.getElementById('nested-age').value);
    const height = parseInt(document.getElementById('nested-height').value);
    const hasTicket = document.getElementById('nested-ticket').checked;
    const output = document.getElementById('nested-demo-output');
    
    const flowTicket = document.getElementById('flow-ticket');
    const flowAge = document.getElementById('flow-age');
    const flowHeight = document.getElementById('flow-height');
    const flowResult = document.getElementById('flow-result');
    
    [flowTicket, flowAge, flowHeight, flowResult].forEach(node => {
        node.classList.remove('active', 'failed');
    });
    
    let messages = [];
    let canRide = true;
    
    if (hasTicket) {
        flowTicket.classList.add('active');
        messages.push('✓ You have a ticket!');
        
        if (age >= 12) {
            flowAge.classList.add('active');
            messages.push('✓ Age requirement met!');
            
            if (height >= 140) {
                flowHeight.classList.add('active');
                flowResult.classList.add('active');
                messages.push('✓ Height requirement met!');
                messages.push('🎢 Enjoy the ride!');
            } else {
                flowHeight.classList.add('failed');
                flowResult.classList.add('failed');
                messages.push(`✗ Sorry, you must be at least 140cm tall. (Current: ${height}cm)`);
                canRide = false;
            }
        } else {
            flowAge.classList.add('failed');
            flowResult.classList.add('failed');
            messages.push(`✗ Sorry, you must be at least 12 years old. (Current: ${age} years)`);
            canRide = false;
        }
    } else {
        flowTicket.classList.add('failed');
        flowResult.classList.add('failed');
        messages.push('✗ Please buy a ticket first!');
        canRide = false;
    }
    
    output.classList.remove('error', 'success');
    output.classList.add(canRide ? 'success' : 'error');
    output.innerHTML = messages.map(m => `<div>${m}</div>`).join('');
}

function runMatchDemo() {
    const day = document.getElementById('match-demo-input').value;
    const output = document.getElementById('match-demo-output');
    
    let mood, emoji, color;
    
    switch(day) {
        case 'Monday':
            mood = 'Start of the work week...'; emoji = '😫'; color = 'var(--accent-red)';
            break;
        case 'Tuesday':
        case 'Wednesday':
        case 'Thursday':
            mood = 'Keep working hard!'; emoji = '💼'; color = 'var(--accent-yellow)';
            break;
        case 'Friday':
            mood = 'TGIF! Almost weekend!'; emoji = '🎉'; color = 'var(--accent-green)';
            break;
        case 'Saturday':
        case 'Sunday':
            mood = 'Weekend! Time to relax!'; emoji = '🎮'; color = 'var(--accent-teal)';
            break;
        default:
            mood = "That's not a valid day!"; emoji = '❓'; color = 'var(--text-muted)';
    }
    
    output.classList.add('success');
    output.innerHTML = `
        <div style="font-size: 2rem; margin-bottom: 0.5rem">${emoji}</div>
        <div style="font-size: 1.2rem; color: ${color}; font-weight: 600">${day}</div>
        <div style="margin-top: 0.5rem">${mood}</div>
    `;
}

// ========================================
// DRAG AND DROP FUNCTIONALITY
// ========================================

let draggedPiece = null;

function initDragAndDrop() {
    // Initialize all drag pieces
    document.querySelectorAll('.drag-piece').forEach(piece => {
        piece.addEventListener('dragstart', handleDragStart);
        piece.addEventListener('dragend', handleDragEnd);
    });

    // Initialize all drop zones
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('dragleave', handleDragLeave);
        zone.addEventListener('drop', handleDrop);
        zone.addEventListener('click', handleDropZoneClick);
    });
}

function handleDragStart(e) {
    draggedPiece = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', e.target.dataset.value);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    draggedPiece = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    const zone = e.currentTarget;
    zone.classList.remove('drag-over');
    
    if (draggedPiece && !zone.classList.contains('filled')) {
        const value = e.dataTransfer.getData('text/plain');
        zone.textContent = value;
        zone.classList.add('filled');
        zone.dataset.currentValue = value;
        draggedPiece.classList.add('used');
        
        // Reset validation classes
        zone.classList.remove('correct', 'incorrect');
    }
}

function handleDropZoneClick(e) {
    const zone = e.currentTarget;
    if (zone.classList.contains('filled')) {
        // Return piece to pool
        const challengeDiv = zone.closest('.drag-challenge');
        const piecesContainer = challengeDiv.querySelector('.drag-pieces');
        const value = zone.dataset.currentValue;
        
        // Find and restore the used piece
        const usedPiece = piecesContainer.querySelector(`.drag-piece.used[data-value="${value}"]`);
        if (usedPiece) {
            usedPiece.classList.remove('used');
        }
        
        // Clear the zone
        zone.textContent = '';
        zone.classList.remove('filled', 'correct', 'incorrect');
        delete zone.dataset.currentValue;
    }
}

function checkDragChallenge(challengeId) {
    const challengeDiv = document.querySelector(`[data-challenge="${challengeId}"]`);
    const dropZones = challengeDiv.querySelectorAll('.drop-zone');
    const resultDiv = document.getElementById(`result-${challengeId}`);
    
    let allCorrect = true;
    let filledCount = 0;
    let correctCount = 0;
    
    dropZones.forEach(zone => {
        const expected = zone.dataset.answer;
        const current = zone.dataset.currentValue;
        
        zone.classList.remove('correct', 'incorrect');
        
        if (current) {
            filledCount++;
            if (current === expected) {
                zone.classList.add('correct');
                correctCount++;
            } else {
                zone.classList.add('incorrect');
                allCorrect = false;
            }
        } else {
            allCorrect = false;
        }
    });
    
    resultDiv.classList.add('show');
    resultDiv.classList.remove('success', 'error', 'partial');
    
    if (filledCount < dropZones.length) {
        resultDiv.classList.add('partial');
        resultDiv.innerHTML = `⚠️ Please fill in all the blanks! (${filledCount}/${dropZones.length} filled)`;
    } else if (allCorrect) {
        resultDiv.classList.add('success');
        resultDiv.innerHTML = `🎉 <strong>Perfect!</strong> All pieces are in the correct place!`;
        
        // Mark as completed
        state.dragdrop.completed.add(challengeId);
        updateProgress('dragdrop');
        
        // Check if all practice is done
        checkAllPracticeCompleted();
    } else {
        resultDiv.classList.add('error');
        resultDiv.innerHTML = `❌ Not quite right. ${correctCount}/${dropZones.length} correct. The red pieces are in the wrong place - click them to remove and try again!`;
    }
}

function resetDragChallenge(challengeId) {
    const challengeDiv = document.querySelector(`[data-challenge="${challengeId}"]`);
    const dropZones = challengeDiv.querySelectorAll('.drop-zone');
    const pieces = challengeDiv.querySelectorAll('.drag-piece');
    const resultDiv = document.getElementById(`result-${challengeId}`);
    
    // Clear all zones
    dropZones.forEach(zone => {
        zone.textContent = '';
        zone.classList.remove('filled', 'correct', 'incorrect');
        delete zone.dataset.currentValue;
    });
    
    // Reset all pieces
    pieces.forEach(piece => {
        piece.classList.remove('used');
    });
    
    // Hide result
    resultDiv.classList.remove('show');
}

// ========================================
// CODING CHALLENGES
// ========================================

function initCodeEditors() {
    // Update line counts on input
    document.querySelectorAll('.code-textarea').forEach(textarea => {
        textarea.addEventListener('input', (e) => {
            const id = e.target.id.replace('-input', '');
            const lineCountSpan = document.getElementById(`lines-${id}`);
            if (lineCountSpan) {
                const lines = e.target.value.split('\n').length;
                lineCountSpan.textContent = lines;
            }
        });
        
        // Handle tab key
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                textarea.value = textarea.value.substring(0, start) + '    ' + textarea.value.substring(end);
                textarea.selectionStart = textarea.selectionEnd = start + 4;
            }
        });
    });
}

function toggleCodingHint(challengeId) {
    const hint = document.getElementById(`hint-${challengeId}`);
    hint.classList.toggle('show');
}

function runCodingChallenge(challengeId) {
    const textarea = document.getElementById(`${challengeId}-input`);
    const code = textarea.value; // Keep original case for indentation check
    const resultDiv = document.getElementById(`result-${challengeId}`);
    
    resultDiv.classList.add('show');
    resultDiv.classList.remove('success', 'error', 'partial');
    
    let result;
    let feedback = '';
    
    switch(challengeId) {
        case 'code1':
            result = checkCode1(code);
            if (result.isCorrect) {
                feedback = `🎉 <strong>Excellent!</strong> Your code correctly identifies positive, negative, and zero numbers!<br><br>
                <strong>Key concepts used:</strong>
                <ul style="margin-top: 0.5rem; margin-left: 1rem;">
                    <li>Comparison operators (<code>&gt;</code>, <code>&lt;</code>, <code>==</code>)</li>
                    <li>if-elif-else chain</li>
                    <li>Proper indentation (4 spaces)</li>
                    <li>Colons after conditions</li>
                </ul>`;
            } else {
                feedback = buildErrorFeedback(result, 'code1');
            }
            break;
            
        case 'code2':
            result = checkCode2(code);
            if (result.isCorrect) {
                feedback = `🎉 <strong>Great job!</strong> Your age category classifier works correctly!<br><br>
                <strong>Key concepts used:</strong>
                <ul style="margin-top: 0.5rem; margin-left: 1rem;">
                    <li>Multiple elif conditions</li>
                    <li>Range checking with <code>&lt;=</code> and <code>&gt;=</code></li>
                    <li>Proper indentation (4 spaces)</li>
                    <li>Colons after conditions</li>
                </ul>`;
            } else {
                feedback = buildErrorFeedback(result, 'code2');
            }
            break;
            
        case 'code3':
            result = checkCode3(code);
            if (result.isCorrect) {
                feedback = `🎉 <strong>Excellent work!</strong> Your nested login system is correct!<br><br>
                <strong>Key concepts used:</strong>
                <ul style="margin-top: 0.5rem; margin-left: 1rem;">
                    <li>Nested if statements</li>
                    <li>String comparison with <code>==</code></li>
                    <li>Proper indentation for nested blocks</li>
                    <li>Colons after conditions</li>
                </ul>`;
            } else {
                feedback = buildErrorFeedback(result, 'code3');
            }
            break;
    }
    
    if (result && result.isCorrect) {
        resultDiv.classList.add('success');
        state.coding.completed.add(challengeId);
        updateProgress('coding');
        
        // Check if all practice is done
        checkAllPracticeCompleted();
    } else {
        resultDiv.classList.add('error');
    }
    
    resultDiv.innerHTML = feedback;
}

// Build specific error feedback based on what's missing
function buildErrorFeedback(result, challengeId) {
    let errors = [];
    let syntaxErrors = [];
    
    // Check for Python syntax errors first (most important!)
    if (!result.hasColons) {
        syntaxErrors.push(`<li>⚠️ <strong>Missing colons!</strong> Every <code>if</code>, <code>elif</code>, and <code>else</code> must end with <code>:</code></li>`);
    }
    if (!result.hasIndentation) {
        syntaxErrors.push(`<li>⚠️ <strong>Missing indentation!</strong> Code inside <code>if</code>/<code>else</code> blocks must be indented with <strong>4 spaces</strong></li>`);
    }
    
    // Challenge-specific errors
    if (!result.hasOutputs) {
        if (challengeId === 'code1') {
            errors.push(`<li>Print <code>"Positive"</code>, <code>"Negative"</code>, and <code>"Zero"</code></li>`);
        } else if (challengeId === 'code2') {
            errors.push(`<li>Print all four categories: <code>"Child"</code>, <code>"Teenager"</code>, <code>"Adult"</code>, <code>"Senior"</code></li>`);
        } else if (challengeId === 'code3') {
            errors.push(`<li>Include messages for success and failure cases</li>`);
        }
    }
    
    if (!result.hasStructure) {
        if (challengeId === 'code1') {
            errors.push(`<li>Use <code>if</code>, <code>elif</code>/<code>else</code> structure with comparisons to <code>0</code></li>`);
        } else if (challengeId === 'code2') {
            errors.push(`<li>Use <code>if</code> and <code>elif</code> to check age ranges</li>`);
        } else if (challengeId === 'code3') {
            errors.push(`<li>Use <strong>nested</strong> if statements - password check inside username check</li>`);
        }
    }
    
    let html = `❌ <strong>Not quite right!</strong><br><br>`;
    
    // Show syntax errors prominently if any
    if (syntaxErrors.length > 0) {
        html += `<div style="background: rgba(243, 139, 168, 0.15); padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid var(--accent-red);">
            <strong>🐍 Python Syntax Errors:</strong>
            <ul style="margin-top: 0.5rem; margin-left: 1rem;">
                ${syntaxErrors.join('')}
            </ul>
        </div>`;
    }
    
    // Show other errors
    if (errors.length > 0) {
        html += `<strong>Also check:</strong>
        <ul style="margin-top: 0.5rem; margin-left: 1rem;">
            ${errors.join('')}
        </ul>`;
    }
    
    // Add example of correct syntax
    html += `<br><div style="background: var(--code-bg); padding: 1rem; border-radius: 8px; margin-top: 0.5rem;">
        <strong>📝 Remember Python syntax:</strong>
        <pre style="margin-top: 0.5rem; color: var(--text-secondary);">if condition<span style="color: var(--accent-yellow);">:</span>
<span style="color: var(--accent-blue);">    </span>print("inside block")  <span style="color: var(--text-muted)"># ← 4 spaces!</span>
else<span style="color: var(--accent-yellow);">:</span>
<span style="color: var(--accent-blue);">    </span>print("else block")    <span style="color: var(--text-muted)"># ← 4 spaces!</span></pre>
    </div>`;
    
    return html;
}

function checkCode1(code) {
    // Check for proper Python syntax including indentation and colons!
    const originalCode = code;
    const codeLower = code.toLowerCase();
    
    // Check that all three outputs exist (must be in quotes!)
    const hasPositive = /["']positive["']/i.test(code);
    const hasNegative = /["']negative["']/i.test(code);
    const hasZero = /["']zero["']/i.test(code);
    
    // Check for conditional structure
    const hasIf = codeLower.includes('if');
    const hasElifOrElse = codeLower.includes('elif') || codeLower.includes('else');
    
    // Check for comparison with 0
    const hasComparison = codeLower.includes('> 0') || codeLower.includes('>0') || 
                          codeLower.includes('< 0') || codeLower.includes('<0') ||
                          codeLower.includes('== 0') || codeLower.includes('==0') ||
                          codeLower.includes('!= 0') || codeLower.includes('!=0');
    
    // Check for print statements
    const hasPrint = codeLower.includes('print');
    
    // IMPORTANT: Check for colons - must have : at end of line with if/elif/else
    const syntaxCheck = checkPythonSyntax(originalCode);
    
    return {
        isCorrect: hasPositive && hasNegative && hasZero && hasIf && hasElifOrElse && 
                   hasComparison && hasPrint && syntaxCheck.hasColons && syntaxCheck.hasIndentation,
        hasColons: syntaxCheck.hasColons,
        hasIndentation: syntaxCheck.hasIndentation,
        hasOutputs: hasPositive && hasNegative && hasZero,
        hasStructure: hasIf && hasElifOrElse && hasComparison
    };
}

function checkCode2(code) {
    // Check for proper Python syntax including indentation and colons!
    const originalCode = code;
    const codeLower = code.toLowerCase();
    
    // Check that all four categories are mentioned (in quotes!)
    const hasChild = /["']child["']/i.test(code);
    const hasTeenager = /["']teenager["']/i.test(code) || /["']teen["']/i.test(code);
    const hasAdult = /["']adult["']/i.test(code);
    const hasSenior = /["']senior["']/i.test(code);
    
    // Check for conditional structure with multiple branches
    const hasIf = codeLower.includes('if');
    const hasElif = codeLower.includes('elif');
    
    // Check for age-related comparisons
    const hasAgeChecks = (codeLower.includes('12') || codeLower.includes('13')) &&
                         (codeLower.includes('17') || codeLower.includes('18')) &&
                         (codeLower.includes('64') || codeLower.includes('65'));
    
    // Check for print statements
    const hasPrint = codeLower.includes('print');
    
    // IMPORTANT: Check for colons and indentation
    const syntaxCheck = checkPythonSyntax(originalCode);
    
    return {
        isCorrect: hasChild && hasTeenager && hasAdult && hasSenior && hasIf && hasElif && 
                   hasAgeChecks && hasPrint && syntaxCheck.hasColons && syntaxCheck.hasIndentation,
        hasColons: syntaxCheck.hasColons,
        hasIndentation: syntaxCheck.hasIndentation,
        hasOutputs: hasChild && hasTeenager && hasAdult && hasSenior,
        hasStructure: hasIf && hasElif && hasAgeChecks
    };
}

function checkCode3(code) {
    // Check for proper Python syntax including indentation and colons!
    const originalCode = code;
    const codeLower = code.toLowerCase();
    
    // Check for username validation (admin must be in quotes)
    const hasUsernameCheck = codeLower.includes('username') && /["']admin["']/i.test(code);
    
    // Check for password validation (1234 must be in quotes)
    const hasPasswordCheck = codeLower.includes('password') && /["']1234["']/i.test(code);
    
    // Check for nested structure (at least 2 if statements)
    const hasNestedIf = (codeLower.match(/if\s/g) || []).length >= 2;
    
    // Check for different outcome messages (must be in quotes!)
    const hasSuccessMessage = /["'][^"']*(?:success|welcome|login|correct|granted)[^"']*["']/i.test(code) ||
                              code.includes('✅');
    const hasFailMessage = /["'][^"']*(?:wrong|incorrect|invalid|fail|error|not found|denied)[^"']*["']/i.test(code) ||
                           code.includes('❌');
    
    // Check for print and else
    const hasPrint = codeLower.includes('print');
    const hasElse = codeLower.includes('else');
    
    // IMPORTANT: Check for colons and indentation
    const syntaxCheck = checkPythonSyntax(originalCode);
    
    return {
        isCorrect: hasUsernameCheck && hasPasswordCheck && hasNestedIf && 
                   hasSuccessMessage && hasFailMessage && hasPrint && hasElse &&
                   syntaxCheck.hasColons && syntaxCheck.hasIndentation,
        hasColons: syntaxCheck.hasColons,
        hasIndentation: syntaxCheck.hasIndentation,
        hasOutputs: hasSuccessMessage && hasFailMessage,
        hasStructure: hasUsernameCheck && hasPasswordCheck && hasNestedIf
    };
}

// Helper function to check for proper Python syntax (colons and indentation)
function checkPythonSyntax(code) {
    const lines = code.split('\n');
    let hasColons = true;
    let hasIndentation = true;
    let expectIndentNext = false;
    let foundAnyConditional = false;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();
        const trimmedLower = trimmedLine.toLowerCase();
        
        // Skip empty lines and comments
        if (trimmedLine === '' || trimmedLine.startsWith('#')) continue;
        
        // Check if previous line was a conditional, this line should be indented
        if (expectIndentNext) {
            const leadingSpaces = line.match(/^(\s*)/)[1];
            // Must have at least 2 spaces/characters of indentation
            if (leadingSpaces.length < 2) {
                // Unless this is another conditional statement at same level
                if (!trimmedLower.startsWith('elif') && !trimmedLower.startsWith('else')) {
                    hasIndentation = false;
                }
            }
            expectIndentNext = false;
        }
        
        // Check for if/elif/else statements - MUST have colon at end
        if (trimmedLower.startsWith('if ') || trimmedLower.startsWith('if(')) {
            foundAnyConditional = true;
            if (!trimmedLine.endsWith(':')) {
                hasColons = false;
            } else {
                expectIndentNext = true;
            }
        }
        else if (trimmedLower.startsWith('elif ') || trimmedLower.startsWith('elif(')) {
            if (!trimmedLine.endsWith(':')) {
                hasColons = false;
            } else {
                expectIndentNext = true;
            }
        }
        else if (trimmedLower === 'else' || trimmedLower.startsWith('else:') || trimmedLower.startsWith('else ')) {
            if (!trimmedLine.includes(':')) {
                hasColons = false;
            } else {
                expectIndentNext = true;
            }
        }
    }
    
    // If no conditionals found with colons, fail
    if (!foundAnyConditional) {
        hasColons = false;
    }
    
    return {
        hasColons: hasColons,
        hasIndentation: hasIndentation
    };
}

// ========================================
// CODE ANALYSIS QUIZ
// ========================================

const quizAnswers = {
    'analysis-q1': 'a',  // x=10, y=5, x>y prints "A"
    'analysis-q2': 'c',  // score=75, >= 70 so "C"
    'analysis-q3': 'c',  // All three separate ifs will print
    'analysis-q4': 'b',  // has_ticket=True, age=15 < 18, so "Too young"
    'analysis-q5': 'd'   // color="blue" doesn't match any case, so "_" prints "Unknown"
};

function submitAnalysisQuiz() {
    if (state.quiz.submitted) return;
    
    let score = 0;
    const breakdown = [];
    
    // Check each question
    Object.keys(quizAnswers).forEach((questionName, index) => {
        const selected = document.querySelector(`input[name="${questionName}"]:checked`);
        const questionDiv = document.querySelector(`[data-question="q${index + 1}"]`);
        const correctAnswer = quizAnswers[questionName];
        
        const labels = questionDiv.querySelectorAll('.option-label');
        labels.forEach(label => {
            const input = label.querySelector('input');
            if (input.value === correctAnswer) {
                label.classList.add('correct');
            }
            if (selected && input.value === selected.value && selected.value !== correctAnswer) {
                label.classList.add('incorrect');
            }
        });
        
        const isCorrect = selected && selected.value === correctAnswer;
        if (isCorrect) {
            score++;
            questionDiv.classList.add('answered-correct');
        } else {
            questionDiv.classList.add('answered-wrong');
        }
        
        breakdown.push({
            question: index + 1,
            correct: isCorrect,
            yourAnswer: selected ? selected.value.toUpperCase() : 'No answer',
            correctAnswer: correctAnswer.toUpperCase()
        });
    });
    
    // Show results
    const resultDiv = document.getElementById('quiz-final-result');
    const scoreSpan = document.getElementById('quiz-score');
    const messageDiv = document.getElementById('quiz-message');
    const breakdownDiv = document.getElementById('quiz-breakdown');
    
    scoreSpan.textContent = score;
    
    let message = '';
    if (score === 5) {
        message = '🏆 Perfect Score! You\'re a Python conditionals master!';
    } else if (score >= 4) {
        message = '🌟 Excellent! You understand conditionals very well!';
    } else if (score >= 3) {
        message = '👍 Good job! Review the incorrect answers above.';
    } else if (score >= 2) {
        message = '📚 Keep practicing! Go back and study the lessons.';
    } else {
        message = '💪 Don\'t give up! Review each section and try again.';
    }
    
    messageDiv.textContent = message;
    
    // Build breakdown HTML
    let breakdownHTML = '';
    breakdown.forEach(item => {
        const className = item.correct ? 'correct' : 'wrong';
        const icon = item.correct ? '✓' : '✗';
        breakdownHTML += `
            <div class="breakdown-item ${className}">
                <span>${icon} Question ${item.question}</span>
                <span>${item.correct ? 'Correct' : `Your: ${item.yourAnswer} | Correct: ${item.correctAnswer}`}</span>
            </div>
        `;
    });
    breakdownDiv.innerHTML = breakdownHTML;
    
    resultDiv.classList.add('show');
    state.quiz.submitted = true;
    
    // Disable all radio buttons
    document.querySelectorAll('.analysis-question input[type="radio"]').forEach(input => {
        input.disabled = true;
    });
    
    // Hide submit button
    document.querySelector('.submit-quiz-btn').style.display = 'none';
    
    // Check if all practice is done
    checkAllPracticeCompleted();
}

function resetAnalysisQuiz() {
    state.quiz.submitted = false;
    
    // Reset all questions
    document.querySelectorAll('.analysis-question').forEach(q => {
        q.classList.remove('answered-correct', 'answered-wrong');
    });
    
    // Reset all options
    document.querySelectorAll('.option-label').forEach(label => {
        label.classList.remove('correct', 'incorrect');
    });
    
    // Clear all selections and enable inputs
    document.querySelectorAll('.analysis-question input[type="radio"]').forEach(input => {
        input.checked = false;
        input.disabled = false;
    });
    
    // Hide results
    document.getElementById('quiz-final-result').classList.remove('show');
    
    // Show submit button
    document.querySelector('.submit-quiz-btn').style.display = 'block';
}

// ========================================
// PROGRESS TRACKING
// ========================================

function updateProgress(section) {
    let progressDiv, totalItems;
    
    if (section === 'dragdrop') {
        progressDiv = document.getElementById('dragdrop-progress');
        totalItems = 4;
        
        const dots = progressDiv.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            if (state.dragdrop.completed.has(`drag${index + 1}`)) {
                dot.classList.add('completed');
            }
        });
        
        const completedCount = state.dragdrop.completed.size;
        progressDiv.querySelector('.progress-text').textContent = `${completedCount}/${totalItems} completed`;
        
    } else if (section === 'coding') {
        progressDiv = document.getElementById('coding-progress');
        totalItems = 3;
        
        const dots = progressDiv.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            if (state.coding.completed.has(`code${index + 1}`)) {
                dot.classList.add('completed');
            }
        });
        
        const completedCount = state.coding.completed.size;
        progressDiv.querySelector('.progress-text').textContent = `${completedCount}/${totalItems} completed`;
    }
    
    // Check if section is complete and update tab
    updateTabCompletion();
}

function updateTabCompletion() {
    const tabs = document.querySelectorAll('.practice-tab-btn');
    
    // Drag & Drop complete
    if (state.dragdrop.completed.size >= 4) {
        tabs[0].classList.add('completed');
    }
    
    // Coding complete
    if (state.coding.completed.size >= 3) {
        tabs[1].classList.add('completed');
    }
    
    // Quiz complete
    if (state.quiz.submitted) {
        tabs[2].classList.add('completed');
    }
}

// ========================================
// UTILITY - Toggle Hint (for old challenges)
// ========================================

function toggleHint(hintId) {
    const hint = document.getElementById(hintId);
    if (hint) {
        hint.classList.toggle('show');
    }
}

// ========================================
// ROADMAP PROGRESS INITIALIZATION
// ========================================

function initRoadmapProgress() {
    const progress = getProgress();
    const modules = document.querySelectorAll('.module');
    
    modules.forEach(module => {
        const link = module.querySelector('a[href*="lessons/"]');
        if (!link) return;
        
        // Extract lesson name from href
        const href = link.getAttribute('href');
        const match = href.match(/lessons\/([^.]+)\.html/);
        if (!match) return;
        
        const lessonName = match[1];
        const isUnlocked = isLessonUnlocked(lessonName);
        const isCompleted = isLessonCompleted(lessonName);
        
        // Update module status
        if (isCompleted) {
            module.classList.add('completed');
            module.classList.remove('locked');
            const statusSpan = module.querySelector('.module-status');
            if (statusSpan) {
                statusSpan.textContent = 'Completed ✓';
                statusSpan.classList.remove('status-available', 'status-coming');
                statusSpan.classList.add('status-completed');
            }
        } else if (isUnlocked) {
            module.classList.remove('locked', 'completed');
            module.classList.add('available');
        } else {
            module.classList.add('locked');
            module.classList.remove('available', 'completed');
            
            // Update status
            const statusSpan = module.querySelector('.module-status');
            if (statusSpan) {
                statusSpan.textContent = '🔒 Locked';
                statusSpan.classList.remove('status-available', 'status-completed');
                statusSpan.classList.add('status-locked');
            }
            
            // Disable click
            const card = module.querySelector('.module-card');
            if (card) {
                card.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    showLockedMessage(lessonName);
                };
                card.style.cursor = 'not-allowed';
            }
            
            // Disable link
            const startBtn = module.querySelector('.start-lesson-btn');
            if (startBtn) {
                startBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    showLockedMessage(lessonName);
                };
                startBtn.classList.add('locked-btn');
            }
        }
    });
    
    // Update progress bar
    updateRoadmapProgressBar();
}

function showLockedMessage(lessonName) {
    const lessonIndex = LESSON_ORDER.indexOf(lessonName);
    const previousLesson = lessonIndex > 0 ? LESSON_ORDER[lessonIndex - 1] : null;
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'locked-modal';
    modal.innerHTML = `
        <div class="locked-modal-content">
            <span class="locked-icon">🔒</span>
            <h3>Lesson Locked!</h3>
            <p>Complete the previous lesson to unlock this one.</p>
            ${previousLesson ? `<p style="margin-top: 0.5rem; color: var(--accent-yellow);">Complete: <strong>${formatLessonName(previousLesson)}</strong></p>` : ''}
            <button onclick="this.closest('.locked-modal').remove()">OK</button>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
}

function formatLessonName(name) {
    const names = {
        'introduction': 'Introduction to Python',
        'variables': 'Variables & Constants',
        'datatypes': 'Data Types',
        'operators': 'Operators',
        'userinput': 'User Input',
        'syntax-errors': 'Common Syntax Errors',
        'conditionals': 'Conditional Statements',
        'forloops': 'For Loops',
        'whileloops': 'While Loops',
        'strings': 'Strings in Depth',
        'lists': 'Lists',
        'tuples': 'Tuples',
        'dictionaries': 'Dictionaries',
        'sets': 'Sets',
        'comprehensions': 'Comprehensions',
        'functions': 'Functions Basics',
        'advanced-functions': 'Advanced Functions',
        'modules': 'Modules & Imports',
        'error-handling': 'Error Handling',
        'files': 'File Handling',
        'classes': 'Classes & Objects',
        'capstone': 'Capstone Project'
    };
    return names[name] || name;
}

function updateRoadmapProgressBar() {
    const progress = getProgress();
    const completed = progress.completedLessons.length;
    const total = LESSON_ORDER.length;
    const percentage = Math.round((completed / total) * 100);
    
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }
    
    if (progressText) {
        progressText.textContent = `${completed} of ${total} lessons completed (${percentage}%)`;
    }
}

// Reset progress (for testing)
function resetProgress() {
    localStorage.removeItem('pythonJrProgress');
    location.reload();
}

// Initialize on window load for animations
window.addEventListener('load', () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
});
